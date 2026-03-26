import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldOff, Plus, Trash2, AlertTriangle, RefreshCw, X, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";
import { BlockedIp } from "@shared/schema";

export default function AdminIPBlocker() {
  const { toast } = useToast();
  const [newIp, setNewIp] = useState("");
  const [newReason, setNewReason] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [unblockConfirmId, setUnblockConfirmId] = useState<string | null>(null);

  const { data: blockedIps = [], isLoading } = useQuery<BlockedIp[]>({ queryKey: ["/api/blocked-ips"] });

  const blockMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/blocked-ips", { ip: newIp.trim(), reason: newReason.trim() || undefined });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocked-ips"] });
      setNewIp(""); setNewReason(""); setShowForm(false);
      toast({ title: "تم حظر عنوان IP ✓" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const unblockMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blocked-ips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocked-ips"] });
      setUnblockConfirmId(null);
      toast({ title: "تم رفع الحظر ✓" });
    },
    onError: () => toast({ title: "خطأ في الحذف", variant: "destructive" }),
  });

  return (
    <AdminLayout>
      <div dir="rtl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white">حظر عناوين IP</h1>
            </div>
            <p className="text-gray-400 mr-13">{blockedIps.length} عنوان محظور</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
            data-testid="button-add-blocked-ip"
          >
            <Plus className="w-4 h-4" />
            حظر IP جديد
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 mb-6"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                إضافة عنوان IP للقائمة السوداء
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">عنوان IP *</label>
                  <input
                    value={newIp}
                    onChange={e => setNewIp(e.target.value)}
                    placeholder="مثال: 192.168.1.100"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 placeholder-gray-500 font-mono"
                    data-testid="input-blocked-ip"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">سبب الحظر</label>
                  <input
                    value={newReason}
                    onChange={e => setNewReason(e.target.value)}
                    placeholder="مثال: طلبات وهمية متكررة"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 placeholder-gray-500"
                    data-testid="input-blocked-reason"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => blockMutation.mutate()}
                  disabled={!newIp.trim() || blockMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
                  data-testid="button-confirm-block-ip"
                >
                  {blockMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  تطبيق الحظر
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-gray-400 hover:text-white transition-all">
                  إلغاء
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">جاري التحميل...</p>
            </div>
          ) : blockedIps.length === 0 ? (
            <div className="p-16 text-center">
              <ShieldOff className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">لا توجد عناوين IP محظورة</p>
              <p className="text-gray-600 text-sm mt-1">سيتم عرض العناوين المحظورة هنا</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">عنوان IP</th>
                    <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">سبب الحظر</th>
                    <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm hidden md:table-cell">تاريخ الحظر</th>
                    <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {blockedIps.map(item => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        data-testid={`blocked-ip-row-${item.id}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-white font-mono text-sm">{item.ip}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {item.reason || <span className="text-gray-600">—</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-DZ") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          {unblockConfirmId === item.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => unblockMutation.mutate(item.id)}
                                disabled={unblockMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                                data-testid={`button-confirm-unblock-${item.id}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                تأكيد
                              </button>
                              <button
                                onClick={() => setUnblockConfirmId(null)}
                                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setUnblockConfirmId(item.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500 text-gray-400 hover:text-emerald-400 text-xs font-bold rounded-lg transition-all"
                              data-testid={`button-unblock-${item.id}`}
                            >
                              <ShieldOff className="w-3.5 h-3.5" />
                              رفع الحظر
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-400 font-bold mb-1">كيف يعمل حظر IP؟</h4>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>أي طلب جديد من عنوان IP محظور سيُرفض تلقائياً</li>
                <li>يمكنك الحصول على IP العميل من سجلات الطلبات</li>
                <li>يُستخدم للحماية من الطلبات الوهمية المتكررة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
