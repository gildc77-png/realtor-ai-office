import Link from "next/link";

const kpis = [
  { label: "Propiedades activas", value: "12", trend: "↑ 20%", href: "/properties" },
  { label: "Nuevos leads", value: "28", trend: "↑ 35%", href: "/leads" },
  { label: "Citas esta semana", value: "8", trend: "↑ 60%", href: "/calendar" },
  { label: "Vistas en tus propiedades", value: "4,320", trend: "↑ 45%", href: "/analytics" },
];

const propertyCards = [
  { name: "Brickell Heights #3401", price: "$850,000", status: "Just Listed", slug: "brickell-heights-3401" },
  { name: "Edgewater Residences #1805", price: "$1,250,000", status: "Open House", slug: "edgewater-residences-1805" },
  { name: "Coconut Grove", price: "$2,480,000", status: "Coming Soon", slug: "coconut-grove" },
  { name: "Downtown Miami #2108", price: "$695,000", status: "Price Reduced", slug: "downtown-miami-2108" },
];

const tasks = [
  { title: "Responder a 3 nuevos leads", context: "2 son prioridad", time: "9:00 AM" },
  { title: "Confirmar showing con Jennifer", context: "Brickell Heights #3401", time: "10:00 AM" },
  { title: "Publicar contenido de Open House", context: "Edgewater Residences", time: "11:00 AM" },
  { title: "Enviar follow-up a Carlos R.", context: "Interesado en Coconut Grove", time: "2:00 PM" },
  { title: "Revisar documentos de offer", context: "Downtown Miami #2108", time: "4:00 PM" },
];

const leads = [
  { initials: "JP", name: "Juan Pérez", source: "Instagram", time: "Hace 10 min", slug: "juan-perez" },
  { initials: "ML", name: "María López", source: "Formulario", time: "Hace 1 hora", slug: "maria-lopez" },
  { initials: "DR", name: "David Rodriguez", source: "Facebook", time: "Hace 3 horas", slug: "david-rodriguez" },
  { initials: "SM", name: "Sofia Martínez", source: "Instagram", time: "Hace 5 horas", slug: "sofia-martinez" },
];

const publications = [
  { title: "Just Listed — Brickell Heights", status: "Programada", time: "11:00 AM" },
  { title: "Open House — Edgewater", status: "Borrador", time: "10:00 AM" },
  { title: "Price Reduced — Downtown", status: "Programada", time: "3:00 PM" },
  { title: "Just Sold — Coral Gables", status: "Borrador", time: "Friday" },
];

const calendarEvents = [
  { time: "9:00 AM", title: "Revisión de nuevos leads", duration: "30 min" },
  { time: "10:00 AM", title: "Showing — Brickell Heights #3401", duration: "1 hora" },
  { time: "12:00 PM", title: "Almuerzo", duration: "1 hora" },
  { time: "2:00 PM", title: "Llamada con cliente — María López", duration: "30 min" },
  { time: "4:00 PM", title: "Revisar documentos de offer", duration: "1 hora" },
  { time: "5:00 PM", title: "Plan de contenido semanal", duration: "30 min" },
];

