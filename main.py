from flask import Flask, request, jsonify
from auth import ensure_authenticated
import openai
import requests
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

OPENAI_API_KEY = "..."
OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions"


@app.route("/secure-endpoint", methods=["GET"])
@ensure_authenticated
def secure_endpoint():
    return {"message": "You have accessed a secure endpoint!"}


client = openai.OpenAI(api_key=OPENAI_API_KEY)


@app.route("/get", methods=["GET", "POST"])
def secure2_endpoint():
    # Parse JSON body
    data = request.get_json()

    # Extract values from JSON body
    language = data.get("language", "")
    location = data.get("location", "")
    age = data.get("age", 0)
    genre = data.get("genre", "")

    print([language, location, age, genre])

    # Create prompt using Detail fields
    prompt = (
        f"""
    Write a {genre} story for a {age}-year-old person residing in {location} in {language}. 
    The story should consist of 3 paragraphs with a minimum of 150 words. 
    The first paragraph should serve as an introduction, the second should develop the plot, and the third should generate moral values.

    The output must be in valid JSON format as follows:
    """  + "{" + """
    "text": "your story text including all three paragraphs separated by <br>",
    "words": [
        {
        "word": "complicated word you want to define",
        "definition": "its definition"
        },
        // other words with definitions
    ]
    }
    Only return one story and one JSON object. Do not prefix with ```json or any additional text. Ensure the story is written clearly and within the constraints provided.
    """
    )


    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "gpt-3.5-turbo",  # Or use 'gpt-4' if available
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 2000,
    }

    # Call OpenAI's API
    try:
        response = requests.post(OPENAI_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()  # Raise an error for bad status codes
        res = response.json()

        # Extract the generated story
        result = res["choices"][0]["message"]["content"].strip()

        return result

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def public_endpoint():
    return {"message": "This is a public endpoint!"}


if __name__ == "__main__":
    app.run(debug=True)
