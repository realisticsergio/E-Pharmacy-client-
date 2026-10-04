'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState, useSyncExternalStore } from 'react';

import { authorizedRequest } from '@/lib/api';
import type { CartItem } from '@/lib/types';

function readCartSnapshot() {
  return window.localStorage.getItem('epharmacy_demo_cart') ?? '[]';
}

function readCart(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

function subscribeToCart(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('epharmacy-cart-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('epharmacy-cart-change', callback);
  };
}

export default function CartPage() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    readCartSnapshot,
    () => '[]',
  );
  const items = useMemo(() => readCart(cartSnapshot), [cartSnapshot]);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const persist = (nextItems: CartItem[]) => {
    window.localStorage.setItem(
      'epharmacy_demo_cart',
      JSON.stringify(nextItems),
    );
    window.dispatchEvent(new Event('epharmacy-cart-change'));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    persist(
      items
        .map((item) =>
          item.product._id === productId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const checkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;
    const accessToken = window.localStorage.getItem('epharmacy_access_token');

    if (!accessToken) {
      setMessage('Please log in before completing the order.');
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setMessage('');

    try {
      await authorizedRequest('/cart/checkout', {
        method: 'POST',
        body: JSON.stringify({
          name: String(form.get('name')),
          email: String(form.get('email')),
          phone: String(form.get('phone')),
          address: String(form.get('address')),
          paymentMethod: String(form.get('paymentMethod')),
        }),
      });
      persist([]);
      setMessage('Order created successfully. Thank you!');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Checkout is unavailable',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="cart-page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <span className="eyebrow">Your order</span>
          <h1>Cart</h1>
        </div>
      </section>

      <section className="section">
        <div className="container cart-layout">
          <div className="cart-panel">
            <div className="cart-panel__heading">
              <h2>Your products</h2>
              <span>{items.length} items</span>
            </div>

            {items.length ? (
              <div className="cart-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.product._id}>
                    <div className="cart-item__image">
                      <Image
                        src={item.product.photo}
                        alt={item.product.name}
                        width={92}
                        height={92}
                        unoptimized
                      />
                    </div>
                    <div className="cart-item__main">
                      <h3>{item.product.name}</h3>
                      <p>{item.product.supplier}</p>
                      <strong>
                        ৳{(item.product.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state empty-state--cart">
                <span>🛒</span>
                <h2>Your cart is empty</h2>
                <p>Add medicine from the catalog to see it here.</p>
                <Link className="button button--green" href="/medicine">
                  Browse medicine
                </Link>
              </div>
            )}
          </div>

          <form className="checkout-panel" onSubmit={checkout}>
            <h2>Order details</h2>
            <label>
              Name
              <input
                name="name"
                placeholder="Olena Kovalenko"
                minLength={2}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="olena@example.com"
                required
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                type="tel"
                placeholder="+380501234567"
                required
              />
            </label>
            <label>
              Delivery address
              <textarea
                name="address"
                placeholder="Street, building, apartment, city"
                minLength={5}
                required
              />
            </label>
            <fieldset>
              <legend>Payment</legend>
              <label className="radio-card">
                <input
                  name="paymentMethod"
                  type="radio"
                  value="cash_on_delivery"
                  defaultChecked
                />
                <span>Cash on delivery</span>
              </label>
              <label className="radio-card">
                <input name="paymentMethod" type="radio" value="bank" />
                <span>Bank payment</span>
              </label>
            </fieldset>
            <div className="checkout-total">
              <span>Total</span>
              <strong>৳{total.toFixed(2)}</strong>
            </div>
            {message && <div className="form-message">{message}</div>}
            <button
              className="button button--green button--wide"
              disabled={!items.length || submitting}
            >
              {submitting ? 'Creating order…' : 'Place order'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
