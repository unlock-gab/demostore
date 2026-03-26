import {
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type Category, type InsertCategory,
  type BlockedIp, type AbandonedCart,
  type DeliveryCompany,
  DEFAULT_DELIVERY_PRICES,
  users, products, orders, categories, blockedIps, abandonedCarts, appSettings, deliveryCompanies,
} from "@shared/schema";
import { randomUUID, createHash } from "crypto";
import { db } from "./db";
import { eq, getTableColumns } from "drizzle-orm";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "nova_store_salt_2026").digest("hex");
}

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getConfirmateurs(): Promise<User[]>;
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getOrders(): Promise<Order[]>;
  getOrdersByConfirmateur(confirmateurId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
  assignOrder(id: string, confirmateurId: string, confirmateurName: string): Promise<Order | undefined>;
  getSettings(): Promise<Record<string, string>>;
  updateSettings(settings: Record<string, string>): Promise<Record<string, string>>;
  getBlockedIps(): Promise<BlockedIp[]>;
  blockIp(ip: string, reason?: string, orderCount?: number): Promise<BlockedIp>;
  unblockIp(id: string): Promise<void>;
  isIpBlocked(ip: string): Promise<boolean>;
  getAbandonedCarts(): Promise<AbandonedCart[]>;
  createAbandonedCart(data: { customerName?: string; customerPhone: string; productId: string; productName: string; productImage?: string; wilaya?: string; ip?: string }): Promise<AbandonedCart>;
  markCartRecovered(id: string): Promise<void>;
  deleteAbandonedCart(id: string): Promise<void>;
  getDeliveryCompanies(): Promise<DeliveryCompany[]>;
  updateDeliveryCompany(id: string, data: Partial<DeliveryCompany>): Promise<DeliveryCompany | undefined>;
  seedDeliveryCompanies(): Promise<void>;
}

let cachedSettings: Record<string, string> | null = null;

async function loadSettingsFromDb(): Promise<Record<string, string>> {
  const result: Record<string, string> = { deliveryPrices: JSON.stringify(DEFAULT_DELIVERY_PRICES) };
  try {
    const rows = await db.select().from(appSettings);
    for (const row of rows) {
      result[row.key] = row.value;
    }
  } catch {
    // table may not exist yet on first deploy — fall back to defaults
  }
  return result;
}

export class DatabaseStorage implements IStorage {

  async getUserById(id: string) {
    const [u] = await db.select().from(users).where(eq(users.id, id));
    return u;
  }

  async getUserByUsername(username: string) {
    const [u] = await db.select().from(users).where(eq(users.username, username));
    return u;
  }

