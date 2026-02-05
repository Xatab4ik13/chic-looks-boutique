import { useEffect } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { Package, LayoutDashboard, ArrowLeft, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useExternalApi } from "@/lib/api";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAdminAuthStore();

  // Проверяем сессию при входе в админку (особенно после обновления страницы)
  useEffect(() => {
    if (useExternalApi) {
      void checkAuth();
    }
  }, [checkAuth]);

  // Если API вернул 401/403 — разлогиниваем и отправляем на /admin/login
  useEffect(() => {
    const onUnauthorized = () => {
      logout();
      toast.error("Сессия истекла. Войдите заново.");
      navigate("/admin/login", { replace: true });
    };

    window.addEventListener("vox-admin-unauthorized", onUnauthorized as EventListener);
    return () => window.removeEventListener("vox-admin-unauthorized", onUnauthorized as EventListener);
  }, [logout, navigate]);

  // Редирект на страницу входа если не авторизован
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Обзор", end: true },
    { to: "/admin/products", icon: Package, label: "Товары" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Back */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-foreground text-background rounded flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-serif text-lg">VOX Admin</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
