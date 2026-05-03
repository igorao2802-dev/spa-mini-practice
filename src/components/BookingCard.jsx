import { useState } from "react";

export default function BookingCard({
  id,
  roomName,
  eventName,
  customerName,
  jobTitle,
  date,
  status,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    roomName,
    eventName,
    customerName,
    jobTitle,
    date,
  });

  // ПОЧЕМУ? Отдельная функция форматирования даты, а не inline в JSX?
  // 1. Читаемость: JSX не перегружен логикой преобразования.
  // 2. Переиспользование: если форматирование понадобится в другом месте,
  //    не придется дублировать код.
  // 3. Тестируемость: можно протестировать функцию отдельно от компонента.
  function formatDisplayDate(rawDate) {
    if (!rawDate) return "";
    // ПОЧЕМУ? Заменяем "T" на "Время: ", а не используем toLocaleString()?
    // 1. Простота: для учебного проекта не нужна сложная локализация.
    // 2. Контроль: мы точно знаем, как будет выглядеть дата.
    // 3. В продакшене лучше использовать date-fns или moment.js
    //    для правильного форматирования с учетом локали.
    return rawDate.replace("T", " Время: ");
  }

  function handleSave() {
    // ПОЧЕМУ? Проверяем обязательные поля перед сохранением?
    // Даже если форма валидируется при создании, при редактировании
    // пользователь может удалить данные. Дублируем валидацию на уровне
    // обработчика для надежности (защита от некорректных данных).
    if (!editData.roomName || !editData.eventName || !editData.customerName || !editData.date) {
      return;
    }
    onUpdate(id, editData);
    setIsEditing(false);
  }

  // ПОЧЕМУ? Вычисляем badgeClass до return, а не inline в JSX?
  // 1. Читаемость JSX: разметка не перегружена тернарными операторами.
  // 2. Производительность: вычисление происходит один раз при рендере,
  //    а не при каждом обращении к className.
  const badgeClass =
    status === "Подтверждено"
      ? "booking-card__badge booking-card__badge--confirmed"
      : "booking-card__badge booking-card__badge--pending";

  // ПОЧЕМУ? canEdit проверяет статус, а не просто разрешает редактирование?
  // Бизнес-правило: подтвержденные брони нельзя изменить,
  // чтобы избежать конфликтов и несанкционированных изменений.
  // Это пример валидации на уровне UI.
  const canEdit = status !== "Подтверждено";

  // ПОЧЕМУ? Условный рендеринг режима редактирования через if/else, а не тернарник?
  // Когда ветки условного рендеринга большие (больше 5-7 строк JSX),
  // if/else читается лучше, чем громоздкий тернарный оператор.
  if (isEditing) {
    return (
      <article className="booking-card">
        <h3 className="booking-card__title">Редактирование</h3>
        {/* ПОЧЕМУ? setEditData((prev) => ({ ...prev, field: value })), а не setEditData({...editData, field: value})?
            При редактировании нескольких полей быстро (batching),
            функциональное обновление гарантирует, что мы работаем
            с актуальным состоянием, а не с замыканием. */}
        <input
          className="booking-card__input"
          value={editData.roomName}
          onChange={(e) => setEditData((prev) => ({ ...prev, roomName: e.target.value }))}
        />
        <input
          className="booking-card__input"
          value={editData.eventName}
          onChange={(e) => setEditData((prev) => ({ ...prev, eventName: e.target.value }))}
        />
        <input
          className="booking-card__input"
          value={editData.customerName}
          onChange={(e) => setEditData((prev) => ({ ...prev, customerName: e.target.value }))}
        />
        <input
          className="booking-card__input"
          type="datetime-local"
          value={editData.date}
          onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
        />
        <div className="booking-card__actions">
          <button onClick={handleSave} className="booking-card__btn booking-card__btn--save">
            Сохранить
          </button>
          <button onClick={() => setIsEditing(false)} className="booking-card__btn booking-card__btn--discard">
            Отмена
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="booking-card">
      {/* ПОЧЕМУ? Условный рендеринг бейджа через &&, а не тернарник?
          Если статус отсутствует (null/undefined), бейдж не показывается вообще.
          Это короче и чище, чем писать {status ? <span>...</span> : null}. */}
      {status && <span className={badgeClass}>{status}</span>}
      
      <h3 className="booking-card__title">{roomName}</h3>
      
      <div className="booking-card__info">
        <p><strong>Мероприятие:</strong> {eventName}</p>
        <p><strong>Заказчик:</strong> {customerName}</p>
        {/* ПОЧЕМУ? jobTitle рендерится только если есть значение?
            Пустое поле "Должность:" без значения выглядит как ошибка
            или незаполненная форма. Скрываем нерелевантные данные. */}
        {jobTitle && <p><strong>Должность:</strong> {jobTitle}</p>}
        <p><strong>Дата:</strong> {formatDisplayDate(date)}</p>
      </div>

      <div className="booking-card__actions">
        {/* ПОЧЕМУ? canEdit && <button>, а не disabled?
            Если кнопка не нужна, мы ее вообще не рендерим.
            Это чище UI (меньше визуального шума) и безопаснее
            (пользователь не увидит неактивную кнопку и не будет пытаться нажать). */}
        {canEdit && (
          <button
            className="booking-card__btn booking-card__btn--edit"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Изменить
          </button>
        )}
        <button
          className="booking-card__btn booking-card__btn--cancel"
          onClick={() => onDelete(id)}
        >
          ❌ Отменить бронь
        </button>
      </div>
    </article>
  );
}