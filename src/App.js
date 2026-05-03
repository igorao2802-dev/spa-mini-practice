import { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import StatusFilter from "./components/StatusFilter";

// ПОЧЕМУ? Начальные данные вынесены за пределы компонента — они не пересоздаются
// при каждом рендере, что экономит память и предотвращает лишние перерисовки.
const INITIAL_BOOKINGS = [
  {
    id: 1,
    roomName: "Переговорная №1",
    specialist: "Иванов А.С.",
    date: "2026-01-15T10:00",
    status: "Подтверждено",
  },
  {
    id: 2,
    roomName: "Коворкинг-зона",
    specialist: "Петрова М.К.",
    date: "2026-01-15T14:00",
    status: "Ожидание",
  },
  {
    id: 3,
    roomName: "Большой зал",
    specialist: "Сидоров Д.П.",
    date: "2026-01-16T09:00",
    status: "Подтверждено",
  },
];

const STORAGE_KEY = "room-bookings-v1";

export default function App() {
  // ПОЧЕМУ? Функция-инициализатор в useState выполняется только при монтировании,
  // а не при каждом рендере — это критично для производительности при работе с localStorage.
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      // ПОЧЕМУ? try/catch защищает от падения приложения при повреждённых данных в localStorage.
      return INITIAL_BOOKINGS;
    }
  });

  const [filter, setFilter] = useState("Все");

  // ПОЧЕМУ? useEffect для localStorage — это «побочный эффект» (side effect),
  // который должен выполняться после рендера, а не во время него.
  // Зависимость [bookings] гарантирует синхронизацию при каждом изменении списка.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      console.warn("⚠️ Не удалось сохранить данные в localStorage");
    }
  }, [bookings]);

  // ПОЧЕМУ? Функциональное обновление prev => [...] гарантирует актуальность state
  // при нескольких быстрых добавлениях (batching в React).
  function handleAddItem(newItem) {
    setBookings((prev) => [...prev, newItem]);
  }

  // ПОЧЕМУ? filter() возвращает новый массив, а не мутирует старый —
  // это соответствует принципу иммутабельности в React и позволяет корректно отслеживать изменения.
  function handleDelete(id) {
    setBookings((prev) => prev.filter((item) => item.id !== id));
  }

  // ПОЧЕМУ? Фильтрация вычисляется в родителе (App), а не в BookingList —
  // это сохраняет «единый источник истины» и упрощает отладку бизнес-логики.
  const filteredBookings =
    filter === "Все"
      ? bookings
      : bookings.filter((item) => item.status === filter);

  return (
    <Layout title="🏢 Бронирование помещений">
      <section className="section">
        <h2>➕ Новая бронь</h2>
        <BookingForm onAddItem={handleAddItem} />
      </section>

      <section className="section">
        <h2>🔍 Фильтр</h2>
        <StatusFilter activeFilter={filter} onFilterChange={setFilter} />
      </section>

      <section className="section">
        <h2>📋 Список броней</h2>
        <BookingList items={filteredBookings} onDelete={handleDelete} />
      </section>
    </Layout>
  );
}
