import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "stock" | "history";

const stockItems = [
  { id: 1, name: "ДСП 16мм белый", category: "Листовые материалы", unit: "лист", qty: 120, minQty: 30, location: "Стеллаж A-1", lastUpdate: "13.06.2026" },
  { id: 2, name: "МДФ 19мм дуб", category: "Листовые материалы", unit: "лист", qty: 45, minQty: 20, location: "Стеллаж A-2", lastUpdate: "12.06.2026" },
  { id: 3, name: "Петли Blum 110°", category: "Фурнитура", unit: "шт", qty: 8, minQty: 50, location: "Стеллаж B-1", lastUpdate: "11.06.2026" },
  { id: 4, name: "Направляющие Hettich 500мм", category: "Фурнитура", unit: "пара", qty: 34, minQty: 20, location: "Стеллаж B-2", lastUpdate: "10.06.2026" },
  { id: 5, name: "Лак паркетный матовый", category: "Покрытия", unit: "л", qty: 25, minQty: 10, location: "Стеллаж C-1", lastUpdate: "09.06.2026" },
  { id: 6, name: "Шурупы 4x40 (упак)", category: "Крепёж", unit: "упак", qty: 85, minQty: 20, location: "Стеллаж D-1", lastUpdate: "08.06.2026" },
  { id: 7, name: "Стекло 4мм прозрачное", category: "Стекло", unit: "м²", qty: 12, minQty: 8, location: "Стеллаж E-1", lastUpdate: "07.06.2026" },
  { id: 8, name: "Кромка ПВХ 2мм дуб", category: "Кромочные материалы", unit: "м.п.", qty: 3, minQty: 50, location: "Стеллаж A-3", lastUpdate: "06.06.2026" },
  { id: 9, name: "Клей ПВА столярный", category: "Клеи", unit: "кг", qty: 18, minQty: 5, location: "Стеллаж C-2", lastUpdate: "05.06.2026" },
  { id: 10, name: "Ручки мебельные хром", category: "Фурнитура", unit: "шт", qty: 63, minQty: 30, location: "Стеллаж B-3", lastUpdate: "04.06.2026" },
];

const historyItems = [
  { id: 1, date: "13.06.2026", type: "arrival", name: "ДСП 16мм белый", qty: 50, unit: "лист", supplier: "ООО «ЛесТех»", doc: "ПН-1142", amount: 45000 },
  { id: 2, date: "12.06.2026", type: "departure", name: "МДФ 19мм дуб", qty: 10, unit: "лист", supplier: "Заказ МЕБ-0241", doc: "РН-0889", amount: 12000 },
  { id: 3, date: "11.06.2026", type: "arrival", name: "Петли Blum 110°", qty: 100, unit: "шт", supplier: "ИП Громов", doc: "ПН-1141", amount: 8500 },
  { id: 4, date: "11.06.2026", type: "departure", name: "Шурупы 4x40", qty: 15, unit: "упак", supplier: "Заказ МЕБ-0240", doc: "РН-0888", amount: 1200 },
  { id: 5, date: "10.06.2026", type: "arrival", name: "Лак паркетный матовый", qty: 20, unit: "л", supplier: "ООО «Хим-Опт»", doc: "ПН-1140", amount: 9600 },
  { id: 6, date: "09.06.2026", type: "departure", name: "Кромка ПВХ 2мм дуб", qty: 80, unit: "м.п.", supplier: "Заказ МЕБ-0239", doc: "РН-0887", amount: 3200 },
  { id: 7, date: "08.06.2026", type: "arrival", name: "Направляющие Hettich", qty: 20, unit: "пара", supplier: "ИП Самсонов", doc: "ПН-1139", amount: 14400 },
  { id: 8, date: "07.06.2026", type: "arrival", name: "Стекло 4мм прозрачное", qty: 8, unit: "м²", supplier: "ООО «Стекло-М»", doc: "ПН-1138", amount: 6400 },
  { id: 9, date: "06.06.2026", type: "departure", name: "Петли Blum 110°", qty: 24, unit: "шт", supplier: "Заказ МЕБ-0238", doc: "РН-0886", amount: 2040 },
  { id: 10, date: "05.06.2026", type: "arrival", name: "Ручки мебельные хром", qty: 50, unit: "шт", supplier: "ООО «Фурнитура Плюс»", doc: "ПН-1137", amount: 7500 },
];

