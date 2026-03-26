import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function diskToBase64(imgPath: string): string | null {
  try {
    const filename = path.basename(imgPath);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp" };
    const mime = mimeMap[ext] || "image/jpeg";
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch { return null; }
}

async function migrateImagesToDb() {
  try {
    const { products } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const rows: any[] = await db.select({
      id: products.id,
      image: products.image,
      images: products.images,
      landingImages: products.landingImages,
    }).from(products);

    let migrated = 0;
    for (const p of rows) {
      const updates: Record<string, any> = {};

      if (p.image?.startsWith("/uploads/")) {
        const b64 = diskToBase64(p.image);
        if (b64) updates.image = b64;
      }
      if (Array.isArray(p.images) && p.images.some((i: string) => i.startsWith("/uploads/"))) {
        const converted = p.images.map((i: string) => {
          if (!i.startsWith("/uploads/")) return i;
          return diskToBase64(i) || i;
        });
        if (JSON.stringify(converted) !== JSON.stringify(p.images)) updates.images = converted;
      }
      if (Array.isArray(p.landingImages) && p.landingImages.some((i: string) => i.startsWith("/uploads/"))) {
        const converted = p.landingImages.map((i: string) => {
          if (!i.startsWith("/uploads/")) return i;
          return diskToBase64(i) || i;
        });
        if (JSON.stringify(converted) !== JSON.stringify(p.landingImages)) updates.landingImages = converted;
      }

      if (Object.keys(updates).length > 0) {
        await db.update(products).set(updates).where(eq(products.id, p.id));
        migrated++;
      }
    }
    if (migrated > 0) {
      console.log(`[migration] ✓ Migrated ${migrated} product image(s) from disk → database`);
    }
  } catch (e) {
    console.error("[migration] disk→db image migration failed:", e);
  }
}

const MemoryStore = createMemoryStore(session);

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
    role: "admin" | "confirmateur";
    username: string;
    name: string;
  }
}

app.use(
  express.json({
    limit: "15mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "5mb" }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable is required in production");
}

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: sessionSecret || "dev-only-secret-not-for-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Auto-create tables if they don't exist (handles VPS first deploy)
  try {
    await db.execute(sql`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS delivery_companies (
        id VARCHAR PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        logo TEXT, enabled BOOLEAN NOT NULL DEFAULT false,
        api_key TEXT, api_secret TEXT, account_id TEXT,
        test_mode BOOLEAN NOT NULL DEFAULT true, notes TEXT
      )
    `);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT`);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_company TEXT`);
  } catch (e) {
    console.error("Could not auto-create tables:", e);
  }

  // Seed delivery companies
  try {
    const { storage } = await import("./storage");
    await storage.seedDeliveryCompanies();
  } catch (e) {
    console.error("Could not seed delivery companies:", e);
  }

  // Migrate disk-stored images → database (runs on every startup, safe to repeat)
  await migrateImagesToDb();

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
