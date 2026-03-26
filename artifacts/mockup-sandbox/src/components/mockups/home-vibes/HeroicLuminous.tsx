import React from "react";
import { 
  Smartphone, 
  Headphones, 
  Shield, 
  Zap, 
  Cable, 
  Star, 
  Truck, 
  BadgeCheck, 
  ArrowLeft,
  ChevronLeft
} from "lucide-react";

export default function HeroicLuminous() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* The single cinematic radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_#1d4ed8_0%,_transparent_65%)] opacity-50 blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-medium mb-8 backdrop-blur-md shadow-lg shadow-blue-900/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            تخفيضات نهاية العام بدأت الآن
          </div>
          
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight mb-6 leading-tight">
            أحدث الهواتف الذكية
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              والإكسسوارات
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            اكتشف تشكيلتنا الواسعة من أحدث الأجهزة التقنية والإكسسوارات الأصلية. جودة مضمونة وأسعار لا تقبل المنافسة.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] flex items-center justify-center gap-2 group">
              تسوق الآن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center">
              تصفح العروض
            </button>
          </div>
          
          {/* Stats Bar */}
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-y-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="flex-1 min-w-[120px] px-4">
              <div className="text-4xl sm:text-5xl font-black text-cyan-400 mb-2">+10k</div>
              <div className="text-sm text-slate-400 font-medium tracking-wide">عميل سعيد</div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-white/10"></div>
            
            <div className="flex-1 min-w-[120px] px-4">
              <div className="text-4xl sm:text-5xl font-black text-cyan-400 mb-2">100%</div>
              <div className="text-sm text-slate-400 font-medium tracking-wide">منتجات أصلية</div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            
            <div className="flex-1 min-w-[120px] px-4">
              <div className="text-4xl sm:text-5xl font-black text-cyan-400 mb-2">24h</div>
              <div className="text-sm text-slate-400 font-medium tracking-wide">توصيل سريع</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Strip */}
      <section className="py-8 bg-slate-950/80 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">توصيل لجميع الولايات</h3>
                <p className="text-slate-400 text-sm">شحن سريع ومضمون إلى 58 ولاية</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">ضمان على المنتجات</h3>
                <p className="text-slate-400 text-sm">ضمان يصل إلى 12 شهراً على الأجهزة</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">دفع عند الاستلام</h3>
                <p className="text-slate-400 text-sm">ادفع بأمان عند استلام طلبيتك</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black mb-2">تصفح الفئات</h2>
              <p className="text-slate-400">اختر من بين تشكيلتنا المتنوعة</p>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Smartphone, name: "هواتف ذكية", count: "124 منتج" },
              { icon: Headphones, name: "سماعات", count: "86 منتج" },
              { icon: Zap, name: "شواحن", count: "52 منتج" },
              { icon: Cable, name: "كوابل ومحولات", count: "93 منتج" }
            ].map((cat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group shadow-lg shadow-black/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-500/20">
                  <cat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <span className="text-xs text-slate-500 font-medium bg-slate-900/50 px-2 py-1 rounded-md">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 inline-block relative">
              الأكثر مبيعاً
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">أفضل المنتجات التقنية التي يفضلها عملاؤنا</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-slate-950 rounded-2xl border border-white/5 overflow-hidden group hover:border-blue-500/30 transition-colors shadow-xl shadow-black/40">
                <div className="relative aspect-square bg-slate-900 p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
                  <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Smartphone className="w-16 h-16 text-slate-600" />
                  </div>
                  {i === 1 && (
                    <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-900/50">
                      جديد
                    </div>
                  )}
                  {i === 2 && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-900/50">
                      خصم 20%
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">هاتف ذكي موديل {i}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-slate-700 text-slate-700" />
                    <span className="text-xs text-slate-500 mr-1">(24)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-xl font-black text-white">45,000 د.ج</div>
                      {i === 2 && <div className="text-sm text-slate-500 line-through">55,000 د.ج</div>}
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white flex items-center justify-center transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2">
              عرض المزيد من المنتجات
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner - Editorial Layout */}
      <section className="bg-[#09090b] border-t border-blue-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="text-right flex-1">
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
                أول طلب؟ <span className="text-blue-500">احصل على شحن مجاني</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl">
                سجل الآن واستفد من شحن مجاني لطلبك الأول إلى أي مكان في الجزائر.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button className="px-10 py-5 bg-white text-slate-950 hover:bg-blue-50 rounded-xl font-black text-xl transition-colors shadow-xl shadow-white/5 flex items-center gap-3">
                إنشاء حساب مجاني
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
