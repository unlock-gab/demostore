import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, hashPassword, resetAndReseed } from "./storage";
import { insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}
function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

async function sendToGoogleSheets(url: string, payload: string) {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
      redirect: "follow",
    });
    const text = await r.text();
    console.log(`[GoogleSheets] status=${r.status} body=${text.substring(0, 200)}`);
    return { ok: r.ok, status: r.status, body: text };
  } catch (err: any) {
    console.error("[GoogleSheets] error:", err?.message);
    return { ok: false, status: 0, body: err?.message || "unknown error" };
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("الملف يجب أن يكون صورة"));
  },
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).json({ message: "غير مصرح" });
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.role !== "admin") return res.status(403).json({ message: "ممنوع - أدمن فقط" });
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  app.get("/uploads/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "الصورة غير موجودة" });
    }
    const ext = path.extname(filename).toLowerCase();
    const mime: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp" };
    res.setHeader("Content-Type", mime[ext] || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => { if (!res.headersSent) res.status(500).end(); });
    stream.pipe(res);
  });

  app.get("/api/products/:id/image", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product?.image) return res.status(404).end();
      const img = product.image;
      if (img.startsWith("data:")) {
        const match = img.match(/^data:(image\/[\w+]+);base64,(.+)$/s);
        if (!match) return res.status(404).end();
        const data = Buffer.from(match[2], "base64");
        res.setHeader("Content-Type", match[1]);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.end(data);
      }
      if (img.startsWith("/uploads/")) {
        const filePath = path.join(UPLOADS_DIR, path.basename(img));
        if (!fs.existsSync(filePath)) return res.status(404).end();
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp" };
        res.setHeader("Content-Type", mimeMap[ext] || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        const stream = fs.createReadStream(filePath);
        stream.on("error", () => { if (!res.headersSent) res.status(500).end(); });
        return stream.pipe(res);
      }
      if (img.startsWith("http://") || img.startsWith("https://")) {
        return res.redirect(img);
      }
      res.status(404).end();
    } catch { res.status(500).end(); }
  });

  app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "لم يتم رفع أي صورة" });
    const data = fs.readFileSync(req.file.path);
    const dataUrl = `data:${req.file.mimetype};base64,${data.toString("base64")}`;
    try { fs.unlinkSync(req.file.path); } catch {}
    res.json({ url: dataUrl });
  });

  app.post("/api/upload/multiple", requireAuth, upload.array("images", 10), (req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "لم يتم رفع أي صور" });
    }
    const urls = (req.files as Express.Multer.File[]).map(f => {
      const data = fs.readFileSync(f.path);
      const dataUrl = `data:${f.mimetype};base64,${data.toString("base64")}`;
      try { fs.unlinkSync(f.path); } catch {}
      return dataUrl;
    });
    res.json({ urls });
  });

  app.post("/api/auth/login", async (req, res) => {
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    if (!checkLoginRateLimit(clientIp)) {
      return res.status(429).json({ message: "محاولات كثيرة جداً. حاول بعد 15 دقيقة." });
    }
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
    const user = await storage.getUserByUsername(username.trim().toLowerCase());
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }
    resetLoginAttempts(clientIp);
    req.session.userId = user.id;
    req.session.role = user.role as "admin" | "confirmateur";
    req.session.username = user.username;
    req.session.name = user.name;
    res.json({ id: user.id, username: user.username, role: user.role, name: user.name });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {});
    res.json({ message: "تم تسجيل الخروج" });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "غير مسجل" });
    const user = await storage.getUserById(req.session.userId);
    if (!user) return res.status(401).json({ message: "المستخدم غير موجود" });
    res.json({ id: user.id, username: user.username, role: user.role, name: user.name });
  });

  app.get("/api/confirmateurs", requireAdmin, async (req, res) => {
    const confirmateurs = await storage.getConfirmateurs();
    const allOrders = await storage.getOrders();
    const result = confirmateurs.map(u => {
      const myOrders = allOrders.filter(o => o.assignedTo === u.id);
      const stats = {
        total: myOrders.length,
        pending: myOrders.filter(o => o.status === "pending").length,
        confirmed: myOrders.filter(o => o.status === "confirmed").length,
        dispatched: myOrders.filter(o => o.status === "dispatched").length,
        in_delivery: myOrders.filter(o => o.status === "in_delivery").length,
        delivered: myOrders.filter(o => o.status === "delivered").length,
        returned: myOrders.filter(o => o.status === "returned").length,
        cancelled: myOrders.filter(o => o.status === "cancelled").length,
      };
      return { id: u.id, username: u.username, name: u.name, role: u.role, createdAt: u.createdAt, stats };
    });
    res.json(result);
  });

  app.post("/api/confirmateurs", requireAdmin, async (req, res) => {
    const schema = z.object({ username: z.string().min(3), password: z.string().min(4), name: z.string().min(2) });
    try {
      const data = schema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) return res.status(400).json({ message: "اسم المستخدم موجود بالفعل" });
      const user = await storage.createUser({ username: data.username, password: hashPassword(data.password), role: "confirmateur", name: data.name });
      res.status(201).json({ id: user.id, username: user.username, name: user.name, role: user.role });
    } catch (e) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.patch("/api/confirmateurs/:id", requireAdmin, async (req, res) => {
    const { name, password } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (password) updates.password = hashPassword(password);
    const user = await storage.updateUser(req.params.id, updates);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json({ id: user.id, username: user.username, name: user.name, role: user.role });
  });

  app.delete("/api/confirmateurs/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteUser(req.params.id);
    if (!success) return res.status(404).json({ message: "المستخدم غير موجود أو لا يمكن حذفه" });
    res.json({ message: "تم الحذف" });
  });

  app.get("/api/products", async (req, res) => {
    const { category, featured, search } = req.query;
    let products = await storage.getProducts();
    if (featured === "true") products = products.filter(p => p.featured);
    if (category && category !== "all") products = products.filter(p => p.category === category);
    if (search) {
      const q = (search as string).toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(product);
  });

  const productSchema = insertProductSchema.extend({ description: insertProductSchema.shape.description.optional().default("") });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const data = productSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (e) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
      res.json(product);
    } catch (e) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json({ message: "تم الحذف بنجاح" });
  });

  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    if (req.session.role === "confirmateur") {
      const orders = await storage.getOrdersByConfirmateur(req.session.userId!);
      return res.json(orders);
    }
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    if (req.session.role === "confirmateur" && order.assignedTo !== req.session.userId) {
      return res.status(403).json({ message: "غير مصرح" });
    }
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      const blocked = await storage.isIpBlocked(clientIp);
      if (blocked) return res.status(403).json({ message: "تعذّر إتمام الطلب. يرجى التواصل معنا مباشرةً." });
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      const settings = await storage.getSettings();
      if (settings.googleSheetsEnabled === "true" && settings.googleSheetsWebhookUrl) {
        let sheetUrl = settings.googleSheetsWebhookUrl.trim();
        if (!sheetUrl.endsWith("/exec")) sheetUrl = sheetUrl.replace(/\/+$/, "") + "/exec";
        const sheetPayload = JSON.stringify({
          id: order.id, date: order.createdAt, name: order.customerName,
          phone: order.customerPhone, wilaya: order.wilaya, product: order.productName,
          quantity: order.quantity, total: order.total, status: order.status,
        });
        sendToGoogleSheets(sheetUrl, sheetPayload);
      }
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.patch("/api/orders/:id/status", requireAuth, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "dispatched", "in_delivery", "delivered", "returned", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "قيمة الحالة غير صحيحة" });
    }
    if (req.session.role === "confirmateur") {
      const order = await storage.getOrder(req.params.id);
      if (!order || order.assignedTo !== req.session.userId) {
        return res.status(403).json({ message: "غير مصرح" });
      }
    }
    const order = await storage.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(order);
  });

  app.patch("/api/orders/:id", requireAuth, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    if (req.session.role === "confirmateur" && order.assignedTo !== req.session.userId) {
      return res.status(403).json({ message: "غير مصرح" });
    }
    const allowed = ["customerName", "customerPhone", "wilaya", "deliveryType", "deliveryPrice", "quantity", "notes", "status"];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const updated = await storage.updateOrder(req.params.id, updates);
    if (!updated) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(updated);
  });

  app.patch("/api/orders/:id/assign", requireAdmin, async (req, res) => {
    const { confirmateurId } = req.body;
    if (!confirmateurId) return res.status(400).json({ message: "معرف المؤكد مطلوب" });
    const confirmateur = await storage.getUserById(confirmateurId);
    if (!confirmateur || confirmateur.role !== "confirmateur") {
      return res.status(400).json({ message: "المؤكد غير موجود" });
    }
    const order = await storage.assignOrder(req.params.id, confirmateurId, confirmateur.name);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(order);
  });

  app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    await storage.deleteOrder(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/stats", requireAdmin, async (req, res) => {
    const products = await storage.getProducts();
    const orders = await storage.getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total as string), 0);
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const confirmedOrders = orders.filter(o => o.status === "confirmed").length;
    const deliveredOrders = orders.filter(o => o.status === "delivered").length;
    const confirmateurs = await storage.getConfirmateurs();
    res.json({ totalProducts: products.length, totalOrders: orders.length, totalRevenue, pendingOrders, confirmedOrders, deliveredOrders, totalConfirmateurs: confirmateurs.length });
  });

  app.get("/api/blocked-ips", requireAdmin, async (req, res) => {
    const ips = await storage.getBlockedIps();
    res.json(ips);
  });

  app.post("/api/blocked-ips", requireAdmin, async (req, res) => {
    const { ip, reason } = req.body;
    if (!ip) return res.status(400).json({ message: "عنوان IP مطلوب" });
    const row = await storage.blockIp(ip, reason);
    res.status(201).json(row);
  });

  app.delete("/api/blocked-ips/:id", requireAdmin, async (req, res) => {
    await storage.unblockIp(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/abandoned-carts", requireAdmin, async (req, res) => {
    const carts = await storage.getAbandonedCarts();
    res.json(carts);
  });

  app.post("/api/abandoned-carts", async (req, res) => {
    const { customerName, customerPhone, productId, productName, productImage, wilaya } = req.body;
    if (!customerPhone || !productId || !productName) return res.status(400).json({ message: "بيانات ناقصة" });
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    const cart = await storage.createAbandonedCart({ customerName, customerPhone, productId, productName, productImage, wilaya, ip: clientIp });
    res.status(201).json(cart);
  });

  app.patch("/api/abandoned-carts/:id/recover", requireAdmin, async (req, res) => {
    await storage.markCartRecovered(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/abandoned-carts/:id", requireAdmin, async (req, res) => {
    await storage.deleteAbandonedCart(req.params.id);
    res.json({ success: true });
  });

  // Force reseed — admin only (used to reset demo data)
  app.post("/api/admin/reseed", requireAdmin, async (_req, res) => {
    try {
      await resetAndReseed();
      res.json({ success: true, message: "تمت إعادة بذر البيانات بنجاح ✓" });
    } catch (err: any) {
      console.error("[reseed] error:", err);
      res.status(500).json({ message: "فشلت إعادة البذر", error: err.message });
    }
  });

  // Public endpoint — only expose delivery prices (needed for order form)
  app.get("/api/settings/public", async (req, res) => {
    const settings = await storage.getSettings();
    res.json({ deliveryPrices: settings.deliveryPrices });
  });

  // Diagnostic: check uploads directory and product image states
  app.get("/api/admin/uploads-debug", requireAdmin, async (_req, res) => {
    const files = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
    const products = await storage.getProducts();
    const imageStates = products.map(p => ({
      id: p.id,
      name: p.name,
      imageUrl: p.image,
      isBase64: p.image?.startsWith("data:"),
      isUploadsPath: p.image?.startsWith("/uploads/"),
      fileExists: p.image?.startsWith("/uploads/")
        ? fs.existsSync(path.join(UPLOADS_DIR, p.image.replace("/uploads/", "")))
        : null,
    }));
    res.json({ uploadsDir: UPLOADS_DIR, fileCount: files.length, files, imageStates });
  });

  // Full settings — admin only
  app.get("/api/settings", requireAdmin, async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.patch("/api/settings", requireAdmin, async (req, res) => {
    const settings = await storage.updateSettings(req.body);
    res.json(settings);
  });

  app.post("/api/settings/test-sheets", requireAdmin, async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ ok: false, message: "الرابط مطلوب" });
    let sheetUrl = url.trim();
    if (!sheetUrl.endsWith("/exec")) sheetUrl = sheetUrl.replace(/\/+$/, "") + "/exec";
    const payload = JSON.stringify({
      id: "TEST-001", date: new Date().toISOString(), name: "اختبار",
      phone: "0555000000", wilaya: "الجزائر", product: "اختبار الاتصال",
      quantity: 1, total: 0, status: "pending",
    });
    const result = await sendToGoogleSheets(sheetUrl, payload);
    if (result.ok && (result.body === "OK" || result.status === 200)) {
      res.json({ ok: true, message: "تم الاتصال بنجاح! تحقق من الـ Sheet." });
    } else {
      res.json({ ok: false, message: `فشل الاتصال — status: ${result.status}`, detail: result.body.substring(0, 300) });
    }
  });

  // --- Delivery Companies ---
  app.get("/api/delivery-companies", requireAdmin, async (_req, res) => {
    const companies = await storage.getDeliveryCompanies();
    res.json(companies);
  });

  app.patch("/api/delivery-companies/:id", requireAdmin, async (req, res) => {
    const allowed = ["enabled", "apiKey", "apiSecret", "accountId", "testMode", "notes", "logo"];
    const updates: Record<string, unknown> = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }
    const company = await storage.updateDeliveryCompany(req.params.id, updates);
    if (!company) return res.status(404).json({ message: "الشركة غير موجودة" });
    res.json(company);
  });

  // Create shipment via delivery company API
  app.post("/api/orders/:id/create-shipment", requireAdmin, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });

    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ message: "companyId مطلوب" });

    const companies = await storage.getDeliveryCompanies();
    const company = companies.find(c => c.id === companyId);
    if (!company || !company.enabled) return res.status(400).json({ message: "شركة التوصيل غير مفعّلة" });
    if (!company.apiKey) return res.status(400).json({ message: "لم يتم إدخال مفتاح API لهذه الشركة" });

    try {
      let trackingNumber: string | null = null;

      if (company.slug === "yalidine") {
        const baseUrl = company.testMode ? "https://api.yalidine.app/v1" : "https://api.yalidine.app/v1";
        const r = await fetch(`${baseUrl}/parcels/`, {
          method: "POST",
          headers: {
            "X-API-ID": company.accountId || "",
            "X-API-TOKEN": company.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: order.customerName,
            familyname: "",
            contact_phone: order.customerPhone,
            address: order.wilaya,
            to_wilaya_name: order.wilaya,
            product_list: order.productName,
            price: parseFloat(order.total as string),
            do_insurance: false,
            declared_value: parseFloat(order.price as string),
            height: 1, width: 1, length: 1, weight: 0.5,
            freeshipping: order.deliveryType === "desk" ? 1 : 0,
            is_stopdesk: order.deliveryType === "desk" ? 1 : 0,
            has_exchange: 0,
          }),
        });
        const data = await r.json();
        if (r.ok && data.tracking) trackingNumber = data.tracking;
        else return res.status(400).json({ message: "خطأ من Yalidine", detail: data });
      } else {
        // Generic: just generate a mock tracking number for other companies
        trackingNumber = `${company.slug.toUpperCase()}-${Date.now()}`;
      }

      if (trackingNumber) {
        await storage.updateOrder(order.id, { trackingNumber, shippingCompany: company.name, status: "dispatched" } as any);
        return res.json({ ok: true, trackingNumber, company: company.name });
      }
      res.status(500).json({ message: "فشل الحصول على رقم التتبع" });
    } catch (e) {
      res.status(500).json({ message: "خطأ في الاتصال بشركة التوصيل" });
    }
  });

  return httpServer;
}
