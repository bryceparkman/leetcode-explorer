import os
import weaviate  # type: ignore[import]
from weaviate.classes.query import Move

from wasabi import msg  # type: ignore[import]

from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from weaviate.classes.query import Filter

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = ["http://localhost:3000", "TODO: Add production origin URL"]

# Add middleware for handling Cross Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

weaviate_endpoint = os.getenv("WEAVIATE_ENDPOINT")
weaviate_apikey = os.getenv("WEAVIATE_APIKEY")
huggingface_apikey = os.getenv("HUGGING_FACE_APIKEY")
openai_apikey = os.getenv("OPENAI_APIKEY")

if weaviate_endpoint and weaviate_apikey:
    msg.good(f"Weaviate endpoint found at {weaviate_endpoint}")
    if huggingface_apikey and openai_apikey:
        msg.good("Hugging Face and OpenAI api keys found")
        client = weaviate.connect_to_weaviate_cloud(
            cluster_url=weaviate_endpoint,
            auth_credentials=weaviate.auth.AuthApiKey(weaviate_apikey),
            headers={
                "X-Huggingface-Api-Key": huggingface_apikey,
                "X-OpenAI-Api-Key": openai_apikey
            }
        )
    else:
        msg.warn("Hugging Face or OpenAI api keys not found")
        exit()
else:
    msg.warn("Weaviate endpoint or api key not found")
    exit()

@app.get("/api/filter_solutions")
async def filter_solutions(q: str, offset: int):
    """
    Takes a query string as input and returns a JSON response containing the leetcode solutions that match the query via weaviate vector search.
    """
    solutions = client.collections.get("Solution")

    response = solutions.query.near_text(
        move_to = Move(force = 1, concepts=["Computer Science", "Programming"]),
        target_vector = "question_vector",
        query = q,
        offset = offset,
        limit = 5,
    )
    if len(response.objects) == 0:
        return JSONResponse(status_code = status.HTTP_404_NOT_FOUND, content = {"message": "No solutions found"})
    
    return JSONResponse(status_code = status.HTTP_200_OK, content = [obj.properties for obj in response.objects])

@app.get("/api/generate_solution")
async def generate_solution(pid: str):
    """
    Takes a uuid as input and generates the Haskell code from the given leetcode solution to return.
    """
    solutions = client.collections.get("Solution")
    response = solutions.generate.fetch_objects(
        filters = Filter.by_property("problem_id").equal(int(pid)),
        limit = 1,
        single_prompt = "An expert programmer was presented with the following problem: {content} \n\n\n You will write the Haskell code for this solution: {java}. \
            You should also provide a bulleted description of the algorithm used by the original solution and how it translates to your new code. This should also explain \
            how it works specifically in Haskell as a functional programming language (especially when there are things unfamiliar to regular OOP programmers, such as folds). Don't mention anything about Java in your description. \
            Your response should be in this markdown format: \
            haskell\n \
            \
            \`\`\`new code here \n\`\`\` \
            algorithm description here"
    )

    if len(response.objects) == 0:
        return JSONResponse(status_code = status.HTTP_404_NOT_FOUND, content = {"message": "Solution not found for supplied problem id: " + pid})
    
    return JSONResponse(status_code = status.HTTP_200_OK, content = response.objects[0].generated)