import { useState } from "react";
import Icon from "@/components/ui/icon";

type FilterType = "all" | "income" | "expense";

const orders = [
  { id: "МЕБ-0241", client: "ООО «Интерьер Плюс»", product: "Шкаф-купе 3-дверный", income: 85000, expense: 42000, date: "12.06.2026", status: "В работе" },
  { id: "МЕБ-0240", client: "Самойлова Е.В.", product: "Кухонный гарнитур", income: 120000, expense: 63000, date: "10.06.2026", status: "Завершён" },
  { id: "МЕБ-0239", client: "ЗАО «Офис Групп»", product: "Стол переговорный", income: 45000, expense: 18000, date: "08.06.2026", status: "В работе" },
  { id: "МЕБ-0238", client: "Кузнецов М.Б.", product: "Гардеробная система", income: 95000, expense: 51000, date: "05.06.2026", status: "В работе" },
  { id: "МЕБ-0237", client: "ООО «Уют»", product: "Детская кровать-чердак", income: 55000, expense: 28000, date: "03.06.2026", status: "Задержка" },
  { id: "МЕБ-0236", client: "Миронова Д.А.", product: "Прихожая с зеркалом", income: 38000, expense: 19000, date: "01.06.2026", status: "Завершён" },
  { id: "МЕБ-0235", client: "ИП Захаров", product: "Торговое оборудование", income: 210000, expense: 98000, date: "28.05.2026", status: "Завершён" },
  { id: "МЕБ-0234", client: "Королёва Н.И.", product: "Шкаф-купе угловой", income: 72000, expense: 35000, date: "25.05.2026", status: "Завершён" },
];

const monthlyData = [
  { month: "Янв", income: 820000, expense: 410000 },
  { month: "Фев", income: 940000, expense: 480000 },
  { month: "Мар", income: 1050000, expense: 520000 },
  { month: "Апр", income: 980000, expense: 495000 },
  { month: "Май", income: 1120000, expense: 540000 },
  { month: "Июн", income: 1240000, expense: 594000 },
];

const statusColor: Record<string, string> = {
  "Завершён": "bg-forest-light text-forest",
  "В работе": "bg-sky-light text-sky",
  "Задержка": "bg-rose-light text-rose",
};

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export default function Finance() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const totalIncome = orders.reduce((s, o) => s + o.income, 0);
  const totalExpense = orders.reduce((s, o) => s + o.expense, 0);
  const totalProfit = totalIncome - totalExpense;

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const maxBar = Math.max(...monthlyData.map(d => d.income));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-foreground">Доходы и расходы</h1>
          <p className="text-muted-foreground mt-1 text-sm">Финансовый учёт по заказам · Июнь 2026</p>
        </div>
        <button className="flex items-center gap-2 bg-wood text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-wood/90 transition-colors shadow-sm">
          <Icon name="Download" size={16} />
          Экспорт отчёта
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-soft rounded-2xl p-5 animate-slide-up stagger-1" style={{ animationFillMode: "both" }}>
          <p className="text-xs text-muted-foreground font-medium mb-1">Общий доход</p>
          <p className="text-2xl font-bold text-forest">{fmt(totalIncome)}</p>
          <p className="text-xs text-muted-foreground mt-1">По {orders.length} заказам</p>
        </div>
        <div className="card-soft rounded-2xl p-5 animate-slide-up stagger-2" style={{ animationFillMode: "both" }}>
          <p className="text-xs text-muted-foreground font-medium mb-1">Расходы</p>
          <p className="text-2xl font-bold text-rose">{fmt(totalExpense)}</p>
          <p className="text-xs text-muted-foreground mt-1">Материалы и работа</p>
        </div>
        <div className="card-soft rounded-2xl p-5 animate-slide-up stagger-3" style={{ animationFillMode: "both" }}>
          <p className="text-xs text-muted-foreground font-medium mb-1">Прибыль</p>
          <p className="text-2xl font-bold text-wood">{fmt(totalProfit)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Маржа: {Math.round((totalProfit / totalIncome) * 100)}%
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card-soft rounded-2xl p-5 animate-slide-up stagger-4" style={{ animationFillMode: "both" }}>
        <h2 className="font-semibold text-base mb-5">Динамика за 6 месяцев</h2>
        <div className="flex items-end gap-3 h-36">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: "112px" }}>
                <div
                  className="flex-1 rounded-t-lg bg-forest/70 transition-all duration-700"
                  style={{ height: `${(d.income / maxBar) * 100}%` }}
                  title={`Доход: ${fmt(d.income)}`}
                />
                <div
                  className="flex-1 rounded-t-lg bg-rose/60 transition-all duration-700"
                  style={{ height: `${(d.expense / maxBar) * 100}%` }}
                  title={`Расходы: ${fmt(d.expense)}`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-forest/70" />
            <span className="text-xs text-muted-foreground">Доход</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose/60" />
            <span className="text-xs text-muted-foreground">Расходы</span>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="card-soft rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <h2 className="font-semibold text-base">Заказы</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              {(["all", "income", "expense"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {f === "all" ? "Все" : f === "income" ? "Доход" : "Расход"}
                </button>
              ))}
            </div>
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-white/60 focus:outline-none focus:ring-1 focus:ring-wood/30 w-40"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Заказ", "Клиент", "Продукт", "Доход", "Расходы", "Прибыль", "Статус", "Дата"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((order) => {
                const profit = order.income - order.expense;
                const margin = Math.round((profit / order.income) * 100);
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium text-wood">{order.id}</td>
                    <td className="py-3 text-foreground max-w-[130px] truncate">{order.client}</td>
                    <td className="py-3 text-muted-foreground max-w-[130px] truncate hidden md:table-cell">{order.product}</td>
                    <td className="py-3 font-medium text-forest">{fmt(order.income)}</td>
                    <td className="py-3 text-rose">{fmt(order.expense)}</td>
                    <td className="py-3 font-semibold text-wood">
                      {fmt(profit)}
                      <span className="ml-1 text-xs text-muted-foreground">({margin}%)</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge-status ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground hidden sm:table-cell">{order.date}</td>
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
