import Link from "next/link";
import { notFound } from "next/navigation";

const leads = {
  "juan-perez": { name: "Juan Pérez", source: "Instagram" },
  "maria-lopez": { name: "María López", source: "Formulario" },
  "david-rodriguez": { name: "David Rodriguez", source: "Facebook" },
  "sofia-martinez": { name: "Sofia Martínez", source: "Instagram" },
};

export function generateStaticParams() {
  return Object.keys(leads).map((slug) => ({ slug }));
}

export default async function LeadDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lead = leads[slug as keyof typeof leads];

  if (!lead) {
    notFound();
  }

  return (
    <section className="foundation-page" aria-labelledby="lead-title">
      <header className="foundation-header">
        <div>
          <p className="eyebrow">Lead foundation · {lead.source}</p>
          <h1 id="lead-title">{lead.name}</h1>
          <p>Prospective client</p>
        </div>
        <Link className="text-button foundation-action" href="/leads">All Leads</Link>
      </header>
      <div className="panel foundation-content">
        <span className="foundation-mark" aria-hidden="true">◌</span>
        <div>
          <h2>Lead detail foundation</h2>
          <p>This route is ready for a future CRM record. Contact history and follow-up workflows are not connected.</p>
          <span className="foundation-status">Reference: {slug}</span>
        </div>
      </div>
    </section>
  );
}