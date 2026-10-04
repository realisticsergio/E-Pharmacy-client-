import Link from 'next/link';

import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo light />
          <p>
            Get the medicine you need without leaving home. Simple, reliable and
            always close to you.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/medicine">Medicine</Link>
          <Link href="/medicine-store">Medicine store</Link>
        </nav>

        <div className="footer__socials" aria-label="Social media">
          <a href="#" aria-label="Facebook">
            f
          </a>
          <a href="#" aria-label="Instagram">
            ◎
          </a>
          <a href="#" aria-label="YouTube">
            ▶
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© E-Pharmacy 2026. All rights reserved.</span>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  );
}