const getStockStatus = (qty: number, min: number) => {
  if (qty < min) return { label: "Критично", bg: "bg-rose-light", text: "text-rose", bar: "bg-rose" };
  if (qty < min * 1.5) return { label: "Мало", bg: "bg-amber-light", text: "text-amber", bar: "bg-amber" };
  return { label: "В норме", bg: "bg-forest-light", text: "text-forest", bar: "bg-forest" };
};

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export default function Warehouse() {
  const [tab, setTab] = useState<Tab>("stock");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(stockItems.map(i => i.category)))];

  const filteredStock = stockItems.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const filteredHistory = historyItems.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = stockItems.filter(i => i.qty < i.minQty).length;
  const totalCategories = new Set(stockItems.map(i => i.category)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-foreground">Склад</h1>
          <p className="text-muted-foreground mt-1 text-sm">Учёт материалов и история движения товаров</p>
        </div>
        <button className="flex items-center gap-2 bg-wood text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-wood/90 transition-colors shadow-sm">
          <Icon name="Plus" size={16} />
          Приход товара
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Позиций", value: stockItems.length, icon: "Package", color: "bg-wood-pale", iconColor: "text-wood" },
          { label: "Категорий", value: totalCategories, icon: "FolderOpen", color: "bg-sky-light", iconColor: "text-sky" },
          { label: "На исходе", value: lowStock, icon: "AlertTriangle", color: "bg-rose-light", iconColor: "text-rose" },
          { label: "Поступлений", value: historyItems.filter(h => h.type === "arrival").length, icon: "ArrowDownToLine", color: "bg-forest-light", iconColor: "text-forest" },
        ].map((s, i) => (
          <div key={s.label} className={`card-soft rounded-2xl p-4 animate-slide-up stagger-${i + 1}`} style={{ animationFillMode: "both" }}>
            <div className="flex items-center gap-3">
              <div className={`${s.color} p-2 rounded-xl`}>
                <Icon name={s.icon} size={18} className={s.iconColor} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="card-soft rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setTab("stock")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === "stock" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Остатки
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === "history" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              История прихода
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {tab === "stock" && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white/60 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-wood/30"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === "all" ? "Все категории" : c}</option>
                ))}
              </select>
            )}
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

        {tab === "stock" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Наименование", "Категория", "Остаток", "Мин. запас", "Статус", "Расположение", "Обновлено"].map(h => (
                    <th key={h} className="pb-3 text-left text-xs text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredStock.map((item) => {
                  const status = getStockStatus(item.qty, item.minQty);
                  const pct = Math.min(100, Math.round((item.qty / (item.minQty * 2)) * 100));
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium text-foreground">{item.name}</td>
                      <td className="py-3 text-muted-foreground text-xs">{item.category}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{item.qty}</span>
                          <span className="text-xs text-muted-foreground">{item.unit}</span>
                        </div>
                        <div className="progress-bar w-16 mt-1">
                          <div className={`progress-fill ${status.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{item.minQty} {item.unit}</td>
                      <td className="py-3">
                        <span className={`badge-status ${status.bg} ${status.text}`}>{status.label}</span>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground hidden md:table-cell">{item.location}</td>
                      <td className="py-3 text-xs text-muted-foreground hidden sm:table-cell">{item.lastUpdate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Дата", "Тип", "Наименование", "Кол-во", "Поставщик / Заказ", "Документ", "Сумма"].map(h => (
                    <th key={h} className="pb-3 text-left text-xs text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-xs text-muted-foreground">{item.date}</td>
                    <td className="py-3">
                      <span className={`badge-status ${item.type === "arrival" ? "bg-forest-light text-forest" : "bg-rose-light text-rose"}`}>
                        <Icon name={item.type === "arrival" ? "ArrowDownToLine" : "ArrowUpFromLine"} size={10} />
                        {item.type === "arrival" ? "Приход" : "Расход"}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-foreground">{item.name}</td>
                    <td className="py-3 text-foreground">{item.qty} {item.unit}</td>
                    <td className="py-3 text-muted-foreground text-xs max-w-[140px] truncate">{item.supplier}</td>
                    <td className="py-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">{item.doc}</td>
                    <td className="py-3 font-medium text-wood">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
