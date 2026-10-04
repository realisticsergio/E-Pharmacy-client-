import Link from 'next/link';

import type { Pharmacy } from '@/lib/types';

export function PharmacyCard({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <article className="pharmacy-card">
      <div className="pharmacy-card__heading">
        <div className="pharmacy-symbol" aria-hidden="true">
          <span />
          <span />
        </div>
        <div>
          <h3>{pharmacy.name}</h3>
          <span
            className={`status-badge ${
              pharmacy.status === 'OPEN' ? 'is-open' : 'is-closed'
            }`}
          >
            {pharmacy.status === 'OPEN' ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      <div className="pharmacy-card__details">
        <p>
          <span aria-hidden="true">⌖</span>
          {pharmacy.address}, {pharmacy.city}
        </p>
        <p>
          <span aria-hidden="true">☎</span>
          {pharmacy.phone}
        </p>
      </div>
      <div className="pharmacy-card__footer">
        <span>★ {pharmacy.rating.toFixed(1)}</span>
        <Link href={`/medicine-store/${pharmacy._id}`}>Visit store</Link>
      </div>
    </article>
  );
}
