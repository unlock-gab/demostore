import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Save, Loader2, Eye, EyeOff, CheckCircle,
  ChevronDown, ChevronUp, Copy, Link2, BarChart2, FileSpreadsheet,
  FlaskConical, AlertCircle, RotateCcw, TriangleAlert,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "./AdminLayout";

const APPS_SCRIPT_CODE = `function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
  if (sh.getLastRow() === 0)
    sh.appendRow(["ID","Date","Name","Phone","Wilaya","Product","Qty","Total","Status"]);
  var d = JSON.parse(e.postData.contents);
  sh.appendRow([d.id,d.date,d.name,d.phone,d.wilaya,d.product,d.quantity,d.total,d.status]);
  return ContentService.createTextOutput("OK");
}`;

function SettingCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SettingRow({ icon, title, subtitle, children, accent = "violet" }: {
  icon: ReactNode; title: string; subtitle: string; children: ReactNode; accent?: string;
}) {
  const accents: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-400",
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    rose: "bg-rose-500/10 text-rose-400",
  };
  return (
    <div className="flex items-start gap-4 p-5 border-b border-gray-800 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accents[accent]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function SecretInput({ value, onChange, placeholder, testId }: {
  value: string; onChange: (v: string) => void; placeholder: string; testId: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-500 transition-colors pr-10"
        data-testid={testId}
        dir="ltr"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function SaveButton({ onClick, isPending, saved, label = "حفظ", color = "violet" }: {
  onClick: () => void; isPending: boolean; saved: boolean; label?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    violet: "bg-violet-600 hover:bg-violet-500 shadow-violet-500/20",
    emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
  };
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg disabled:opacity-60 ${colors[color]}`}
    >
      {isPending ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
      ) : saved ? (
        <><CheckCircle className="w-4 h-4 text-emerald-300" /> تم الحفظ</>
      ) : (
        <><Save className="w-4 h-4" /> {label}</>
      )}
    </button>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [fbPixelId, setFbPixelId] = useState("");
  const [ttPixelId, setTtPixelId] = useState("");
  const [gsWebhookUrl, setGsWebhookUrl] = useState("");
  const [gsEnabled, setGsEnabled] = useState(false);
  const [pixelSaved, setPixelSaved] = useState(false);
  const [gsSaved, setGsSaved] = useState(false);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [reseedConfirm, setReseedConfirm] = useState(false);

  const { data: settingsData } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (!settingsData) return;
    if (settingsData.facebookPixelId) setFbPixelId(settingsData.facebookPixelId);
    if (settingsData.tiktokPixelId) setTtPixelId(settingsData.tiktokPixelId);
    if (settingsData.googleSheetsWebhookUrl) setGsWebhookUrl(settingsData.googleSheetsWebhookUrl);
    if (settingsData.googleSheetsEnabled) setGsEnabled(settingsData.googleSheetsEnabled === "true");
  }, [settingsData]);

  const pixelMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/settings", { facebookPixelId: fbPixelId, tiktokPixelId: ttPixelId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setPixelSaved(true);
      setTimeout(() => setPixelSaved(false), 3000);
      toast({ title: "تم حفظ إعدادات البيكسل ✓" });
    },
    onError: () => toast({ title: "خطأ في الحفظ", variant: "destructive" }),
  });

  const gsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/settings", {
        googleSheetsWebhookUrl: gsWebhookUrl,
        googleSheetsEnabled: gsEnabled ? "true" : "false",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setGsSaved(true);
      setTimeout(() => setGsSaved(false), 3000);
      toast({ title: "تم حفظ إعدادات Google Sheets ✓" });
    },
    onError: () => toast({ title: "خطأ في الحفظ", variant: "destructive" }),
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/settings/test-sheets", { url: gsWebhookUrl });
      return res.json();
    },
    onSuccess: (data: { ok: boolean; message: string; detail?: string }) => {
      if (data.ok) {
        toast({ title: "✓ " + data.message });
      } else {
        toast({ title: "فشل الاختبار", description: data.message + (data.detail ? ` — ${data.detail.substring(0, 100)}` : ""), variant: "destructive" });
      }
    },
    onError: () => toast({ title: "خطأ في الاتصال", variant: "destructive" }),
  });

  const reseedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/reseed", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setReseedConfirm(false);
      toast({ title: "✓ تمت إعادة بذر البيانات بنجاح — تحديث الصفحة تلقائياً..." });
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: () => toast({ title: "خطأ في إعادة البذر", variant: "destructive" }),
  });

  const copyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
    toast({ title: "تم نسخ الكود ✓" });
  };

  const urlMissingExec = gsWebhookUrl && !gsWebhookUrl.trim().endsWith("/exec");

  return (
    <AdminLayout>
      <div dir="rtl" className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">الإعدادات</h1>
          <p className="text-gray-500 text-sm">إدارة التتبع والتكاملات الخارجية</p>
        </div>

        <div className="space-y-3">

          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-1 mb-2">تتبع الإعلانات</p>

          <SettingCard>
            <SettingRow
              icon={<BarChart2 className="w-5 h-5" />}
              title="Facebook Pixel"
              subtitle="تتبع التحويلات من إعلانات Meta"
              accent="blue"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <SecretInput
                    value={fbPixelId}
                    onChange={setFbPixelId}
                    placeholder="123456789012345"
                    testId="input-fb-pixel"
                  />
                </div>
                {fbPixelId && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    مُفعَّل
                  </span>
                )}
              </div>
            </SettingRow>

            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.53V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
              }
              title="TikTok Pixel"
              subtitle="تتبع التحويلات من إعلانات TikTok"
              accent="rose"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <SecretInput
                    value={ttPixelId}
                    onChange={setTtPixelId}
                    placeholder="C4XXXXXXXXXXXXXXXXXX"
                    testId="input-tt-pixel"
                  />
                </div>
                {ttPixelId && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    مُفعَّل
                  </span>
                )}
              </div>
            </SettingRow>

            <div className="flex justify-end p-4 bg-gray-950/40">
              <SaveButton
                onClick={() => pixelMutation.mutate()}
                isPending={pixelMutation.isPending}
                saved={pixelSaved}
                label="حفظ إعدادات البيكسل"
                color="violet"
              />
            </div>
          </SettingCard>

          <div className="pt-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-1 mb-2">التكاملات</p>
          </div>

          <SettingCard>
            <SettingRow
              icon={<FileSpreadsheet className="w-5 h-5" />}
              title="Google Sheets"
              subtitle="تصدير الطلبات تلقائياً عند كل طلب جديد"
              accent="emerald"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white text-sm font-semibold">تفعيل المزامنة التلقائية</p>
                    <p className="text-gray-500 text-xs mt-0.5">إرسال كل طلب جديد للـ Sheet فوراً</p>
                  </div>
                  <button
                    onClick={() => setGsEnabled(!gsEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${gsEnabled ? "bg-emerald-500" : "bg-gray-700"}`}
                    data-testid="toggle-google-sheets"
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${gsEnabled ? "right-1" : "left-1"}`} />
                  </button>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    رابط Apps Script (Web App URL)
                  </label>
                  <input
                    value={gsWebhookUrl}
                    onChange={e => setGsWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className={`w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors ${urlMissingExec ? "border-amber-500 focus:border-amber-400" : "border-gray-700 focus:border-emerald-500"}`}
                    data-testid="input-google-sheets-url"
                    dir="ltr"
                  />
                  {urlMissingExec && (
                    <p className="flex items-center gap-1.5 text-amber-400 text-xs mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      الرابط ينقصه <code className="bg-gray-800 px-1 rounded">/exec</code> في النهاية — سيُضاف تلقائياً عند الإرسال
                    </p>
                  )}
                </div>

                {gsWebhookUrl && (
                  <button
                    onClick={() => testMutation.mutate()}
                    disabled={testMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
                    data-testid="button-test-sheets"
                  >
                    {testMutation.isPending
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> جاري الاختبار...</>
                      : <><FlaskConical className="w-3.5 h-3.5" /> اختبار الاتصال بـ Google Sheets</>
                    }
                  </button>
                )}

                <button
                  onClick={() => setShowScriptGuide(!showScriptGuide)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                  data-testid="toggle-script-guide"
                >
                  {showScriptGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  كيفية إعداد Apps Script خطوة بخطوة
                </button>

                <AnimatePresence>
                  {showScriptGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                          <ol className="space-y-2 text-sm text-gray-300">
                            <li className="flex gap-2">
                              <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                              افتح Google Sheet جديد → <span className="text-white font-semibold">Extensions → Apps Script</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                              الصق الكود التالي ثم اضغط <span className="text-white font-semibold">Deploy → New Deployment → Web App</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                              اختر <span className="text-white font-semibold">Anyone</span> في "Who has access" ثم انسخ الرابط
                            </li>
                          </ol>
                        </div>
                        <div className="relative">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800">
                            <span className="text-gray-500 text-xs font-mono">Apps Script</span>
                            <button
                              onClick={copyCode}
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-lg transition-all"
                            >
                              {codeCopied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {codeCopied ? "تم النسخ!" : "نسخ"}
                            </button>
                          </div>
                          <pre className="p-4 text-xs text-emerald-400 font-mono leading-relaxed overflow-x-auto bg-gray-950" dir="ltr">
                            {APPS_SCRIPT_CODE}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SettingRow>

            <div className="flex justify-end p-4 bg-gray-950/40">
              <SaveButton
                onClick={() => gsMutation.mutate()}
                isPending={gsMutation.isPending}
                saved={gsSaved}
                label="حفظ إعدادات Sheets"
                color="emerald"
              />
            </div>
          </SettingCard>

        </div>

        <div className="pt-6">
          <p className="text-xs font-semibold text-red-600/70 uppercase tracking-widest px-1 mb-2">منطقة الخطر</p>
        </div>

        <SettingCard>
          <SettingRow
            icon={<RotateCcw className="w-5 h-5" />}
            title="إعادة بذر البيانات التجريبية"
            subtitle="يحذف جميع المنتجات والطلبيات والتصنيفات الحالية ويعيد تحميل البيانات الجديدة من الكود"
            accent="rose"
          >
            {!reseedConfirm ? (
              <button
                onClick={() => setReseedConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl text-sm font-semibold transition-all"
                data-testid="button-reseed-start"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة البذر (Reset Data)
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-4">
                  <TriangleAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-semibold text-sm">تأكيد الحذف والإعادة</p>
                    <p className="text-red-400/70 text-xs mt-1">سيتم حذف جميع المنتجات والطلبيات والتصنيفات الحالية وإعادة تحميل البيانات الجديدة. هذا الإجراء لا يمكن التراجع عنه.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => reseedMutation.mutate()}
                    disabled={reseedMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-lg shadow-red-500/20"
                    data-testid="button-reseed-confirm"
                  >
                    {reseedMutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإعادة...</>
                      : <><RotateCcw className="w-4 h-4" /> نعم، أعد البذر</>
                    }
                  </button>
                  <button
                    onClick={() => setReseedConfirm(false)}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </SettingRow>
        </SettingCard>

      </div>
    </AdminLayout>
  );
}
