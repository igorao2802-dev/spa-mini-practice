import { useState } from "react";
import "./App.css";
import ServiceCard from "./components/ServiceCard";
import GuestSelector from "./components/GuestSelector";
import ServiceSearch from "./components/ServiceSearch";

// ПОЧЕМУ? Данные хранятся в родителе и передаются вниз через props — это one-way data flow.
const SERVICES = [
  {
    id: 1,
    serviceName: "Большой зал",
    specialist: "Администратор",
    price: "5000 BYN",
    status: "Популярно",
  },
  {
    id: 2,
    serviceName: "Переговорная №2",
    specialist: "ИТ-отдел",
    price: "1000 BYN",
    status: "Свободно",
  },
  {
    id: 3,
    serviceName: "Коворкинг",
    specialist: "Общий",
    price: "500 BYN",
    status: null,
  },
];

export default function App() {
  const [query, setQuery] = useState("");

  // ПОЧЕМУ? Фильтрация в родителе позволяет централизованно управлять отображением списка.
  const filteredServices = SERVICES.filter(
    (s) =>
      query.trim() === "" ||
      s.serviceName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏢 Система онлайн-бронирования помещений</h1>
      </header>
      <main className="app-main">
        <section className="section">
          <h2>👥 Участники</h2>
          <GuestSelector />
        </section>
        <section className="section">
          <h2>🔍 Поиск</h2>
          <ServiceSearch value={query} onChange={setQuery} />
        </section>
        <section className="section">
          <h2>📋 Помещения</h2>
          {filteredServices.length === 0 ? (
            <p>😔 Ничего не найдено</p>
          ) : (
            <div className="course-grid">
              {/* ПОЧЕМУ? key={service.id} помогает React эффективно обновлять DOM. */}
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  serviceName={service.serviceName}
                  specialist={service.specialist}
                  price={service.price}
                  badge={service.status}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
