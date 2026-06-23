# MoodStream Deployment Guide

This guide details how to build, configure, and deploy the complete MoodStream application to cloud platforms (such as Render, Vercel, and MongoDB Atlas) for a production-ready setup.

---

## 📦 Cloud Database Setup: MongoDB Atlas

In production, you must use a hosted MongoDB instance instead of `localhost`. Follow these instructions to set up a free cluster on MongoDB Atlas:

1. **Sign up/Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Cluster** (Shared tier).
3. **Database Access User**:
   * Create a database user with read/write credentials. Keep note of the password.
4. **Network Access settings**:
   * Add an IP whitelist access rule. For simple deployment testing, set it to allow access from anywhere (`0.0.0.0/0`), as hosting platforms like Render or Vercel use dynamic outbound IPs.
5. **Get connection string**:
   * Choose connection method: **Drivers**.
   * Copy the connection string format: `mongodb+srv://<username>:<password>@cluster.xxxx.mongodb.net/moodstream?retryWrites=true&w=majority`.
   * Replace `<username>` and `<password>` placeholders with your actual user database credentials.

---

## 🖥️ Deploying the Backend API: Render

Render is a robust, free-tier friendly platform to host Node.js Express APIs.

1. **Sign up** to [Render](https://render.com) and link your GitHub repository.
2. Select **New** > **Web Service**.
3. Link your repository.
4. Set the following Web Service properties:
   * **Name**: `moodstream-api`
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
5. **Environment Variables**:
   Under the **Environment** tab, click **Add Environment Variable** and define:
   * `NODE_ENV` = `production`
   * `PORT` = `10000` (Render binds automatically, but configuring it ensures local-to-cloud mapping is clear)
   * `MONGO_URI` = *(Paste your MongoDB Atlas Connection String from above)*
   * `JWT_SECRET` = *(Choose a long, secure cryptographic password phrase)*
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a public web URL for your API, e.g., `https://moodstream-api.onrender.com`.

---

## 🎨 Deploying the Frontend Client: Vercel

Vercel is the recommended hosting service for compiling and distributing React client applications.

### Step 1: Update API URLs in Production
Before building the production bundle, ensure the frontend makes requests to your live backend service on Render rather than the proxied development path (`/api/...`).

You can achieve this in two ways:
1. **Axios Base URL override**:
   Open [AuthContext.jsx](file:///c:/Users/hariv/OneDrive/Desktop/code%20alpha%20t1/frontend/src/context/AuthContext.jsx) or configure a global script that sets the default endpoint:
   ```javascript
   import axios from 'axios';
   
   if (import.meta.env.PROD) {
     axios.defaults.baseURL = 'https://your-backend-api-url.onrender.com';
   }
   ```
   *(Note: Let's ensure this base configuration is supported directly by adding a global configurations file or adding the URL detection logic in the client. Our client works fine with absolute paths or proxy rules. Let's make sure it handles production endpoints gracefully by writing a configuration update.)*

Let's see: how did we make requests in the frontend pages? We used paths like `axios.get('/api/products')`. In production, this matches the frontend hosting domain by default if relative, which will fail if frontend and backend are hosted on separate domains.
To fix this dynamically, let's write a small configuration utility, or just add a global axios baseURL hook in `main.jsx`!
Let's add it in `main.jsx` right before booting, like:
```javascript
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```
Wait! That is an extremely smart and professional way of solving cross-domain APIs. Let's configure it this way! We'll edit `main.jsx` to configure the base URL dynamically.

Let's continue writing the `DEPLOYMENT.md` content:

```markdown
### Step 2: Vercel Web Deployment

1. **Sign up** to [Vercel](https://vercel.com) and link your GitHub account.
2. Click **Add New** > **Project**.
3. Import your repository.
4. Set the following configurations:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. **Environment Variables**:
   * Add a new environment variable: `VITE_API_URL` = *(Your Render Backend service URL, e.g., `https://moodstream-api.onrender.com`)*
6. Click **Deploy**. Vercel will build the React assets and issue a public URL (e.g. `https://moodstream-store.vercel.app`).

---

## 📋 Environment Checklist

Ensure all variables are populated correctly across both hosting services:

| Service | Environment Variable | Purpose | Location |
| :--- | :--- | :--- | :--- |
| **Backend** | `MONGO_URI` | Remote database link string | Render Config |
| **Backend** | `JWT_SECRET` | Signing authorization keys | Render Config |
| **Backend** | `NODE_ENV` | Toggle API logging behaviors | Render Config |
| **Frontend** | `VITE_API_URL` | Live backend API address link | Vercel Config |
```
