import { useState } from "react";
import Icon from "@/components/ui/icon";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const workers = [
  { id: 1, name: "Иванов А.С.", role: "Столяр", avatar: "ИА" },
  { id: 2, name: "Петров В.И.", role: "Сборщик", avatar: "ПВ" },
  { id: 3, name: "Сидоров Д.Р.", role: "Столяр", avatar: "СД" },
  { id: 4, name: "Романова И.С.", role: "Дизайнер", avatar: "РИ" },
  { id: 5, name: "Новиков К.А.", role: "Лакировщик", avatar: "НК" },
];

type TaskColor = "wood" | "sky" | "forest" | "amber" | "rose";

const tasks: Array<{
  id: number; workerId: number; day: number; title: string; order: string; hours: number; color: TaskColor; done: boolean
}> = [
  { id: 1, workerId: 1, day: 10, title: "Раскрой ДСП", order: "МЕБ-0241", hours: 4, color: "wood", done: true },
  { id: 2, workerId: 1, day: 11, title: "Сборка корпуса", order: "МЕБ-0241", hours: 6, color: "wood", done: true },
  { id: 3, workerId: 2, day: 11, title: "Монтаж фасадов", order: "МЕБ-0240", hours: 3, color: "sky", done: true },
  { id: 4, workerId: 3, day: 12, title: "Шлифовка поверхностей", order: "МЕБ-0239", hours: 5, color: "forest", done: false },
  { id: 5, workerId: 4, day: 13, title: "Разработка чертежа", order: "МЕБ-0238", hours: 2, color: "amber", done: true },
  { id: 6, workerId: 5, day: 12, title: "Лакировка фасадов", order: "МЕБ-0240", hours: 4, color: "rose", done: true },
  { id: 7, workerId: 1, day: 14, title: "Фурнитура и петли", order: "МЕБ-0241", hours: 3, color: "wood", done: false },
  { id: 8, workerId: 2, day: 14, title: "Сборка кухонного гарнитура", order: "МЕБ-0239", hours: 7, color: "sky", done: false },
  { id: 9, workerId: 3, day: 15, title: "Финишная обработка", order: "МЕБ-0238", hours: 4, color: "forest", done: false },
  { id: 10, workerId: 5, day: 15, title: "Сушка покрытия", order: "МЕБ-0237", hours: 8, color: "rose", done: false },
];

const colorMap: Record<TaskColor, { bg: string; text: string; border: string }> = {
  wood: { bg: "bg-wood-pale", text: "text-wood", border: "border-l-wood" },
  sky: { bg: "bg-sky-light", text: "text-sky", border: "border-l-sky" },
  forest: { bg: "bg-forest-light", text: "text-forest", border: "border-l-forest" },
  amber: { bg: "bg-amber-light", text: "text-amber", border: "border-l-amber" },
  rose: { bg: "bg-rose-light", text: "text-rose", border: "border-l-rose" },
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year: number, month: number) => {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
};

export default function ProductionCalendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [selectedDay, setSelectedDay] = useState<number | null>(14);
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const today = 14;

  const dayTasks = tasks.filter(
    (t) => t.day === selectedDay && (!selectedWorker || t.workerId === selectedWorker)
  );

  const getTasksForDay = (day: number) => tasks.filter((t) => t.day === day);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-foreground">Календарь производства</h1>
          <p className="text-muted-foreground mt-1 text-sm">Планирование и отслеживание работ по сотрудникам</p>
        </div>
        <button className="flex items-center gap-2 bg-wood text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-wood/90 transition-colors shadow-sm">
          <Icon name="Plus" size={16} />
          Добавить задачу
        </button>
      </div>

      {/* Workers filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedWorker(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedWorker ? "bg-wood text-white shadow-sm" : "bg-white/70 text-muted-foreground hover:bg-white border border-border"}`}
        >
          Все сотрудники
        </button>
        {workers.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWorker(selectedWorker === w.id ? null : w.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedWorker === w.id ? "bg-wood text-white shadow-sm" : "bg-white/70 text-muted-foreground hover:bg-white border border-border"}`}
          >
            <span className="w-5 h-5 rounded-full bg-sand flex items-center justify-center text-xs font-bold text-wood">{w.avatar}</span>
            {w.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card-soft rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="ChevronLeft" size={18} className="text-muted-foreground" />
            </button>
            <h2 className="font-semibold text-foreground">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasksList = getTasksForDay(day);
              const isSelected = selectedDay === day;
              const isToday = day === today;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm transition-all
                    ${isSelected ? "bg-wood text-white shadow-md" : isToday ? "bg-wood-pale text-wood font-semibold" : "hover:bg-muted/60 text-foreground"}`}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {dayTasksList.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayTasksList.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : `bg-${t.color}`}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="card-soft rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-1">
            {selectedDay ? `${selectedDay} ${MONTHS[month]}` : "Выберите день"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{dayTasks.length} задач{dayTasks.length === 1 ? "а" : dayTasks.length > 4 ? "" : "и"}</p>

          {dayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Icon name="CalendarX" size={32} className="opacity-30 mb-2" />
              <p className="text-sm">Задач нет</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayTasks.map((task) => {
                const worker = workers.find(w => w.id === task.workerId);
                const colors = colorMap[task.color];
                return (
                  <div
                    key={task.id}
                    className={`${colors.bg} border-l-2 ${colors.border} rounded-r-xl p-3 relative`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${colors.text} mb-0.5`}>{task.order}</p>
                        <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-4 h-4 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {worker?.avatar}
                          </span>
                          <span className="text-xs text-muted-foreground">{worker?.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Icon name="Clock" size={11} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{task.hours} ч.</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? "bg-forest text-white" : "bg-white/60"}`}>
                        {task.done && <Icon name="Check" size={12} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Workers overview */}
      <div className="card-soft rounded-2xl p-5">
        <h2 className="font-semibold text-base mb-4">Сотрудники</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {workers.map((w) => {
            const workerTasks = tasks.filter(t => t.workerId === w.id);
            const done = workerTasks.filter(t => t.done).length;
            const pct = workerTasks.length ? Math.round((done / workerTasks.length) * 100) : 0;
            return (
              <div key={w.id} className="bg-muted/40 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-wood-pale flex items-center justify-center text-xs font-bold text-wood">
                    {w.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{done}/{workerTasks.length} задач</span>
                  <span>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill bg-wood"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
