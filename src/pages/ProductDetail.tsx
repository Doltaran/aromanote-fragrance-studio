import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useProduct } from "@/hooks/useProducts";
import type { VolumePrice } from "@/types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id || "");
  const [selectedVolume, setSelectedVolume] = useState<VolumePrice | null>(null);

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="font-serif text-4xl mb-4">Товар не найден</h1>
          <Button variant="outlined" asChild>
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = selectedVolume?.price || product.volumes[0]?.price || product.base_price;
  const currentVolume = selectedVolume || product.volumes[0];

  const handleOrder = () => {
    const orderData = {
      productName: product.name,
      volume: currentVolume?.ml,
      price: currentPrice,
    };
    // Store in session for contact form
    sessionStorage.setItem("orderData", JSON.stringify(orderData));
    navigate("/contact");
  };

  return (
    <Layout>
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button variant="ghost" asChild className="group">
          <Link to="/catalog">
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
            Назад в каталог
          </Link>
        </Button>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <div className="animate-fade-up">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Нет изображения
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">{product.name}</h1>
              
              {product.short_description && (
                <p className="text-lg text-muted-foreground mb-8">
                  {product.short_description}
                </p>
              )}

              {/* Volume Selection */}
              {product.volumes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-widest mb-4">Выберите объём</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.volumes.map((vol, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVolume(vol)}
                        className={`px-6 py-3 rounded-sm border transition-all ${
                          (selectedVolume?.ml === vol.ml || (!selectedVolume && index === 0))
                            ? "border-gold bg-gold/10 text-foreground"
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        <span className="font-serif text-lg">{vol.ml} мл</span>
                        <span className="block text-sm text-muted-foreground mt-1">
                          {vol.price.toLocaleString("ru-RU")} ₽
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-8">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                  Цена
                </p>
                <p className="font-serif text-4xl text-gold">
                  {currentPrice.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              {/* Order Button */}
              <Button variant="gold" size="xl" className="w-full md:w-auto" onClick={handleOrder}>
                Заказать <ShoppingBag className="ml-2" size={18} />
              </Button>

              {/* Notes */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-serif text-2xl mb-6">Пирамида аромата</h3>
                <div className="grid gap-6">
                  {product.top_notes.length > 0 && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                        Верхние ноты
                      </p>
                      <p className="font-serif text-lg">{product.top_notes.join(", ")}</p>
                    </div>
                  )}
                  {product.heart_notes.length > 0 && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                        Ноты сердца
                      </p>
                      <p className="font-serif text-lg">{product.heart_notes.join(", ")}</p>
                    </div>
                  )}
                  {product.base_notes.length > 0 && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                        Базовые ноты
                      </p>
                      <p className="font-serif text-lg">{product.base_notes.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.full_description && (
            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="font-serif text-3xl mb-6">Описание</h2>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {product.full_description}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
