-- Create site_content table for editable text blocks
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Only admins can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (is_admin());

-- Only admins can update
CREATE POLICY "Only admins can update site content"
ON public.site_content
FOR UPDATE
USING (is_admin());

-- Only admins can delete
CREATE POLICY "Only admins can delete site content"
ON public.site_content
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_content (key, title, content) VALUES
-- Index page
('index_hero_subtitle', 'Подзаголовок главной', 'Коллекция 2024'),
('index_hero_title', 'Заголовок главной', 'Искусство Аромата'),
('index_hero_description', 'Описание главной', 'Откройте мир изысканных ароматов, где каждый флакон — это история, написанная нотами редких ингредиентов.'),
('index_feature_1_title', 'Особенность 1 - заголовок', 'Эксклюзивность'),
('index_feature_1_text', 'Особенность 1 - текст', 'Лимитированные коллекции с уникальными композициями, созданными ведущими парфюмерами мира.'),
('index_feature_2_title', 'Особенность 2 - заголовок', 'Натуральность'),
('index_feature_2_text', 'Особенность 2 - текст', 'Только натуральные ингредиенты высочайшего качества из лучших регионов мира.'),
('index_feature_3_title', 'Особенность 3 - заголовок', 'Мастерство'),
('index_feature_3_text', 'Особенность 3 - текст', 'Многовековые традиции парфюмерного искусства в сочетании с современными инновациями.'),
('index_cta_title', 'CTA заголовок', 'Найдите свой идеальный аромат'),
('index_cta_text', 'CTA текст', 'Оставьте заявку, и наши эксперты помогут подобрать парфюм, который станет вашей визитной карточкой.'),
-- About page
('about_hero_subtitle', 'О нас - подзаголовок', 'О бренде'),
('about_hero_title', 'О нас - заголовок', 'AromaNote'),
('about_hero_description', 'О нас - описание', 'История страсти к созданию уникальных ароматов, которые становятся частью вашей индивидуальности.'),
('about_story_subtitle', 'История - подзаголовок', 'Наша история'),
('about_story_title', 'История - заголовок', 'Искусство создания ароматов'),
('about_story_text', 'История - текст', 'AromaNote родился из любви к парфюмерному искусству и стремления создавать ароматы, которые рассказывают истории. Каждая наша композиция — это результат кропотливой работы, где традиции встречаются с инновациями.

Мы работаем с лучшими парфюмерами мира, используя редкие натуральные ингредиенты из самых экзотических уголков планеты: болгарская роза, индийский сандал, французская лаванда.

Наша миссия — помочь каждому найти аромат, который станет продолжением его личности, невидимым аксессуаром, оставляющим неизгладимое впечатление.'),
('about_experience_years', 'Лет опыта', '15+'),
-- Contact page
('contact_hero_subtitle', 'Контакты - подзаголовок', 'Свяжитесь с нами'),
('contact_hero_title', 'Контакты - заголовок', 'Контакты'),
('contact_hero_description', 'Контакты - описание', 'Оставьте заявку, и наши консультанты помогут подобрать идеальный аромат специально для вас.'),
('contact_phone', 'Телефон', '+7 (999) 123-45-67'),
('contact_hours', 'Часы работы', 'Пн-Сб: 10:00 - 20:00'),
('contact_email', 'Email', 'info@aromanote.ru'),
('contact_address', 'Адрес', 'г. Москва, ул. Парфюмерная, д. 1'),
-- How to order steps
('order_step_1', 'Шаг 1', 'Выберите аромат в каталоге и нужный объём'),
('order_step_2', 'Шаг 2', 'Нажмите "Заказать" на странице товара'),
('order_step_3', 'Шаг 3', 'Заполните форму обратной связи'),
('order_step_4', 'Шаг 4', 'Дождитесь звонка от нашего менеджера'),
-- Catalog page
('catalog_hero_subtitle', 'Каталог - подзаголовок', 'Откройте для себя'),
('catalog_hero_title', 'Каталог - заголовок', 'Каталог ароматов'),
('catalog_hero_description', 'Каталог - описание', 'Исследуйте нашу коллекцию изысканных ароматов, созданных для тех, кто ценит искусство парфюмерии.');