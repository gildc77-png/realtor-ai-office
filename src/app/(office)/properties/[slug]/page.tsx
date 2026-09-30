import Link from "next/link";
import { notFound } from "next/navigation";

const properties = {
  "brickell-heights-3401": { name: "Brickell Heights #3401", price: "$850,000", status: "Just Listed" },
  "edgewater-residences-1805": { name: "Edgewater Residences #1805", price: "$1,250,000", status: "Open House" },
  "coconut-grove": { name: "Coconut Grove", price: "$2,480,000", status: "Coming Soon" },
  "downtown-miami-2108": { name: "Downtown Miami #2108", price: "$695,000", status: "Price Reduced" },
};

export function generateStaticParams() {
  return Object.keys(properties).map((slug) => ({ slug }));
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties[slug as keyof typeof properties];

  if (!property) {
    notFound();
  }

  return (
    <section className="foundation-page" aria-labelledby="property-title">
      <header className="foundation-header">
        <div>
          <p className="eyebrow">Property foundation · {property.status}</p>
          <h1 id="property-title">{property.name}</h1>
          <p>Miami, FL · {property.price}</p>
        </div>
        <Link className="text-button foundation-action" href="/properties">All Properties</Link>
      </header>
      <div className="panel foundation-content">
        <span className="foundation-mark" aria-hidden="true">▣</span>
        <div>
          <h2>Property detail foundation</h2>
          <p>This demonstration route is ready to be backed by a property record. Listing changes and external publishing are not available.</p>
          <span className="foundation-status">Reference: {slug}</span>
        </div>
      </div>
    </section>
  );
}