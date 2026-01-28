-- Create table for managing featured products on homepage
CREATE TABLE public.featured_products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;

-- Anyone can view featured products
CREATE POLICY "Anyone can view featured products"
ON public.featured_products
FOR SELECT
USING (true);

-- Only admins can manage featured products
CREATE POLICY "Only admins can insert featured products"
ON public.featured_products
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update featured products"
ON public.featured_products
FOR UPDATE
USING (is_admin());

CREATE POLICY "Only admins can delete featured products"
ON public.featured_products
FOR DELETE
USING (is_admin());

-- Update site_content with correct contact info
UPDATE public.site_content SET content = '+7 (932) 427 7778' WHERE key = 'contact_phone';
UPDATE public.site_content SET content = 'Россия, г. Когалым' WHERE key = 'contact_address';