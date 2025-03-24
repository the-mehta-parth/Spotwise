from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse
from model import yolo_nas_l
from fastapi.middleware.cors import CORSMiddleware
import base64

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post("/upload")
# async def upload_image(image: UploadFile = File(...)):
#     if not image.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

#     try:
#         with open(f"input/{image.filename}", "wb") as f:
#             contents = await image.read()
#             f.write(contents)

#         yolo_nas_l(f"input/{image.filename}")

#         with open(f"output/{image.filename}", "rb") as image_file:
#             encoded_string = base64.b64encode(image_file.read()).decode()

#         return {"image": encoded_string}

#         # return FileResponse(f"output/{image.filename}", media_type="image/png")

#     except Exception as e:
#         print(f"Error uploading image: {e}") # Important for debugging
#         raise HTTPException(status_code=500, detail=f"Error uploading image: {e}")

@app.post("/upload-json")
async def upload_image_json(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    try:
        with open(f"input/{image.filename}", "wb") as f:
            contents = await image.read()
            f.write(contents)

        json_response= yolo_nas_l(f"input/{image.filename}")

        return json_response

    except Exception as e:
        print(f"Error uploading image: {e}")  # Important for debugging
        raise HTTPException(status_code=500, detail=f"Error uploading image: {e}")
    
# Testing Frontend
@app.get("/")
async def read_root():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Image Upload</title>
    </head>
    <body>
        <h1>Upload Image</h1>
        <form method="post" action="/upload-json" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*">
            <input type="submit" value="Upload">
        </form>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)