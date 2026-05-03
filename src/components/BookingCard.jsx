// ПОЧЕМУ? Деструктуризация props в параметрах функции делает контракт компонента явным
// и упрощает чтение кода — сразу видно, какие данные компонент ожидает.
// Это также предотвращает случайное использование несуществующих полей.
export default function BookingCard({ id, roomName, specialist, date, status, onDelete }) {
  // ПОЧЕМУ? Статус отображается через условный рендеринг с разными стилями,
  // чтобы пользователь мгновенно визуально различал подтверждённые и ожидающие брони.
  const badgeClass = status === "Подтверждено" 
    ? "booking-card__badge booking-card__badge--confirmed" 
    : "booking-card__badge booking-card__badge--pending";

  return (
    <article className="booking-card">
      {status && <span className={badgeClass}>{status}</span>}
      
      <h3 className="booking-card__title">{roomName}</h3>
      
      <div className="booking-card__info">
        <p><strong>Специалист:</strong> {specialist}</p>
        <p><strong>Дата:</strong> {date}</p>
      </div>

      {/* ПОЧЕМУ? Кнопка удаления вызывает callback, переданный из App,
          а не изменяет данные напрямую — это сохраняет однонаправленный поток данных. */}
      <button 
        className="booking-card__delete"
        onClick={() => onDelete(id)}
        aria-label={`Отменить бронь на ${roomName}`}
      >
        Отменить бронь
      </button>
    </article>
  );
}