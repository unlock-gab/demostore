import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X, ChevronDown, Grid3X3, List, Shirt, Sparkles, Scissors, Heart, Crown, Smartphone, Package } from "lucide-react";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = { Shirt, Sparkles, Scissors, Heart, Crown };

const categoryNames: Record<string, string> = {
  electronics: "إلكترونيات",
  fashion: "أزياء",
  books: "كتب",
  sports: "رياضة",
  beauty: "جمال",
  home: "منزل",
};

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "popular", label: "الأكثر شعبية" },
];

export default function Products() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const [search, setSearch] = useState(params.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  const { data: products = [], isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const newParams = new URLSearchParams(location.split("?")[1] || "");
    setActiveCategory(newParams.get("category") || "all");
    setSearch(newParams.get("search") || "");
  }, [location]);

  useEffect(() => {
    const target = products.length;
    if (target === 0) { setDisplayCount(0); return; }
    const duration = 900;
    const startTime = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [products.length]);

  let filtered = products;
  if (activeCategory !== "all") filtered = filtered.filter(p => p.category === activeCategory);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  filtered = filtered.filter(p => parseFloat(p.price as string) >= priceRange[0] && parseFloat(p.price as string) <= priceRange[1]);

  switch (sort) {
    case "price-asc": filtered = [...filtered].sort((a, b) => parseFloat(a.price as string) - parseFloat(b.price as string)); break;
    case "price-desc": filtered = [...filtered].sort((a, b) => parseFloat(b.price as string) - parseFloat(a.price as string)); break;
    case "rating": filtered = [...filtered].sort((a, b) => parseFloat(b.rating as string) - parseFloat(a.rating as string)); break;
    case "popular": filtered = [...filtered].sort((a, b) => b.reviews - a.reviews); break;
    default: break;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Creative Hero Section ── */}
      <div className="products-hero pt-24 pb-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="products-hero__bg" aria-hidden="true" />
        {/* Perspective grid */}
        <div className="products-hero__grid" aria-hidden="true" />
        {/* Floating glow orbs */}
        <div className="products-hero__orb products-hero__orb--1" aria-hidden="true" />
        <div className="products-hero__orb products-hero__orb--2" aria-hidden="true" />
        <div className="products-hero__orb products-hero__orb--3" aria-hidden="true" />
        {/* Horizontal scan beam */}
        <div className="products-hero__beam" aria-hidden="true" />
        {/* Noise texture */}
        <div className="products-hero__noise" aria-hidden="true" />

        {/* Decorative rings — left side */}
        <div className="products-hero__rings-wrap" aria-hidden="true">
          <div className="products-hero__ring products-hero__ring--1" />
          <div className="products-hero__ring products-hero__ring--2" />
          <div className="products-hero__ring products-hero__ring--3" />
          <div className="products-hero__ring products-hero__ring--4" />
          <div className="products-hero__ring-center">
            <Smartphone className="w-7 h-7 text-blue-200" />
          </div>
        </div>

        {/* Content — padded separately so wave stays full-width */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-blue-300/60 text-sm mb-6"
          >
            <span>الرئيسية</span>
            <span className="text-blue-400/40">/</span>
            <span className="text-blue-200/80">المنتجات</span>
            {activeCategory !== "all" && (
              <>
                <span className="text-blue-400/40">/</span>
                <span className="text-blue-100 font-medium">{categoryNames[activeCategory] || activeCategory}</span>
              </>
            )}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="products-hero__title text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-5 leading-tight"
          >
            {activeCategory === "all" ? (
              <>
                جميع{" "}
                <span className="products-hero__title-accent">المنتجات</span>
              </>
            ) : (
              categoryNames[activeCategory] || activeCategory
            )}
          </motion.h1>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-4 flex-wrap"
          >
            <span className="products-hero__badge">
              <span className="products-hero__dot" aria-hidden="true" />
              <span className="products-hero__count">{displayCount}</span>
              <span>منتج متاح</span>
            </span>
            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {categories.slice(0, 4).map(cat => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`products-hero__chip ${activeCategory === cat.slug ? "products-hero__chip--active" : ""}`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom wave — full-width, outside padding */}
        <div className="products-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </div>
      {/* ── End Hero Section ── */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-5 text-lg">الفئات</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeCategory === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
                  data-testid="filter-category-all"
                >
                  <span>جميع المنتجات</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {products.length}
                  </span>
                </button>
                {categories.map(cat => {
                  const Icon = iconMap[cat.icon] || Sparkles;
                  const count = products.filter(p => p.category === cat.slug).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeCategory === cat.slug ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
                      data-testid={`filter-category-${cat.slug}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{cat.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.slug ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">نطاق السعر</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>{priceRange[0].toLocaleString("ar-DZ")} دج</span>
                  <span>-</span>
                  <span>{priceRange[1].toLocaleString("ar-DZ")} دج</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={1000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="pr-10 rounded-xl border-gray-200 focus:border-blue-400 bg-white"
                  data-testid="input-product-search"
                />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:border-blue-400 outline-none cursor-pointer"
                data-testid="select-sort"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap lg:hidden">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
              >
                الكل
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.slug ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-12 h-12 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-400 mb-6">جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر</p>
                <Button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="bg-blue-600 text-white rounded-xl">
                  عرض جميع المنتجات
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + search + sort}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
