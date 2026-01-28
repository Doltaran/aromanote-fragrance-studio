import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

interface FeaturedProduct {
  id: string;
  product_id: string;
  sort_order: number;
  product: Product;
}

export const useFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = async () => {
    const { data, error } = await supabase
      .from("featured_products")
      .select(`
        id,
        product_id,
        sort_order,
        products (*)
      `)
      .order("sort_order");

    if (error) {
      console.error("Error fetching featured products:", error);
      setLoading(false);
      return;
    }

    if (data) {
      const mapped = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        sort_order: item.sort_order,
        product: {
          ...item.products,
          volumes: item.products.volumes || [],
          top_notes: item.products.top_notes || [],
          heart_notes: item.products.heart_notes || [],
          base_notes: item.products.base_notes || [],
        },
      }));
      setFeaturedProducts(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const addFeatured = async (productId: string): Promise<boolean> => {
    const maxOrder = featuredProducts.length > 0 
      ? Math.max(...featuredProducts.map(f => f.sort_order)) + 1 
      : 0;

    const { error } = await supabase
      .from("featured_products")
      .insert({ product_id: productId, sort_order: maxOrder });

    if (error) {
      console.error("Error adding featured product:", error);
      return false;
    }

    await fetchFeatured();
    return true;
  };

  const removeFeatured = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("featured_products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error removing featured product:", error);
      return false;
    }

    await fetchFeatured();
    return true;
  };

  const reorderFeatured = async (items: { id: string; sort_order: number }[]): Promise<boolean> => {
    for (const item of items) {
      const { error } = await supabase
        .from("featured_products")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      
      if (error) {
        console.error("Error reordering:", error);
        return false;
      }
    }
    await fetchFeatured();
    return true;
  };

  return {
    featuredProducts,
    loading,
    addFeatured,
    removeFeatured,
    reorderFeatured,
    refetch: fetchFeatured,
  };
};
