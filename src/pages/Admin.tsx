import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Edit, Trash2, LogOut, Package, FileText, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Layout from "@/components/layout/Layout";
import ProductForm from "@/components/admin/ProductForm";
import ContentEditor from "@/components/admin/ContentEditor";
import FeaturedProductsEditor from "@/components/admin/FeaturedProductsEditor";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { products, loading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  if (authLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="font-serif text-4xl mb-4">Доступ запрещён</h1>
          <p className="text-muted-foreground mb-8">
            У вас нет прав администратора для доступа к этой странице.
          </p>
          <Button variant="outlined" onClick={() => signOut()}>
            Выйти
          </Button>
        </div>
      </Layout>
    );
  }

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const handleFormSubmit = async (data: any, imageFile?: File) => {
    if (editingProduct) {
      return await updateProduct(editingProduct.id, data, imageFile);
    } else {
      return await createProduct(data, imageFile);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-2">
                Панель управления
              </p>
              <h1 className="font-serif text-4xl">Админ-панель</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="products" className="gap-2">
                <Package size={16} />
                Товары
              </TabsTrigger>
              <TabsTrigger value="featured" className="gap-2">
                <Star size={16} />
                Популярные
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2">
                <FileText size={16} />
                Контент
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">Товары ({products.length})</h2>
                <Button variant="gold" onClick={handleCreate}>
                  <Plus size={18} className="mr-2" />
                  Добавить товар
                </Button>
              </div>

              {productsLoading ? (
                <p className="text-muted-foreground">Загрузка товаров...</p>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-secondary/50 rounded-sm">
                  <p className="text-muted-foreground mb-4">Товары ещё не добавлены</p>
                  <Button variant="outlined" onClick={handleCreate}>
                    Добавить первый товар
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-6 p-4 bg-card rounded-sm border border-border hover:border-gold/30 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-sm overflow-hidden bg-secondary flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            Нет фото
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl mb-1 truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <div className="flex flex-wrap gap-2">
                          {product.volumes.map((vol, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-secondary rounded">
                              {vol.ml}мл — {vol.price.toLocaleString("ru-RU")}₽
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingProduct(product)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Featured Products Tab */}
            <TabsContent value="featured">
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-2">Популярные ароматы</h2>
                <p className="text-muted-foreground">
                  Управление товарами, отображаемыми на главной странице
                </p>
              </div>
              <FeaturedProductsEditor />
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-2">Редактирование контента</h2>
                <p className="text-muted-foreground">
                  Редактируйте тексты на страницах сайта
                </p>
              </div>
              <ContentEditor />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? "Редактировать товар" : "Новый товар"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{deletingProduct?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
