import { useState } from "react";
import Icon from "@/components/ui/icon";

type Status = "all" | "В работе" | "Готово" | "Ожидание" | "Задержка";

const allOrders = [
  { id: "МЕБ-0241", client: "ООО «Интерьер Плюс»", product: "Шкаф-купе 3-дверный", worker: "Вовняников К.", status: "В работе", progress: 65, deadline: "17 июня", deadlineDays: 3, income: 85000, created: "01.06.2026" },
  { id: "МЕБ-0240", client: "Самойлова Е.В.", product: "Кухонный гарнитур", worker: "Войкин А.", status: "Готово", progress: 100, deadline: "14 июня", deadlineDays: 0, income: 120000, created: "28.05.2026" },
  { id: "МЕБ-0239", client: "ЗАО «Офис Групп»", product: "Стол переговорный", worker: "Сидоров Д.Р.", status: "Ожидание", progress: 20, deadline: "22 июня", deadlineDays: 8, income: 45000, created: "10.06.2026" },
  { id: "МЕБ-0238", client: "Кузнецов М.Б.", product: "Гардеробная система", worker: "Романова И.С.", status: "В работе", progress: 48, deadline: "19 июня", deadlineDays: 5, income: 95000, created: "05.06.2026" },
  { id: "МЕБ-0237", client: "ООО «Уют»", product: "Детская кровать-чердак", worker: "Новиков К.А.", status: "Задержка", progress: 30, deadline: "13 июня", deadlineDays: -1, income: 55000, created: "03.06.2026" },
  { id: "МЕБ-0236", client: "Миронова Д.А.", product: "Прихожая с зеркалом", worker: "Вовняников К.", status: "Готово", progress: 100, deadline: "12 июня", deadlineDays: 0, income: 38000, created: "25.05.2026" },
  { id: "МЕБ-0235", client: "ИП Захаров", product: "Торговое оборудование", worker: "Войкин А.", status: "Готово", progress: 100, deadline: "10 июня", deadlineDays: 0, income: 210000, created: "20.05.2026" },
  { id: "МЕБ-0234", client: "Королёва Н.И.", product: "Шкаф-купе угловой", worker: "Сидоров Д.Р.", status: "Готово", progress: 100, deadline: "08 июня", deadlineDays: 0, income: 72000, created: "18.05.2026" },
  { id: "МЕБ-0233", client: "ООО «СтройДом»", product: "Стеллаж офисный 5-секционный", worker: "Вовняников К.", status: "В работе", progress: 75, deadline: "16 июня", deadlineDays: 2, income: 67000, created: "07.06.2026" },
  { id: "МЕБ-0232", client: "Белова Т.С.", product: "Комод 6-ящичный", worker: "Войкин А.", status: "Ожидание", progress: 5, deadline: "25 июня", deadlineDays: 11, income: 28000, created: "12.06.2026" },
  { id: "МЕБ-0231", client: "ИП Громов К.Р.", product: "Барная стойка", worker: "Вовняников К.", status: "Задержка", progress: 55, deadline: "11 июня", deadlineDays: -3, income: 89000, created: "01.06.2026" },
  { id: "МЕБ-0230", client: "Школа №42", product: "Мебель для кабинета (12 парт)", worker: "Войкин А.", status: "В работе", progress: 40, deadline: "20 июня", deadlineDays: 6, income: 156000, created: "04.06.2026" },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "В работе": { bg: "bg-sky-light", text: "text-sky", dot: "bg-sky" },
  "Готово": { bg: "bg-forest-light", text: "text-forest", dot: "bg-forest" },
  "Ожидание": { bg: "bg-amber-light", text: "text-amber", dot: "bg-amber" },
  "Задержка": { bg: "bg-rose-light", text: "text-rose", dot: "bg-rose" },
};

const deadlineBadge = (days: number, status: string) => {
  if (status === "Готово") return { cls: "bg-forest-light text-forest", label: "Выполнен", icon: "CheckCircle2" };
  if (days < 0) return { cls: "bg-rose-light text-rose", label: `−${Math.abs(days)} д.`, icon: "AlertCircle" };
  if (days <= 3) return { cls: "bg-amber-light text-amber", label: `${days} д.`, icon: "Clock" };
  return { cls: "bg-muted text-muted-foreground", label: `${days} д.`, icon: "Calendar" };
};

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

const STATUSES: Status[] = ["all", "В работе", "Ожидание", "Задержка", "Готово"];
const STATUS_LABELS: Record<Status, string> = { all: "Все", "В работе": "В работе", "Ожидание": "Ожидание", "Задержка": "Задержка", "Готово": "Готово" };

