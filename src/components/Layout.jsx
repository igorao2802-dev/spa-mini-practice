export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p>Профессиональный уход за вашей красотой</p>
      </header>
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
}