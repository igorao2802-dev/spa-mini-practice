import { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import BookingForm from "./components/BookingForm";
import ServiceList from "./components/ServiceList";
import FilterPanel from "./components/FilterPanel";
import Footer from "./components/Footer";

// ПОЧЕМУ? Начальные данные вынесены за пределы компонента —
// они не пересоздаются при каждом рендере.
const INITIAL_SERVICES = [
  {
    id: 1,
    serviceName: "Стрижка женская",
    specialist: "Анна Михайлова",
    category: "Парикмахерские услуги",
    duration: 60,
    price: "1500 RUB",
    status: "Ожидание",
  },
  {
    id: 2,
    serviceName: "Маникюр классический",
    specialist: "Елена Петрова",
    category: "Ногтевой сервис",
    duration: 90,
    price: "1200 RUB",
    status: "Подтверждено",
  },
  {
    id: 3,
    serviceName: "Массаж расслабляющий",
    specialist: "Иван Сидоров",
    category: "Массаж",
    duration: 60,
    price: "2000 RUB",
    status: "Ожидание",
  },
];

const STORAGE_KEY = "beauty-salon-bookings-v1";

export default function App() {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [filter, setFilter] = useState("Все");
  const [sortOrder, setSortOrder] = useState("asc");

  // ПОЧЕМУ? useEffect для localStorage — это side effect,
  // который выполняется после рендера
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch {
      console.warn("⚠️ Ошибка сохранения в localStorage");
    }
  }, [services]);

  function handleAddItem(newItem) {
    setServices((prev) => [...prev, newItem]);
  }

  function handleDelete(id) {
    // ПОЧЕМУ? filter, а не splice?
    // splice() мутирует исходный массив, а в React state нельзя мутировать напрямую.
    // filter() возвращает новый массив — React видит изменение ссылки и корректно
    // запускает ре-рендер. Это гарантирует предсказуемость состояния и работу
    // механизма сравнения (reconciliation) в React.
    setServices((prev) => prev.filter((item) => item.id !== id));
  }
  function handleUpdateService(id, updatedFields) {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );
  }

  // 1. Фильтрация
  const filteredByCategory =
    filter === "Все"
      ? services
      : services.filter((item) => item.category === filter);

  // 2. Сортировка по длительности
  const sortedServices = [...filteredByCategory].sort((a, b) => {
    return sortOrder === "asc"
      ? a.duration - b.duration
      : b.duration - a.duration;
  });

  return (
    <Layout title="💆 Салон «Здоровье и красота»">
      <section className="section">
        <h2>📝 Новая запись</h2>
        <BookingForm onAddItem={handleAddItem} existingServices={services} />
      </section>

      <section className="section">
        <h2>🔍 Фильтр</h2>
        <FilterPanel activeFilter={filter} onFilterChange={setFilter} />
      </section>

      <section className="section">
        <h2>📋 Мои записи</h2>
        <ServiceList
          items={sortedServices}
          onDelete={handleDelete}
          onUpdate={handleUpdateService}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </section>

      <Footer />
    </Layout>
  );
}
