import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import BookingForm from "./components/BookingForm";
import ServiceCard from "./components/ServiceCard";

// ПОЧЕМУ? Ключ для localStorage вынесен в константу — упрощает поддержку и миграцию данных.
const STORAGE_KEY = "salon-bookings-v1";

const INITIAL_ITEMS = [
  {
    id: 1,
    serviceName: "Стрижка женская",
    specialist: "Анна Михайлова",
    customerName: "Иванова Мария",
    customerPhone: "29 111 22 33",
    appointmentDateTime: "2026-05-10T14:00",
    duration: 60,
    status: "Ожидание",
  },
  {
    id: 2,
    serviceName: "Массаж расслабляющий",
    specialist: "Иван Сидоров",
    customerName: "Петров Алексей",
    customerPhone: "33 444 55 66",
    appointmentDateTime: "2026-05-12T10:30",
    duration: 90,
    status: "Подтверждено",
  },
  {
    id: 3,
    serviceName: "Маникюр классический",
    specialist: "Елена Петрова",
    customerName: "Сидорова Ольга",
    customerPhone: "44 777 88 99",
    appointmentDateTime: "2026-05-08T16:00",
    duration: 45,
    status: "Ожидание",
  },
];

export default function App() {
  // ПОЧЕМУ? Функция-инициализатор выполняется только при монтировании,
  // предотвращая лишние чтения из localStorage при каждом рендере.
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [filterStatus, setFilterStatus] = useState("Все");
  const [sortBy, setSortBy] = useState("soonest");

  // ПОЧЕМУ? useEffect для side-effects. Синхронизация состояния React с внешним хранилищем
  // должна происходить после успешного рендера, чтобы не блокировать UI.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Ошибка сохранения в localStorage:", e);
    }
  }, [items]);

  function handleAddItem(newItem) {
    // ПОЧЕМУ? Функциональное обновление гарантирует работу с актуальным стейтом
    // при быстрых последовательных добавлениях (React batching).
    setItems((prev) => [...prev, { ...newItem, id: Date.now() }]);
  }

  function handleDelete(id) {
    // ПОЧЕМУ? filter создаёт новый массив, сохраняя иммутабельность стейта.
    // splice мутирует исходный массив, что ломает механизм сравнения React и ведёт к багам рендера.
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdate(id, updatedData) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)),
    );
  }

  // Фильтрация и сортировка вынесены в вычисляемое свойство, чтобы не засорять рендер
  const processedItems = items
    .filter((item) => filterStatus === "Все" || item.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.appointmentDateTime);
      const dateB = new Date(b.appointmentDateTime);
      return sortBy === "soonest" ? dateA - dateB : dateB - dateA;
    });

  return (
    <Layout title="Салон «Здоровье и красота»">
      <div className="controls-panel">
        <div className="control-group">
          <label className="control-label">🔍 Фильтр по статусу</label>
          <select
            className="control-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Все">Все записи</option>
            <option value="Ожидание">Ожидание</option>
            <option value="Подтверждено">Подтверждено</option>
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">📊 Сортировка</label>
          <select
            className="control-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="soonest">Сначала ближайшие</option>
            <option value="latest">Сначала поздние</option>
          </select>
        </div>
      </div>

      <section className="section">
        <h2 className="section__title">📝 Новая запись</h2>
        <BookingForm onAddItem={handleAddItem} />
      </section>

      <section className="section">
        <h2 className="section__title">
          📋 Мои записи ({processedItems.length})
        </h2>
        {processedItems.length === 0 ? (
          <div className="empty-state">
            Записи не найдены. Измените фильтр или добавьте новую запись.
          </div>
        ) : (
          <div className="cards-grid">
            {processedItems.map((item) => (
              <ServiceCard
                key={item.id}
                {...item}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
