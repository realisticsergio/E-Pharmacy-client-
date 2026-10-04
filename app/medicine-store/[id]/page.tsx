'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ProductCard } from '@/components/product-card';
import { demoPharmacies, demoProducts } from '@/lib/demo-data';

export default function PharmacyDetailsPage() {
  const params = useParams<{ id: string }>();
  const pharmacy =
    demoPharmacies.find((item) => item._id === params.id) ?? demoPharmacies[0];

  return (
    <main>
      <section className="page-hero page-hero--store-detail">
        <div className="container store-profile">
          <div className="store-profile__symbol" aria-hidden="true">
            <span />
            <span />
          </div>
          <div>
            <span className="eyebrow">Verified medicine store</span>
            <h1>{pharmacy.name}</h1>
            <p>
              {pharmacy.address}, {pharmacy.city}
            </p>
            <div className="store-profile__meta">
              <span className="status-badge is-open">Open</span>
              <span>★ {pharmacy.rating.toFixed(1)}</span>
              <span>{pharmacy.phone}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Available medicine</h2>
              <p>Popular products available through our catalog.</p>
            </div>
            <Link className="text-link" href="/medicine">
              Browse catalog <span>→</span>
            </Link>
          </div>
          <div className="product-grid">
            {demoProducts.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
