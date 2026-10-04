'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import type { Product } from '@/lib/types';

function MedicineCatalog() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const discount = searchParams.get('discount');

  useEffect(() => {
    const params = new URLSearchParams({ limit: '100' });
    if (discount) params.set('discount', discount);

    getProducts(`?${params.toString()}`)
      .then((response) => {
        if (response.data.length) setProducts(response.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [discount]);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products],
  );
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase().trim());
        const matchesCategory =
          category === 'All' || product.category === category;
        const matchesDiscount =
          !discount || product.discount === Number(discount);
        return matchesSearch && matchesCategory && matchesDiscount;
      }),
    [category, discount, products, search],
  );

  return (
    <main className="catalog-page">
      <section className="page-hero page-hero--catalog">
        <div className="container">
          <span className="eyebrow">Medicine catalog</span>
          <h1>Choose your medicine</h1>
          <p>Search by name or narrow the catalog by category.</p>
        </div>
      </section>

      <section className="section section--catalog">
        <div className="container">
          <div className="catalog-toolbar">
            <label className="search-field">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Search medicine"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <div className="category-tabs" aria-label="Product categories">
              {categories.map((item) => (
                <button
                  className={category === item ? 'is-active' : ''}
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-summary">
            <p>
              <strong>{filtered.length}</strong> products found
              {discount ? ` with ${discount}% discount` : ''}
            </p>
            {loading && <span>Checking live catalog…</span>}
          </div>

          {filtered.length ? (
            <div className="product-grid product-grid--catalog">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h2>No medicine found</h2>
              <p>Try another product name or category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function MedicinePage() {
  return (
    <Suspense fallback={<main className="page-loading">Loading catalog…</main>}>
      <MedicineCatalog />
    </Suspense>
  );
}
