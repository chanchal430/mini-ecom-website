# Mini E-Commerce Platform — Full-Stack Application

**Sheryians Coding School Assignment** — Complete JWT Authentication, Product CRUD REST APIs with `express-validator`, ImageKit CDN integration, and a feature-based React Frontend application.

## Overview

This repository contains a full-stack e-commerce web application featuring:

1. **JWT Authentication Module**: User registration, login, profile fetch, logout, and token refresh with password hashing and httpOnly cookie security.
2. **Product CRUD Module**: Fully protected routes for merchants to create, read, update, and delete products, with ownership scoping and ImageKit CDN storage lifecycle management.
3. **Request Validation**: Field-level 400 error handling on all inputs using `express-validator`.
4. **Feature-Based React Frontend**: user interface built using React, Vite, React Router, React Hook Form, and TailwindCSS.

---

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), ImageKit SDK, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `express-validator`, `cookie-parser`, `multer`.
- **Frontend**: React (Vite), React Router (`createBrowserRouter`), React Hook Form, TailwindCSS, Axios, Lucide Icons.

---

## Project Architecture & Key Features

### 1. Backend Features

- **JWT Access & Refresh Token Flow**: Short-lived (15 min) access tokens returned in JSON body + long-lived (7 days) `httpOnly` refresh cookies.
- **Refresh Token Revocation**: Refresh tokens are stored server-side against the user in MongoDB, allowing instant revocation on logout or mismatch detection.
- **ImageKit Storage Lifecycle**: Pre-validates product existence and seller ownership before uploading to CDN. When products or specific photos are updated/deleted, the corresponding files are deleted from ImageKit automatically.
- **Resource Ownership Scoping**: Ensures sellers can only edit or delete products they own (`product.seller === req.user.userId`).

### 2. Frontend Features & UI Flow (Task 4)

- **Feature-Based Modular Structure**: Organized logically into `features/auth`, `features/products`, and `features/users`.
- **Global Context Management**:
  - **AuthContext**: Manages the logged-in user and access-token state and restores authentication on application startup using the refresh-token flow.
  - **Axios Interceptors**: Attach the access token to requests and automatically attempt token refresh when a protected request returns `401`.

- **Role-Based Portals & Route Guards**:
  - **Customer Storefront (`/`, `/products`, `/products/:id`)**: Explore catalog, live search, currency filtering (`INR`/`USD`), price sorting, quantity steppers, size badges, and an interactive "Add to Cart" with notifications.
  - **Seller Dashboard (`/seller`)**: Merchant console featuring overview stats, product management table, and tabs filtering seller items.
  - **Create & Edit Product Forms (`react-hook-form`)**: Dynamic size & stock inventory array builder, file upload previews, and selective image deletion tags (`deletedImageIds`).
- **Form Handling & Error Formatting**: Clean field-level error messages displaying backend validation responses.

---

## ⚙️ Setup & Installation

### 1. Repository Structure

```
A3-mini-ecom-website/
├── backend/    # Node.js & Express REST API
├── frontend/   # React & Vite Single Page Application
└── README.md   # Project documentation
```

---

### 2. Environment Variables Setup

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mini-ecom
ACCESS_JWT_SECRET=your_super_secret_access_key_123
REFRESH_JWT_SECRET=your_super_secret_refresh_key_456
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

---

### 3. Run Commands

#### Start the Backend API Server:

```bash
cd backend
npm install
npm run dev
```

_(Runs on `http://localhost:3000`)_

#### Start the Frontend Web Application:

```bash
cd frontend
npm install
npm run dev
```

_(Runs on `http://localhost:5173` with Vite server proxy routing `/api` requests to `localhost:3000`)_

---

## 📡 API Endpoints Reference

### 🔑 Authentication APIs (`/api/auth`)

| Method | Endpoint                  | Access Level  | Description                                                                             |
| :----- | :------------------------ | :------------ | :-------------------------------------------------------------------------------------- |
| `POST` | `/api/auth/register`      | Public        | Create a new user (`name`, `email`, `password`, `confirmPassword`, `role`)              |
| `POST` | `/api/auth/login`         | Public        | Authenticate user; return `accessToken` in JSON & set `refreshToken` in httpOnly cookie |
| `GET`  | `/api/auth/me`            | Authenticated | Return profile of current logged-in user                                                |
| `POST` | `/api/auth/refresh-token` | Public\*      | Verify refresh cookie, rotate token in DB, and issue new `accessToken`                  |
| `POST` | `/api/auth/logout`        | Authenticated | Invalidate stored refresh token in DB & clear browser cookie                            |

---

### 🛍️ Product CRUD APIs (`/api/products`)

| Method   | Endpoint            | Access Level           | Description                                                               |
| :------- | :------------------ | :--------------------- | :------------------------------------------------------------------------ |
| `GET`    | `/api/products`     | Public                 | Fetch all products with populated seller info                             |
| `GET`    | `/api/products/:id` | Public                 | Fetch details of a single product by ID                                   |
| `POST`   | `/api/products`     | Authenticated (Seller) | Create a product with image upload to ImageKit CDN                        |
| `PUT`    | `/api/products/:id` | Authenticated (Seller) | Update product details, add new images, or remove selected ImageKit files |
| `DELETE` | `/api/products/:id` | Authenticated (Seller) | Delete product from MongoDB and purge associated images from ImageKit     |

---

## 🔄 Data Flow & Explanation

1. **User Registers / Logs In**:

   - Frontend sends credentials to `POST /api/auth/login`.
   - Express hashes/compares passwords with `bcryptjs`.
   - On success, backend returns a short-lived Access Token and sets an `httpOnly` Refresh Cookie.
   - `AuthContext` stores the Access Token in memory and sets up Axios authorization headers.

2. **Accessing Protected Routes**:

   - Frontend attaches `Authorization: Bearer <accessToken>` to API calls.
   - Backend `authenticate` middleware verifies the access token and populates `req.user`.

3. **Silent Token Refresh (15m Lifecycle)**:

   - When an access token expires, Axios interceptor catches the `401 Unauthorized` status.
   - Automatically calls `POST /api/auth/refresh-token` using cookie credentials.
   - Backend verifies cookie against MongoDB, updates the DB token, and issues a new access token seamlessly without interrupting the user.

4. **Product Creation & Updating with ImageKit**:
   - Frontend `ProductForm` collects data using `react-hook-form` and builds `FormData` with image files.
   - Middleware parses numbers, objects, and sizes.
   - Express Controller verifies product existence and seller ownership before uploading to ImageKit.
   - Image URLs and `fileId` references are stored in MongoDB.
