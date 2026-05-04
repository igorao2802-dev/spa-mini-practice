import { useState } from "react";

// ПОЧЕМУ? Деструктуризация props делает код чище
// и сразу показывает контракт компонента
export default function ServiceCard({ 
  id, 
  serviceName, 
  specialist, 
  category, 
  duration, 
  price, 
  status, 
  onDelete, 
  onUpdate 
}) {
// ПОЧЕМУ? Логика редактирования (isEditing, handleSave, editData) необходима для темы 
// «Салон «Здоровье и красота»»: клиент может изменить услугу, специалиста или время 
// записи ДО момента подтверждения администратором. После подтверждения (статус 
// "Подтверждено") редактирование блокируется — это соответствует бизнес-правилам 
// реального салона, где подтверждённая запись фиксируется в расписании мастера.
// Реализовано через локальный useState + callback onUpdate для lifting state up.
const [isEditing, setIsEditing] = useState(false);  const [editData, setEditData] = useState({ 
    serviceName, 
    specialist, 
    category, 
    duration 
  });

function handleSave() {
  // ПОЧЕМУ? Проверяем через trim(), чтобы отклонить ввод, состоящий только из пробелов
  if (!editData.serviceName.trim() || !editData.specialist.trim() || !editData.category.trim()) return;
  onUpdate(id, editData);
  setIsEditing(false);
}
  const badgeClass = status === "Подтверждено"
    ? "service-card__badge service-card__badge--confirmed"
    : "service-card__badge service-card__badge--pending";

  const canEdit = status !== "Подтверждено";

  if (isEditing) {
    return (
      <article className="service-card">
        <h3 className="service-card__title">Редактирование записи</h3>
        <input 
          className="service-card__input" 
          value={editData.serviceName} 
          onChange={(e) => setEditData((prev) => ({ ...prev, serviceName: e.target.value }))} 
          placeholder="Услуга"
        />
        <input 
          className="service-card__input" 
          value={editData.specialist} 
          onChange={(e) => setEditData((prev) => ({ ...prev, specialist: e.target.value }))} 
          placeholder="Специалист"
        />
        <input 
          className="service-card__input" 
          value={editData.category} 
          onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))} 
          placeholder="Категория"
        />
        <input 
          className="service-card__input" 
          type="number"
          value={editData.duration} 
          onChange={(e) => setEditData((prev) => ({ ...prev, duration: parseInt(e.target.value) }))} 
          placeholder="Длительность (мин)"
        />
        <div className="service-card__actions">
          <button onClick={handleSave} className="service-card__btn service-card__btn--save">
            💾 Сохранить
          </button>
          <button onClick={() => setIsEditing(false)} className="service-card__btn service-card__btn--discard">
            ❌ Отмена
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="service-card">
      {status && <span className={badgeClass}>{status}</span>}
      <h3 className="service-card__title">{serviceName}</h3>
      <div className="service-card__info">
        <p><strong>👤 Специалист:</strong> {specialist}</p>
        <p><strong>📂 Категория:</strong> {category}</p>
        <p><strong>⏱ Длительность:</strong> {duration} мин</p>
        <p><strong>💰 Стоимость:</strong> {price}</p>
      </div>
      <div className="service-card__actions">
        {canEdit && (
          <button 
            className="service-card__btn service-card__btn--edit" 
            onClick={() => setIsEditing(true)}
          >
            ✏️ Изменить
          </button>
        )}
        <button 
          className="service-card__btn service-card__btn--cancel" 
          onClick={() => onDelete(id)}
        >
          🗑 Отменить запись
        </button>
      </div>
    </article>
  );
}