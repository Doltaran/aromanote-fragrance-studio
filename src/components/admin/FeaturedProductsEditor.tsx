import { useState } from "react";
import { Plus, Trash2, GripVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useProducts } from "@/hooks/useProducts";

const FeaturedProductsEditor = () => {
  const { toast } = useToast();
  const { featuredProducts, loading, addFeatured, removeFeatured } = useFeaturedProducts();
  const { products, loading: productsLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [adding, setAdding] = useState(false);

  // Filter out products that are already featured
  const featuredIds = new Set(featuredProducts.map(f => f.product_id));
  const availableProducts = products.filter(p => !featuredIds.has(p.id));

  const handleAdd = async () => {
    if (!selectedProduct) return;
    
    setAdding(true);
    const success = await addFeatured(selectedProduct);
    setAdding(false);

    if (success) {
      toast({ title: "Товар добавлен в популярные" });
      setSelectedProduct("");
    } else {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось добавить товар",
        variant: "destructive" 
      });
    }
  };

  const handleRemove = async (id: string, name: string) => {
    const success = await removeFeatured(id);
    if (success) {
      toast({ title: `"${name}" удалён из популярных` });
    } else {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось удалить товар",
        variant: "destructive" 
      });
    }
  };

  if (loading || productsLoading) {
    return <p className="text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Add new featured product */}
      <div className="p-4 bg-secondary/50 rounded-sm border border-border">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Star size={18} className="text-gold" />
          Добавить в популярные
        </h4>
        <div className="flex gap-3">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Выберите товар..." />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.length === 0 ? (
                <SelectItem value="_empty" disabled>
                  Все товары уже добавлены
                </SelectItem>
              ) : (
                availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button 
            variant="gold" 
            onClick={handleAdd}
            disabled={!selectedProduct || adding}
          >
            <Plus size={18} className="mr-1" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Current featured products */}
      <div>
        <h4 className="font-medium mb-4">
          Текущие популярные ароматы ({featuredProducts.length})
        </h4>
        
        {featuredProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 bg-secondary/30 rounded-sm">
            Популярные ароматы ещё не выбраны
          </p>
        ) : (
          <div className="space-y-2">
            {featuredProducts.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-card rounded-sm border border-border hover:border-gold/30 transition-colors"
              >
                <div className="text-muted-foreground cursor-grab">
                  <GripVertical size={18} />
                </div>
                
                <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </span>

                {/* Image */}
                <div className="w-12 h-14 rounded-sm overflow-hidden bg-secondary flex-shrink-0">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      —
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(item.id, item.product.name)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductsEditor;
