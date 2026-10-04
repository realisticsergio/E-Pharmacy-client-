'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { login, register, saveSession } from '@/lib/api';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const session =
        mode === 'login'
          ? await login(String(form.get('email')), String(form.get('password')))
          : await register({
              name: String(form.get('name')),
              email: String(form.get('email')),
              phone: String(form.get('phone')),
              password: String(form.get('password')),
            });
      saveSession(session);
      router.push('/');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to complete the request',
      );
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__heading">
        <span className="eyebrow eyebrow--green">Welcome to E-Pharmacy</span>
        <h1>{isLogin ? 'Log in to your account' : 'Create your account'}</h1>
        <p>
          {isLogin
            ? 'Access your cart and continue shopping.'
            : 'Register to save your cart and place an order.'}
        </p>
      </div>

      {!isLogin && (
        <label>
          Full name
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Olena Kovalenko"
            minLength={2}
            required
          />
        </label>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="olena@example.com"
          required
        />
      </label>
      {!isLogin && (
        <label>
          Phone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+380501234567"
            pattern="\+?[1-9][0-9]{9,14}"
            required
          />
        </label>
      )}
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </label>

      {error && <div className="form-error">{error}</div>}

      <button className="button button--green button--wide" disabled={loading}>
        {loading ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
      </button>

      <p className="auth-form__switch">
        {isLogin ? 'Do not have an account?' : 'Already have an account?'}{' '}
        <Link href={isLogin ? '/register' : '/login'}>
          {isLogin ? 'Register' : 'Log in'}
        </Link>
      </p>
    </form>
  );
}
