# Backend-of-Assignment

# 📘 Backend Documentation

## 🧱 Project Overview

This backend is built using **Node.js**, **Express**, and **MongoDB**. It provides APIs for creating and fetching events. **Multer** is used for handling image uploads.

---

## 📂 Project Structure

```
project-root/
│
├── config 
├── routes             # Contains all route logic (event CRUD)
├── models/
│   └── eventModel.js    # Mongoose schema for event data
│
├── app.js            # Entry point for Express app
├── .env                 # Environment variables (Mongo URI, Port)
├── package.json
└── node_modules/
```

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in the project root and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 🚀 Server Setup (server.js)

* Imports Express, CORS, dotenv, mongoose, and the route file (`api.js`).
* Connects to MongoDB using the URI from `.env`.
* Mounts the routes under `/api`.

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const eventRoutes = require("./api");
app.use("/api", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 🧩 Event Model (models/eventModel.js)

Defines the event schema.

```js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String }
});

module.exports = mongoose.model("Event", eventSchema);
```

---

## 🧾 Routes (api.js)

### Importing Dependencies

```js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const eventModel = require("./models/eventModel");
```

---

## 📤 Multer Setup

Handles file uploads (stores images in memory or a specific folder).

```js
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
```

If you prefer storing locally:

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });
```

---

## 🧠 API Endpoints

### 1️⃣ Create Event

**POST** `/api/events`

**Description:** Create a new event with optional image upload.

**Request (multipart/form-data):**

| Field       | Type   | Required | Description             |
| ----------- | ------ | -------- | ----------------------- |
| title       | string | ✅        | Event title             |
| description | string | ✅        | Event description       |
| date        | string | ✅        | Event date (ISO format) |
| image       | file   | ❌        | Event image             |

**Response (201):**

```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "6724a0f5f8a12b5c9d22f4d3",
    "title": "Tech Meetup",
    "description": "A networking event for devs.",
    "date": "2025-11-15T00:00:00.000Z",
    "image": "1730445678-banner.jpg"
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "message": "Failed to create event",
  "error": "Missing required fields"
}
```

---

### 2️⃣ Get All Events

**GET** `/api/events`

**Response (200):**

```json
[
  {
    "_id": "6724a0f5f8a12b5c9d22f4d3",
    "title": "Tech Meetup",
    "description": "A networking event for devs.",
    "date": "2025-11-15T00:00:00.000Z",
    "image": "1730445678-banner.jpg"
  }
]
```

---

### 3️⃣ Get Single Event

**GET** `/api/events/:id`

**Response (200):**

```json
{
  "_id": "6724a0f5f8a12b5c9d22f4d3",
  "title": "Tech Meetup",
  "description": "A networking event for devs.",
  "date": "2025-11-15T00:00:00.000Z",
  "image": "1730445678-banner.jpg"
}
```

**Error (404):**

```json
{
  "success": false,
  "message": "Event not found"
}
```

---

## 🧰 Testing with Postman

* For `POST /api/events`, select **Body → form-data** and add:

  * Key: `title` (Text)
  * Key: `description` (Text)
  * Key: `date` (Text)
  * Key: `image` (File)

---

## 🌐 Deployment (Render)

**Steps:**

1. Push code to GitHub.
2. Go to [Render.com](https://render.com/).
3. Create a new **Web Service** → connect your GitHub repo.
4. In Environment tab, add:

   * `MONGO_URI` → your database URI
   * `PORT` → 10000 (Render assigns automatically)
5. Build command:

   ```
   npm install
   ```
6. Start command:

   ```
   node server.js
   ```

**Resulting URL:**

```
https://your-app-name.onrender.com/api/events
```
