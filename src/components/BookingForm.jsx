import { useState } from "react";

// ПОЧЕМУ? Форма вынесена в отдельный компонент для соблюдения принципа единственной ответственности (SRP).
// Это упрощает тестирование, валидацию и повторное использование.
export default function BookingForm({ onAddItem }) {
  const [roomName, setRoomName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("30"); // ПОЧЕМУ? По умолчанию 30 минут согласно ТЗ.
  const [status, setStatus] = useState("Ожидание");
  const [error, setError] = useState("");

  // ПОЧЕМУ? Список помещений вынесен в константу для централизованного управления и легкого расширения.
  // Если тема проекта сменилась на «Салон/Клинику», замените значения на ["Стрижка", "Маникюр", ...]
  const SERVICES = ["Стрижка", "Маникюр", "Массаж", "Консультация врача"];

  // ПОЧЕМУ? Прогресс-бар считает только обязательные поля (услуга, клиент, телефон, дата).
  const requiredFilled = [roomName, customerName, customerPhone, date].filter((v) => v.trim() !== "").length;
  const progressPercent = (requiredFilled / 4) * 100;

  // ПОЧЕМУ? Валидация телефона вынесена в отдельную функцию для чистоты кода и переиспользования.
  const validatePhone = (phone) => {
    const validOperators = ["17", "25", "29", "33", "44"];
    const code = phone.slice(0, 2);
    return validOperators.includes(code) && phone.length === 9 && /^\d+$/.test(phone);
  };

  // ПОЧЕМУ? Обработчик ввода телефона фильтрует только цифры и ограничивает длину до 9 символов.
  // Это предотвращает ввод некорректных данных ещё на этапе набора.
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setCustomerPhone(value);
  };

  function handleSubmit(e) {
    e.preventDefault(); /* ПОЧЕМУ? preventDefault отменяет стандартную отправку формы, предотвращая перезагрузку страницы. */
    setError("");

    // Валидация обязательных полей
    if (!roomName || !customerName || !customerPhone || !date) {
      setError("⚠️ Заполните все обязательные поля");
      return;
    }
    if (customerName.trim().length < 2) {
      setError("⚠️ Имя клиента должно содержать минимум 2 символа");
      return;
    }
    if (!validatePhone(customerPhone)) {
      setError("⚠️ Неверный формат телефона. Введите код оператора (29, 33, 44, 17) и 7 цифр номера");
      return;
    }

    const newItem = {
      roomName,
      specialist: specialist.trim() || "Не указан", /* ПОЧЕМУ? Специалист не обязателен, поэтому ставим значение по умолчанию. */
      customerName: customerName.trim(),
      customerPhone: `+375${customerPhone}`, /* ПОЧЕМУ? Форматируем номер под белорусский стандарт перед сохранением. */
      date,
      duration: parseInt(duration, 10),
      status,
    };

    const result = onAddItem(newItem);

    // ПОЧЕМУ? Проверяем результат валидации перед очисткой формы.
    if (result && result.success) {
      setRoomName("");
      setSpecialist("");
      setCustomerName("");
      setCustomerPhone("");
      setDate("");
      setDuration("30");
      setStatus("Ожидание");
    } else if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="booking-form__field">
        <label>Помещение *</label>
        <select value={roomName} onChange={(e) => setRoomName(e.target.value)} required>
          <option value="">Выберите помещение</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="booking-form__field">
        <label>Специалист (необязательно)</label>
        <input
          type="text"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          placeholder="ФИО мастера"
          maxLength={50}
        />
      </div>

      <div className="booking-form__field">
        <label>ФИО Клиента *</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Иванов Иван Иванович"
          maxLength={50}
          required
        />
      </div>

      <div className="booking-form__field">
        <label>Телефон *</label>
        <input
          type="tel"
          value={customerPhone}
          onChange={handlePhoneChange}
          placeholder="29 123 45 67"
          required
        />
      </div>

      <div className="booking-form__field">
        <label>Дата и время *</label>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="booking-form__field">
        <label>Длительность (мин) *</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="5"
          step="5"
          required
        />
      </div>

      <button type="submit" className="booking-form__submit">➕ Забронировать</button>
    </form>
  );
}