# Deployment Guide

This guide covers deploying the SkillForge application to production using **Render** (recommended for full-stack) or **Vercel** (for frontend only).

## Option 1: Deploying Full-Stack on Render (Recommended)

Render is ideal because it allows deploying the Express API and the React frontend together in a single Web Service using our `render.yaml` Blueprint.

### Steps:

1. **Push your code to GitHub.**
2. Log in to [Render](https://render.com/).
3. Go to your Dashboard and click **New+** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` file in the root directory.
6. Provide the environment variables when prompted:
   - `COGNODB_URI` (e.g., `bolt+s://<instance-id>.databases.cognodb.cloud`)
   - `COGNODB_USERNAME` (e.g., `cognodb`)
   - `COGNODB_PASSWORD`
7. Click **Apply**. Render will install dependencies, build both the frontend and backend, and start the unified server.

*Note: The Express backend is configured to serve the React static files automatically when `NODE_ENV=production`.*

---

## Option 2: Deploying Separately (Vercel + Render)

If you prefer deploying the frontend on Vercel for Edge CDN benefits and the backend on Render.

### Backend (Render)

1. Create a new **Web Service** on Render.
2. Connect your repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add the CognoDB environment variables, plus `NODE_ENV=production`.
7. Once deployed, copy the Render URL (e.g., `https://skillforge-api.onrender.com`).

### Frontend (Vercel)

1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Connect your GitHub repository.
3. In the Configuration screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `<Your Render Backend URL>/api` (e.g., `https://skillforge-api.onrender.com/api`)
5. Click **Deploy**. Vercel will automatically use the `client/vercel.json` file to handle React Router SPA routing.
