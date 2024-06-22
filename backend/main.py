#operational imports
import os
import tempfile
from dotenv import load_dotenv
load_dotenv()

#FASTAPI imports
import uvicorn
from fastapi import FastAPI, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


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



#API routes
# 
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload")
async def receive_file(file: UploadFile = File(...), extension: str = Form(...)):
    try:
        file_extension = extension.lower()
        if file_extension not in ['png', 'jpg', 'jpeg']:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Unsupported file extension"})

        request_object_content = await file.read()
        img = Image.open(io.BytesIO(request_object_content))
        img.show()

    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"message": str(e)})



#Uvicorn routing setup
if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)