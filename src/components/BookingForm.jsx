import { useState } from "react";

export default function BookingForm({ onAddItem, existingBookings }) {
  const [roomName, setRoomName] = useState("");
  const [eventName, setEventName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Ожидание");
  const [error, setError] = useState("");

  const ROOMS = ["Переговорная комната", "Конференц-зал", "Банкетный зал", "Спортивный уголок"];

  // Расчет прогресса: 4 обязательных поля (Помещение, Мероприятие, Заказчик, Дата)
  const requiredFilled = [roomName, eventName, customerName, date].filter((v) => v.trim() !== "").length;
  const progressPercent = (requiredFilled / 4) * 100;

  // ПОЧЕМУ? Отдельная функция проверки пересечений, а не валидация в handleSubmit?
  // 1. Разделение ответственности: проверка бизнес-правил (пересечение времени)
  //    отделена от общей валидации формы.
  // 2. Переиспользование: эту логику можно вызвать при изменении поля даты/помещения
  //    для мгновенной обратной связи пользователю.
  function checkTimeOverlap(newDate, newRoom) {
    if (!newDate || !newRoom) return null;
    const newTime = new Date(newDate).getTime();

    // ПОЧЕМУ? Сравниваем toDateString() для проверки того же дня?
    // Бронирование на разные даты не конфликтует, даже если время одинаковое.
    // toDateString() отбрасывает время, оставляя только дату (год-месяц-день).
    const conflicts = existingBookings.filter((booking) => {
      if (booking.roomName !== newRoom) return false;
      
      const existingDate = new Date(booking.date);
      const isSameDay = existingDate.toDateString() === new Date(newDate).toDateString();
      
      if (!isSameDay) return false;

      const existingTime = existingDate.getTime();
      const diffMinutes = Math.abs(newTime - existingTime) / (1000 * 60);
      
      // ПОЧЕМУ? Интервал 15 минут, а не 0?
      // Бронирование с разницей в 1-2 минуты технически возможно (между встречами),
      // но на практике нужно время на подготовку помещения.
      // 15 минут — разумный буфер для уборки/настройки.
      return diffMinutes < 15;
    });

    return conflicts.length > 0 ? `⚠️ Время пересекается с существующей бронью (интервал < 15 мин)` : null;
  }

  function handleSubmit(e) {
    // ПОЧЕМУ? e.preventDefault() обязателен для форм?
    // По умолчанию форма отправляется с перезагрузкой страницы (full page reload).
    // В React SPA мы хотим обрабатывать данные без перезагрузки,
    // поэтому отменяем стандартное поведение браузера.
    e.preventDefault();
    setError("");

    // ПОЧЕМУ? Проверяем .trim(), а не просто на пустую строку?
    // Пользователь может случайно ввести пробелы (например, "   ").
    // Такая строка технически не пустая, но не содержит полезных данных.
    // trim() удаляет пробелы по краям перед проверкой.
    if (!roomName || !eventName || !customerName || !date) {
      setError("Заполните все обязательные поля");
      return;
    }

    // Проверка на пересечение времени
    const overlapError = checkTimeOverlap(date, roomName);
    if (overlapError) {
      setError(overlapError);
      return;
    }

    // ПОЧЕМУ? Создаем newItem с id: Date.now(), а не используем библиотеку nanoid?
    // Для учебного проекта Date.now() достаточно:
    // 1. Гарантирует уникальность в рамках одной сессии (между кликами проходит >1ms).
    // 2. Не требует установки дополнительных зависимостей.
    // В продакшене лучше использовать nanoid или uuid для абсолютной уникальности.
    onAddItem({
      id: Date.now(),
      roomName,
      eventName,
      customerName,
      jobTitle,
      date,
      status,
    });

    // ПОЧЕМУ? Очищаем все поля вручную, а не используем сброс формы?
    // Это управляемый компонент (controlled component): React полностью контролирует
    // значения инпутов через state. Сброс через form.reset() не сработает,
    // так как значения берутся из state, а не из DOM.
    setRoomName("");
    setEventName("");
    setCustomerName("");
    setJobTitle("");
    setDate("");
    setStatus("Ожидание");
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      {/* ПОЧЕМУ? Прогресс-бар на основе заполненности полей?
          Визуальная обратная связь мотивирует пользователя заполнить форму до конца.
          Это UX-паттерн, который повышает конверсию (completion rate). */}
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="booking-form__field">
        <label>Помещение *</label>
        {/* ПОЧЕМУ? select вместо input type="text" для помещения?
            1. Валидация на уровне UI: пользователь не введет несуществующее помещение.
            2. UX: быстрее выбрать из списка, чем печатать.
            3. Консистентность данных: одинаковые названия помещений для фильтрации. */}
        <select value={roomName} onChange={(e) => setRoomName(e.target.value)} required>
          <option value="">Выберите помещение</option>
          {ROOMS.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
      </div>

      <div className="booking-form__field">
        <label>Наименование мероприятия *</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Совещание отдела"
          maxLength={60}
          required
        />
      </div>

      <div className="booking-form__field">
        <label>Заказчик *</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="ФИО заказчика"
          maxLength={50}
          required
        />
      </div>

      <div className="booking-form__field">
        <label>Должность</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Должность (необязательно)"
          maxLength={40}
        />
      </div>

      <div className="booking-form__field">
        <label>Дата и время *</label>
        {/* ПОЧЕМУ? input type="datetime-local", а не отдельные date и time?
            1. Проще валидация: одно значение вместо двух.
            2. Меньше полей — лучше UX.
            3. Стандартный HTML5 тип поддерживает мобильные устройства (нативный picker). */}
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="booking-form__field">
        <label>Статус</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Ожидание">Ожидание</option>
          <option value="Подтверждено">Подтверждено</option>
        </select>
      </div>

      <button type="submit" className="booking-form__submit">
        ➕ Забронировать
      </button>
    </form>
  );
}