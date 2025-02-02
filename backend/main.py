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

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    try:
        with open(f"input/{image.filename}", "wb") as f:
            contents = await image.read()
            f.write(contents)

        yolo_nas_l(f"input/{image.filename}")

        # Read the output file and convert to base64
        with open("output/output.png", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode()

        return {"image": encoded_string}

    except Exception as e:
        print(f"Error processing image: {e}")  # Important for debugging
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")


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
        <form method="post" action="/upload" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*">
            <input type="submit" value="Upload">
        </form>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)
