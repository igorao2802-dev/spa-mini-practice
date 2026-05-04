import { useState } from "react";

// ПОЧЕМУ? Управляемая форма: все поля хранятся в state
// Это позволяет валидировать и очищать форму программно
export default function BookingForm({ onAddItem, existingServices }) {
  const [serviceName, setServiceName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("60");
  const [status, setStatus] = useState("Ожидание");
  const [error, setError] = useState("");
  
  const CATEGORIES = [
    "Парикмахерские услуги",
    "Ногтевой сервис",
    "Массаж",
    "Косметология",
    "SPA-процедуры"
  ];
  
  // Расчет прогресса заполнения формы (теперь 3 обязательных поля вместо 4)
  const requiredFilled = [serviceName, category].filter((v) => v.trim() !== "").length;
  const progressPercent = (requiredFilled / 3) * 100;
  
  function handleSubmit(e) {
    // ПОЧЕМУ? preventDefault() предотвращает перезагрузку страницы
    // при отправке формы, что критично для SPA
    e.preventDefault();
    setError("");
    
    // ПОЧЕМУ? Теперь проверяем только обязательные поля (serviceName и category)
// ПОЧЕМУ? Используем .trim(), чтобы отклонить ввод, состоящий только из пробелов
// Это предотвращает создание записей с «пустыми» названиями услуг
if (!serviceName.trim() || !category.trim()) {
  setError("Заполните все обязательные поля");
  return;
}
    onAddItem({
      id: Date.now(),
      serviceName,
      specialist, // ПОЧЕМУ? specialist теперь необязательное поле
      category,
      duration: parseInt(duration, 10),
      status,
    });

    // ПОЧЕМУ? Очищаем форму после успешной отправки
    setServiceName("");
    setSpecialist("");
    setCategory("");
    setDuration("60");
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
        <input 
          type="text" 
          value={serviceName} 
          onChange={(e) => setServiceName(e.target.value)} 
          placeholder="Например: Стрижка женская"
          maxLength={60}
          required 
        />
      </div>

      <div className="booking-form__field">
        <label>Специалист</label>
        <input 
          type="text" 
          value={specialist} 
          onChange={(e) => setSpecialist(e.target.value)} 
          placeholder="ФИО мастера (необязательно)"
          maxLength={50}
          // ПОЧЕМУ? Убран атрибут required - поле теперь необязательное
        />
      </div>

      <div className="booking-form__field">
        <label>Категория *</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required
        >
          <option value="">Выберите категорию</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="booking-form__field">
        <label>Длительность (мин)</label>
        <input 
          type="number" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          min="15" 
          step="15"
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