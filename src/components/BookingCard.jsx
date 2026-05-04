import { useState } from "react";

export default function BookingCard({ id, serviceName, specialist, customerName, customerPhone, date, duration, status, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ serviceName, specialist, customerName, customerPhone, date, duration });

  function formatDisplayDate(rawDate) {
    if (!rawDate) return "";
    return rawDate.replace("T", " в ");
  }

  function handleSave() {
    if (!editData.serviceName || !editData.specialist || !editData.customerName || !editData.customerPhone || !editData.date) return;
    
    const result = onUpdate(id, { ...editData, duration: parseInt(editData.duration, 10) });
    if (result && result.success) {
        setIsEditing(false);
    } else if (result && result.error) {
        alert(result.error); // Для простоты при редактировании можно alert, или добавить state ошибки
    }
  }

  const badgeClass = status === "Подтверждено"
    ? "booking-card__badge booking-card__badge--confirmed"
    : "booking-card__badge booking-card__badge--pending";

  const canEdit = status !== "Подтверждено";

  if (isEditing) {
    return (
      <article className="booking-card">
        <h3 className="booking-card__title">Редактирование</h3>
        <input className="booking-card__input" value={editData.serviceName} onChange={(e) => setEditData({ ...editData, serviceName: e.target.value })} placeholder="Услуга" />
        <input className="booking-card__input" value={editData.specialist} onChange={(e) => setEditData({ ...editData, specialist: e.target.value })} placeholder="Специалист" />
        <input className="booking-card__input" value={editData.customerName} onChange={(e) => setEditData({ ...editData, customerName: e.target.value })} placeholder="Клиент" />
        <input className="booking-card__input" type="datetime-local" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} />
        <input className="booking-card__input" type="number" value={editData.duration} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} placeholder="Мин" />
        <div className="booking-card__actions">
          <button onClick={handleSave} className="booking-card__btn booking-card__btn--save">Сохранить</button>
          <button onClick={() => setIsEditing(false)} className="booking-card__btn booking-card__btn--discard">Отмена</button>
        </div>
      </article>
    );
  }

  return (
    <article className="booking-card">
      {status && <span className={badgeClass}>{status}</span>}
      <h3 className="booking-card__title">{serviceName}</h3>
      <div className="booking-card__info">
        <p><strong>Мастер:</strong> {specialist}</p>
        <p><strong>Клиент:</strong> {customerName}</p>
        <p><strong>Тел:</strong> {customerPhone}</p>
        <p><strong>Дата:</strong> {formatDisplayDate(date)} ({duration} мин)</p>
      </div>

      <div className="booking-card__actions">
        {canEdit && <button className="booking-card__btn booking-card__btn--edit" onClick={() => setIsEditing(true)}>✏️ Изменить</button>}
        <button className="booking-card__btn booking-card__btn--cancel" onClick={() => onDelete(id)}>Отменить</button>
      </div>
    </article>
  );
}