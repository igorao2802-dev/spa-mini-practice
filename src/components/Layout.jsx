export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p>Профессиональный уход за вашей красотой</p>
      </header>
      <main className="layout__main">
        {/* ПОЧЕМУ children? Это механизм композиции React.
            Layout задаёт каркас приложения (шапку и основную область),
            а содержимое (форма, фильтр, список) вкладывается снаружи.
            Это избавляет от копипаста общей структуры и позволяет
            легко менять layout всего приложения в одном месте. */}
        {children}
      </main>
    </div>
  );
}