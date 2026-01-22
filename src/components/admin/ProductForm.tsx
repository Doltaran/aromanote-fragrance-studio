import { useState, useEffect } from "react";
import { X, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductFormData, VolumePrice } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData, imageFile?: File) => Promise<boolean>;
  onCancel: () => void;
}

const defaultVolumes: VolumePrice[] = [
  { ml: 5, price: 500 },
  { ml: 10, price: 900 },
  { ml: 30, price: 2500 },
];

const categories = ["Восточные", "Вечерние", "Цветочные", "Унисекс", "Древесные", "Свежие"];

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || categories[0],
    base_price: product?.base_price || 0,
    short_description: product?.short_description || "",
    full_description: product?.full_description || "",
    volumes: product?.volumes || defaultVolumes,
    top_notes: product?.top_notes || [],
    heart_notes: product?.heart_notes || [],
    base_notes: product?.base_notes || [],
  });

  const [notesInput, setNotesInput] = useState({
    top: "",
    heart: "",
    base: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "base_price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVolumeChange = (index: number, field: keyof VolumePrice, value: string) => {
    setFormData((prev) => {
      const newVolumes = [...prev.volumes];
      newVolumes[index] = {
        ...newVolumes[index],
        [field]: parseFloat(value) || 0,
      };
      return { ...prev, volumes: newVolumes };
    });
  };

  const addVolume = () => {
    setFormData((prev) => ({
      ...prev,
      volumes: [...prev.volumes, { ml: 0, price: 0 }],
    }));
  };

  const removeVolume = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      volumes: prev.volumes.filter((_, i) => i !== index),
    }));
  };

  const addNote = (type: "top" | "heart" | "base") => {
    const value = notesInput[type].trim();
    if (!value) return;

    const fieldMap = {
      top: "top_notes",
      heart: "heart_notes",
      base: "base_notes",
    } as const;

    setFormData((prev) => ({
      ...prev,
      [fieldMap[type]]: [...prev[fieldMap[type]], value],
    }));
    setNotesInput((prev) => ({ ...prev, [type]: "" }));
  };

  const removeNote = (type: "top_notes" | "heart_notes" | "base_notes", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData, imageFile || undefined);
    
    setLoading(false);
    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload */}
      <div>
        <label className="block text-sm uppercase tracking-widest mb-3">Изображение</label>
        <div className="flex items-start gap-6">
          {imagePreview && (
            <div className="w-32 h-40 rounded-sm overflow-hidden bg-secondary">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex flex-col items-center justify-center w-32 h-40 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-gold transition-colors">
            <Upload size={24} className="text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Загрузить</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm uppercase tracking-widest mb-2">Название *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название аромата"
            className="h-12 bg-secondary"
            required
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-widest mb-2">Категория *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-secondary border border-border rounded-sm focus:border-gold outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Базовая цена</label>
        <Input
          name="base_price"
          type="number"
          value={formData.base_price}
          onChange={handleChange}
          placeholder="0"
          className="h-12 bg-secondary w-48"
        />
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Краткое описание</label>
        <Textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          placeholder="Краткое описание для карточки товара"
          rows={2}
          className="bg-secondary"
        />
      </div>

      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Полное описание</label>
        <Textarea
          name="full_description"
          value={formData.full_description}
          onChange={handleChange}
          placeholder="Подробное описание аромата"
          rows={4}
          className="bg-secondary"
        />
      </div>

      {/* Volumes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm uppercase tracking-widest">Объёмы и цены</label>
          <Button type="button" variant="outline" size="sm" onClick={addVolume}>
            <Plus size={16} className="mr-1" /> Добавить
          </Button>
        </div>
        <div className="space-y-3">
          {formData.volumes.map((vol, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={vol.ml}
                  onChange={(e) => handleVolumeChange(index, "ml", e.target.value)}
                  placeholder="мл"
                  className="h-10 bg-secondary"
                />
              </div>
              <span className="text-muted-foreground">мл</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={vol.price}
                  onChange={(e) => handleVolumeChange(index, "price", e.target.value)}
                  placeholder="Цена"
                  className="h-10 bg-secondary"
                />
              </div>
              <span className="text-muted-foreground">₽</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeVolume(index)}
                className="text-destructive hover:text-destructive"
              >
                <X size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {(["top", "heart", "base"] as const).map((type) => {
        const labels = {
          top: { label: "Верхние ноты", field: "top_notes" as const },
          heart: { label: "Ноты сердца", field: "heart_notes" as const },
          base: { label: "Базовые ноты", field: "base_notes" as const },
        };
        const { label, field } = labels[type];

        return (
          <div key={type}>
            <label className="block text-sm uppercase tracking-widest mb-2">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData[field].map((note, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-sm text-sm"
                >
                  {note}
                  <button
                    type="button"
                    onClick={() => removeNote(field, index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={notesInput[type]}
                onChange={(e) => setNotesInput((prev) => ({ ...prev, [type]: e.target.value }))}
                placeholder="Добавить ноту"
                className="h-10 bg-secondary flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNote(type);
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => addNote(type)}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="gold" disabled={loading}>
          {loading ? "Сохранение..." : product ? "Сохранить" : "Создать товар"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
