import { useState } from "react";
import Icon from "@/components/ui/icon";
import Dashboard from "./Dashboard";
import ProductionCalendar from "./ProductionCalendar";
import Finance from "./Finance";
import Warehouse from "./Warehouse";
import Orders from "./Orders";

type Role = "admin" | "manager" | "worker";
type Page = "dashboard" | "orders" | "calendar" | "finance" | "warehouse" | "settings";

interface User {
  name: string;
  role: Role;
  avatar: string;
}

const demoUsers: Record<Role, User> = {
  admin: { name: "Чихонадских Артём Алексеевич", role: "admin", avatar: "ЧА" },
  manager: { name: "Сазыкин Алексей Евгеньевич", role: "manager", avatar: "СА" },
  worker: { name: "Вовняников Константин", role: "worker", avatar: "ВК" },
};

const roleLabels: Record<Role, { label: string; color: string; desc: string }> = {
  admin: { label: "Администратор", color: "text-wood", desc: "Полный доступ ко всем разделам" },
  manager: { label: "Менеджер", color: "text-forest", desc: "Заказы, финансы, склад" },
  worker: { label: "Работник", color: "text-sky", desc: "Производство и просмотр склада" },
};

const navItems: Array<{ id: Page; label: string; icon: string; roles: Role[] }> = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard", roles: ["admin", "manager"] },
  { id: "orders", label: "Заказы", icon: "ClipboardList", roles: ["admin", "manager"] },
  { id: "calendar", label: "Производство", icon: "Calendar", roles: ["admin", "manager", "worker"] },
  { id: "finance", label: "Финансы", icon: "BarChart3", roles: ["admin", "manager"] },
  { id: "warehouse", label: "Склад", icon: "Package", roles: ["admin", "manager", "worker"] },
  { id: "settings", label: "Настройки", icon: "Settings", roles: ["admin"] },
];

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role>("admin");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, hsl(32 60% 88% / 0.6) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, hsl(25 45% 85% / 0.5) 0%, transparent 55%), hsl(36 33% 97%)",
      }}
    >
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, hsl(25 45% 38%), hsl(25 50% 52%))" }}
          >
            <Icon name="Sofa" size={26} className="text-white" />
          </div>
          <h1 className="font-cormorant text-3xl font-semibold text-foreground">Честная мебель</h1>
          <p className="text-sm text-muted-foreground mt-1">Система управления производством</p>
        </div>

        <div className="card-soft rounded-3xl p-7">
          <h2 className="font-semibold text-base text-foreground mb-1">Выберите профиль</h2>
          <p className="text-xs text-muted-foreground mb-5">Демо-версия с разными уровнями доступа</p>

          <div className="space-y-2 mb-6">
            {(Object.keys(demoUsers) as Role[]).map((role) => {
              const u = demoUsers[role];
              const cfg = roleLabels[role];
              return (
                <button
                  key={role}
                  onClick={() => setSelected(role)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left
                    ${selected === role
                      ? "border-wood/40 bg-wood-pale shadow-sm"
                      : "border-border bg-white/40 hover:bg-white/70"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                    ${selected === role ? "bg-wood text-white" : "bg-sand text-muted-foreground"}`}
                  >
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                    <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                  </div>
                  {selected === role && (
                    <Icon name="CheckCircle2" size={18} className="text-wood flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onLogin(selected)}
            className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, hsl(25 45% 38%), hsl(25 50% 52%))" }}
          >
            Войти в систему
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const roles = [
    { name: "Администратор", desc: "Полный доступ: дашборд, производство, финансы, склад, настройки", icon: "ShieldCheck", color: "text-wood", bg: "bg-wood-pale" },
    { name: "Менеджер", desc: "Доступ к заказам, финансам и складу, без настроек системы", icon: "UserCheck", color: "text-forest", bg: "bg-forest-light" },
    { name: "Работник", desc: "Только раздел производства — свои задачи и расписание", icon: "Hammer", color: "text-sky", bg: "bg-sky-light" },
  ];
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-cormorant text-3xl font-semibold text-foreground">Настройки</h1>
        <p className="text-muted-foreground mt-1 text-sm">Управление системой и правами доступа</p>
      </div>
      <div className="card-soft rounded-2xl p-6">
        <h2 className="font-semibold text-base mb-4">Уровни доступа</h2>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.name} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className={`${r.bg} p-2.5 rounded-xl`}>
                <Icon name={r.icon} size={20} className={r.color} />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-soft rounded-2xl p-6">
        <h2 className="font-semibold text-base mb-4">Экспорт данных</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Отчёт по доходам", icon: "TrendingUp" },
            { label: "Отчёт по расходам", icon: "TrendingDown" },
            { label: "Складские остатки", icon: "Package" },
          ].map((e) => (
            <button
              key={e.label}
              className="flex items-center gap-2 p-3 border border-border rounded-xl hover:bg-muted/30 transition-colors text-left"
            >
              <Icon name={e.icon} size={16} className="text-wood" />
              <span className="text-sm text-foreground">{e.label}</span>
              <Icon name="Download" size={14} className="text-muted-foreground ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <LoginScreen
        onLogin={(role) => {
          setUser(demoUsers[role]);
          setPage(role === "worker" ? "calendar" : "dashboard");
        }}
      />
    );
  }

  const allowedNav = navItems.filter((n) => n.roles.includes(user.role));

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "orders": return <Orders />;
      case "calendar": return <ProductionCalendar />;
      case "finance": return <Finance />;
      case "warehouse": return <Warehouse workerMode={user.role === "worker"} />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col
          bg-white/80 backdrop-blur-md border-r border-border
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/50">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(25 45% 38%), hsl(25 50% 52%))" }}
          >
            <Icon name="Sofa" size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground leading-tight">Честная мебель</p>
            <p className="text-xs text-muted-foreground">Производство</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {allowedNav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${page === item.id
                  ? "nav-item-active"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              <Icon name={item.icon} size={17} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User block */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-wood-pale flex items-center justify-center text-xs font-bold text-wood flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[user.role].label}</p>
            </div>
            <button
              onClick={() => setUser(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border/60 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="Menu" size={20} className="text-muted-foreground" />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              ${user.role === "admin" ? "bg-wood-pale text-wood" : user.role === "manager" ? "bg-forest-light text-forest" : "bg-sky-light text-sky"}`}
            >
              <Icon name="Shield" size={12} />
              {roleLabels[user.role].label}
            </div>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
              <Icon name="Bell" size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}