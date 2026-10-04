'use client';

import Image from 'next/image';
import Link from 'next/link';

import { authorizedRequest } from '@/lib/api';
import type { CartItem, Product } from '@/lib/types';

function readCart(): CartItem[] {
  try {
    return JSON.parse(
      window.localStorage.getItem('epharmacy_demo_cart') ?? '[]',
    ) as CartItem[];
  } catch {
    return [];
  }
}

export function ProductCard({ product }: { product: Product }) {
  const addToCart = async () => {
    const cart = readCart();
    const existing = cart.find((item) => item.product._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    window.localStorage.setItem('epharmacy_demo_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('epharmacy-cart-change'));

    if (
      !product._id.startsWith('demo-') &&
      window.localStorage.getItem('epharmacy_access_token')
    ) {
      try {
        await authorizedRequest('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({
            productId: product._id,
            quantity: existing?.quantity ?? 1,
          }),
        });
      } catch {
        // The local cart keeps the visual demo usable when the API is offline.
      }
    }
  };

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return (
    <article className="product-card">
      <Link className="product-card__image" href={`/medicine/${product._id}`}>
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <Image
          src={product.photo}
          alt={product.name}
          width={280}
          height={220}
          unoptimized
        />
      </Link>
      <div className="product-card__body">
        <div>
          <h3>{product.name}</h3>
          <p>{product.supplier || product.brand}</p>
        </div>
        <div className="product-card__price">
          <strong>৳{discountedPrice.toFixed(2)}</strong>
          {product.discount > 0 && <s>৳{product.price.toFixed(2)}</s>}
        </div>
        <div className="product-card__actions">
          <button type="button" onClick={addToCart}>
            Add to cart
          </button>
          <Link href={`/medicine/${product._id}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}
