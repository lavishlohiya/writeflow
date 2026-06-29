# WriteFlow

> A full-stack blogging platform built to learn production-style backend development using Node.js, Express.js, PostgreSQL, and JWT Authentication.

---

## 🚀 Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,postgres,html,css,js,docker,git,github,vscode" />
</p>

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- JWT Authentication
- bcrypt
- cookie-parser
- cors
- dotenv

### Frontend
- HTML
- CSS
- JavaScript

---

# ✨ Features

- 🔐 User Authentication
- 🍪 HTTP-only Cookie Authentication
- 📝 CRUD Operations for Posts
- 💬 CRUD Operations for Comments
- 🔍 Search Posts
- 📄 Pagination
- 👤 Author-only Update/Delete
- 🛡️ Admin Authorization
- 🏗 Layered Architecture
- ⚡ RESTful API

---

# 📂 Project Structure

```text
src/
│
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── validators/
├── utils/
│
├── app.js
```

---

# 🗄 Database

Current tables

- Users
- Posts
- Comments

---

# 🔐 Authentication Routes

| Method | Endpoint | Description | Protected |
|:------:|----------|-------------|:---------:|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/me` | Get current authenticated user | ✅ |

---

# 📝 Post Routes

| Method | Endpoint | Description | Protected |
|:------:|----------|-------------|:---------:|
| POST | `/api/post/create` | Create a new post | ✅ |
| GET | `/api/post` | Get all posts | ✅ |
| GET | `/api/post/:id` | Get post by ID | ✅ |
| PATCH | `/api/post/:id` | Update own post | ✅ |
| DELETE | `/api/post/:id` | Delete own post/Admin | ✅ |

---

# 💬 Comment Routes

| Method | Endpoint | Description | Protected |
|:------:|----------|-------------|:---------:|
| POST | `/api/post/comment/:id` | Create comment on a post | ✅ |
| GET | `/api/post/comment/:id` | Get comments of a post | ✅ |
| PUT | `/api/post/comment/:id` | Update own comment | ✅ |
| DELETE | `/api/post/comment/:id` | Delete own comment/Admin | ✅ |

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/lavishlohiya/writeflow.git
```

Move into the project

```bash
cd writeflow
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=1002
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run the server

```bash
npm start
```

---

# 📸 Screenshots

## Dashboard

c:\Users\love lohiya\OneDrive\Pictures\Screenshots\Screenshot 2026-06-29 122119.png

---

## Login

c:\Users\love lohiya\OneDrive\Pictures\Screenshots\Screenshot 2026-06-29 122207.png

---

# 🚧 Future Improvements

- 🖼 Image Uploads
- ❤️ Like System
- 👤 User Profiles
- 🏷 Categories & Tags
- 📂 File Storage
- 🐳 Docker
- 🧪 Unit & Integration Tests
- 🚀 CI/CD Pipeline

---

# 📄 License

Licensed under the **MIT License**.

---

# 👨💻 Author

**Lavish Lohiya**
