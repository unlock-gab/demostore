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

export default function DeepQuiet() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* Background grid overlay - extremely subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}>
      </div>

      <div className="relative z-10">
        
        {/* Navigation / Header */}
        <header className="container mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-slate-800 bg-black flex items-center justify-center">
              <span className="text-white font-bold text-xl tracking-wider">D</span>
            </div>
            <span className="text-white font-medium tracking-wide">Demo Store</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="text-white hover:text-indigo-400 transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-white transition-colors">المنتجات</a>
            <a href="#" className="hover:text-white transition-colors">عن المتجر</a>
            <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-black/50 text-slate-400 text-sm font-medium mb-12">
            <BadgeCheck className="w-4 h-4 text-slate-500" />
            <span>هواتف وإكسسوارات — أفضل الأسعار في الجزائر</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight mb-8 max-w-4xl">
            متجرك للهواتف <br/> والإكسسوارات
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
            هواتف ذكية، سماعات، شاحنات، وإكسسوارات بأسعار تنافسية. توصيل لكل ولايات الجزائر الـ 58. الدفع عند الاستلام.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-none transition-all duration-300 flex items-center justify-center gap-2">
              تسوّق الآن
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-white font-medium rounded-none transition-all duration-300">
              الأكثر طلباً
            </button>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-slate-900/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-slate-900/50">
              {[
                { num: "+1000", label: "منتج متاح" },
                { num: "+5K", label: "زبون راضٍ" },
                { num: "4.8★", label: "تقييم الزبائن", accent: true },
                { num: "58", label: "ولاية نوصّل إليها" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center px-4">
                  <span className={`text-4xl md:text-5xl font-light mb-2 ${stat.accent ? 'text-indigo-400' : 'text-white'}`}>{stat.num}</span>
                  <span className="text-sm font-medium text-slate-500 tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "توصيل لكل الجزائر", desc: "توصيل سريع وموثوق" },
              { icon: Shield, title: "الدفع عند الاستلام", desc: "ادفع براحة بال" },
              { icon: BadgeCheck, title: "منتجات أصلية 100%", desc: "مضمونة المصدر" },
              { icon: Zap, title: "ضمان الجودة", desc: "خدمة ما بعد البيع" }
            ].map((feat, i) => (
              <div key={i} className="group p-8 bg-black border border-slate-900 hover:border-indigo-500/50 transition-colors duration-300 flex flex-col items-start gap-4">
                <feat.icon className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">{feat.title}</h3>
                  <p className="text-slate-500 text-sm">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">التصنيفات</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "هواتف ذكية", active: true },
              { name: "سماعات", active: false },
              { name: "حافظات", active: false },
              { name: "شواحن", active: false },
              { name: "إكسسوارات", active: false }
            ].map((cat, i) => (
              <button 
                key={i} 
                className={`px-8 py-4 text-lg font-medium transition-all duration-300 border-b-2 ${
                  cat.active 
                    ? 'border-indigo-500 text-white bg-slate-900/30' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group bg-black border border-slate-900 p-6 flex flex-col transition-all duration-500 hover:border-slate-700">
                <div className="aspect-square bg-[#0f0f11] mb-6 flex items-center justify-center p-8 relative overflow-hidden">
                  {/* Abstract placeholder for phone/accessory */}
                  <div className="w-2/3 h-4/5 border border-slate-800 rounded-sm bg-gradient-to-b from-slate-900 to-black group-hover:scale-105 transition-transform duration-700"></div>
                  {i === 0 && (
                    <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold px-2 py-1 tracking-wider">
                      جديد
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="text-xs font-medium text-slate-500 mb-2 tracking-widest uppercase">Apple</div>
                  <h3 className="text-lg font-medium text-slate-300 mb-4 group-hover:text-white transition-colors">
                    iPhone 15 Pro Max
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-white">250,000 د.ج</span>
                    <button className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container mx-auto px-6 py-32 mb-12 border-t border-slate-900">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              أول طلب؟ احصل على شحن مجاني
            </h2>
            <button className="px-10 py-5 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-lg transition-all duration-300 inline-flex items-center gap-3">
              استفد من العرض
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </section>
        
        {/* Footer minimal */}
        <footer className="border-t border-slate-900 py-12 text-center text-slate-600 text-sm">
          <p>© 2024 Demo Store. جميع الحقوق محفوظة.</p>
        </footer>

      </div>
    </div>
  );
}
