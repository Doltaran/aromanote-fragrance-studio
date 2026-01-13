import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { products, categories } from "@/data/products";
import { cn } from "@/lib/utils";

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filteredProducts =
    activeCategory === "Все"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Наша коллекция
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Каталог ароматов</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Исследуйте нашу коллекцию изысканных ароматов — от свежих цветочных 
            композиций до глубоких восточных эликсиров.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2 text-sm uppercase tracking-widest transition-all duration-300 rounded-sm",
                  activeCategory === category
                    ? "bg-noir text-cream"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                В данной категории пока нет ароматов.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
