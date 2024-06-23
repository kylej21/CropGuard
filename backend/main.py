# VENV INSTRUCTIONS
# -----------------
# source bin/activate   [activate venv when in backend]
# source bin/deactivate [deactivate venv when in backend]
# 
# in case venv is deleted:
#   - delete folders (include, lib, bin)
#   - python3 -m venv . [creates venv in local directory]
#   - pip3 install -r requirements.txt

# =============================================

# SQL DATABASE INFO
# -----------------
# 
# CREATE TABLE users (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     username VARCHAR(255) UNIQUE NOT NULL,
#     password VARCHAR(255) NOT NULL
# );
# 
# CREATE TABLE submissions (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     username VARCHAR(255) NOT NULL,
#     image LONGBLOB,
#     description TEXT,
#     FOREIGN KEY (username) REFERENCES users(username)
# );


#operational imports
import os
import tempfile
import pathlib
import base64
import json

#FASTAPI imports
import uvicorn
from fastapi import FastAPI, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

#Model imports
from transformers import pipeline

# image processing imports
from PIL import Image
import io

# genai imports
import google.generativeai as genai
from IPython.display import display, Markdown
import textwrap

# db imports
import sqlite3

# connect db
conn = sqlite3.connect('mydatabase.db')
cursor = conn.cursor() #The cursor allows you to execute SQL commands against the database:


# set up model
genai.configure(api_key="AIzaSyAZGdzC8i8YOMojZMCGXLkQirVp6X4bYDs")
model = genai.GenerativeModel('gemini-1.5-flash')

# REQUIRED FOR GEMINI API
# imputs must be converted to markdown when returned
def to_markdown(text):
  text = text.replace('•', '  *')
  return textwrap.indent(text, '', predicate=lambda _: True)

# text input -> text output using Gemini API
def generateValue(input):
    response = model.generate_content(input)
    return to_markdown(response.text)


#FASTAPI setup
app = FastAPI()

origins = ["*"]

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
pipe = pipeline("image-classification", model="gianlab/swin-tiny-patch4-window7-224-finetuned-plantdisease")

def model_forward(image: Image) -> str:

    # Perform image classification
    results = pipe(image)

    # Define the label mapping
    mapping = {
        'Pepper__bell___Bacterial_spot': 'Pepper bell bacterial spot',
        'Pepper__bell___healthy': 'Pepper bell healthy',
        'Potato___Early_blight': 'Potato early blight',
        'Potato___Late_blight': 'Potato late blight',
        'Potato___healthy': 'Potato healthy',
        'Tomato_Bacterial_spot': 'Tomato bacterial spot',
        'Tomato_Early_blight': 'Tomato early blight',
        'Tomato_Late_blight': 'Tomato late blight',
        'Tomato_Leaf_Mold': 'Tomato leaf mold',
        'Tomato_Septoria_leaf_spot': 'Tomato septoria leaf spot',
        'Tomato_Spider_mites_Two_spotted_spider_mite': 'Tomato spider mites two spotted spider mite',
        'Tomato__Target_Spot': 'Tomato target spot',
        'Tomato__Tomato_YellowLeaf__Curl_Virus': 'Tomato tomato yellowleaf curl virus',
        'Tomato__Tomato_mosaic_virus': 'Tomato tomato mosaic virus',
        'Tomato_healthy': 'Tomato healthy'
    }

    # Get the predicted class label from the model's result
    predicted_class_label = results[0]['label']

    # Map the predicted class label to the human-readable label
    predicted_label = mapping.get(predicted_class_label, "Unknown label")

    # Print the predicted label
    print('Source of damage is:', predicted_label)
    return predicted_label


def generate_gemini_explanation(image_path: pathlib.Path, label: str) -> str:
    prompt_parts = [
        genai.upload_file(image_path),
        f"Input: The danger to the plant in this image was classified as '{label}'. Explain how this condition works and how to alleviate it.",
        "Output (Answer with 50 words max): ",
    ]
    response = model.generate_content(prompt_parts)
    return to_markdown(response.text)


#API routes
# 
@app.get("/")
def read_root():
    return {"Hello": "World"}

# post request - image sent to backend
@app.post("/upload")
async def receive_file(file: UploadFile = File(...), extension: str = Form(...), username: str = Form(...)):
    print("recieved")
    try:
        # ensure file is an image
        file_extension = extension.lower()
        if file_extension not in ['png', 'jpg', 'jpeg']:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Unsupported file extension"})

        # read image & pass it thru classification model
        request_object_content = await file.read()
        img = Image.open(io.BytesIO(request_object_content))
        response = model_forward(img)

        print(response)
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = pathlib.Path(temp_file.name)

        out = generate_gemini_explanation(temp_file_path, response)
        print(out)
        temp_file_path.unlink()

        # save image to SQL DB
        bytes_data = io.BytesIO(request_object_content).read()
        base64_data = base64.b64encode(bytes_data).decode('utf-8')
        params = (username, base64_data, out)
        query = "INSERT INTO submissions (username, image, description) VALUES (?, ?, ?)"
        cursor.execute(query, params)
        conn.commit()

        return {"status":response, "explanation": out}

    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"message": str(e)})



@app.post("/login")
async def login(username:str = Form(...), password:str = Form(...)):
    print("here")
    print(username)
    print(password)

    cursor.execute('SELECT * FROM users WHERE username=? AND password=?', (username,password))
    user = cursor.fetchone()
    print(user)
    if user:        
        print(f"Logged in as: {username}")
        return {"status":"logged in"}
    else:
        cursor.execute('SELECT * FROM users WHERE username=?', (username,))
        user = cursor.fetchone()
        if user:
            return {"status":"Incorrect Password"}
        else:
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            print("Account created")
            return {"status":"Account created"}
    
    
    
@app.post("/submissions")
async def user_submissions(username: str = Form(...)):
    query = "SELECT image, description FROM submissions WHERE username=?"
    cursor.execute(query, (username,))

    results = cursor.fetchall()
    print([r[0] for r in results])
    return {"submissions": results}



#Uvicorn routing setup
if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)