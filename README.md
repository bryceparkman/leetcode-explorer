# Weaviate Search and Open AI Leetcode Explorer

LeetCode Explorer uses Weaviate vector search to filter a Leetcode dataset ([link](https://huggingface.co/datasets/greengerong/leetcode)) and display the problem descriptions/solutions. GPT-4 is then used to show a solution in Haskell and a description of that code.

## Environment Variables

You need to provide your API keys for Weaviate and Open AI in a `.env` file in the root of this project. The format of the `.env` file is as follows:
```
WEAVIATE_ENDPOINT={}
WEAVIATE_APIKEY={}
HUGGING_FACE_APIKEY={}
OPENAI_APIKEY={}
```