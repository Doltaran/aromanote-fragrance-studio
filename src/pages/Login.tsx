import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { LogIn, UserPlus } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: "Регистрация успешна!",
          description: "Вы можете войти в систему",
        });
        setIsSignUp(false);
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли в систему",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Что-то пошло не так",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-24 min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl mb-4">
                {isSignUp ? "Регистрация" : "Вход"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Создайте аккаунт для доступа к админ-панели"
                  : "Войдите для управления товарами"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">
                  Пароль
                </label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-12 bg-secondary border-border focus:border-gold"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  "Загрузка..."
                ) : isSignUp ? (
                  <>
                    Зарегистрироваться <UserPlus className="ml-2" size={18} />
                  </>
                ) : (
                  <>
                    Войти <LogIn className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                {isSignUp
                  ? "Уже есть аккаунт? Войти"
                  : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
