import { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import StatusFilter from "./components/StatusFilter";
import Footer from "./components/Footer";

// ПОЧЕМУ? Данные вынесены за пределы компонента, чтобы они не пересоздавались при каждом рендере.
// Если бы INITIAL_BOOKINGS был внутри App(), то при каждом рендере создавался бы новый массив,
// что привело бы к лишним перерисовкам и проблемам с производительностью.
const INITIAL_BOOKINGS = [
  {
    id: 1,
    roomName: "Переговорная комната",
    eventName: "Планерка",
    customerName: "Иванов А.С.",
    jobTitle: "Менеджер",
    date: "2026-01-15T10:00",
    status: "Подтверждено",
  },
  {
    id: 2,
    roomName: "Конференц-зал",
    eventName: "Презентация",
    customerName: "Петрова М.К.",
    jobTitle: "",
    date: "2026-01-15T14:00",
    status: "Ожидание",
  },
  {
    id: 3,
    roomName: "Банкетный зал",
    eventName: "Корпоратив",
    customerName: "Сидоров Д.П.",
    jobTitle: "Директор",
    date: "2026-01-16T09:00",
    status: "Подтверждено",
  },
];

const STORAGE_KEY = "room-bookings-v1";

export default function App() {
  // ПОЧЕМУ? useState с функцией-инициализатором вместо прямого значения?
  // Функция выполняется только один раз при первом рендере (монтировании компонента),
  // а не при каждом обновлении состояния. Это предотвращает лишние обращения к localStorage
  // и парсинг JSON на каждом рендере, что критично для производительности.
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // ПОЧЕМУ? Проверяем saved перед парсингом?
      // localStorage.getItem возвращает null, если ключ не найден.
      // JSON.parse(null) выбросит ошибку, поэтому нужна проверка.
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch (error) {
      // ПОЧЕМУ? Возвращаем INITIAL_BOOKINGS при ошибке, а не пустой массив?
      // Если данные в localStorage повреждены (невалидный JSON),
      // мы не теряем начальные данные и приложение остается работоспособным.
      console.error("Ошибка загрузки из localStorage:", error);
      return INITIAL_BOOKINGS;
    }
  });

  const [filter, setFilter] = useState("Все");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' или 'desc'

  // ПОЧЕМУ? useEffect для сохранения в localStorage, а не прямое изменение в handleAddItem?
  // 1. Разделение ответственности: логика бизнес-операций (добавление/удаление)
  //    отделена от побочных эффектов (сохранение в хранилище).
  // 2. Централизация: все изменения bookings автоматически сохраняются,
  //    не нужно помнить о сохранении в каждой функции-обработчике.
  // 3. useEffect запускается ПОСЛЕ рендера, не блокируя отрисовку UI.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      // ПОЧЕМУ? console.warn, а не console.error или throw?
      // localStorage может быть недоступен (режим инкогнито, квота превышена).
      // Предупреждение не ломает приложение, но информирует разработчика.
      console.warn("⚠️ Не удалось сохранить данные в localStorage:", error);
    }
  }, [bookings]); // ПОЧЕМУ? Зависимость [bookings]?
  // Эффект выполняется только при изменении массива bookings,
  // а не при каждом рендере компонента (например, при изменении filter).
  // Это предотвращает лишние записи в localStorage.

  // ПОЧЕМУ? Функциональное обновление setBookings(prev => ...) вместо setBookings(bookings)?
  // 1. Гарантия актуальности: prev всегда содержит последнее состояние,
  //    даже если несколько обновлений произошли подряд (batching в React).
  // 2. Избегаем замыканий: не рискуем использовать устаревшее значение bookings
  //    из замыкания обработчика события.
  function handleAddItem(newItem) {
    setBookings((prev) => [...prev, newItem]);
  }

  function handleDelete(id) {
    // ПОЧЕМУ? filter, а не splice для удаления элемента?
    // splice мутирует исходный массив, а React сравнивает ссылки на объекты.
    // Если мутировать массив, React не увидит изменений и не перерисует компонент.
    // filter возвращает НОВЫЙ массив, что триггерит перерисовку.
    setBookings((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdateBooking(id, updatedFields) {
    // ПОЧЕМУ? map с тернарным оператором, а не find + индекс?
    // 1. Не мутируем: создаем новый массив и новые объекты только для измененных элементов.
    // 2. Декларативный подход: код читается как "для каждого элемента, если id совпадает — обнови".
    // 3. Безопасность: не работаем с индексами, которые могут измениться.
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );
  }

  // ПОЧЕМУ? Фильтрация вычисляется в App, а не передается в BookingList?
  // 1. App — владелец данных (single source of truth), поэтому бизнес-логика
  //    (фильтрация, сортировка) должна жить рядом с данными.
  // 2. BookingList остается "глупым" презентационным компонентом,
  //    который только отображает то, что ему дали.
  // 3. Упрощается тестирование: логика фильтрации изолирована в родителе.
  const filteredByStatus =
    filter === "Все"
      ? bookings
      : bookings.filter((item) => item.status === filter);

  // ПОЧЕМУ? Сортировка после фильтрации, а не до?
  // Порядок операций: сначала уменьшаем набор данных (фильтр),
  // потом сортируем меньший массив — это эффективнее по производительности.
  const sortedBookings = [...filteredByStatus].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <Layout title="🏢 Бронирование помещений">
      <section className="section">
        <h2>Новая бронь</h2>
        {/* ПОЧЕМУ? Передаем bookings в форму?
            Форма проверяет пересечение времени с существующими бронями,
            поэтому ей нужен доступ ко всем данным. */}
        <BookingForm onAddItem={handleAddItem} existingBookings={bookings} />
      </section>

      <section className="section">
        <h2>🔍 Фильтр</h2>
        {/* ПОЧЕМУ? Передаем setFilter напрямую, а не обертку?
            setFilter уже имеет нужную сигнатуру (value) => void,
            создавать лишнюю функцию-обертку нет необходимости. */}
        <StatusFilter activeFilter={filter} onFilterChange={setFilter} />
      </section>

      <section className="section">
        <h2>📋 Список броней</h2>
        <BookingList
          items={sortedBookings}
          onDelete={handleDelete}
          onUpdate={handleUpdateBooking}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </section>

      <Footer />
    </Layout>
  );
}
