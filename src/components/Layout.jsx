import Footer from "./Footer";
export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p>Система онлайн-записи на услуги</p>
      </header>
      
      {/* ПОЧЕМУ? children — это "слот" для основного контента (формы и списки). */}
      <main className="layout__main">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}