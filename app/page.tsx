'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PharmacyCard } from '@/components/pharmacy-card';
import { ProductCard } from '@/components/product-card';
import {
  getCustomerReviews,
  getNearestPharmacies,
  getProducts,
} from '@/lib/api';
import { demoPharmacies, demoProducts, demoReviews } from '@/lib/demo-data';
import type { CustomerReview, Pharmacy, Product } from '@/lib/types';

const offers = [
  {
    eyebrow: 'Huge sale',
    value: '70%',
    text: 'off selected medicines',
    href: '/medicine?discount=70',
    tone: 'mint',
  },
  {
    eyebrow: 'Secure delivery',
    value: '100%',
    text: 'care from store to door',
    href: '/medicine-store',
    tone: 'cream',
  },
  {
    eyebrow: 'Weekly offer',
    value: '35%',
    text: 'off healthcare essentials',
    href: '/medicine?discount=35',
    tone: 'green',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(demoPharmacies);
  const [reviews, setReviews] = useState<CustomerReview[]>(demoReviews);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    Promise.all([
      getProducts('?limit=6'),
      getNearestPharmacies(),
      getCustomerReviews(),
    ])
      .then(([productResponse, pharmacyResponse, reviewResponse]) => {
        if (productResponse.data.length) setProducts(productResponse.data);
        if (pharmacyResponse.data.length) setPharmacies(pharmacyResponse.data);
        if (reviewResponse.data.length) setReviews(reviewResponse.data);
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero">
          <div className="hero__copy">
            <span className="eyebrow">Your health, our priority</span>
            <h1>
              Your medication,
              <br /> delivered
            </h1>
            <p>
              Say goodbye to all your healthcare worries with us. Browse,
              compare and order the essentials you need in a few simple steps.
            </p>
            <div className="hero__actions">
              <Link className="button button--light" href="/medicine">
                Shop medicine
              </Link>
              <Link
                className="text-link text-link--light"
                href="/medicine-store"
              >
                Find a pharmacy <span>→</span>
              </Link>
            </div>
            <div className="hero__trust">
              <div className="avatar-stack" aria-hidden="true">
                <span>MT</span>
                <span>SR</span>
                <span>NC</span>
              </div>
              <p>
                <strong>4.9/5</strong>
                Trusted by our customers
              </p>
            </div>
          </div>

          <div className="hero__visual" aria-label="Featured medicines">
            <span className="hero__spark hero__spark--one">✦</span>
            <span className="hero__spark hero__spark--two">✦</span>
            <div className="medicine-orbit medicine-orbit--one">
              <Image
                src={products[0]?.photo ?? demoProducts[0].photo}
                alt=""
                width={124}
                height={124}
                unoptimized
              />
            </div>
            <div className="medicine-orbit medicine-orbit--two">
              <Image
                src={products[1]?.photo ?? demoProducts[1].photo}
                alt=""
                width={106}
                height={106}
                unoptimized
              />
            </div>
            <div className="hero-box">
              <div className="hero-box__cross">
                <span />
                <span />
              </div>
              <span>E-Pharmacy</span>
              <small>Care in every order</small>
            </div>
            <div className="hero-pill hero-pill--one" />
            <div className="hero-pill hero-pill--two" />
          </div>
        </div>
      </section>

      <section className="section offers-section">
        <div className="container offer-grid">
          {offers.map((offer, index) => (
            <article
              className={`offer-card offer-card--${offer.tone}`}
              key={offer.eyebrow}
            >
              <span className="offer-card__number">0{index + 1}</span>
              <div>
                <p>{offer.eyebrow}</p>
                <strong>{offer.value}</strong>
                <span>{offer.text}</span>
              </div>
              <Link href={offer.href}>Shop now →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow eyebrow--green">Daily essentials</span>
              <h2>Popular medicine</h2>
              <p>Thoughtfully selected healthcare products for every day.</p>
            </div>
            <Link className="text-link" href="/medicine">
              View all medicine <span>→</span>
            </Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {!apiOnline && (
            <p className="demo-notice">
              Preview data is shown. Start the backend to load the live catalog.
            </p>
          )}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow eyebrow--green">Near you</span>
              <h2>Your nearest medicine store</h2>
              <p>Reliable pharmacies ready to help in your city.</p>
            </div>
            <Link className="text-link" href="/medicine-store">
              View all stores <span>→</span>
            </Link>
          </div>
          <div className="pharmacy-grid">
            {pharmacies.slice(0, 6).map((pharmacy) => (
              <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container medicine-cta">
          <div className="medicine-cta__copy">
            <span className="eyebrow">Simple online ordering</span>
            <h2>Add the medicines you need online now</h2>
            <p>
              Browse the catalog, add products to your cart and complete your
              order when it suits you.
            </p>
            <Link className="button button--light" href="/medicine">
              Order medicine
            </Link>
          </div>
          <div className="medicine-cta__visual">
            <div className="cta-phone">
              <span className="cta-phone__speaker" />
              <div className="cta-phone__header">
                <div className="mini-logo">+</div>
                <span>My cart</span>
              </div>
              {products.slice(0, 2).map((product) => (
                <div className="cta-phone__item" key={product._id}>
                  <Image
                    src={product.photo}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <span>৳{product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="cta-phone__button">Checkout</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="section-heading section-heading--center">
            <div>
              <span className="eyebrow eyebrow--green">Customer stories</span>
              <h2>Reviews</h2>
              <p>What people say about their E-Pharmacy experience.</p>
            </div>
          </div>
          <div className="review-grid">
            {reviews.slice(0, 3).map((review) => (
              <article className="review-card" key={review._id}>
                <div className="review-card__avatar">
                  {review.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="review-card__stars">★★★★★</div>
                <p>“{review.testimonial}”</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
