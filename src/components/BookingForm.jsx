import { useState } from "react";

// ПОЧЕМУ? Управляемая форма: все поля хранятся в state
// Это позволяет валидировать и очищать форму программно
export default function BookingForm({ onAddItem }) {
  const [serviceName, setServiceName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [status, setStatus] = useState("Ожидание");
  const [error, setError] = useState("");

  // ПОЧЕМУ? Списки услуг и специалистов вынесены в константы
  // Это обеспечивает консистентность данных между формой и карточками
  const SERVICES = [
    "Стрижка женская",
    "Стрижка мужская",
    "Укладка волос",
    "Окрашивание волос",
    "Маникюр классический",
    "Педикюр",
    "Массаж расслабляющий",
    "Массаж лечебный",
    "Чистка лица",
    "SPA-процедуры"
  ];

  const SPECIALISTS = [
    "Анна Михайлова",
    "Иван Сидоров",
    "Елена Петрова",
    "Михаил Козлов",
    "Ольга Смирнова"
  ];

  // Расчет прогресса заполнения формы (4 обязательных поля)
  const requiredFilled = [serviceName, customerName, customerPhone, appointmentDateTime]
    .filter((v) => v && v.trim() !== "").length;
  const progressPercent = (requiredFilled / 4) * 100;

  function handleSubmit(e) {
    // ПОЧЕМУ? preventDefault() предотвращает перезагрузку страницы
    // при отправке формы, что критично для SPA
    e.preventDefault();
    setError("");

    // ПОЧЕМУ? Используем .trim(), чтобы отклонить ввод, состоящий только из пробелов
    // Это предотвращает создание записей с «пустыми» данными
    if (!serviceName.trim() || !customerName.trim() || !customerPhone.trim() || !appointmentDateTime) {
      setError("Заполните все обязательные поля");
      return;
    }

    // Валидация телефона (минимум 10 цифр)
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Введите корректный номер телефона (минимум 10 цифр)");
      return;
    }

    onAddItem({
      id: Date.now(),
      serviceName,
      specialist,
      customerName,
      customerPhone,
      appointmentDateTime,
      duration: parseInt(duration, 10),
      status,
    });

    // ПОЧЕМУ? Очищаем форму после успешной отправки
    setServiceName("");
    setSpecialist("");
    setCustomerName("");
    setCustomerPhone("");
    setAppointmentDateTime("");
    setDuration("30");
    setStatus("Ожидание");
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {error && <p className="form-error">{error}</p>}

      <div className="booking-form__field">
        <label>Услуга *</label>
        <select 
          value={serviceName} 
          onChange={(e) => setServiceName(e.target.value)} 
          required 
        >
          <option value="">Выберите услугу</option>
          {SERVICES.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </div>

      <div className="booking-form__field">
        <label>Специалист</label>
        <select 
          value={specialist} 
          onChange={(e) => setSpecialist(e.target.value)}
        >
          <option value="">Не выбран</option>
          {SPECIALISTS.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="booking-form__field">
        <label>ФИО заказчика *</label>
        <input 
          type="text" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)} 
          placeholder="Введите ваше ФИО"
          maxLength={100}
          required 
        />
      </div>

      <div className="booking-form__field">
        <label>Номер телефона *</label>
        <input 
          type="tel" 
          value={customerPhone} 
          onChange={(e) => setCustomerPhone(e.target.value)} 
          placeholder="+7 (___) ___-__-__"
          maxLength={20}
          required 
        />
      </div>

      <div className="booking-form__field">
        <label>Дата и время записи *</label>
        <input 
          type="datetime-local" 
          value={appointmentDateTime} 
          onChange={(e) => setAppointmentDateTime(e.target.value)} 
          min={new Date().toISOString().slice(0, 16)}
          required 
        />
      </div>

      <div className="booking-form__field">
        <label>Длительность (мин)</label>
        <input 
          type="number" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          min="30" 
          step="5"
          required 
        />
      </div>

      <div className="booking-form__field">
        <label>Статус</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Ожидание">Ожидание</option>
          <option value="Подтверждено">Подтверждено</option>
        </select>
      </div>

      <button type="submit" className="booking-form__submit">
        ➕ Записаться
      </button>
    </form>
  );
}