export default function Orders({ workerName }: { workerName?: string }) {
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"deadline" | "income" | "progress">("deadline");
  const [selected, setSelected] = useState<string | null>(null);

  const visibleOrders = workerName
    ? allOrders.filter(o => o.worker === workerName)
    : allOrders;

  const filtered = visibleOrders
    .filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.client.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") return a.deadlineDays - b.deadlineDays;
      if (sortBy === "income") return b.income - a.income;
      if (sortBy === "progress") return b.progress - a.progress;
      return 0;
    });

  const counts = {
    all: visibleOrders.length,
    "В работе": visibleOrders.filter(o => o.status === "В работе").length,
    "Ожидание": visibleOrders.filter(o => o.status === "Ожидание").length,
    "Задержка": visibleOrders.filter(o => o.status === "Задержка").length,
    "Готово": visibleOrders.filter(o => o.status === "Готово").length,
  };

  const selectedOrder = visibleOrders.find(o => o.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-foreground">
            {workerName ? "Мои заказы" : "Заказы"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {workerName ? `${workerName} · ` : ""}{visibleOrders.length} заказов · {counts["Задержка"]} с задержкой
          </p>
        </div>
        {!workerName && (
          <button className="flex items-center gap-2 bg-wood text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-wood/90 transition-colors shadow-sm">
            <Icon name="Plus" size={16} />
            Новый заказ
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const sc = s !== "all" ? statusConfig[s] : null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border
                ${statusFilter === s
                  ? "bg-wood text-white border-wood shadow-sm"
                  : "bg-white/70 text-muted-foreground border-border hover:bg-white"
                }`}
            >
              {sc && <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === s ? "bg-white/70" : sc.dot}`} />}
              {STATUS_LABELS[s]}
              <span className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === s ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {counts[s]}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-white/60 focus:outline-none focus:ring-1 focus:ring-wood/30 w-44"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white/60 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-wood/30"
          >
            <option value="deadline">По сроку</option>
            <option value="income">По сумме</option>
            <option value="progress">По прогрессу</option>
          </select>
        </div>
      </div>

      <div className={`grid gap-6 ${selectedOrder ? "lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Table */}
        <div className={`card-soft rounded-2xl p-5 ${selectedOrder ? "lg:col-span-2" : ""}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Заказ</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Клиент</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium hidden md:table-cell">Продукт</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Прогресс</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Статус</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium">Срок</th>
                  <th className="pb-3 text-left text-xs text-muted-foreground font-medium hidden lg:table-cell">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((order) => {
                  const sc = statusConfig[order.status];
                  const dl = deadlineBadge(order.deadlineDays, order.status);
                  const isSelected = selected === order.id;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelected(isSelected ? null : order.id)}
                      className={`transition-colors cursor-pointer ${isSelected ? "bg-wood-pale" : "hover:bg-muted/30"}`}
                    >
                      <td className="py-3 font-medium text-wood">{order.id}</td>
                      <td className="py-3 text-foreground max-w-[110px] truncate">{order.client}</td>
                      <td className="py-3 text-muted-foreground hidden md:table-cell max-w-[130px] truncate">{order.product}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="progress-bar w-14">
                            <div
                              className="progress-fill"
                              style={{ width: `${order.progress}%`, background: "linear-gradient(90deg, hsl(25 45% 38%), hsl(25 50% 55%))" }}
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
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-foreground">{order.deadline}</span>
                          <span className={`badge-status ${dl.cls} w-fit`}>
                            <Icon name={dl.icon} size={9} />
                            {dl.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-foreground hidden lg:table-cell">{fmt(order.income)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-14 text-muted-foreground">
                <Icon name="SearchX" size={32} className="opacity-30 mb-2" />
                <p className="text-sm">Заказов не найдено</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedOrder && (
          <div className="card-soft rounded-2xl p-5 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Заказ</p>
                <p className="font-semibold text-wood text-lg leading-tight">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-muted/40 rounded-xl p-3.5 space-y-2.5">
                <Row icon="User" label="Клиент" value={selectedOrder.client} />
                <Row icon="Package" label="Продукт" value={selectedOrder.product} />
                <Row icon="Hammer" label="Исполнитель" value={selectedOrder.worker} />
                <Row icon="CalendarDays" label="Создан" value={selectedOrder.created} />
                <Row icon="Flag" label="Срок сдачи" value={selectedOrder.deadline} />
              </div>

              <div className="bg-muted/40 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Прогресс выполнения</span>
                  <span className="text-xs font-semibold text-foreground">{selectedOrder.progress}%</span>
                </div>
                <div className="progress-bar h-2.5">
                  <div
                    className="progress-fill"
                    style={{ width: `${selectedOrder.progress}%`, background: "linear-gradient(90deg, hsl(25 45% 38%), hsl(25 50% 55%))" }}
                  />
                </div>
              </div>

              <div className="bg-muted/40 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Сумма заказа</span>
                <span className="font-semibold text-foreground">{fmt(selectedOrder.income)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Статус</span>
                <span className={`badge-status ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedOrder.status].dot}`} />
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted/30 transition-colors text-muted-foreground">
                Редактировать
              </button>
              <button className="py-2 rounded-xl text-xs font-medium bg-wood text-white hover:bg-wood/90 transition-colors">
                Открыть задачи
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
      <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-foreground leading-tight">{value}</span>
    </div>
  );
}