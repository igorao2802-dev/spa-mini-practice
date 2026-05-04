import { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import StatusFilter from "./components/StatusFilter";

// ПОЧЕМУ? Данные вынесены за пределы компонента — они не пересоздаются при каждом рендере.
// Тема изменена на «Салон/Клиника» согласно ТЗ.
const INITIAL_BOOKINGS = [
  {
    id: 1,
    serviceName: "Стрижка мужская",
    specialist: "Мастер Анна",
    customerName: "Иванов И.И.",
    customerPhone: "+7 (900) 123-45-67",
    date: "2026-01-15T10:00",
    duration: 60, // Длительность в минутах
    status: "Подтверждено",
  },
  {
    id: 2,
    serviceName: "Массаж спины",
    specialist: "Доктор Петров",
    customerName: "Сидорова М.К.",
    customerPhone: "+7 (999) 000-11-22",
    date: "2026-01-15T11:30",
    duration: 90,
    status: "Ожидание",
  },
];

const STORAGE_KEY = "salon-bookings-v1";

export default function App() {
  // ПОЧЕМУ? Функция-инициализатор в useState выполняется только при монтировании.
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [filter, setFilter] = useState("Все");
  const [sortOrder, setSortOrder] = useState("asc");

  // ПОЧЕМУ? useEffect для сохранения — это side effect, выполняемый после рендера.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      console.warn("⚠️ Не удалось сохранить данные в localStorage");
    }
  }, [bookings]);

  // ПОЧЕМУ? Проверка конфликтов учитывает длительность услуги (duration).
  // Конфликт есть, если начало новой записи раньше конца существующей И начало существующей раньше конца новой.
  function checkTimeOverlap(newDate, duration, newService) {
    if (!newDate || !duration) return null;

    const newStart = new Date(newDate).getTime();
    const newEnd = newStart + duration * 60 * 1000; // Перевод минут в мс

    const conflict = bookings.find((booking) => {
      if (booking.serviceName !== newService) return false;

      const existingStart = new Date(booking.date).getTime();
      const existingEnd = existingStart + booking.duration * 60 * 1000;

      // Логика пересечения отрезков времени
      return newStart < existingEnd && existingStart < newEnd;
    });

    return conflict
      ? `⚠️ Время пересекается с записью клиента "${conflict.customerName}"`
      : null;
  }

  function handleAddItem(newItem) {
    // Проверка на этапе добавления
    const overlapError = checkTimeOverlap(
      newItem.date,
      newItem.duration,
      newItem.serviceName,
    );
    if (overlapError) return { success: false, error: overlapError };

    setBookings((prev) => [...prev, { ...newItem, id: Date.now() }]);
    return { success: true };
  }

  // ПОЧЕМУ? filter() возвращает новый массив (иммутабельность).
  function handleDelete(id) {
    setBookings((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdateBooking(id, updatedFields) {
    // При редактировании тоже нужно проверять конфликты, исключая саму редактируемую запись
    const currentBooking = bookings.find((b) => b.id === id);
    if (!currentBooking) return;

    const newStart = new Date(updatedFields.date).getTime();
    const newEnd =
      newStart +
      (updatedFields.duration || currentBooking.duration) * 60 * 1000;

    const hasConflict = bookings.some((booking) => {
      if (
        booking.id === id ||
        booking.serviceName !== currentBooking.serviceName
      )
        return false;

      const existingStart = new Date(booking.date).getTime();
      const existingEnd = existingStart + booking.duration * 60 * 1000;
      return newStart < existingEnd && existingStart < newEnd;
    });

    if (hasConflict)
      return {
        success: false,
        error: "⚠️ Новое время пересекается с другой записью",
      };

    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );
    return { success: true };
  }

  const filteredBookings =
    filter === "Все"
      ? bookings
      : bookings.filter((item) => item.status === filter);

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <Layout title="🏥 Салон «Здоровье и Красота»">
      <section className="section">
        <h2>➕ Новая запись</h2>
        <BookingForm onAddItem={handleAddItem} existingBookings={bookings} />
      </section>

      <section className="section">
        <h2>🔍 Фильтр и Сортировка</h2>
        <StatusFilter activeFilter={filter} onFilterChange={setFilter} />
        <div style={{ marginTop: "10px" }}>
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">🔼 Сначала ранние</option>
            <option value="desc">🔽 Сначала поздние</option>
          </select>
        </div>
      </section>

      <section className="section">
        <h2>📋 Журнал записей</h2>
        <BookingList
          items={sortedBookings}
          onDelete={handleDelete}
          onUpdate={handleUpdateBooking}
        />
      </section>
    </Layout>
  );
}
