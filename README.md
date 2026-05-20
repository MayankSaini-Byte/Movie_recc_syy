# 🎬 CineMatch AI — Movie Recommendation System

A full-stack movie recommendation system powered by machine learning. Select a movie and get 5 similar recommendations with posters.

## 🏗️ Architecture

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend  | React + Vite | [Vercel](https://vercel.com) |
| Backend   | FastAPI + Python | [Render](https://render.com) |
| ML Model  | Cosine Similarity (scikit-learn) | Bundled with backend |

## 🚀 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# API runs at http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## 🌐 Deployment

### Backend → Render
1. Connect this repo to [Render](https://render.com)
2. Use the `render.yaml` blueprint or manually configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel
1. Connect this repo to [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy!

## 📦 Tech Stack
- **React 19** + **Vite 8** (Frontend)
- **FastAPI** + **Uvicorn** (Backend)
- **Pandas** + **scikit-learn** (ML)
- **TMDB API** (Movie Posters)
"# Movie_recc_syy" 
