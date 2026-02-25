from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "mobilenetv2_best.keras")

class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

app = Flask(__name__)
CORS(app)

# DATASET_DIR = os.path.join(BASE_DIR, "dataset", "train")

# Get class names in sorted order
# Temporary dummy class names until dataset is ready
# class_names = [f"Class_{i}" for i in range(38)]

model = tf.keras.models.load_model(MODEL_PATH)

IMG_SIZE = 224

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]

    img = Image.open(file.stream).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = model.predict(img_array)[0]

    predicted_index = int(np.argmax(predictions))
    predicted_disease = class_names[predicted_index]
    confidence = float(predictions[predicted_index])

    top3_indices = predictions.argsort()[-3:][::-1]

    top3 = [
        {
            "disease": class_names[int(i)],
            "probability": float(predictions[i])
        }
        for i in top3_indices
    ]

    return jsonify({
        "disease": predicted_disease,
        "confidence": confidence,
        "top3": top3
    })
if __name__ == "__main__":
    app.run(port=5000, debug=True)