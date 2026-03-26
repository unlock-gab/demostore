import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ChevronDown, ChevronUp, Save, CheckCircle2, XCircle, Zap, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DeliveryCompany } from "@shared/schema";

const COMPANY_COLORS: Record<string, string> = {
  yalidine: "from-yellow-600 to-amber-500",
  "zr-express": "from-red-700 to-red-500",
  maystro: "from-blue-700 to-blue-500",
  ecotrack: "from-green-700 to-green-500",
  guepex: "from-purple-700 to-purple-500",
  noest: "from-cyan-700 to-cyan-500",
};

const COMPANY_LABELS: Record<string, { description: string; hasApi: boolean }> = {
  yalidine:   { description: "شركة توصيل رائدة في الجزائر — تدعم API الرسمي", hasApi: true },
  "zr-express": { description: "ZR Express للتوصيل السريع في كل الولايات", hasApi: true },
  maystro:    { description: "Maystro Delivery — شبكة توصيل واسعة", hasApi: true },
  ecotrack:   { description: "Ecotrack — تتبع الشحنات في الوقت الفعلي", hasApi: true },
  guepex:     { description: "Guepex — خدمة توصيل الشحنات الثقيلة", hasApi: false },
  noest:      { description: "Noest Express — التوصيل شرق الجزائر", hasApi: false },
};

function CompanyCard({ company, onUpdated }: { company: DeliveryCompany; onUpdated: () => void }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    apiKey: company.apiKey || "",
    apiSecret: company.apiSecret || "",
    accountId: company.accountId || "",
    testMode: company.testMode ?? true,
    notes: company.notes || "",
  });

  const toggleMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/delivery-companies/${company.id}`, { enabled: !company.enabled }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/delivery-companies"] }); onUpdated(); },
  });

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/delivery-companies/${company.id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-companies"] });
      toast({ title: "تم الحفظ", description: `تم حفظ إعدادات ${company.name}` });
      onUpdated();
    },
  });

  const meta = COMPANY_LABELS[company.slug] || { description: "", hasApi: false };
  const gradient = COMPANY_COLORS[company.slug] || "from-gray-700 to-gray-600";

  return (
    <motion.div
      layout
      className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
    >
      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-bold">{company.name}</span>
            {meta.hasApi && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                <Zap className="w-3 h-3" />API
              </span>
            )}
            {company.enabled && (
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">مفعّل</span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
            data-testid={`toggle-company-${company.slug}`}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${company.enabled ? "bg-emerald-500" : "bg-gray-600"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${company.enabled ? "right-0.5" : "left-0.5"}`} />
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
            data-testid={`expand-company-${company.slug}`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-700 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    {company.slug === "yalidine" ? "X-API-TOKEN" : "API Key"}
                  </label>
                  <input
                    type="password"
                    value={form.apiKey}
                    onChange={e => setForm(f => ({ ...f, apiKey: e.target.value }))}
                    placeholder="أدخل مفتاح API..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                    data-testid={`input-apikey-${company.slug}`}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    {company.slug === "yalidine" ? "X-API-ID (معرّف الحساب)" : "Account ID"}
                  </label>
                  <input
                    type="text"
                    value={form.accountId}
                    onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}
                    placeholder="معرّف الحساب..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                    data-testid={`input-accountid-${company.slug}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">ملاحظات</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="ملاحظات اختيارية..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, testMode: !f.testMode }))}
                    className={`relative w-10 h-5 rounded-full transition-all ${form.testMode ? "bg-amber-500" : "bg-gray-600"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.testMode ? "right-0.5" : "left-0.5"}`} />
                  </div>
                  <span className="text-gray-300 text-sm">وضع الاختبار {form.testMode ? "(مفعّل)" : "(معطّل)"}</span>
                </label>

                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-rose-500 hover:to-pink-500 transition-all disabled:opacity-50"
                  data-testid={`btn-save-${company.slug}`}
                >
                  <Save className="w-4 h-4" />
                  {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>

              {company.enabled && company.apiKey && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-400 text-xs">هذه الشركة مربوطة وجاهزة لإنشاء الشحنات من صفحة الطلبات</p>
                </div>
              )}
              {company.enabled && !company.apiKey && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <XCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-400 text-xs">الشركة مفعّلة لكن لم يتم إدخال مفتاح API بعد</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminDeliveryCompanies() {
  const { data: companies = [], isLoading, refetch } = useQuery<DeliveryCompany[]>({
    queryKey: ["/api/delivery-companies"],
  });

  const enabled = companies.filter(c => c.enabled);
  const disabled = companies.filter(c => !c.enabled);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto" dir="rtl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">شركات التوصيل</h1>
          <p className="text-gray-400 text-sm">اربط شركات التوصيل الجزائرية لإنشاء الشحنات تلقائياً من لوحة الطلبات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="text-3xl font-black text-emerald-400">{enabled.length}</div>
            <div className="text-gray-400 text-sm mt-1">شركة مفعّلة</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="text-3xl font-black text-gray-400">{disabled.length}</div>
            <div className="text-gray-400 text-sm mt-1">شركة معطّلة</div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 mb-8">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-400" />
            كيف تعمل؟
          </h3>
          <ol className="space-y-2 text-gray-400 text-sm list-decimal list-inside">
            <li>فعّل شركة التوصيل التي تتعامل معها وأدخل مفتاح الـ API الخاص بها</li>
            <li>عند تأكيد طلب، اذهب لصفحة الطلبات ← افتح الطلب ← اضغط "إنشاء شحنة"</li>
            <li>اختر الشركة وسيتم إنشاء الشحنة تلقائياً مع رقم التتبع</li>
          </ol>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map(c => (
              <CompanyCard key={c.id} company={c} onUpdated={() => refetch()} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
