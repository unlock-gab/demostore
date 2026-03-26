import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Phone, MapPin, CheckCircle, Trash2, RefreshCw, X, Package, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";
import { AbandonedCart } from "@shared/schema";

export default function AdminAbandonedCarts() {
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterRecovered, setFilterRecovered] = useState<"all" | "pending" | "recovered">("all");

  const { data: carts = [], isLoading, refetch } = useQuery<AbandonedCart[]>({ queryKey: ["/api/abandoned-carts"] });

  const recoverMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/abandoned-carts/${id}/recover`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/abandoned-carts"] });
      toast({ title: "تم تحديد الطلب كمُسترجَع ✓" });
    },
    onError: () => toast({ title: "خطأ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/abandoned-carts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/abandoned-carts"] });
      setDeleteConfirmId(null);
      toast({ title: "تم الحذف ✓" });
    },
    onError: () => toast({ title: "خطأ في الحذف", variant: "destructive" }),
  });

  const filtered = carts.filter(c => {
    if (filterRecovered === "pending") return !c.recovered;
    if (filterRecovered === "recovered") return c.recovered;
    return true;
  });

  const pendingCount = carts.filter(c => !c.recovered).length;
  const recoveredCount = carts.filter(c => c.recovered).length;

  return (
    <AdminLayout>
      <div dir="rtl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">سلات متروكة</h1>
          </div>
          <p className="text-gray-400 mr-13">{carts.length} سلة إجمالي — {pendingCount} بانتظار الاسترجاع</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "الكل", value: "all", count: carts.length, color: "bg-gray-800 border-gray-700 text-gray-300" },
            { label: "بانتظار الاسترجاع", value: "pending", count: pendingCount, color: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
            { label: "تم الاسترجاع", value: "recovered", count: recoveredCount, color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterRecovered(tab.value as any)}
              className={`p-3 rounded-xl border text-sm font-bold transition-all ${filterRecovered === tab.value ? tab.color + " ring-2 ring-offset-2 ring-offset-gray-950 ring-current" : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700"}`}
              data-testid={`filter-carts-${tab.value}`}
            >
              {tab.label}
              <span className="block text-2xl font-black mt-0.5">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">
              <RefreshCw className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">جاري التحميل...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">لا توجد سلات متروكة</p>
              <p className="text-gray-600 text-sm mt-1">ستظهر هنا بيانات الزوار الذين بدأوا الطلب ولم يُكملوه</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm">العميل</th>
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm hidden md:table-cell">المنتج</th>
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm hidden lg:table-cell">الولاية</th>
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm">التاريخ</th>
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm">الحالة</th>
                    <th className="text-right px-5 py-4 text-gray-400 font-medium text-sm">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map(cart => (
                      <motion.tr
                        key={cart.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                        data-testid={`cart-row-${cart.id}`}
                      >
                        <td className="px-5 py-4">
                          <div className="text-white font-medium text-sm">{cart.customerName || <span className="text-gray-600">—</span>}</div>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span className="font-mono">{cart.customerPhone}</span>
                          </div>
                          {cart.ip && <div className="text-gray-600 text-xs font-mono mt-0.5">{cart.ip}</div>}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {cart.productImage && (
                              <img src={cart.productImage} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-700" />
                            )}
                            <span className="text-gray-300 text-xs line-clamp-2 max-w-[150px]">{cart.productName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                            {cart.wilaya || <span className="text-gray-600">—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {cart.createdAt ? new Date(cart.createdAt).toLocaleDateString("ar-DZ") : "—"}
                          </div>
                          <div className="text-gray-600 text-xs mt-0.5">
                            {cart.createdAt ? new Date(cart.createdAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" }) : ""}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {cart.recovered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                              <CheckCircle className="w-3 h-3" />
                              تم الاسترجاع
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
                              <Clock className="w-3 h-3" />
                              متروكة
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {!cart.recovered && (
                              <button
                                onClick={() => recoverMutation.mutate(cart.id)}
                                disabled={recoverMutation.isPending}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg transition-all"
                                data-testid={`button-recover-cart-${cart.id}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                سترجع
                              </button>
                            )}
                            {deleteConfirmId === cart.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => deleteMutation.mutate(cart.id)}
                                  disabled={deleteMutation.isPending}
                                  className="p-1.5 bg-red-600 text-white rounded-lg"
                                  data-testid={`button-confirm-delete-cart-${cart.id}`}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(cart.id)}
                                className="p-1.5 bg-gray-800 hover:bg-red-600/20 border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                                data-testid={`button-delete-cart-${cart.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-bold mb-1">كيف تعمل السلات المتروكة؟</h4>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>تُسجَّل السلة عندما يدخل الزائر رقم هاتفه في نموذج الطلب ولا يُكمل الشراء</li>
                <li>يمكنك التواصل معهم وإقناعهم بإتمام الطلب</li>
                <li>اضغط "سترجع" لتحديد السلة كمُسترجَعة بعد التواصل</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
