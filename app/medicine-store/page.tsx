'use client';

import { useEffect, useMemo, useState } from 'react';

import { PharmacyCard } from '@/components/pharmacy-card';
import { getPharmacies } from '@/lib/api';
import { demoPharmacies } from '@/lib/demo-data';
import type { Pharmacy } from '@/lib/types';

export default function MedicineStorePage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(demoPharmacies);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPharmacies('?limit=100')
      .then((response) => {
        if (response.data.length) setPharmacies(response.data);
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();
    return pharmacies.filter((pharmacy) =>
      `${pharmacy.name} ${pharmacy.city} ${pharmacy.address}`
        .toLowerCase()
        .includes(value),
    );
  }, [pharmacies, search]);

  return (
    <main>
      <section className="page-hero page-hero--stores">
        <div className="container page-hero__split">
          <div>
            <span className="eyebrow">Trusted local partners</span>
            <h1>Medicine stores</h1>
            <p>
              Find a pharmacy near you, check its status and continue to the
              medicine catalog.
            </p>
          </div>
          <div className="store-hero-symbol" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="store-search">
            <label className="search-field">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Search by pharmacy, city or address"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <p>{filtered.length} stores available</p>
          </div>
          <div className="pharmacy-grid pharmacy-grid--catalog">
            {filtered.map((pharmacy) => (
              <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
