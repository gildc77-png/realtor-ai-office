import Link from "next/link";

export default function NewPropertyPage() {
  return (
    <section className="foundation-page" aria-labelledby="new-property-title">
      <header className="foundation-header">
        <div>
          <p className="eyebrow">Properties</p>
          <h1 id="new-property-title">Add Property</h1>
          <p>Prepare a new listing for your workspace.</p>
        </div>
        <Link className="text-button foundation-action" href="/properties">Back to Properties</Link>
      </header>
      <div className="panel foundation-content">
        <span className="foundation-mark" aria-hidden="true">+</span>
        <div>
          <h2>Property setup is coming next</h2>
          <p>This route is ready for the future property creation workflow. No record has been created.</p>
          <span className="foundation-status">Foundation surface</span>
        </div>
      </div>
    </section>
  );
}