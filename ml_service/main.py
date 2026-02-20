from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import io

app = FastAPI()

# Load model once at startup
model = tf.keras.models.load_model("mobilenetv2_best.h5")

IMG_SIZE = 224

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = model.predict(img_array)[0]

    top3_indices = predictions.argsort()[-3:][::-1]
    top3 = [
        {
            "classIndex": int(i),
            "probability": float(predictions[i])
        }
        for i in top3_indices
    ]

    predicted_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions))

    return {
        "classIndex": predicted_index,
        "confidence": confidence,
        "top3": top3
    }