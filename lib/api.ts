import type {
  AuthResponse,
  CollectionResponse,
  CustomerReview,
  Pharmacy,
  Product,
} from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      signal: controller.signal,
    });

    const payload = (await response.json()) as T & {
      message?: string | string[];
    };

    if (!response.ok) {
      const message = Array.isArray(payload.message)
        ? payload.message.join(', ')
        : payload.message;
      throw new Error(message || 'Request failed');
    }

    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getProducts(query = '') {
  return request<CollectionResponse<Product>>(`/products${query}`);
}

export function getProduct(id: string) {
  return request<{ data: Product }>(`/products/${id}`);
}

export function getPharmacies(query = '') {
  return request<CollectionResponse<Pharmacy>>(`/stores${query}`);
}

export function getNearestPharmacies() {
  return request<CollectionResponse<Pharmacy>>('/stores/nearest?limit=6');
}

export function getCustomerReviews() {
  return request<CollectionResponse<CustomerReview>>('/customer-reviews');
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(body: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  return request<AuthResponse>('/user/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function authorizedRequest<T>(path: string, init?: RequestInit) {
  const accessToken = window.localStorage.getItem('epharmacy_access_token');

  return request<T>(path, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken ?? ''}`,
    },
  });
}

export function saveSession(session: AuthResponse) {
  window.localStorage.setItem('epharmacy_access_token', session.accessToken);
  window.localStorage.setItem('epharmacy_refresh_token', session.refreshToken);
  window.localStorage.setItem('epharmacy_user', JSON.stringify(session.user));
  window.dispatchEvent(new Event('epharmacy-auth-change'));
}
