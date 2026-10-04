'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/product-card';
import { getProduct } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import type { CartItem, Product } from '@/lib/types';

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const fallback =
    demoProducts.find((item) => item._id === params.id) ?? demoProducts[0];
  const [product, setProduct] = useState<Product>(fallback);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!params.id.startsWith('demo-')) {
      getProduct(params.id)
        .then((response) => setProduct(response.data))
        .catch(() => undefined);
    }
  }, [params.id]);

  const addToCart = () => {
    let cart: CartItem[] = [];
    try {
      cart = JSON.parse(
        window.localStorage.getItem('epharmacy_demo_cart') ?? '[]',
      ) as CartItem[];
    } catch {
      cart = [];
    }

    const existing = cart.find((item) => item.product._id === product._id);
    if (existing) existing.quantity += quantity;
    else cart.push({ product, quantity });

    window.localStorage.setItem('epharmacy_demo_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('epharmacy-cart-change'));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="details-page">
      <div className="container breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/medicine">Medicine</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="container product-details">
        <div className="product-details__image">
          {product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
          <Image
            src={product.photo}
            alt={product.name}
            width={520}
            height={480}
            unoptimized
            priority
          />
        </div>
        <div className="product-details__copy">
          <span className="category-label">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-details__supplier">
            Supplied by {product.supplier || product.brand}
          </p>
          <div className="rating-row">
            <span>★★★★★</span>
            <strong>{product.rating.toFixed(1)}</strong>
          </div>
          <div className="product-details__price">
            <strong>৳{product.price.toFixed(2)}</strong>
            <span>{product.stock} items available</span>
          </div>
          <p className="product-details__description">
            {product.description ??
              'Product information and everyday healthcare support. Follow the package instructions and consult a healthcare professional when necessary.'}
          </p>

          <div className="purchase-row">
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((value) => Math.min(product.stock, value + 1))
                }
              >
                +
              </button>
            </div>
            <button
              className="button button--green"
              type="button"
              onClick={addToCart}
            >
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>

          <div className="product-benefits">
            <div>
              <span>✓</span>
              Secure checkout
            </div>
            <div>
              <span>✓</span>
              Verified pharmacy stock
            </div>
            <div>
              <span>✓</span>
              Easy cart management
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>You may also like</h2>
              <p>More everyday healthcare essentials.</p>
            </div>
          </div>
          <div className="product-grid">
            {demoProducts.slice(1, 4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
