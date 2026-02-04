import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, Mail } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useExternalApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading, isAuthenticated, checkAuth } = useAdminAuthStore();
  const navigate = useNavigate();

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (useExternalApi) {
      checkAuth();
    }
  }, [checkAuth]);

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Если есть внешний API — используем email+password
    // Иначе — только пароль (локальный режим)
    const success = useExternalApi 
      ? await login(email, password)
      : await login(password);
    
    if (success) {
      navigate("/admin");
    } else {
      setError(useExternalApi ? "Неверный email или пароль" : "Неверный пароль");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl tracking-[0.3em] mb-2">VOX</h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Панель управления
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login field - только если есть внешний API */}
            {useExternalApi && (
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voxshop"
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">
                {useExternalApi ? "Пароль" : "Пароль администратора"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="pr-10"
                  autoFocus={!useExternalApi}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={(!password) || (useExternalApi && !email) || isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Вернуться в магазин
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
