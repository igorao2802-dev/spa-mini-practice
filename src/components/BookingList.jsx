import BookingCard from "./BookingCard";

// ПОЧЕМУ? Компонент принимает только данные и callback — он «глупый» (presentational),
// что упрощает тестирование и повторное использование в других частях приложения.
export default function BookingList({ items, onDelete }) {
  // ПОЧЕМУ? Проверка на пустой массив вынесена отдельно — это улучшает читаемость
  // и позволяет легко изменить сообщение или добавить иконку без изменения логики рендеринга.
  if (!items || items.length === 0) {
    return (
      <div className="booking-list__empty">
        <p>📭 Список пуст. Добавьте первую запись!</p>
      </div>
    );
  }

  return (
    <div className="booking-grid">
      {/* ПОЧЕМУ? key={item.id} обязателен для стабильной работы React при обновлении списков.
          Использование индекса массива здесь недопустимо — id гарантирует уникальность. */}
      {items.map((item) => (
        <BookingCard
          key={item.id}
          id={item.id}
          roomName={item.roomName}
          specialist={item.specialist}
          date={item.date}
          status={item.status}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}