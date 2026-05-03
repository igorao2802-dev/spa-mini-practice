import { useState } from "react";

// ПОЧЕМУ? Управляемые инпуты (value + onChange) дают полный контроль над значением поля,
// что необходимо для валидации, очистки и синхронизации с другими компонентами.
export default function BookingForm({ onAddItem }) {
  const [roomName, setRoomName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Ожидание");

  // ПОЧЕМУ? preventDefault() отменяет стандартную перезагрузку страницы при submit,
  // позволяя обработать данные через JavaScript без потери состояния приложения.
  function handleSubmit(e) {
    e.preventDefault();

    // ПОЧЕМУ? Валидация через .trim() отсекает «пустые» значения из пробелов,
    // предотвращая сохранение некорректных данных в состоянии приложения.
    if (!roomName.trim() || !specialist.trim() || !date.trim()) {
      alert("⚠️ Заполните все обязательные поля");
      return;
    }

    const newBooking = {
      id: Date.now(), // ПОЧЕМУ? Date.now() даёт уникальный id для демо; в продакшене — uuid/nanoid
      roomName: roomName.trim(),
      specialist: specialist.trim(),
      date: date.trim(),
      status,
    };

    onAddItem(newBooking);

    // ПОЧЕМУ? Очистка формы после отправки улучшает UX и готовит компонент к новому вводу.
    setRoomName("");
    setSpecialist("");
    setDate("");
    setStatus("Ожидание");
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="booking-form__field">
        <label htmlFor="roomName">Помещение *</label>
        <input
          id="roomName"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Например: Переговорная №1"
          maxLength={50}
          required
        />
      </div>

      <div className="booking-form__field">
        <label htmlFor="specialist">Специалист *</label>
        <input
          id="specialist"
          type="text"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          placeholder="ФИО ответственного"
          maxLength={50}
          required
        />
      </div>

      <div className="booking-form__field">
        <label htmlFor="date">Дата и время *</label>
        <input
          id="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="booking-form__field">
        <label htmlFor="status">Статус</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
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