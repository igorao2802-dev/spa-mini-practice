import BookingCard from "./BookingCard";

export default function BookingList({ items, onDelete, onUpdate }) {
  // ПОЧЕМУ? Убрали sortOrder и onSortChange из props, 
  // так как сортировка теперь управляется только в родительском компоненте
  
  if (!items || items.length === 0) {
    return <div className="booking-list__empty"><p>📭 Список пуст. Добавьте первую запись!</p></div>;
  }
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Всего записей: {items.length}</span>
        {/* ПОЧЕМУ? Убрали дублирующий select сортировки отсюда, 
            так как управление сортировкой осталось только в FilterPanel/StatusFilter */}
      </div>
      <div className="booking-grid">
        {items.map((item) => (
          <BookingCard key={item.id} {...item} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}