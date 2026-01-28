import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import heroImage from "@/assets/hero-perfume.jpg";

const Index = () => {
  const { featuredProducts, loading } = useFeaturedProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury perfume"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-noir/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Коллекция 2024
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 leading-tight">
              Искусство
              <br />
              <span className="text-gradient-gold">Аромата</span>
            </h1>
            <p className="text-cream/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              Откройте мир изысканных ароматов, где каждый флакон — это история, 
              написанная нотами редких ингредиентов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/catalog">
                  Каталог <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button variant="elegant" size="xl" asChild>
                <Link to="/about">О бренде</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 opacity-0 animate-fade-up stagger-1">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center hover-glow transition-all duration-300">
                <Sparkles className="text-gold" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Эксклюзивность</h3>
              <p className="text-muted-foreground leading-relaxed">
                Лимитированные коллекции с уникальными композициями, созданными 
                ведущими парфюмерами мира.
              </p>
            </div>
            <div className="text-center p-8 opacity-0 animate-fade-up stagger-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center hover-glow transition-all duration-300">
                <Heart className="text-gold" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Натуральность</h3>
              <p className="text-muted-foreground leading-relaxed">
                Только натуральные ингредиенты высочайшего качества из лучших 
                регионов мира.
              </p>
            </div>
            <div className="text-center p-8 opacity-0 animate-fade-up stagger-3">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center hover-glow transition-all duration-300">
                <Award className="text-gold" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Мастерство</h3>
              <p className="text-muted-foreground leading-relaxed">
                Многовековые традиции парфюмерного искусства в сочетании с 
                современными инновациями.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 opacity-0 animate-fade-up">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Избранное
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              Популярные ароматы
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя наши самые востребованные композиции, 
              полюбившиеся ценителям парфюмерии.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Загрузка...
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Популярные ароматы пока не выбраны
              </div>
            ) : (
              featuredProducts.map((item) => (
                <ProductCard 
                  key={item.product.id} 
                  id={item.product.id}
                  name={item.product.name}
                  category={item.product.category}
                  price={item.product.volumes[item.product.volumes.length - 1]?.price || item.product.base_price}
                  image={item.product.image_url}
                  notes={item.product.short_description}
                />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outlined" size="lg" asChild>
              <Link to="/catalog">
                Смотреть все ароматы <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-noir text-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Найдите свой
            <span className="text-gradient-gold"> идеальный аромат</span>
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto mb-10 text-lg">
            Оставьте заявку, и наши эксперты помогут подобрать парфюм, 
            который станет вашей визитной карточкой.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">Оставить заявку</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
