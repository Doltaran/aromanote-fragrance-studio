import { useState, useEffect } from "react";
import { Send, Phone, Mail, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

// Generate simple math captcha
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

interface OrderData {
  productName: string;
  volume: number;
  price: number;
}

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");

  // Load order data from session storage
  useEffect(() => {
    const savedOrder = sessionStorage.getItem("orderData");
    if (savedOrder) {
      try {
        setOrderData(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Error parsing order data:", e);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const clearOrder = () => {
    sessionStorage.removeItem("orderData");
    setOrderData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Validate captcha
    if (parseInt(captchaInput) !== captcha.answer) {
      toast({
        title: "Ошибка",
        description: "Неверный ответ на проверочный вопрос",
        variant: "destructive",
      });
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-telegram', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          message: formData.message || undefined,
          // Order details
          productName: orderData?.productName,
          volume: orderData?.volume,
          price: orderData?.price,
        },
      });

      if (error) throw error;

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
      clearOrder();
      refreshCaptcha();
    } catch (error) {
      console.error('Error sending form:', error);
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте ещё раз позже",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Свяжитесь с нами
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Контакты</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Оставьте заявку, и наши консультанты помогут подобрать 
            идеальный аромат специально для вас.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="animate-fade-up">
              <h2 className="font-serif text-3xl mb-8">Оставить заявку</h2>

              {/* Order Summary */}
              {orderData && (
                <div className="mb-8 p-6 bg-gold/10 border border-gold/30 rounded-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-gold">Ваш заказ</h3>
                    <button
                      type="button"
                      onClick={clearOrder}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Аромат:</span>{" "}
                      <span className="font-medium">{orderData.productName}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Объём:</span>{" "}
                      <span className="font-medium">{orderData.volume} мл</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Цена:</span>{" "}
                      <span className="font-medium font-serif text-lg text-gold">
                        {orderData.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2">
                    Имя *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ваше имя"
                    className="h-12 bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2">
                    Телефон *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    className="h-12 bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="h-12 bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2">
                    Сообщение
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Расскажите, какой аромат вы ищете..."
                    rows={5}
                    className="bg-secondary border-border focus:border-gold resize-none"
                  />
                </div>
                
                {/* Simple Math Captcha */}
                <div className="p-4 bg-secondary/50 rounded-sm border border-border">
                  <label className="block text-sm uppercase tracking-widest mb-3">
                    Проверка *
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif">
                      {captcha.num1} + {captcha.num2} = 
                    </span>
                    <Input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="?"
                      className="w-20 h-10 bg-background border-border focus:border-gold text-center"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={refreshCaptcha}
                      className="text-muted-foreground hover:text-gold"
                    >
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Отправка..."
                  ) : (
                    <>
                      Отправить заявку <Send className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-serif text-3xl mb-8">Контактная информация</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">Телефон</h3>
                    <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                    <p className="text-muted-foreground">Пн-Сб: 10:00 - 20:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">Email</h3>
                    <p className="text-muted-foreground">info@aromanote.ru</p>
                    <p className="text-muted-foreground">Ответим в течение 24 часов</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">Адрес</h3>
                    <p className="text-muted-foreground">г. Москва</p>
                    <p className="text-muted-foreground">ул. Парфюмерная, д. 1</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 aspect-video bg-secondary rounded-sm flex items-center justify-center border border-border">
                <p className="text-muted-foreground">Карта</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
