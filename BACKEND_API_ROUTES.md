# BikersHub Admin — Backend API Routes

> Base URL: `http://localhost:5000/api`
> All protected routes require `Authorization: Bearer <token>` header.
> Admin-only routes (marked **[ADMIN]**) additionally verify `role === "admin"`.

---

## Auth

| Method | Route | Access | Body / Query | Description |
|--------|-------|--------|--------------|-------------|
| `POST` | `/auth/login` | Public | `{ email, password }` | Login. Returns `{ token, user: { id, name, email, role } }` |
| `POST` | `/auth/logout` | Auth | — | Invalidate token (optional if using stateless JWT) |
| `GET` | `/auth/me` | Auth | — | Returns current authenticated user |

**Login Response:**
```json
{
  "token": "eyJhb...",
  "user": {
    "id": "64abc...",
    "name": "Admin User",
    "email": "admin@bikershub.com",
    "role": "admin"
  }
}
```

---

## Products

| Method | Route | Access | Body / Query | Description |
|--------|-------|--------|--------------|-------------|
| `GET` | `/products` | Public | `?page=1&limit=20&category=&search=&minPrice=&maxPrice=&inStock=` | Paginated product list |
| `GET` | `/products/:id` | Public | — | Single product detail |
| `POST` | `/products` | **[ADMIN]** | Product body (see schema) | Create new product |
| `PUT` | `/products/:id` | **[ADMIN]** | Partial product body | Update product |
| `DELETE` | `/products/:id` | **[ADMIN]** | — | Delete product |
| `POST` | `/admin/products/bulk-import` | **[ADMIN]** | `multipart/form-data` → `file` (CSV) | Bulk import products from CSV |
| `GET` | `/admin/products/bulk-import/template` | **[ADMIN]** | — | Download blank CSV template |

**Product Schema (POST/PUT body):**
```json
{
  "name": "Racing Helmet Pro",
  "description": "Full-face motorcycle helmet with visor",
  "price": 199.99,
  "category": "Helmets",
  "brand": "RacePro",
  "stock": 50,
  "images": ["https://cdn.example.com/img1.jpg"],
  "specifications": { "weight": "1.4kg", "size": "M/L/XL" },
  "tags": ["helmet", "racing", "safety"]
}
```

**CSV Bulk Import — Expected Columns:**
```
name,description,price,category,brand,stock,images,tags
Racing Helmet Pro,"Full-face motorcycle helmet",199.99,Helmets,RacePro,50,https://cdn.example.com/img1.jpg,"helmet,racing"
```

**Bulk Import Response:**
```json
{
  "imported": 42,
  "skipped": 3,
  "errors": [
    { "row": 5, "reason": "Missing required field: price" }
  ]
}
```

---

## Orders

| Method | Route | Access | Body / Query | Description |
|--------|-------|--------|--------------|-------------|
| `GET` | `/orders` | **[ADMIN]** | `?page=1&limit=20&status=&userId=&search=&from=&to=` | Paginated orders list |
| `GET` | `/orders/:id` | **[ADMIN]** | — | Order detail with items & user info |
| `PUT` | `/orders/:id/status` | **[ADMIN]** | `{ status: "processing" \| "shipped" \| "delivered" \| "cancelled" }` | Update order status |
| `DELETE` | `/orders/:id` | **[ADMIN]** | — | Delete order (soft delete recommended) |

**Order Status Values:** `pending` · `processing` · `shipped` · `delivered` · `cancelled`

---

## Users

| Method | Route | Access | Body / Query | Description |
|--------|-------|--------|--------------|-------------|
| `GET` | `/users` | **[ADMIN]** | `?page=1&limit=20&role=&search=` | Paginated user list |
| `GET` | `/users/:id` | **[ADMIN]** | — | User detail with order history |
| `PUT` | `/users/:id` | **[ADMIN]** | `{ name?, email?, role?, isActive? }` | Update user |
| `DELETE` | `/users/:id` | **[ADMIN]** | — | Delete user account |
| `PUT` | `/users/:id/ban` | **[ADMIN]** | `{ reason? }` | Ban / unban a user |

---

## Reviews

| Method | Route | Access | Body / Query | Description |
|--------|-------|--------|--------------|-------------|
| `GET` | `/reviews/product/:productId` | Public | `?rating=&page=1&limit=20` | Reviews for a specific product |
| `GET` | `/admin/reviews` | **[ADMIN]** | `?productId=&rating=&search=&from=&to=&page=1&limit=20` | All reviews with filters |
| `DELETE` | `/reviews/:id` | **[ADMIN]** | — | Delete a review |
| `PUT` | `/reviews/:id/flag` | **[ADMIN]** | `{ reason? }` | Flag a review for investigation |
| `PUT` | `/reviews/:id/unflag` | **[ADMIN]** | — | Remove flag from review |

**GET /admin/reviews Query Params:**
| Param | Values | Description |
|-------|--------|-------------|
| `productId` | ObjectId string | Filter by product |
| `rating` | `1`–`5` | Filter by star rating |
| `search` | string | Search in reviewer name or comment |
| `from` | ISO date | Created after |
| `to` | ISO date | Created before |
| `page` | number | Pagination |
| `limit` | number | Page size |

