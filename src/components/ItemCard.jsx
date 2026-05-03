// ПОЧЕМУ? Деструктуризация props делает код короче и сразу показывает контракт компонента.
export default function ServiceCard({ serviceName, specialist, price, badge }) {
  return (
    <div className="service-card">
      {/* ПОЧЕМУ? Условный рендеринг бейджа: показываем только если статус передан. */}
      {badge && <span className={`badge ${badge.toLowerCase()}`}>{badge}</span>}
      <h3>{serviceName}</h3>
      <p>{specialist}</p>
      <p>{price}</p>
    </div>
  );
}