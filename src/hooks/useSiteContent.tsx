import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContentItem {
  id: string;
  key: string;
  title: string | null;
  content: string;
}

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [contentItems, setContentItems] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("key");

    if (error) {
      console.error("Error fetching site content:", error);
      return;
    }

    if (data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item) => {
        contentMap[item.key] = item.content;
      });
      setContent(contentMap);
      setContentItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (key: string, newContent: string): Promise<boolean> => {
    const { error } = await supabase
      .from("site_content")
      .update({ content: newContent })
      .eq("key", key);

    if (error) {
      console.error("Error updating content:", error);
      return false;
    }

    await fetchContent();
    return true;
  };

  const getContent = (key: string, fallback: string = ""): string => {
    return content[key] ?? fallback;
  };

  return {
    content,
    contentItems,
    loading,
    getContent,
    updateContent,
    refetch: fetchContent,
  };
};
