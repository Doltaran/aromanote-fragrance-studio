import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-noir text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-3xl font-semibold tracking-tight">
                Aroma<span className="text-gradient-gold">Note</span>
              </span>
            </Link>
            <p className="text-cream/70 max-w-md leading-relaxed">
              Изысканная коллекция парфюмерии для тех, кто ценит утончённость и роскошь. 
              Каждый аромат — это история, написанная нотами.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-xl mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-cream/70 hover:text-gold transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-cream/70 hover:text-gold transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/70 hover:text-gold transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream/70 hover:text-gold transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl mb-6">Контакты</h4>
            <ul className="space-y-3 text-cream/70">
              <li>+7 (932) 427 7778</li>
              <li>info@aromanote.ru</li>
              <li>Россия, г. Когалым</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} AromaNote. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-cream/50 hover:text-gold transition-colors text-sm">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-cream/50 hover:text-gold transition-colors text-sm">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
