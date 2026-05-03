import BookingCard from "./BookingCard";

export default function BookingList({ items, onDelete, onUpdate, sortOrder, onSortChange }) {
  // ПОЧЕМУ? Проверка на пустой массив в начале компонента, а не в App?
  // 1. BookingList отвечает за отображение списка, включая edge cases (пустой список).
  // 2. App не должен знать о том, как именно отображается "пустое состояние".
  // 3. Переиспользование: если компонент используется в другом месте,
  //    логика заглушки уже встроена.
  if (!items || items.length === 0) {
    return (
      <div className="booking-list__empty">
        <p>📭 Список пуст. Добавьте первую запись!</p>
      </div>
    );
  }

  return (
    <div>
      {/* ПОЧЕМУ? inline стили для контейнера сортировки, а не CSS-класс?
          Для простых layout-задач (flexbox с justify-content)
          inline стили допустимы, если:
          1. Стили уникальны для этого места и не переиспользуются.
          2. Это экономит время на создание класса.
          В продакшене лучше вынести в CSS для консистентности. */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
          Всего записей: {items.length}
        </span>
        {/* ПОЧЕМУ? select для сортировки, а не кнопки?
            1. Экономия места: две опции в одном элементе.
            2. Стандартный паттерн для сортировки (пользователи привыкли).
            3. Меньше кликов: не нужно нажимать на активную кнопку повторно. */}
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="asc">🔼 Сначала ранние</option>
          <option value="desc">🔽 Сначала поздние</option>
        </select>
      </div>

      <div className="booking-grid">
        {/* ПОЧЕМУ? key={item.id}, а не index?
            1. Стабильность: id не меняется при сортировке/фильтрации.
            2. Производительность: React точно знает, какой элемент изменился,
               и не перерисовывает лишние DOM-узлы.
            3. Избегаем багов: при использовании index как key
               могут возникнуть проблемы с состоянием компонентов (isEditing). */}
        {items.map((item) => (
          <BookingCard
            key={item.id}
            {...item}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}