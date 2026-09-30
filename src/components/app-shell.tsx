"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "Properties", href: "/properties", icon: "▣" },
  { label: "Leads", href: "/leads", icon: "◌" },
  { label: "Marketing", href: "/marketing", icon: "✦" },
  { label: "Calendar", href: "/calendar", icon: "◫" },
  { label: "Tasks", href: "/tasks", icon: "✓" },
  { label: "Documents", href: "/documents", icon: "▤" },
  { label: "Analytics", href: "/analytics", icon: "↗" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <main className="app-shell">
      <aside className="sidebar-panel">
        <div>
          <Link className="brand-block brand-link" href="/dashboard" aria-label="Realtor AI Office, ir al dashboard">
            <div className="brand-mark" aria-hidden="true">R</div>
            <div><h1>Realtor AI Office</h1></div>
          </Link>

          <nav className="nav-list" aria-label="Navegación principal">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "nav-item active" : "nav-item"}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Link className="profile-summary profile-link" href="/settings" aria-label="Perfil de Carlos M., abrir configuración">
          <div className="profile-avatar" aria-hidden="true">CM</div>
          <div>
            <p className="profile-name">Carlos M.</p>
            <p className="profile-role">Real Estate Agent</p>
          </div>
        </Link>
      </aside>

      <section className="workspace-panel">
        <header className="topbar">
          <form className="search-input assistant-command" action="/assistant" method="get" role="search">
            <label className="search-icon" htmlFor="assistant-query" aria-hidden="true">✦</label>
            <input
              id="assistant-query"
              className="search-placeholder assistant-input"
              type="search"
              name="q"
              placeholder="Ask Chispita anything..."
              aria-label="Escribe una pregunta para Chispita"
            />
            <button className="command-submit" type="submit" aria-label="Abrir asistente">
              ↵
            </button>
          </form>
          <div className="topbar-actions">
            <button type="button" className="icon-button upcoming-control" aria-label="Micrófono, próximamente" title="Micrófono próximamente" disabled>
              ◌
            </button>
            <div className="utility-wrap">
              <button
                type="button"
                className="icon-button"
                aria-label="Notificaciones"
                aria-expanded={notificationOpen}
                onClick={() => setNotificationOpen((open) => !open)}
              >
                🔔
              </button>
              {notificationOpen && (
                <div className="utility-popover" role="status">
                  <strong>Notificaciones</strong>
                  <p>No tienes notificaciones nuevas.</p>
                </div>
              )}
            </div>
            <div className="utility-wrap">
              <button
                type="button"
                className="icon-button"
                aria-label="Ayuda"
                aria-expanded={helpOpen}
                onClick={() => setHelpOpen((open) => !open)}
              >
                ?
              </button>
              {helpOpen && (
                <div className="utility-popover" role="status">
                  <strong>Centro de ayuda</strong>
                  <p>La ayuda del producto estará disponible en una próxima etapa.</p>
                </div>
              )}
            </div>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}