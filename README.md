# Fluent Quest API

Fluent Quest API is a RESTful backend service built with Node.js and Express.js. It handles user management, authentication/authorization, secure communication with MongoDB, request logging, global error handling, and more. The API is designed with scalability, security, and clean architecture in mind.

---

## 🚀 Features

- User registration and role-based authorization
- JWT-based authentication
- Secure password hashing using bcrypt
- MongoDB integration using Mongoose
- CORS support
- Global error and not-found handlers
- Logging with Morgan middleware

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Firebase**
- **Firebase-Admin**
- **JWT** (Authentication)
- **bcrypt** (Password hashing)
- **morgan** (Logging)
- **body-parser**

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/SEWLESEWBIAZEN/fluent-quest-api.git
cd fluent-quest-api
```

2. Install dependencies

 ```bash
   npm install
```

3. Create .env file

   ``` bash
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/fluentquest
    JWT_SECRET=your_jwt_secret
   ``` 

5. Run the Server
   ```bash
   npm start

📚 API Endpoints
  🔹 Root
  GET /api
  Returns a basic welcome message or status info.

 🔹 User
POST /api/user/register
Registers a new user.

Request body
```
{
  "username": "user01",
  "name": "User User User",
  "role": ["user"],
  "email": "sewlesewbiazenqe2@gmail.com",
  "password": "Sewlesew@12",
  "confirm_password": "Sewlesew@12",
  "phoneNumber": "0961718044"
}
```

Response

```
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id_here",
    "username": "user01",
    "email": "sewlesewbiazenqe2@gmail.com",
    ...
  }
}
```

🔐 Passwords are securely hashed before storage.

🧪 Testing
Use tools like Postman, Thunder Client, or curl to test the endpoints.

📂 Project Structure (Typical)
```
fluent-quest-api/
├── config/
├── controllers/
├── enums/
├── firebase/
├── middleware/
├── model/
├── routes/
├── utils/
├── validations/
├── .env
├── .gitignores
├── server.js or index.js
└── package.json

```

🛡️ Security Notes
Uses JWT for stateless authentication.
Passwords are hashed using bcrypt.
Input validation & sanitization should be implemented for production.

📄 License
MIT License — feel free to use, modify, and share!

👤 Author
Developed by Sewlesew Biazen