  async createUser(data: InsertUser): Promise<User> {
    const id = `user-${randomUUID()}`;
    const [u] = await db.insert(users).values({ ...data, id }).returning();
    return u;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [u] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return u;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (id === "user-admin") return false;
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getConfirmateurs(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "confirmateur"));
  }

  async getProducts(): Promise<Product[]> {
    const { landingImages, images, ...listCols } = getTableColumns(products);
    const rows = await db.select(listCols).from(products);
    return rows
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .map(p => ({ ...p, landingImages: [], images: [] }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [p] = await db.select().from(products).where(eq(products.id, id));
    return p;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { landingImages, images, ...listCols } = getTableColumns(products);
    const rows = await db.select(listCols).from(products).where(eq(products.featured, true));
    return rows.map(p => ({ ...p, landingImages: [], images: [] }));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const [p] = await db.insert(products).values({
      ...product, id,
      rating: product.rating ?? "4.5",
      reviews: product.reviews ?? 0,
      stock: product.stock ?? 100,
      featured: product.featured ?? false,
      badge: product.badge ?? null,
      tags: product.tags ?? [],
      images: product.images ?? [],
      originalPrice: product.originalPrice ?? null,
      landingEnabled: product.landingEnabled ?? false,
      landingHook: product.landingHook ?? null,
      landingBenefits: product.landingBenefits ?? [],
    }).returning();
    return p;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [p] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return p;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const [c] = await db.insert(categories).values({ ...category, id }).returning();
    return c;
  }

  async getOrders(): Promise<Order[]> {
    const rows = await db.select().from(orders);
    return rows.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getOrdersByConfirmateur(confirmateurId: string): Promise<Order[]> {
    const rows = await db.select().from(orders).where(eq(orders.assignedTo, confirmateurId));
    return rows.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [o] = await db.select().from(orders).where(eq(orders.id, id));
    return o;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = `ord-${randomUUID()}`;
    const [o] = await db.insert(orders).values({
      ...order, id,
      status: order.status ?? "pending",
      notes: order.notes ?? null,
      source: order.source ?? "product",
      productImage: order.productImage ?? null,
      quantity: order.quantity ?? 1,
      deliveryType: order.deliveryType ?? "home",
      deliveryPrice: order.deliveryPrice ?? "0",
      assignedTo: order.assignedTo ?? null,
      confirmateurName: order.confirmateurName ?? null,
    }).returning();
    return o;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [o] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return o;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const { id: _id, createdAt: _c, ...safeUpdates } = updates as any;
    const [o] = await db.update(orders).set(safeUpdates).where(eq(orders.id, id)).returning();
    return o;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  async assignOrder(id: string, confirmateurId: string, confirmateurName: string): Promise<Order | undefined> {
    const [o] = await db.update(orders)
      .set({ assignedTo: confirmateurId, confirmateurName })
      .where(eq(orders.id, id))
      .returning();
    return o;
  }

  async getSettings(): Promise<Record<string, string>> {
    if (cachedSettings) return cachedSettings;
    cachedSettings = await loadSettingsFromDb();
    return cachedSettings;
  }

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    try {
      for (const [key, value] of Object.entries(settings)) {
        await db.insert(appSettings)
          .values({ key, value })
          .onConflictDoUpdate({ target: appSettings.key, set: { value } });
      }
    } catch {
      // table may not exist yet — keep in memory only as fallback
    }
    cachedSettings = { ...(cachedSettings ?? {}), ...settings };
    return cachedSettings;
  }

  async getBlockedIps(): Promise<BlockedIp[]> {
    return db.select().from(blockedIps).orderBy(blockedIps.createdAt);
  }

  async blockIp(ip: string, reason?: string, orderCount = 0): Promise<BlockedIp> {
    const existing = await db.select().from(blockedIps).where(eq(blockedIps.ip, ip));
    if (existing.length > 0) {
      const [updated] = await db.update(blockedIps).set({ reason: reason ?? existing[0].reason, orderCount }).where(eq(blockedIps.ip, ip)).returning();
      return updated;
    }
    const [row] = await db.insert(blockedIps).values({ id: randomUUID(), ip, reason, orderCount }).returning();
    return row;
  }

  async unblockIp(id: string): Promise<void> {
    await db.delete(blockedIps).where(eq(blockedIps.id, id));
  }

  async isIpBlocked(ip: string): Promise<boolean> {
    const rows = await db.select().from(blockedIps).where(eq(blockedIps.ip, ip));
    return rows.length > 0;
  }

  async getAbandonedCarts(): Promise<AbandonedCart[]> {
    return db.select().from(abandonedCarts).orderBy(abandonedCarts.createdAt);
  }

  async createAbandonedCart(data: { customerName?: string; customerPhone: string; productId: string; productName: string; productImage?: string; wilaya?: string; ip?: string }): Promise<AbandonedCart> {
    const [row] = await db.insert(abandonedCarts).values({ id: randomUUID(), ...data, recovered: false }).returning();
    return row;
  }

  async markCartRecovered(id: string): Promise<void> {
    await db.update(abandonedCarts).set({ recovered: true }).where(eq(abandonedCarts.id, id));
  }

  async deleteAbandonedCart(id: string): Promise<void> {
    await db.delete(abandonedCarts).where(eq(abandonedCarts.id, id));
  }

  async getDeliveryCompanies(): Promise<DeliveryCompany[]> {
    return db.select().from(deliveryCompanies);
  }

  async updateDeliveryCompany(id: string, data: Partial<DeliveryCompany>): Promise<DeliveryCompany | undefined> {
    const [row] = await db.update(deliveryCompanies).set(data).where(eq(deliveryCompanies.id, id)).returning();
    return row;
  }

  async seedDeliveryCompanies(): Promise<void> {
    const existing = await db.select().from(deliveryCompanies);
    if (existing.length > 0) return;
    const companies = [
      { id: "dc-yalidine",  name: "Yalidine",         slug: "yalidine",  logo: "https://yalidine.com/favicon.ico" },
      { id: "dc-zr",        name: "ZR Express",        slug: "zr-express", logo: "" },
      { id: "dc-maystro",   name: "Maystro Delivery",  slug: "maystro",   logo: "" },
      { id: "dc-ecotrack",  name: "Ecotrack",          slug: "ecotrack",  logo: "" },
      { id: "dc-guepex",    name: "Guepex",            slug: "guepex",    logo: "" },
      { id: "dc-noest",     name: "Noest Express",     slug: "noest",     logo: "" },
    ];
    for (const c of companies) {
      await db.insert(deliveryCompanies).values({ ...c, enabled: false, testMode: true }).onConflictDoNothing();
    }
  }
}

const PHONE_CATEGORIES = [
  { id: "cat-1", name: "هواتف ذكية", slug: "smartphones", icon: "Smartphone", color: "#2563eb", description: "أحدث الهواتف الذكية بأفضل الأسعار" },
  { id: "cat-2", name: "صوتيات", slug: "audio", icon: "Headphones", color: "#0891b2", description: "سماعات ومكبرات صوت بلوتوث" },
  { id: "cat-3", name: "حافظات وأغطية", slug: "cases", icon: "Shield", color: "#7c3aed", description: "حماية متكاملة لهاتفك" },
  { id: "cat-4", name: "شاحنات وطاقة", slug: "chargers", icon: "Zap", color: "#d97706", description: "شاحنات سريعة وبطاريات محمولة" },
  { id: "cat-5", name: "اكسسوارات", slug: "accessories", icon: "Cable", color: "#059669", description: "كابلات وإكسسوارات متنوعة" },
];

async function migrateCategories() {
  for (const cat of PHONE_CATEGORIES) {
    const existing = await db.select().from(categories).where(eq(categories.id, cat.id));
    if (existing.length === 0) {
      await db.insert(categories).values(cat);
    } else {
      await db.update(categories).set(cat).where(eq(categories.id, cat.id));
    }
  }
  const phoneSlugs = PHONE_CATEGORIES.map(c => c.slug);
  const allCats = await db.select().from(categories);
  for (const cat of allCats) {
    if (!phoneSlugs.includes(cat.slug)) {
      await db.delete(categories).where(eq(categories.id, cat.id));
    }
  }
}

const DEMO_PRODUCTS = [
  {
    id: "p-1",
    name: "سامسونغ Galaxy A55",
    description: "هاتف سامسونغ Galaxy A55 بشاشة Super AMOLED مقاس 6.6 بوصة، كاميرا ثلاثية 50MP، معالج Exynos 1480، بطارية 5000mAh مع شحن سريع 25W. إصدار 2024.",
    price: "58000", originalPrice: "65000", category: "smartphones",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    images: [], rating: "4.8", reviews: 2341, stock: 35, featured: true,
    badge: "الأكثر مبيعاً", tags: ["سامسونغ", "Galaxy", "A55"],
    sizes: ["128GB", "256GB"], colors: ["أسود", "أزرق فاتح", "رمادي"],
    landingEnabled: true,
    landingHook: "سامسونغ Galaxy A55 — شاشة رائعة، كاميرا احترافية، بسعر مناسب!",
    landingBenefits: ["شاشة AMOLED 6.6 بوصة", "كاميرا 50MP ثلاثية", "بطارية 5000mAh", "ضمان سنة كاملة"],
  },
  {
    id: "p-2",
    name: "آيفون 15 — 128GB",
    description: "آيفون 15 الأصلي بشريحة A16 Bionic، نظام كاميرا مزدوج 48MP، شاشة Super Retina XDR 6.1 بوصة، USB-C، بطارية تدوم اليوم كاملاً.",
    price: "145000", originalPrice: "160000", category: "smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
    images: [], rating: "4.9", reviews: 1876, stock: 15, featured: true,
    badge: "الأصلي", tags: ["آيفون", "Apple", "iPhone15"],
    sizes: ["128GB", "256GB", "512GB"], colors: ["أسود", "أبيض", "وردي", "أخضر", "أصفر"],
    landingEnabled: true,
    landingHook: "آيفون 15 الأصلي — أقوى هاتف بين يديك بسعر لا يُنافس!",
    landingBenefits: ["معالج A16 Bionic الأسرع", "كاميرا 48MP احترافية", "USB-C للشحن السريع", "ضمان Apple رسمي"],
  },
  {
    id: "p-3",
    name: "شاومي Redmi Note 13",
    description: "ريدمي نوت 13 بشاشة AMOLED 6.67 بوصة 120Hz، كاميرا 108MP، معالج Snapdragon 685، بطارية 5000mAh شحن سريع 33W. الخيار الأمثل للميزانية.",
    price: "38000", originalPrice: "43000", category: "smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    images: [], rating: "4.6", reviews: 3120, stock: 60, featured: true,
    badge: "قيمة مميزة", tags: ["شاومي", "Redmi", "Note13"],
    sizes: ["128GB", "256GB"], colors: ["أسود", "أخضر", "أزرق"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-4",
    name: "سماعات بلوتوث لاسلكية TWS",
    description: "سماعات أذن لاسلكية بتقنية بلوتوث 5.3، عزل نشط للضوضاء ANC، جودة صوت Hi-Fi، تدوم 6 ساعات مع شحن سريع، مقاومة للماء IPX4.",
    price: "8500", originalPrice: "12000", category: "audio",
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&q=80",
    images: [], rating: "4.7", reviews: 1654, stock: 80, featured: true,
    badge: "الأكثر طلباً", tags: ["سماعات", "بلوتوث", "TWS"],
    sizes: [], colors: ["أبيض", "أسود"],
    landingEnabled: true,
    landingHook: "سماعات TWS احترافية — صوت نقي وعزل للضوضاء بسعر لا يُصدق!",
    landingBenefits: ["عزل نشط للضوضاء ANC", "بلوتوث 5.3 مستقر", "مقاومة للماء IPX4", "شحن سريع 10 دقائق = ساعة استخدام"],
  },
  {
    id: "p-5",
    name: "سماعات Over-Ear احترافية",
    description: "سماعات فوق الأذن بجودة صوت استثنائية، عزل نشط للضوضاء، بلوتوث 5.0، تدوم 30 ساعة، مريحة للاستخدام الطويل، قابلة للطي.",
    price: "18500", originalPrice: "24000", category: "audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    images: [], rating: "4.8", reviews: 876, stock: 25, featured: true,
    badge: "احترافية", tags: ["سماعات", "Over-Ear", "ANC"],
    sizes: [], colors: ["أسود", "فضي", "أبيض"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-6",
    name: "مكبر صوت بلوتوث محمول",
    description: "مكبر صوت بلوتوث 5.0 بقدرة 20W، صوت ستيريو بجودة 360°، مقاوم للماء IPX7، بطارية 12 ساعة، مناسب للخارج والسفر.",
    price: "12000", originalPrice: "15500", category: "audio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    images: [], rating: "4.7", reviews: 987, stock: 40, featured: true,
    badge: "مميز", tags: ["مكبر صوت", "بلوتوث", "محمول"],
    sizes: [], colors: ["أسود", "أحمر", "أزرق", "أخضر"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-7",
    name: "حافظة سيليكون متعددة الألوان",
    description: "حافظة سيليكون ناعمة بأربع زوايا مقواة لحماية أفضل من السقوط، مادة مضادة للانزلاق، متوفرة لجميع موديلات الهواتف الشائعة.",
    price: "800", originalPrice: "1200", category: "cases",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=500&q=80",
    images: [], rating: "4.5", reviews: 4230, stock: 200, featured: false,
    badge: "اقتصادي", tags: ["حافظة", "سيليكون", "حماية"],
    sizes: ["iPhone 15", "iPhone 14", "Samsung S24", "Samsung A55", "Redmi Note 13"],
    colors: ["أسود", "شفاف", "أزرق", "وردي", "أخضر", "أصفر"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-8",
    name: "حافظة جلد طبيعي فاخرة",
    description: "حافظة جلد طبيعي فاخرة بتصميم أنيق يمنح هاتفك مظهراً احترافياً. تتميز بوجود مكان للبطاقات والنقود، مغناطيس قوي للإغلاق.",
    price: "2500", originalPrice: "3500", category: "cases",
    image: "https://images.unsplash.com/photo-1606920909399-b78def43d8c7?w=500&q=80",
    images: [], rating: "4.8", reviews: 1120, stock: 50, featured: false,
    badge: "فاخر", tags: ["حافظة", "جلد", "محفظة"],
    sizes: ["iPhone 15", "iPhone 14", "Samsung S24", "Samsung A55"],
    colors: ["بني", "أسود", "كاميل"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-9",
    name: "زجاج حماية الشاشة 9H",
    description: "زجاج مقسى 9H لحماية شاشتك من الخدوش والكسر، شفافية 99.9%، سهل التركيب بدون فقاعات، متوفر لجميع الموديلات.",
    price: "600", originalPrice: "1000", category: "cases",
    image: "https://images.unsplash.com/photo-1563642421748-5047b6585a4a?w=500&q=80",
    images: [], rating: "4.4", reviews: 5670, stock: 300, featured: false,
    badge: "مقاوم", tags: ["زجاج", "حماية", "شاشة"],
    sizes: ["iPhone 15", "iPhone 14", "Samsung S24", "Samsung A55", "Redmi Note 13"],
    colors: ["شفاف"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-10",
    name: "شاحن سريع GaN 65W",
    description: "شاحن GaN صغير الحجم بقدرة 65W يدعم بروتوكولات PD 3.0 وQC 4.0، يشحن هاتفك من 0 إلى 100% في أقل من ساعة، مناسب للهاتف واللابتوب.",
    price: "3500", originalPrice: "5000", category: "chargers",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80",
    images: [], rating: "4.7", reviews: 2109, stock: 90, featured: false,
    badge: "شحن سريع", tags: ["شاحن", "GaN", "65W"],
    sizes: ["65W"], colors: ["أبيض", "أسود"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-11",
    name: "بطارية محمولة 20000mAh",
    description: "باور بانك 20000mAh بمنافذ USB-C وUSB-A، شحن سريع 22.5W، شاشة LED تُظهر النسبة المئوية المتبقية، تشحن هاتفك 4-5 مرات كاملة.",
    price: "7500", originalPrice: "10000", category: "chargers",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80",
    images: [], rating: "4.6", reviews: 1543, stock: 65, featured: true,
    badge: "ضروري", tags: ["باور بانك", "بطارية", "محمولة"],
    sizes: ["20000mAh"], colors: ["أسود", "أبيض"],
    landingEnabled: true,
    landingHook: "باور بانك 20000mAh — لا تنفد بطاريتك أبداً أينما كنت!",
    landingBenefits: ["تشحن هاتفك 5 مرات كاملة", "شحن سريع 22.5W", "منفذ USB-C وUSB-A", "شاشة رقمية للبطارية"],
  },
  {
    id: "p-12",
    name: "شاحن لاسلكي 15W",
    description: "شاحن لاسلكي سريع Qi 15W يدعم MagSafe، يشحن بدون كابل، تصميم رفيع وأنيق، يعمل مع iPhone وSamsung وأغلب الهواتف الحديثة.",
    price: "4500", originalPrice: "6000", category: "chargers",
    image: "https://images.unsplash.com/photo-1615654566891-7e24c6716b19?w=500&q=80",
    images: [], rating: "4.5", reviews: 876, stock: 70, featured: false,
    badge: "عملي", tags: ["شاحن", "لاسلكي", "Qi"],
    sizes: ["15W"], colors: ["أبيض", "أسود"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
  {
    id: "p-13",
    name: "كابل USB-C مضفر 2M",
    description: "كابل USB-C مضفر بطول 2 متر، يدعم شحن PD 100W ونقل البيانات 480Mbps، متين يتحمل 20,000 انثناء، يعمل مع جميع الأجهزة الحديثة.",
    price: "1200", originalPrice: "1800", category: "accessories",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76e0c01c?w=500&q=80",
    images: [], rating: "4.6", reviews: 3456, stock: 150, featured: false,
    badge: "متين", tags: ["كابل", "USB-C", "شحن"],
    sizes: ["1M", "2M", "3M"], colors: ["أسود", "رمادي", "أحمر"],
    landingEnabled: false, landingHook: null, landingBenefits: [],
  },
];

const DEMO_ORDERS = [
  { id: "ord-1",  customerName: "محمد أمين بوعلام",   customerPhone: "0550112233", wilaya: "الجزائر العاصمة", commune: "باب الزوار",    deliveryType: "home", deliveryPrice: "400",  productId: "p-1",  productName: "سامسونغ Galaxy A55",        productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", quantity: 1, price: "58000", total: "58400", status: "delivered",   selectedSize: "128GB", selectedColor: "أسود",     notes: null,                         source: "product" },
  { id: "ord-2",  customerName: "يوسف مرابط",         customerPhone: "0661234567", wilaya: "وهران",           commune: "الخروبة",       deliveryType: "desk", deliveryPrice: "350",  productId: "p-2",  productName: "آيفون 15 — 128GB",          productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80", quantity: 1, price: "145000",total: "145350",status: "delivered",   selectedSize: "128GB", selectedColor: "أسود",     notes: "توصيل سريع من فضلك",          source: "landing" },
  { id: "ord-3",  customerName: "عمر بلعيد",          customerPhone: "0770345678", wilaya: "قسنطينة",         commune: "المنصورة",      deliveryType: "home", deliveryPrice: "500",  productId: "p-3",  productName: "شاومي Redmi Note 13",       productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", quantity: 1, price: "38000", total: "38500", status: "in_delivery", selectedSize: "128GB", selectedColor: "أخضر",     notes: null,                         source: "product" },
  { id: "ord-4",  customerName: "ياسين خالدي",        customerPhone: "0554445566", wilaya: "سطيف",            commune: "عين أرنات",     deliveryType: "desk", deliveryPrice: "400",  productId: "p-4",  productName: "سماعات بلوتوث TWS",        productImage: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&q=80", quantity: 1, price: "8500",  total: "8900",  status: "confirmed",   selectedSize: "",      selectedColor: "أبيض",     notes: null,                         source: "product" },
  { id: "ord-5",  customerName: "رضا بن يحيى",        customerPhone: "0665556677", wilaya: "بجاية",           commune: "بجاية",         deliveryType: "home", deliveryPrice: "500",  productId: "p-5",  productName: "سماعات Over-Ear احترافية", productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", quantity: 1, price: "18500", total: "19000", status: "pending",     selectedSize: "",      selectedColor: "أسود",     notes: null,                         source: "product" },
  { id: "ord-6",  customerName: "علي زيناي",          customerPhone: "0771122334", wilaya: "عنابة",           commune: "سيدي عمار",     deliveryType: "home", deliveryPrice: "600",  productId: "p-6",  productName: "مكبر صوت بلوتوث محمول",    productImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80", quantity: 1, price: "12000", total: "12600", status: "dispatched",  selectedSize: "",      selectedColor: "أسود",     notes: null,                         source: "product" },
  { id: "ord-7",  customerName: "حمزة قادري",         customerPhone: "0557778899", wilaya: "البليدة",         commune: "الأربعاء",      deliveryType: "desk", deliveryPrice: "400",  productId: "p-8",  productName: "حافظة جلد طبيعي فاخرة",   productImage: "https://images.unsplash.com/photo-1606920909399-b78def43d8c7?w=500&q=80", quantity: 2, price: "2500",  total: "5400",  status: "delivered",   selectedSize: "Samsung A55", selectedColor: "بني",  notes: "هدية لصديقي",                source: "product" },
  { id: "ord-8",  customerName: "كمال طاهر",          customerPhone: "0662233445", wilaya: "باتنة",           commune: "باتنة",         deliveryType: "home", deliveryPrice: "500",  productId: "p-11", productName: "بطارية محمولة 20000mAh",   productImage: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80", quantity: 1, price: "7500",  total: "8000",  status: "processing",  selectedSize: "20000mAh", selectedColor: "أسود", notes: null,                         source: "product" },
  { id: "ord-9",  customerName: "سعيد بوكثير",        customerPhone: "0773344556", wilaya: "تيزي وزو",        commune: "تيزي وزو",      deliveryType: "desk", deliveryPrice: "500",  productId: "p-10", productName: "شاحن سريع GaN 65W",        productImage: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80", quantity: 1, price: "3500",  total: "4000",  status: "delivered",   selectedSize: "65W",   selectedColor: "أبيض",     notes: null,                         source: "product" },
  { id: "ord-10", customerName: "توفيق حسين",         customerPhone: "0558899001", wilaya: "أم البواقي",      commune: "أم البواقي",    deliveryType: "home", deliveryPrice: "500",  productId: "p-9",  productName: "زجاج حماية الشاشة 9H",    productImage: "https://images.unsplash.com/photo-1563642421748-5047b6585a4a?w=500&q=80", quantity: 3, price: "600",   total: "2300",  status: "confirmed",   selectedSize: "iPhone 15", selectedColor: "شفاف", notes: "3 قطع للمحل",               source: "product" },
  { id: "ord-11", customerName: "فارس منصور",         customerPhone: "0669900112", wilaya: "مستغانم",         commune: "مستغانم",       deliveryType: "desk", deliveryPrice: "450",  productId: "p-13", productName: "كابل USB-C مضفر 2M",       productImage: "https://images.unsplash.com/photo-1558618047-3c8c76e0c01c?w=500&q=80", quantity: 5, price: "1200",  total: "6450",  status: "delivered",   selectedSize: "2M",    selectedColor: "أسود",     notes: "بالجملة للمحل",              source: "product" },
  { id: "ord-12", customerName: "نجيب عبد الله",      customerPhone: "0774411223", wilaya: "ورقلة",           commune: "ورقلة",         deliveryType: "home", deliveryPrice: "700",  productId: "p-12", productName: "شاحن لاسلكي 15W",          productImage: "https://images.unsplash.com/photo-1615654566891-7e24c6716b19?w=500&q=80", quantity: 1, price: "4500",  total: "5200",  status: "pending",     selectedSize: "15W",   selectedColor: "أبيض",     notes: null,                         source: "product" },
  { id: "ord-13", customerName: "لامين بومديان",      customerPhone: "0552233444", wilaya: "جيجل",            commune: "جيجل",          deliveryType: "home", deliveryPrice: "550",  productId: "p-1",  productName: "سامسونغ Galaxy A55",        productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", quantity: 1, price: "58000", total: "58550", status: "confirmed",   selectedSize: "256GB", selectedColor: "أزرق فاتح", notes: null,                         source: "landing" },
  { id: "ord-14", customerName: "سليم بوزيد",         customerPhone: "0663344556", wilaya: "المدية",          commune: "المدية",        deliveryType: "desk", deliveryPrice: "450",  productId: "p-4",  productName: "سماعات بلوتوث TWS",        productImage: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&q=80", quantity: 2, price: "8500",  total: "17450", status: "delivered",   selectedSize: "",      selectedColor: "أسود",     notes: "اثنان للمحل",               source: "product" },
  { id: "ord-15", customerName: "إبراهيم حمداوي",    customerPhone: "0775566778", wilaya: "تلمسان",          commune: "تلمسان",        deliveryType: "home", deliveryPrice: "550",  productId: "p-11", productName: "بطارية محمولة 20000mAh",   productImage: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80", quantity: 1, price: "7500",  total: "8050",  status: "in_delivery", selectedSize: "20000mAh", selectedColor: "أبيض", notes: null,                         source: "product" },
  { id: "ord-16", customerName: "عدلان ساحي",         customerPhone: "0556677889", wilaya: "غرداية",          commune: "غرداية",        deliveryType: "desk", deliveryPrice: "700",  productId: "p-2",  productName: "آيفون 15 — 128GB",          productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80", quantity: 1, price: "145000",total: "145700",status: "delivered",   selectedSize: "256GB", selectedColor: "أبيض",     notes: null,                         source: "landing" },
  { id: "ord-17", customerName: "وليد طالب",          customerPhone: "0664455667", wilaya: "سوق أهراس",       commune: "سوق أهراس",     deliveryType: "home", deliveryPrice: "600",  productId: "p-8",  productName: "حافظة جلد طبيعي فاخرة",   productImage: "https://images.unsplash.com/photo-1606920909399-b78def43d8c7?w=500&q=80", quantity: 1, price: "2500",  total: "3100",  status: "processing",  selectedSize: "iPhone 15", selectedColor: "أسود", notes: null,                         source: "product" },
  { id: "ord-18", customerName: "زكريا بن خليفة",    customerPhone: "0776677889", wilaya: "برج بوعريريج",    commune: "برج بوعريريج",  deliveryType: "home", deliveryPrice: "450",  productId: "p-3",  productName: "شاومي Redmi Note 13",       productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", quantity: 1, price: "38000", total: "38450", status: "pending",     selectedSize: "256GB", selectedColor: "أسود",     notes: null,                         source: "product" },
  { id: "ord-19", customerName: "ريان بوعزيز",        customerPhone: "0557788900", wilaya: "بسكرة",           commune: "بسكرة",         deliveryType: "desk", deliveryPrice: "450",  productId: "p-6",  productName: "مكبر صوت بلوتوث محمول",    productImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80", quantity: 1, price: "12000", total: "12450", status: "delivered",   selectedSize: "",      selectedColor: "أحمر",     notes: null,                         source: "product" },
  { id: "ord-20", customerName: "شريف قاسمي",         customerPhone: "0660011223", wilaya: "خنشلة",           commune: "خنشلة",         deliveryType: "home", deliveryPrice: "650",  productId: "p-10", productName: "شاحن سريع GaN 65W",        productImage: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80", quantity: 1, price: "3500",  total: "4150",  status: "confirmed",   selectedSize: "65W",   selectedColor: "أسود",     notes: null,                         source: "product" },
  { id: "ord-21", customerName: "بلال مرسي",          customerPhone: "0771122445", wilaya: "الجلفة",          commune: "الجلفة",        deliveryType: "desk", deliveryPrice: "550",  productId: "p-5",  productName: "سماعات Over-Ear احترافية", productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", quantity: 1, price: "18500", total: "19050", status: "dispatched",  selectedSize: "",      selectedColor: "فضي",      notes: null,                         source: "landing" },
  { id: "ord-22", customerName: "جمال حسناوي",        customerPhone: "0553344556", wilaya: "تبسة",            commune: "تبسة",          deliveryType: "home", deliveryPrice: "600",  productId: "p-7",  productName: "حافظة سيليكون متعددة الألوان", productImage: "https://images.unsplash.com/photo-1601593346740-925612772716?w=500&q=80", quantity: 10, price: "800", total: "8600",  status: "delivered",  selectedSize: "Samsung A55", selectedColor: "شفاف", notes: "جملة للمحل",                source: "product" },
  { id: "ord-23", customerName: "منير عطار",          customerPhone: "0664455778", wilaya: "معسكر",           commune: "معسكر",         deliveryType: "home", deliveryPrice: "500",  productId: "p-11", productName: "بطارية محمولة 20000mAh",   productImage: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80", quantity: 1, price: "7500",  total: "8000",  status: "pending",     selectedSize: "20000mAh", selectedColor: "أسود", notes: null,                         source: "product" },
  { id: "ord-24", customerName: "حسام كمال",          customerPhone: "0775566990", wilaya: "تيارت",           commune: "تيارت",         deliveryType: "desk", deliveryPrice: "500",  productId: "p-13", productName: "كابل USB-C مضفر 2M",       productImage: "https://images.unsplash.com/photo-1558618047-3c8c76e0c01c?w=500&q=80", quantity: 3, price: "1200",  total: "4100",  status: "delivered",   selectedSize: "2M",    selectedColor: "رمادي",    notes: "3 كابلات للمحل",             source: "product" },
  { id: "ord-25", customerName: "نزيم بوخاري",        customerPhone: "0558899112", wilaya: "الشلف",           commune: "الشلف",         deliveryType: "home", deliveryPrice: "450",  productId: "p-1",  productName: "سامسونغ Galaxy A55",        productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", quantity: 1, price: "58000", total: "58450", status: "confirmed",   selectedSize: "128GB", selectedColor: "رمادي",    notes: null,                         source: "product" },
  { id: "ord-26", customerName: "أنيس فرحاتي",        customerPhone: "0669900334", wilaya: "البويرة",         commune: "البويرة",       deliveryType: "home", deliveryPrice: "450",  productId: "p-4",  productName: "سماعات بلوتوث TWS",        productImage: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&q=80", quantity: 1, price: "8500",  total: "8950",  status: "delivered",   selectedSize: "",      selectedColor: "أبيض",     notes: null,                         source: "product" },
  { id: "ord-27", customerName: "ماهر بوطالب",        customerPhone: "0770011223", wilaya: "تيسمسيلت",        commune: "تيسمسيلت",      deliveryType: "desk", deliveryPrice: "550",  productId: "p-12", productName: "شاحن لاسلكي 15W",          productImage: "https://images.unsplash.com/photo-1615654566891-7e24c6716b19?w=500&q=80", quantity: 1, price: "4500",  total: "5050",  status: "dispatched",  selectedSize: "15W",   selectedColor: "أبيض",     notes: null,                         source: "landing" },
  { id: "ord-28", customerName: "صلاح جابر",          customerPhone: "0551122334", wilaya: "عين الدفلة",      commune: "عين الدفلة",    deliveryType: "home", deliveryPrice: "450",  productId: "p-3",  productName: "شاومي Redmi Note 13",       productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", quantity: 1, price: "38000", total: "38450", status: "pending",     selectedSize: "128GB", selectedColor: "أزرق",     notes: null,                         source: "product" },
  { id: "ord-29", customerName: "طارق بن صالح",       customerPhone: "0662233556", wilaya: "الأغواط",         commune: "الأغواط",       deliveryType: "home", deliveryPrice: "650",  productId: "p-2",  productName: "آيفون 15 — 128GB",          productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80", quantity: 1, price: "145000",total: "145650",status: "confirmed",   selectedSize: "512GB", selectedColor: "وردي",     notes: null,                         source: "landing" },
  { id: "ord-30", customerName: "إسلام حمداوي",       customerPhone: "0773344667", wilaya: "بومرداس",         commune: "بومرداس",       deliveryType: "desk", deliveryPrice: "400",  productId: "p-9",  productName: "زجاج حماية الشاشة 9H",    productImage: "https://images.unsplash.com/photo-1563642421748-5047b6585a4a?w=500&q=80", quantity: 10, price: "600",  total: "6400",  status: "delivered",  selectedSize: "Samsung S24", selectedColor: "شفاف",  notes: "للمحل بالجملة",             source: "product" },
];

async function seedDatabase() {
  await migrateCategories();

  const existingAdmin = await db.select().from(users).where(eq(users.id, "user-admin"));
  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      id: "user-admin", username: "admin",
      password: hashPassword("admin2026"),
      role: "admin", name: "المدير",
    });
    await db.insert(users).values({
      id: "user-conf-1", username: "confirmateur1",
      password: hashPassword("conf2026"),
      role: "confirmateur", name: "أمين بن عمر",
    });
  }

  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    console.log("[db] Seeding database...");
    await db.insert(products).values(DEMO_PRODUCTS as any);
  }

  const existingOrders = await db.select().from(orders);
  if (existingOrders.length === 0) {
    await db.insert(orders).values(DEMO_ORDERS as any);
  }

  console.log("[db] Database seeded ✓");
}

export const storage = new DatabaseStorage();

seedDatabase().catch(console.error);

export async function resetAndReseed() {
  console.log("[db] Force reseed started...");
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  console.log("[db] Tables cleared. Reseeding...");
  await seedDatabase();
  console.log("[db] Force reseed complete ✓");
}
