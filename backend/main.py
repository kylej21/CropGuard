# VENV INSTRUCTIONS
# -----------------
# source bin/activate   [activate venv when in backend]
# source bin/deactivate [deactivate venv when in backend]
# 
# in case venv is deleted:
#   - delete folders (include, lib, bin)
#   - python3 -m venv . [creates venv in local directory]
#   - pip3 install -r requirements.txt

#operational imports
import os
import tempfile

#FASTAPI imports
import uvicorn
from fastapi import FastAPI, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

#Model imports
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

# image processing imports
from PIL import Image
import io


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
processor = AutoImageProcessor.from_pretrained("Professor/CGIAR-Crop-disease")
model = AutoModelForImageClassification.from_pretrained("Professor/CGIAR-Crop-disease")

def model_forward(image: Image):
    
    
    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")
    
    # Get model predictions
    outputs = model(**inputs)
    logits = outputs.logits
    
    # Apply softmax to get probabilities
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    
    # Get the predicted class index
    predicted_class_idx = probabilities.argmax(-1).item()
    
    mapping = {
        0: "weed",
        1: "disease",
        2: "healthy",
        3: "drought",
        4: "nutrient deficiency",
    }
    
    # Print the predicted label
    print('source of damage is: ' + mapping[predicted_class_idx])
    return mapping[predicted_class_idx]



#API routes
# 
@app.get("/")
def read_root():
    return {"Hello": "World"}

# post request - image sent to backend
@app.post("/upload")
async def receive_file(file: UploadFile = File(...), extension: str = Form(...)):
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
        return {"status":response}
    
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"message": str(e)})


@app.get("/generate/{prompt}")
def generateSolution(prompt: str):
    response =""


    return {"response":prompt}
#Uvicorn routing setup
if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)