// ПОЧЕМУ? На данном этапе практики форма упрощена — валидация через react-hook-form будет на следующем этапе.
import { useState } from "react";

export default function BookingForm({ roomData }) {
  const [name, setName] = useState('');
  
  // ПОЧЕМУ? Управляемый инпут: значение хранится в state, обновление через onChange.
  return (
    <div className="form-wrapper">
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Ваше имя"
        maxLength={50}
      />
      <button disabled={!name.trim()}>Забронировать</button>
    </div>
  );
}