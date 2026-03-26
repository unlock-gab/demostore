import React, { useState, useEffect } from "react";
import { 
  Smartphone, Headphones, Shield, Zap, Cable, 
  Star, Truck, BadgeCheck, ArrowLeft, ChevronLeft,
  ShoppingCart, Search, Menu
} from "lucide-react";

// Fixed blobs instead of Math.random() for stable, beautiful composition
const HERO_BLOBS = [
  { id: 1, w: 380, h: 380, left: "-10%", top: "-10%", bg: "bg-blue-600/20", delay: "0s", duration: "12s" },
  { id: 2, w: 450, h: 450, right: "-15%", top: "20%", bg: "bg-indigo-600/20", delay: "2s", duration: "15s" },
  { id: 3, w: 300, h: 300, left: "20%", bottom: "-10%", bg: "bg-cyan-500/15", delay: "4s", duration: "14s" },
  { id: 4, w: 350, h: 350, right: "15%", bottom: "10%", bg: "bg-blue-500/20", delay: "1s", duration: "13s" },
  { id: 5, w: 250, h: 250, left: "40%", top: "30%", bg: "bg-indigo-500/15", delay: "3s", duration: "16s" },
  { id: 6, w: 320, h: 320, right: "35%", top: "-5%", bg: "bg-cyan-600/15", delay: "5s", duration: "11s" },
];

export default function PolishedConsistent() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-900">
      {/* Navbar (Transparent -> Solid Dark) */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-black tracking-tight">موبايل<span className="text-blue-400">ستور</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
            <a href="#" className="text-white hover:text-blue-400 transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-blue-400 transition-colors">الهواتف</a>
            <a href="#" className="hover:text-blue-400 transition-colors">الإكسسوارات</a>
            <a href="#" className="hover:text-blue-400 transition-colors">تخفيضات</a>
          </div>

          <div className="flex items-center gap-4 text-white">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Search className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full text-[10px] flex items-center justify-center font-bold">2</span>
            </button>
            <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_BLOBS.map((blob) => (
            <div
              key={blob.id}
              className={`absolute rounded-full blur-[80px] ${blob.bg} opacity-60 animate-pulse`}
              style={{
                width: blob.w,
                height: blob.h,
                left: blob.left,
                right: blob.right,
                top: blob.top,
                bottom: blob.bottom,
                animationDuration: blob.duration,
                animationDelay: blob.delay,
              }}
            />
          ))}
          {/* subtle noise texture overlay could go here for extra polish */}
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Badge - 1 icon only */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 font-medium text-sm mb-8 backdrop-blur-sm">
              <BadgeCheck className="w-4 h-4" />
              <span>أكبر متجر هواتف في الجزائر</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.2] mb-6 tracking-tight">
              اكتشف عالم التقنية مع <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent inline-block mt-2">أحدث الهواتف الذكية</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              نوفر لك أفضل الهواتف الذكية والإكسسوارات الأصلية بأسعار تنافسية مع ضمان حقيقي وتوصيل سريع لكل الولايات.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                تسوق الآن
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg backdrop-blur-sm transition-all duration-300">
                تصفح العروض
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10 max-w-5xl mx-auto">
            {[
              { label: "عميل سعيد", value: "+10K" },
              { label: "منتج أصلي", value: "+500" },
              { label: "ولاية توصيل", value: "58" },
              { label: "سنوات خبرة", value: "+5" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURE STRIP (Dark Slate-900) */}
      <section className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "توصيل سريع", desc: "إلى جميع الولايات 58" },
              { icon: Shield, title: "ضمان حقيقي", desc: "منتجات أصلية 100%" },
              { icon: Headphones, title: "دعم فني", desc: "متواجدون دائماً لخدمتك" },
              { icon: Zap, title: "عروض يومية", desc: "تخفيضات لا تفوت" },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{feat.title}</h3>
                  <p className="text-slate-400 text-sm">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">تصفح الأقسام</h2>
              <p className="text-slate-500">اختر من بين مجموعتنا المتنوعة</p>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group">
              عرض الكل
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Smartphone, label: "هواتف ذكية", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Headphones, label: "سماعات", color: "text-purple-600", bg: "bg-purple-100" },
              { icon: Shield, label: "أغطية حماية", color: "text-emerald-600", bg: "bg-emerald-100" },
              { icon: Cable, label: "شواحن وكابلات", color: "text-orange-600", bg: "bg-orange-100" },
              { icon: Star, label: "أجهزة ذكية", color: "text-pink-600", bg: "bg-pink-100" },
            ].map((cat, i) => (
              <a key={i} href="#" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-500/40 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-slate-800">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (Subtle gradient bg) */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">أحدث المنتجات</h2>
              <p className="text-slate-500">اكتشف أحدث الهواتف والإكسسوارات المضافة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="relative aspect-square bg-slate-100 p-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    -15%
                  </div>
                  {/* Mock image placeholder */}
                  <div className="w-full h-full bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                    <Smartphone className="w-20 h-20 opacity-20" />
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs text-blue-600 font-bold mb-2">سامسونج</div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">هاتف سامسونج جالاكسي S24 الترا سعة 256 جيجابايت</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                    ))}
                    <span className="text-xs text-slate-500 mr-1">(42)</span>
                  </div>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900">185,000 د.ج</div>
                      <div className="text-sm text-slate-400 line-through">215,000 د.ج</div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
              عرض المزيد من المنتجات
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER (Radial Glow) */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Distinct radial glow rather than directional gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            مستعد لترقية هاتفك الذكي؟
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الذين وثقوا بنا. تسوق الآن واستفد من التوصيل المجاني للطلبات فوق 50,000 د.ج.
          </p>
          <button className="px-10 py-4 rounded-xl bg-white text-slate-900 font-black text-lg hover:bg-blue-50 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300">
            ابدأ التسوق الآن
          </button>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-slate-950 py-8 border-t border-white/10 text-center text-slate-500 text-sm">
        <p>© 2024 موبايل ستور. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