export function DashboardShell() {
  return (
    <div className="dashboard-content">
        <div className="board-grid">
          <div className="hero-panel panel">
            <div className="agent-portrait-wrap">
              <div className="agent-portrait" aria-hidden="true">
                <span>C</span>
              </div>
            </div>

            <div className="hero-copy">
              <h2>Hola, Carlos 👋</h2>
              <p>Soy Chispita, tu asistente de Real Estate.</p>
              <p className="question-text">¿En qué te ayudo hoy?</p>

              <div className="prompt-grid">
                <Link className="quick-action" href="/properties/new">
                  <span className="quick-icon">✦</span>
                  <span>Crear un nuevo listing</span>
                </Link>
                <Link className="quick-action" href="/marketing">
                  <span className="quick-icon">◌</span>
                  <span>Publicar en redes sociales</span>
                </Link>
                <Link className="quick-action" href="/leads">
                  <span className="quick-icon">▣</span>
                  <span>Revisar nuevos leads</span>
                </Link>
                <Link className="quick-action" href="/calendar">
                  <span className="quick-icon">✓</span>
                  <span>¿Qué tengo hoy?</span>
                </Link>
              </div>
            </div>
          </div>

          <aside className="feature-panel panel">
            <div className="feature-header">
              <div>
                <p className="eyebrow">Nuevo listing</p>
                <h3>a punto de publicarse</h3>
              </div>
              <Link className="action-button" href="/properties/brickell-heights-3401">
                Revisar y publicar →
              </Link>
            </div>

            <div className="listing-preview" aria-hidden="true">
              <div className="listing-overlay">
                <div className="listing-meta">300 Biscayne Blvd #4001</div>
                <div className="listing-location">Miami, FL</div>
              </div>
            </div>
          </aside>
        </div>

        <section className="stats-grid" aria-label="Key performance indicators">
          {kpis.map((item) => (
            <Link key={item.label} className="stat-card panel stat-link" href={item.href}>
              <div className="stat-row">
                <div className="stat-icon" aria-hidden="true">
                  {item.label.includes("Propiedades") ? "▣" : item.label.includes("Leads") ? "◌" : item.label.includes("Citas") ? "☰" : "📊"}
                </div>
                <span className="trend-badge">{item.trend}</span>
              </div>
              <div className="stat-value">{item.value}</div>
              <p>{item.label}</p>
            </Link>
          ))}
        </section>

        <section className="property-section">
          <div className="listing-column panel">
            <div className="section-header">
              <h3>Propiedades recientes</h3>
              <Link className="text-button" href="/properties">Ver todas →</Link>
            </div>

            <div className="property-grid">
              {propertyCards.map((card) => (
                <Link key={card.name} className="property-card property-link" href={`/properties/${card.slug}`} aria-label={`${card.name}, ${card.price}`}>
                  <div className="property-image property-image-sky" aria-hidden="true">
                    <div className="property-badge">{card.status}</div>
                    <div className="property-favorite">♥</div>
                  </div>
                  <div className="property-info">
                    <div className="property-price">{card.price}</div>
                    <div className="property-name">{card.name}</div>
                    <div className="property-location">Miami, FL</div>
                    <div className="property-meta">
                      <span>3 Beds</span>
                      <span>2 Baths</span>
                      <span>1,400 sqft</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="task-panel panel">
            <div className="section-header">
              <h3>Tareas de hoy</h3>
              <Link className="text-button" href="/tasks">Ver todas →</Link>
            </div>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.title} className="task-item">
                  <input type="checkbox" defaultChecked={task.title.includes("lead") || task.title.includes("Carlos") ? true : false} />
                  <div className="task-copy">
                    <strong>{task.title}</strong>
                    <small>{task.context}</small>
                  </div>
                  <span className="task-time">{task.time}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="bottom-grid">
          <div className="panel lead-panel">
            <div className="section-header">
              <h3>Nuevos leads</h3>
              <Link className="text-button" href="/leads">Ver todos →</Link>
            </div>
            <ul className="lead-list">
              {leads.map((lead) => (
                <li key={lead.name}>
                  <Link className="lead-item lead-link" href={`/leads/${lead.slug}`} aria-label={`${lead.name}, lead de ${lead.source}`}>
                    <div className="lead-pill">{lead.initials}</div>
                    <div className="lead-copy">
                      <strong>{lead.name}</strong>
                      <span>{lead.source}</span>
                    </div>
                    <div className="lead-meta">
                      <span>{lead.time}</span>
                      <span className="lead-status">Nuevo</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel queue-panel">
            <div className="section-header">
              <h3>Próximas publicaciones</h3>
              <Link className="text-button" href="/marketing">Ver más →</Link>
            </div>
            <ul className="publication-list">
              {publications.map((item) => (
                <li key={item.title} className="publication-item">
                  <div className="publication-thumb" aria-hidden="true" />
                  <div className="publication-copy">
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>
                  <div className="publication-status">{item.status}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel calendar-panel">
            <div className="section-header">
              <h3>Calendario</h3>
              <Link className="text-button" href="/calendar">Ver mes →</Link>
            </div>
            <div className="calendar-label">Miércoles, 30 de septiembre de 2026</div>
            <ul className="calendar-list">
              {calendarEvents.map((event) => (
                <li key={event.title} className="calendar-item">
                  <div className="calendar-time">{event.time}</div>
                  <div className="calendar-copy">
                    <strong>{event.title}</strong>
                    <small>{event.duration}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
    </div>
  );
}
