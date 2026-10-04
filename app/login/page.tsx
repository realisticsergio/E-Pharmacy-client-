import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="container auth-shell">
        <AuthForm mode="login" />
        <aside className="auth-aside">
          <span className="eyebrow">Healthcare made simple</span>
          <h2>Everything you need in one trusted place.</h2>
          <ul>
            <li>Browse verified medicine</li>
            <li>Find nearby pharmacies</li>
            <li>Manage your cart online</li>
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
