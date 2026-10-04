import Link from 'next/link';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`logo ${light ? 'logo--light' : ''}`} href="/">
      <span className="logo__mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span>E-Pharmacy</span>
    </Link>
  );
}
