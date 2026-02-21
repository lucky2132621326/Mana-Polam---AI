from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import os

app = Flask(__name__)   # ✅ FIRST create app
CORS(app)               # ✅ THEN enable CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "mobilenetv2_best.keras")

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
    confidence = float(np.max(predictions))

    return jsonify({
        "classIndex": predicted_index,
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)