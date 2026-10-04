import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="container auth-shell">
        <AuthForm mode="register" />
        <aside className="auth-aside">
          <span className="eyebrow">Join E-Pharmacy</span>
          <h2>Your everyday health essentials, one click away.</h2>
          <ul>
            <li>Simple registration</li>
            <li>Fast and reliable catalog</li>
            <li>Secure order history</li>
          </ul>
          <div className="auth-aside__cross">
            <span />
            <span />
          </div>
        </aside>
      </div>
    </main>
  );
}
