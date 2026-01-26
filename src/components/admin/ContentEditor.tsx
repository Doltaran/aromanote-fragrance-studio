import { useState } from "react";
import { Save, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";

const ContentEditor = () => {
  const { contentItems, loading, updateContent, refetch } = useSiteContent();
  const { toast } = useToast();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Group content by page
  const groupedContent = contentItems.reduce((acc, item) => {
    const prefix = item.key.split("_")[0];
    const pageNames: Record<string, string> = {
      index: "Главная",
      about: "О нас",
      contact: "Контакты",
      catalog: "Каталог",
      order: "Как заказать",
    };
    const pageName = pageNames[prefix] || "Другое";
    if (!acc[pageName]) acc[pageName] = [];
    acc[pageName].push(item);
    return acc;
  }, {} as Record<string, typeof contentItems>);

  const handleEdit = (key: string, content: string) => {
    setEditingKey(key);
    setEditValue(content);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editingKey) return;
    
    setSaving(true);
    const success = await updateContent(editingKey, editValue);
    setSaving(false);

    if (success) {
      toast({
        title: "Сохранено",
        description: "Контент успешно обновлён",
      });
      setEditingKey(null);
      setEditValue("");
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Загрузка контента...</p>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedContent).map(([pageName, items]) => (
        <div key={pageName}>
          <h3 className="font-serif text-xl mb-4 text-gold">{pageName}</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card rounded-sm border border-border hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.title || item.key}
                    </p>
                    
                    {editingKey === item.key ? (
                      <div className="space-y-3">
                        {item.content.length > 100 ? (
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={5}
                            className="bg-secondary"
                          />
                        ) : (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-10 bg-secondary"
                          />
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="gold"
                            onClick={handleSave}
                            disabled={saving}
                          >
                            <Save size={14} className="mr-1" />
                            {saving ? "Сохранение..." : "Сохранить"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X size={14} className="mr-1" />
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap line-clamp-3">
                        {item.content}
                      </p>
                    )}
                  </div>
                  
                  {editingKey !== item.key && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item.key, item.content)}
                    >
                      <Edit2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentEditor;
