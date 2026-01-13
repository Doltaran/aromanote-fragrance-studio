import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import aboutImage from "@/assets/about-craftsmanship.jpg";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            О бренде
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">
            Aroma<span className="text-gradient-gold">Note</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            История страсти к созданию уникальных ароматов, 
            которые становятся частью вашей индивидуальности.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Наша история
              </p>
              <h2 className="font-serif text-4xl mb-6">
                Искусство создания ароматов
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  AromaNote родился из любви к парфюмерному искусству и стремления 
                  создавать ароматы, которые рассказывают истории. Каждая наша 
                  композиция — это результат кропотливой работы, где традиции 
                  встречаются с инновациями.
                </p>
                <p>
                  Мы работаем с лучшими парфюмерами мира, используя редкие 
                  натуральные ингредиенты из самых экзотических уголков планеты: 
                  болгарская роза, индийский сандал, французская лаванда.
                </p>
                <p>
                  Наша миссия — помочь каждому найти аромат, который станет 
                  продолжением его личности, невидимым аксессуаром, оставляющим 
                  неизгладимое впечатление.
                </p>
              </div>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <img
                  src={aboutImage}
                  alt="Craftsmanship"
                  className="w-full rounded-sm shadow-card"
                />
                <div className="absolute -bottom-6 -left-6 bg-noir text-cream p-8 rounded-sm shadow-card">
                  <p className="font-serif text-4xl text-gold mb-1">15+</p>
                  <p className="text-sm uppercase tracking-widest">лет опыта</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-noir text-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Наши ценности
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Принципы, которым мы следуем
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-cream/10 rounded-sm">
              <h3 className="font-serif text-2xl mb-4 text-gold">Качество</h3>
              <p className="text-cream/70 leading-relaxed">
                Только натуральные ингредиенты премиум-класса, прошедшие 
                тщательный отбор и контроль качества.
              </p>
            </div>
            <div className="text-center p-8 border border-cream/10 rounded-sm">
              <h3 className="font-serif text-2xl mb-4 text-gold">Устойчивость</h3>
              <p className="text-cream/70 leading-relaxed">
                Экологичное производство и ответственный подход к добыче 
                сырья с заботой о природе.
              </p>
            </div>
            <div className="text-center p-8 border border-cream/10 rounded-sm">
              <h3 className="font-serif text-2xl mb-4 text-gold">Инновации</h3>
              <p className="text-cream/70 leading-relaxed">
                Современные технологии в сочетании с вековыми традициями 
                парфюмерного мастерства.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl mb-6">Готовы найти свой аромат?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Свяжитесь с нами, и мы поможем подобрать идеальную парфюмерную 
            композицию специально для вас.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">Связаться с нами</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
