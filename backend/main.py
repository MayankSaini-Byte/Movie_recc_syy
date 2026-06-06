from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import os
import httpx

app = FastAPI(title="Movie Recommendation API")

# Setup CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_API_KEY = os.environ.get("TMDB_API_KEY", "8265bd1679663a7ea12ac168da84d2e8")
TMDB_BASE = "https://api.themoviedb.org/3"

# Load data at startup
try:
    dict_path = os.path.join(os.path.dirname(__file__), 'movies_dict.pkl')
    sim_path = os.path.join(os.path.dirname(__file__), 'similarity16.pkl')

    with open(dict_path, 'rb') as f:
        movies_dict = pickle.load(f)
    movies = pd.DataFrame(movies_dict)

    with open(sim_path, 'rb') as f:
        similarity = pickle.load(f)

    print(f"Model loaded successfully! {len(movies)} movies in dataset.")
except Exception as e:
    print(f"Error loading model: {e}")
    movies = pd.DataFrame()
    similarity = []


@app.get("/")
def read_root():
    return {"message": "Movie Recommendation API is running!"}


@app.get("/movies")
def get_movie_list():
    """Returns a list of all movie titles for the dropdown."""
    if movies.empty:
        raise HTTPException(status_code=500, detail="Movies data not loaded")
    return {"movies": movies['title'].tolist()}


@app.get("/search")
def search_movies(q: str = Query("", min_length=1)):
    """Search movie titles within the loaded dataset."""
    if movies.empty:
        raise HTTPException(status_code=500, detail="Movies data not loaded")
    query_lower = q.lower()
    matches = movies[movies['title'].str.lower().str.contains(query_lower, na=False)]
    results = []
    for _, row in matches.head(20).iterrows():
        results.append({
            "id": int(row['id']),
            "title": str(row['title'])
        })
    return {"results": results}


@app.get("/recommend/{movie}")
def recommend(movie: str):
    """Returns 5 recommended movies based on the input movie."""
    if movies.empty:
        raise HTTPException(status_code=500, detail="Data not loaded properly.")

    try:
        # Find index of the movie
        mov_index = movies[movies['title'] == movie].index[0]
    except IndexError:
        raise HTTPException(status_code=404, detail="Movie not found in the dataset.")

    distances = similarity[mov_index]
    # Enumerate and sort by similarity score
    mov_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommendations = []
    for i in mov_list:
        idx = i[0]
        recommendations.append({
            "id": int(movies.iloc[idx].id),
            "title": str(movies.iloc[idx].title)
        })

    return {"recommendations": recommendations}


@app.get("/trending")
async def get_trending():
    """Proxy TMDB trending movies for cold-start / hero section."""
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{TMDB_BASE}/trending/movie/week",
                params={"api_key": TMDB_API_KEY, "language": "en-US"},
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {"results": data.get("results", [])[:20]}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"TMDB API error: {str(e)}")


@app.get("/movie/{movie_id}")
async def get_movie_details(movie_id: int):
    """Proxy TMDB movie details for full metadata enrichment."""
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{TMDB_BASE}/movie/{movie_id}",
                params={"api_key": TMDB_API_KEY, "language": "en-US"},
                timeout=10.0,
            )
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"TMDB API error: {str(e)}")


@app.get("/movie/{movie_id}/similar")
async def get_similar_movies(movie_id: int):
    """Get similar movies from TMDB for the detail panel carousel."""
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{TMDB_BASE}/movie/{movie_id}/similar",
                params={"api_key": TMDB_API_KEY, "language": "en-US", "page": 1},
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {"results": data.get("results", [])[:10]}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"TMDB API error: {str(e)}")


@app.get("/genres")
async def get_genres():
    """Get TMDB genre list for filter panel."""
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{TMDB_BASE}/genre/movie/list",
                params={"api_key": TMDB_API_KEY, "language": "en-US"},
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {"genres": data.get("genres", [])}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"TMDB API error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