---

## Analytics

| Method | Route | Access | Query | Description |
|--------|-------|--------|-------|-------------|
| `GET` | `/admin/analytics` | **[ADMIN]** | `?range=30` | Full analytics bundle (time series + top products) |
| `GET` | `/admin/analytics/summary` | **[ADMIN]** | — | KPI summary cards |
| `GET` | `/admin/analytics/revenue` | **[ADMIN]** | `?range=30` | Revenue time series only |
| `GET` | `/admin/analytics/orders` | **[ADMIN]** | `?range=30` | Orders time series only |
| `GET` | `/admin/analytics/customers` | **[ADMIN]** | `?range=30` | Customer growth time series |
| `GET` | `/admin/analytics/top-products` | **[ADMIN]** | `?limit=10&range=30` | Top selling products |
| `GET` | `/admin/analytics/category-breakdown` | **[ADMIN]** | `?range=30` | Revenue by category |

**GET /admin/analytics Response Schema:**
```json
{
  "timeSeries": [
    { "date": "Jan 1", "revenue": 4250, "orders": 32, "users": 8 }
  ],
  "topProducts": [
    { "name": "Racing Helmet Pro", "sales": 245, "revenue": 48755.55 }
  ],
  "summary": {
    "totalRevenue": 128450.00,
    "totalOrders": 943,
    "newUsers": 312,
    "avgOrderValue": 136.21,
    "revenueChange": "+12.4%",
    "ordersChange": "+8.1%",
    "usersChange": "+5.3%"
  }
}
```

**`range` values**: `7` (7 days) · `30` (30 days) · `90` (90 days) · `365` (1 year)

---

## AI Insights

| Method | Route | Access | Query | Description |
|--------|-------|--------|-------|-------------|
| `GET` | `/admin/ai-insights` | **[ADMIN]** | — | Latest AI-generated insights & recommendations |
| `POST` | `/admin/ai-insights/generate` | **[ADMIN]** | — | Trigger fresh AI analysis |

**Response example:**
```json
{
  "generatedAt": "2026-03-11T08:00:00Z",
  "insights": [
    {
      "type": "inventory",
      "severity": "high",
      "title": "Low stock alert",
      "description": "Racing Helmet Pro has only 3 units left. Reorder recommended.",
      "action": "Restock Racing Helmet Pro"
    },
    {
      "type": "revenue",
      "severity": "info",
      "title": "Weekend sales spike",
      "description": "Revenue on Sat-Sun is 38% higher than weekdays.",
      "action": "Schedule promotions on Friday evenings"
    }
  ]
}
```

---

## Dashboard Summary

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/admin/dashboard` | **[ADMIN]** | Returns all KPI cards + recent orders + low stock alerts |

**Response:**
```json
{
  "stats": {
    "totalRevenue": { "value": 128450, "change": "+12.4%", "changeType": "positive" },
    "totalOrders": { "value": 943, "change": "+8.1%", "changeType": "positive" },
    "totalUsers": { "value": 3210, "change": "+5.3%", "changeType": "positive" },
    "totalProducts": { "value": 184, "change": "+2", "changeType": "positive" }
  },
  "recentOrders": [ /* last 5 orders */ ],
  "lowStockProducts": [ /* products with stock < 5 */ ],
  "recentReviews": [ /* last 5 reviews */ ]
}
```

---

## Settings

| Method | Route | Access | Body | Description |
|--------|-------|--------|------|-------------|
| `GET` | `/admin/settings` | **[ADMIN]** | — | Get all store settings |
| `PUT` | `/admin/settings` | **[ADMIN]** | See schema below | Update store settings |
| `PUT` | `/admin/settings/password` | Auth | `{ currentPassword, newPassword }` | Change admin password |

**Settings Schema:**
```json
{
  "storeName": "BikersHub",
  "storeEmail": "support@bikershub.com",
  "currency": "USD",
  "taxRate": 8.5,
  "shippingFee": 9.99,
  "freeShippingThreshold": 100,
  "maintenanceMode": false,
  "allowGuestCheckout": true,
  "emailNotifications": {
    "newOrder": true,
    "lowStock": true,
    "newReview": false
  }
}
```

---

## Common Response Formats

### Paginated List
```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Error Response
```json
{
  "message": "Descriptive error message",
  "code": "PRODUCT_NOT_FOUND"
}
```

### Success (no data)
```json
{ "message": "Deleted successfully" }
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing / invalid token) |
| `403` | Forbidden (role check failed — not admin) |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate email) |
| `422` | Unprocessable entity (CSV parse errors) |
| `500` | Internal server error |

---

## Middleware Stack (recommended)

```
Request
  └─> cors()
  └─> express.json()
  └─> authMiddleware        →  verifies JWT, attaches req.user
  └─> adminMiddleware       →  checks req.user.role === "admin"
  └─> route handler
  └─> errorHandler
```
