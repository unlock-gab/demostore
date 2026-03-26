import React from 'react';
import { 
  Smartphone, Headphones, Shield, Zap, Cable, 
  Star, Truck, BadgeCheck, ArrowLeft, ChevronLeft,
  ShoppingCart, Menu, Search
} from 'lucide-react';

const products = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra', price: '245,000 د.ج', category: 'هواتف ذكية', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', badge: 'جديد' },
  { id: 2, name: 'iPhone 15 Pro Max', price: '290,000 د.ج', category: 'هواتف ذكية', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', badge: 'الأكثر مبيعاً' },
  { id: 3, name: 'AirPods Pro 2', price: '45,000 د.ج', category: 'سماعات', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80' },
  { id: 4, name: 'Redmi Note 13 Pro', price: '65,000 د.ج', category: 'هواتف ذكية', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', badge: 'تخفيض' },
  { id: 5, name: 'شاحن سامسونج 45W', price: '6,500 د.ج', category: 'شواحن', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80' },
  { id: 6, name: 'حافظة سيليكون آيفون 15', price: '3,000 د.ج', category: 'حافظات', image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=500&q=80' },
  { id: 7, name: 'ساعة آبل Ultra 2', price: '185,000 د.ج', category: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80' },
  { id: 8, name: 'باور بانك Anker 20000mAh', price: '12,000 د.ج', category: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80' },
];

const categories = [
  { name: 'هواتف ذكية', icon: Smartphone },
  { name: 'سماعات', icon: Headphones },
  { name: 'شواحن', icon: Zap },
  { name: 'كوابل', icon: Cable },
  { name: 'إكسسوارات', icon: Shield },
];

const features = [
  { title: 'توصيل لكل الجزائر', icon: Truck, desc: 'لجميع الولايات الـ 58' },
  { title: 'الدفع عند الاستلام', icon: Zap, desc: 'آمن وموثوق 100%' },
  { title: 'منتجات أصلية', icon: BadgeCheck, desc: 'مضمونة الجودة' },
  { title: 'ضمان الجودة', icon: Shield, desc: 'استبدال مجاني' },
];

const stats = [
  { value: '+1000', label: 'منتج متاح' },
  { value: '+5K', label: 'زبون راضٍ' },
  { value: '4.8★', label: 'تقييم الزبائن' },
  { value: '58', label: 'ولاية نوصّل إليها' },
];

export default function CleanBright() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                D
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">Demo Store</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">الرئيسية</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">الهواتف</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">الإكسسوارات</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">تتبع الطلب</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  2
                </span>
              </button>
              <button className="md:hidden text-gray-500 hover:text-blue-600 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <BadgeCheck className="w-4 h-4" />
                هواتف وإكسسوارات — أفضل الأسعار في الجزائر
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2] mb-6 tracking-tight">
                متجرك للهواتف <br/> والإكسسوارات
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                هواتف ذكية، سماعات، شاحنات، وإكسسوارات بأسعار تنافسية. توصيل لكل ولايات الجزائر الـ 58. الدفع عند الاستلام.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2">
                  تسوّق الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
                  الأكثر طلباً
                </button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-blue-50 rounded-[2.5rem] transform rotate-3 scale-105"></div>
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" 
                alt="Smartphone collection" 
                className="relative rounded-[2rem] shadow-xl border border-white object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تصفح حسب الفئة</h2>
            <p className="text-gray-500">اختر من بين مجموعتنا الواسعة</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <a href="#" key={i} className="bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1 group">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors mb-4">
                <cat.icon className="w-8 h-8" />
              </div>
              <span className="font-semibold text-gray-900">{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">وصل حديثاً</h2>
              <p className="text-gray-500">اكتشف أحدث المنتجات التقنية</p>
            </div>
            <a href="#" className="hidden sm:flex items-center text-blue-600 font-medium hover:text-blue-700">
              عرض الكل
              <ChevronLeft className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-50 p-6">
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      {product.badge}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Quick Add Button overlay */}
                  <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white/90 backdrop-blur text-blue-600 font-semibold py-2.5 rounded-xl shadow-sm border border-gray-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
                      إضافة للسلة
                    </button>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 font-medium mb-1.5">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-blue-600">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <button className="w-full px-6 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              عرض كل المنتجات
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">{stat.value}</div>
                <div className="font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-16 text-center border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Zap className="w-4 h-4 fill-blue-700" />
                عرض خاص
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                أول طلب؟ احصل على شحن مجاني
              </h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto text-lg">
                انضم إلى آلاف الزبائن الراضين واستمتع بتجربة تسوق فريدة مع أفضل المنتجات التقنية في الجزائر.
              </p>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                سجل الآن وتسوق
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                D
              </div>
              <span className="font-bold text-gray-900">Demo Store</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
