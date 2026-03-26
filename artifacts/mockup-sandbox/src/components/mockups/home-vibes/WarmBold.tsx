import React from 'react';
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
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';

export default function WarmBold() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#1c0a00] text-amber-50 font-sans overflow-x-hidden selection:bg-amber-500/30">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1c0a00]/80 backdrop-blur-md border-b border-amber-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <span className="text-2xl font-black text-[#1c0a00]">D</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">متجر<span className="text-amber-500">ديمو</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-bold text-amber-100">
              <a href="#" className="hover:text-amber-400 transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-amber-400 transition-colors">الهواتف</a>
              <a href="#" className="hover:text-amber-400 transition-colors">الإكسسوارات</a>
              <a href="#" className="hover:text-amber-400 transition-colors">العروض</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-amber-950/50 border border-amber-900/50 flex items-center justify-center text-amber-400 hover:bg-amber-900 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-400 font-bold text-sm mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Zap className="w-4 h-4 text-orange-500" />
            <span>هواتف وإكسسوارات — أفضل الأسعار في الجزائر</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.2] drop-shadow-lg">
            متجرك <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">للهواتف والإكسسوارات</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-amber-200/80 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            هواتف ذكية، سماعات، شاحنات، وإكسسوارات بأسعار تنافسية. توصيل لكل ولايات الجزائر الـ 58. الدفع عند الاستلام.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-[#1c0a00] font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2">
              تسوّق الآن
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-amber-600 text-amber-400 font-bold text-lg hover:bg-amber-950/50 hover:text-amber-300 transition-all flex items-center justify-center gap-2">
              الأكثر طلباً
              <Star className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-amber-900/30 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-amber-500 mb-1 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">+1000</span>
              <span className="text-amber-200/60 font-medium">منتج متاح</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-amber-500 mb-1 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">+5K</span>
              <span className="text-amber-200/60 font-medium">زبون راضٍ</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-amber-500 mb-1 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">4.8★</span>
              <span className="text-amber-200/60 font-medium">تقييم الزبائن</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-amber-500 mb-1 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">58</span>
              <span className="text-amber-200/60 font-medium">ولاية نوصّل إليها</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="bg-amber-950/40 border-y border-amber-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 bg-[#1a0f00] p-4 rounded-2xl border border-amber-900/50 shadow-inner group hover:border-amber-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-[#1a0f00] transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <span className="font-bold text-amber-100">توصيل لكل الجزائر</span>
            </div>
            <div className="flex items-center gap-4 bg-[#1a0f00] p-4 rounded-2xl border border-amber-900/50 shadow-inner group hover:border-amber-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-[#1a0f00] transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-bold text-amber-100">الدفع عند الاستلام</span>
            </div>
            <div className="flex items-center gap-4 bg-[#1a0f00] p-4 rounded-2xl border border-amber-900/50 shadow-inner group hover:border-amber-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-[#1a0f00] transition-colors">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-amber-100">منتجات أصلية 100%</span>
            </div>
            <div className="flex items-center gap-4 bg-[#1a0f00] p-4 rounded-2xl border border-amber-900/50 shadow-inner group hover:border-amber-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-[#1a0f00] transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-bold text-amber-100">ضمان الجودة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">تصفح الأقسام</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'هواتف ذكية', icon: Smartphone, color: 'from-amber-600 to-amber-800' },
            { name: 'سماعات', icon: Headphones, color: 'from-orange-600 to-orange-800' },
            { name: 'حافظات', icon: Shield, color: 'from-amber-600 to-amber-800' },
            { name: 'شواحن', icon: Zap, color: 'from-orange-600 to-orange-800' },
            { name: 'إكسسوارات', icon: Cable, color: 'from-amber-600 to-amber-800' },
          ].map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className={`aspect-square rounded-3xl bg-gradient-to-br ${cat.color} p-[1px] relative overflow-hidden transition-transform hover:-translate-y-2`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity"></div>
                <div className="w-full h-full bg-[#1a0f00] rounded-[23px] flex flex-col items-center justify-center gap-4 relative z-10">
                  <cat.icon className="w-10 h-10 text-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  <span className="font-bold text-lg text-amber-100 group-hover:text-white">{cat.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex items-end justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">منتجات مميزة</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
          </div>
          <button className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors group">
            عرض الكل
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#1a0f00] rounded-2xl overflow-hidden border border-amber-900/40 group hover:border-amber-500/50 transition-all hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-b from-amber-950/50 to-[#1a0f00] relative p-6 flex items-center justify-center">
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  تخفيض
                </div>
                <Smartphone className="w-24 h-24 text-amber-900/50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="p-5">
                <div className="flex gap-1 text-amber-500 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-amber-900" />
                </div>
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">هاتف ذكي ألترا {i} برو</h3>
                <p className="text-amber-200/50 text-sm mb-4">سعة 256 جيجابايت</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-amber-500 tracking-tight">85,000<span className="text-sm text-amber-500/70 ml-1">د.ج</span></span>
                    <span className="text-sm text-amber-200/40 line-through">95,000 د.ج</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-amber-950 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-[#1c0a00] transition-colors shadow-lg">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-900 to-[#1a0f00] rounded-[2.5rem] p-10 md:p-16 border border-amber-700/50 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]"></div>
          
          <div className="relative z-10 md:w-2/3 text-center md:text-right">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              أول طلب؟ احصل على <span className="text-amber-500">شحن مجاني</span>
            </h2>
            <p className="text-xl text-amber-200/80 font-medium">
              استخدم الكود <span className="text-white font-black bg-amber-950 px-3 py-1 rounded-lg mx-1 border border-amber-800">WELCOME</span> عند الدفع
            </p>
          </div>
          
          <div className="relative z-10 md:w-1/3 flex justify-center md:justify-end w-full">
            <button className="w-full md:w-auto px-10 py-5 rounded-2xl bg-orange-600 text-white font-black text-xl hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
              تسوّق الآن
              <Zap className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer className="border-t border-amber-900/30 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-amber-200/40 font-medium">
          <p>© 2024 متجر ديمو. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

    </div>
  );
}
