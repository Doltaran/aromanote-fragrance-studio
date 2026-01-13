import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  notes?: string;
}

const ProductCard = ({ id, name, category, price, image, notes }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-card transition-all duration-500">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {category}
        </p>
        <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>
        {notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{notes}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl">{price.toLocaleString("ru-RU")} ₽</span>
          <Button variant="outlined" size="sm" asChild>
            <Link to={`/product/${id}`}>Подробнее</Link>
          </Button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default ProductCard;
