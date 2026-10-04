'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { AuthUser, CartItem } from '@/lib/types';
import { Logo } from './logo';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/medicine', label: 'Medicine' },
  { href: '/medicine-store', label: 'Medicine store' },
];

function readCartCount() {
  try {
    const cart = JSON.parse(
      window.localStorage.getItem('epharmacy_demo_cart') ?? '[]',
    ) as CartItem[];
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
}

function readUser() {
  try {
    return JSON.parse(
      window.localStorage.getItem('epharmacy_user') ?? 'null',
    ) as AuthUser | null;
  } catch {
    return null;
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const sync = () => {
      setCartCount(readCartCount());
      setUser(readUser());
    };

    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('epharmacy-cart-change', sync);
    window.addEventListener('epharmacy-auth-change', sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('epharmacy-cart-change', sync);
      window.removeEventListener('epharmacy-auth-change', sync);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />

        <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`}>
          {navigation.map((item) => (
            <Link
              className={pathname === item.href ? 'is-active' : ''}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="cart-button" href="/cart" aria-label="Cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H7" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
            </svg>
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>

          {user ? (
            <Link className="user-pill" href="/cart">
              <span>{user.name.slice(0, 1).toUpperCase()}</span>
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <div className="auth-links">
              <Link href="/login">Log in</Link>
              <span>/</span>
              <Link href="/register">Register</Link>
            </div>
          )}

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
