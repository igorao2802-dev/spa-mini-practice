// ПОЧЕМУ? Паттерн «компонент-обёртка» позволяет вынести общий каркас (шапка, структура)
// в отдельный компонент — это устраняет дублирование и упрощает изменение дизайна.
export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p>Система онлайн-бронирования помещений</p>
      </header>
      
      {/* ПОЧЕМУ? children — механизм композиции React: Layout задаёт структуру,
          а содержимое вкладывается извне. Это избавляет от копипаста на каждой странице. */}
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
}