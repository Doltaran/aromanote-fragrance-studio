import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product, VolumePrice, ProductFormData } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map((p: any) => ({
        ...p,
        volumes: (p.volumes as VolumePrice[]) || [],
        top_notes: p.top_notes || [],
        heart_notes: p.heart_notes || [],
        base_notes: p.base_notes || [],
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData: ProductFormData, imageFile?: File) => {
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("products").insert({
        name: formData.name,
        category: formData.category,
        base_price: formData.base_price,
        short_description: formData.short_description,
        full_description: formData.full_description,
        volumes: formData.volumes as unknown as any,
        top_notes: formData.top_notes,
        heart_notes: formData.heart_notes,
        base_notes: formData.base_notes,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Товар создан",
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать товар",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduct = async (id: string, formData: ProductFormData, imageFile?: File) => {
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      const updateData: any = {
        name: formData.name,
        category: formData.category,
        base_price: formData.base_price,
        short_description: formData.short_description,
        full_description: formData.full_description,
        volumes: formData.volumes as unknown as any,
        top_notes: formData.top_notes,
        heart_notes: formData.heart_notes,
        base_notes: formData.base_notes,
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Товар обновлён",
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить товар",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Товар удалён",
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить товар",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct({
          ...data,
          volumes: (data.volumes as unknown as VolumePrice[]) || [],
          top_notes: data.top_notes || [],
          heart_notes: data.heart_notes || [],
          base_notes: data.base_notes || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading };
};
