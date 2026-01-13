import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
  { href: "/contact", label: "Контакты" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
              Aroma<span className="text-gradient-gold">Note</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors duration-300 hover:text-accent",
                  location.pathname === link.href
                    ? "text-accent"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="gold" size="sm" asChild>
              <Link to="/contact">Заказать</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-6 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-serif py-2 transition-colors duration-300",
                    location.pathname === link.href
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="gold" className="mt-4" asChild>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Заказать
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
