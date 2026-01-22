import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const Catalog = () => {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("Все");

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["Все", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Все") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Откройте для себя
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Каталог ароматов</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Исследуйте нашу коллекцию изысканных ароматов, 
            созданных для тех, кто ценит искусство парфюмерии.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-sm text-sm uppercase tracking-widest transition-all ${
                  activeCategory === category
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary hover:bg-gold/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Загрузка товаров...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {products.length === 0
                  ? "Товары ещё не добавлены"
                  : "В этой категории пока нет товаров"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.volumes[0]?.price || product.base_price}
                  image={product.image_url}
                  notes={product.short_description}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
