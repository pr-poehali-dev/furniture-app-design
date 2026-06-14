import Icon from "@/components/ui/icon";

const stats = [
  {
    label: "Активных заказов",
    value: "24",
    sub: "+3 за сегодня",
    icon: "ClipboardList",
    color: "bg-wood-pale",
    iconColor: "text-wood",
    accent: "hsl(25 45% 38%)",
  },
  {
    label: "Доход за месяц",
    value: "₽ 1,240,000",
    sub: "+12% к прошлому",
    icon: "TrendingUp",
    color: "bg-forest-light",
    iconColor: "text-forest",
    accent: "hsl(145 30% 38%)",
  },
  {
    label: "Позиций на складе",
    value: "312",
    sub: "18 позиций на исходе",
    icon: "Package",
    color: "bg-sky-light",
    iconColor: "text-sky",
    accent: "hsl(210 45% 55%)",
  },
  {
    label: "Работников в смене",
    value: "8 / 12",
    sub: "4 в отпуске",
    icon: "Users",
    color: "bg-amber-light",
    iconColor: "text-amber",
    accent: "hsl(38 85% 55%)",
  },
];

const recentOrders = [
  { id: "МЕБ-0241", client: "ООО «Интерьер Плюс»", product: "Шкаф-купе 3-дверный", worker: "Иванов А.С.", status: "В работе", progress: 65, deadline: "17 июня", deadlineDays: 3 },
  { id: "МЕБ-0240", client: "Самойлова Е.В.", product: "Кухонный гарнитур", worker: "Петров В.И.", status: "Готово", progress: 100, deadline: "14 июня", deadlineDays: 0 },
  { id: "МЕБ-0239", client: "ЗАО «Офис Групп»", product: "Стол переговорный", worker: "Сидоров Д.Р.", status: "Ожидание", progress: 20, deadline: "22 июня", deadlineDays: 8 },
  { id: "МЕБ-0238", client: "Кузнецов М.Б.", product: "Гардеробная система", worker: "Романова И.С.", status: "В работе", progress: 48, deadline: "19 июня", deadlineDays: 5 },
  { id: "МЕБ-0237", client: "ООО «Уют»", product: "Детская кровать-чердак", worker: "Новиков К.А.", status: "Задержка", progress: 30, deadline: "13 июня", deadlineDays: -1 },
];

const getDeadlineStyle = (days: number, status: string) => {
  if (status === "Готово") return { badge: "bg-forest-light text-forest", label: "Выполнен", icon: "CheckCircle2" };
  if (days < 0) return { badge: "bg-rose-light text-rose", label: `Просрочен на ${Math.abs(days)} д.`, icon: "AlertCircle" };
  if (days <= 3) return { badge: "bg-amber-light text-amber", label: `Осталось ${days} д.`, icon: "Clock" };
  return { badge: "bg-muted text-muted-foreground", label: `${days} дней`, icon: "Calendar" };
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "В работе": { bg: "bg-sky-light", text: "text-sky", dot: "bg-sky" },
  "Готово": { bg: "bg-forest-light", text: "text-forest", dot: "bg-forest" },
  "Ожидание": { bg: "bg-amber-light", text: "text-amber", dot: "bg-amber" },
  "Задержка": { bg: "bg-rose-light", text: "text-rose", dot: "bg-rose" },
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-cormorant text-3xl font-semibold text-foreground">Обзор производства</h1>
        <p className="text-muted-foreground mt-1 text-sm">14 июня 2026 — Воскресенье</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card-soft rounded-2xl p-5 animate-slide-up stagger-${i + 1}`}
            style={{ animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
              <div className={`${s.color} p-2.5 rounded-xl`}>
                <Icon name={s.icon} size={20} className={s.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card-soft rounded-2xl p-6 animate-slide-up stagger-5" style={{ animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-base text-foreground">Последние заказы</h2>
          <button className="text-xs text-wood hover:text-wood-light transition-colors font-medium">Все заказы →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Заказ</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Клиент</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium hidden md:table-cell">Продукт</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium hidden lg:table-cell">Исполнитель</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Прогресс</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Статус</th>
                <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Срок сдачи</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium text-wood">{order.id}</td>
                    <td className="py-3 text-foreground max-w-[120px] truncate">{order.client}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell max-w-[140px] truncate">{order.product}</td>
                    <td className="py-3 text-muted-foreground hidden lg:table-cell">{order.worker}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="progress-bar w-16">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${order.progress}%`,
                              background: `linear-gradient(90deg, hsl(25 45% 38%), hsl(25 50% 55%))`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{order.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge-status ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {(() => {
                        const dl = getDeadlineStyle(order.deadlineDays, order.status);
                        return (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-foreground">{order.deadline}</span>
                            <span className={`badge-status ${dl.badge} w-fit`}>
                              <Icon name={dl.icon} size={10} />
                              {dl.label}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}