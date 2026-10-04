# E-Pharmacy Client

Responsive Next.js frontend for the E-Pharmacy learning project. The interface
is based on the supplied Figma direction and connects to the NestJS backend.

## Local setup

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Open `http://localhost:3000`.

The default API URL is `http://localhost:3001/api`. Override it with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Implemented routes

- `/` — landing page, promotions, products, pharmacies, reviews;
- `/medicine` — searchable and filterable product catalog;
- `/medicine/[id]` — product details and add-to-cart flow;
- `/medicine-store` — searchable pharmacy list;
- `/medicine-store/[id]` — pharmacy details;
- `/login` and `/register` — backend authentication forms;
- `/cart` — local preview cart and authenticated backend checkout.

Public screens use preview data when the backend is offline and automatically
replace it with API data when the server is available. Authentication and final
checkout require the backend and MongoDB.

## Quality checks

```powershell
npm.cmd run check
npm.cmd run build
```
