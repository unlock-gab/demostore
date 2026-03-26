import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, ShoppingCart, ChevronLeft, ChevronDown, Menu, Home, Bell, Settings, Truck, Users, LogOut, Loader2, Shield, ShoppingBag, Building2, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@shared/schema";

const statusItems = [
  { key: "pending",     label: "En attente" },
  { key: "confirmed",   label: "Confirmée" },
  { key: "dispatched",  label: "En dispatch" },
  { key: "in_delivery", label: "En livraison" },
  { key: "delivered",   label: "Livrées" },
  { key: "returned",    label: "En retour" },
  { key: "cancelled",   label: "Annulée" },
];

const mainNavItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
  { icon: Package, label: "المنتجات", href: "/admin/products" },
];

const bottomNavItems = [
  { icon: Users, label: "المؤكدون", href: "/admin/confirmateurs" },
  { icon: Shield, label: "حظر IP", href: "/admin/ip-blocker" },
  { icon: Truck, label: "أسعار التوصيل", href: "/admin/delivery" },
  { icon: Building2, label: "شركات التوصيل", href: "/admin/delivery-companies" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
];

const allNavItems = [
  ...mainNavItems,
  { icon: ShoppingCart, label: "الطلبات", href: "/admin/orders" },
  { icon: ShoppingBag, label: "سلات متروكة", href: "/admin/abandoned-carts" },
  ...bottomNavItems,
];

const ordersRelatedPaths = ["/admin/orders", "/admin/abandoned-carts"];

function SidebarNav({ location, onClose }: { location: string; onClose?: () => void }) {
  const isOrdersActive = ordersRelatedPaths.some(p => location === p || location.startsWith(p + "/"));
  const [ordersOpen, setOrdersOpen] = useState(isOrdersActive);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: ordersOpen,
    staleTime: 30_000,
  });

  const countOf = (status: string) => orders.filter(o => o.status === status).length;

  useEffect(() => {
    if (isOrdersActive) setOrdersOpen(true);
  }, [isOrdersActive]);

  const itemCls = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all select-none ${
      active
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
        : "text-gray-400 hover:bg-gray-800/80 hover:text-white"
    }`;

  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      <div className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3 px-4">القائمة الرئيسية</div>

      {mainNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            whileHover={{ x: -3 }}
            onClick={onClose}
            className={itemCls(location === item.href)}
            data-testid={`nav-admin-${item.href.split("/").pop()}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
            {location === item.href && <ChevronLeft className="w-4 h-4 mr-auto opacity-60" />}
          </motion.div>
        </Link>
      ))}

      <motion.div whileHover={{ x: -3 }}>
        <Link href="/admin/orders">
          <div
            onClick={() => { setOrdersOpen(true); onClose?.(); }}
            className={itemCls(location === "/admin/orders" && !new URLSearchParams(window.location.search).get("status"))}
            data-testid="nav-admin-orders"
          >
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1">الطلبات</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOrdersOpen(v => !v); }}
              className="p-0.5 hover:text-white transition-colors"
            >
              <motion.div animate={{ rotate: ordersOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </motion.div>
            </button>
          </div>
        </Link>
      </motion.div>

      <AnimatePresence initial={false}>
        {ordersOpen && (
          <motion.div
            key="orders-sub"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="mb-1">
              {statusItems.map((s) => {
                const count = countOf(s.key);
                const currentSearch = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") : null;
                const isActive = location === "/admin/orders" && currentSearch === s.key;
                return (
                  <Link key={s.key} href={`/admin/orders?status=${s.key}`}>
                    <div
                      onClick={onClose}
                      className={`flex items-center gap-2.5 pr-9 pl-3 py-2 rounded-xl mb-0.5 cursor-pointer transition-all text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-blue-300 border border-blue-500/20"
                          : "text-gray-500 hover:bg-gray-800/60 hover:text-gray-300"
                      }`}
                      data-testid={`nav-status-${s.key}`}
                    >
                      <Circle className="w-1.5 h-1.5 flex-shrink-0 fill-current opacity-50" />
                      <span className="flex-1 font-medium">{s.label}</span>
                      <span className={`text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 ${
                        count > 0 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    </div>
                  </Link>
                );
              })}

              <div className="border-t border-gray-800/60 my-1.5 mx-2" />

              <Link href="/admin/abandoned-carts">
                <div
                  onClick={onClose}
                  className={`flex items-center gap-2.5 pr-9 pl-3 py-2 rounded-xl cursor-pointer transition-all text-sm ${
                    location === "/admin/abandoned-carts"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/20"
                      : "text-gray-500 hover:bg-gray-800/60 hover:text-gray-300"
                  }`}
                  data-testid="nav-admin-abandoned-carts"
                >
                  <ShoppingBag className="w-4 h-4 flex-shrink-0 opacity-70" />
                  <span className="flex-1 font-medium">سلات متروكة</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bottomNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            whileHover={{ x: -3 }}
            onClick={onClose}
            className={itemCls(location === item.href)}
            data-testid={`nav-admin-${item.href.split("/").pop()}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
            {location === item.href && <ChevronLeft className="w-4 h-4 mr-auto opacity-60" />}
          </motion.div>
        </Link>
      ))}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    } else if (!loading && user && user.role !== "admin") {
      navigate("/confirmateur/orders");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const currentLabel = allNavItems.find(n => n.href === location)?.label || "لوحة الإدارة";

  return (
    <div className="min-h-screen bg-gray-950 flex" dir="rtl">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: sidebarOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-72 bg-gray-900 border-l border-gray-800 z-50 lg:hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-base">D</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">Demo <span className="text-amber-400">Store</span></div>
              <div className="text-gray-400 text-xs">لوحة الإدارة</div>
            </div>
          </div>
        </div>
        <SidebarNav location={location} onClose={() => setSidebarOpen(false)} />
        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer transition-all">
              <Home className="w-5 h-5" />
              <span className="font-medium">العودة للمتجر</span>
            </div>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>

      <div className="hidden lg:flex lg:flex-col lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-72 bg-gray-900 border-l border-gray-800 z-30">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <div>
              <div className="text-white font-black text-base">Demo <span className="text-amber-400">Store</span></div>
              <div className="text-gray-400 text-xs">لوحة الإدارة</div>
            </div>
          </div>
        </div>

        <SidebarNav location={location} />

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "أ"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">@{user?.username}</p>
            </div>
          </div>
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer transition-all" data-testid="nav-back-to-store">
              <Home className="w-5 h-5" />
              <span className="font-medium">العودة للمتجر</span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div className="flex-1 lg:mr-72">
        <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-white font-semibold text-sm hidden sm:block">
                {currentLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0) || "أ"}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
