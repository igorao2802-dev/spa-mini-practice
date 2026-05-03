// ПОЧЕМУ? Компонент фильтрации вынесен отдельно — это позволяет переиспользовать его
// в других частях приложения и упрощает тестирование логики фильтрации.
export default function StatusFilter({ activeFilter, onFilterChange }) {
  const filters = ["Все", "Подтверждено", "Ожидание"];

  return (
    <div className="filter-panel">
      {/* ПОЧЕМУ? map() используется для генерации кнопок — это устраняет дублирование кода
          и упрощает добавление новых фильтров в будущем (принцип DRY). */}
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-panel__btn ${
            activeFilter === filter ? "filter-panel__btn--active" : ""
          }`}
          onClick={() => onFilterChange(filter)}
          aria-pressed={activeFilter === filter}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}