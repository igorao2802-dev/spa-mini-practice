import { useState } from "react";

// ПОЧЕМУ? Деструктуризация props делает код чище
// и сразу показывает контракт компонента
export default function ServiceCard({
  id,
  serviceName,
  specialist,
  customerName,
  customerPhone,
  appointmentDateTime,
  duration,
  status,
  onDelete,
  onUpdate
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    serviceName,
    specialist,
    customerName,
    customerPhone,
    appointmentDateTime,
    duration
  });

  // ПОЧЕМУ? Логика редактирования (isEditing, handleSave, editData) необходима для темы 
  // «Салон «Здоровье и красота»»: клиент может изменить услугу, специалиста, дату/время 
  // или контактные данные ДО момента подтверждения записи. После подтверждения (статус 
  // "Подтверждено") редактирование блокируется — это соответствует бизнес-правилам 
  // реального салона, где подтверждённая запись фиксируется в расписании мастера.
  // Реализовано через локальный useState + callback onUpdate для lifting state up.
  function handleSave() {
    // ПОЧЕМУ? Проверяем через trim(), чтобы отклонить ввод, состоящий только из пробелов
    if (!editData.serviceName.trim() || !editData.customerName.trim() || !editData.customerPhone.trim() || !editData.appointmentDateTime) return;
    onUpdate(id, editData);
    setIsEditing(false);
  }

  const badgeClass = status === "Подтверждено"
    ? "service-card__badge service-card__badge--confirmed"
    : "service-card__badge service-card__badge--pending";
  
  const canEdit = status !== "Подтверждено";

  // Форматирование даты и времени для отображения
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Не указано";
    const date = new Date(dateTimeString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isEditing) {
    return (
      <article className="service-card">
        <h3 className="service-card__title">Редактирование записи</h3>
        
        <label className="service-card__label">
          Услуга
          <select
            className="service-card__input"
            value={editData.serviceName}
            onChange={(e) => setEditData((prev) => ({ ...prev, serviceName: e.target.value }))}
          >
            <option value="Стрижка женская">Стрижка женская</option>
            <option value="Стрижка мужская">Стрижка мужская</option>
            <option value="Укладка волос">Укладка волос</option>
            <option value="Окрашивание волос">Окрашивание волос</option>
            <option value="Маникюр классический">Маникюр классический</option>
            <option value="Педикюр">Педикюр</option>
            <option value="Массаж расслабляющий">Массаж расслабляющий</option>
            <option value="Массаж лечебный">Массаж лечебный</option>
            <option value="Чистка лица">Чистка лица</option>
            <option value="SPA-процедуры">SPA-процедуры</option>
          </select>
        </label>

        <label className="service-card__label">
          Специалист
          <select
            className="service-card__input"
            value={editData.specialist}
            onChange={(e) => setEditData((prev) => ({ ...prev, specialist: e.target.value }))}
          >
            <option value="">Не выбран</option>
            <option value="Анна Михайлова">Анна Михайлова</option>
            <option value="Иван Сидоров">Иван Сидоров</option>
            <option value="Елена Петрова">Елена Петрова</option>
            <option value="Михаил Козлов">Михаил Козлов</option>
            <option value="Ольга Смирнова">Ольга Смирнова</option>
          </select>
        </label>

        <label className="service-card__label">
          ФИО заказчика
          <input
            className="service-card__input"
            value={editData.customerName}
            onChange={(e) => setEditData((prev) => ({ ...prev, customerName: e.target.value }))}
            placeholder="ФИО клиента"
          />
        </label>

        <label className="service-card__label">
          Телефон
          <input
            className="service-card__input"
            value={editData.customerPhone}
            onChange={(e) => setEditData((prev) => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="+7 (___) ___-__-__"
          />
        </label>

        <label className="service-card__label">
          Дата и время
          <input
            className="service-card__input"
            type="datetime-local"
            value={editData.appointmentDateTime}
            onChange={(e) => setEditData((prev) => ({ ...prev, appointmentDateTime: e.target.value }))}
          />
        </label>

        <label className="service-card__label">
          Длительность (мин)
          <input
            className="service-card__input"
            type="number"
            value={editData.duration}
            onChange={(e) => setEditData((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="30"
            step="5"
            placeholder="30"
          />
        </label>

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
        {specialist && (
          <p><strong>👤 Специалист:</strong> {specialist}</p>
        )}
        <p><strong>👤 Клиент:</strong> {customerName}</p>
        <p><strong>📞 Телефон:</strong> {customerPhone}</p>
        <p><strong>📅 Дата и время:</strong> {formatDateTime(appointmentDateTime)}</p>
        <p><strong>⏱ Длительность:</strong> {duration} мин</p>
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