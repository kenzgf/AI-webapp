from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import os
import tensorflow as tf
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__, static_folder='frontend/build')
CORS(app)

@app.route("/")
def entry():
    with open('frontend/build/index.html') as f:
        return f.read()

@app.route("/static/js/main.0976a078.js")
def entry():
    with open('frontend/build/static/js/main.0976a078.js') as f:
        return f.read()
    
@app.route("/static/css/main.0976a078.js")
def entry():
    with open('frontend/build/static/css/main.bd405a6d.css') as f:
        return f.read()


@app.route("/image", methods=['POST'])
def model():
    IMG_HEIGHT = 48
    IMG_WIDTH = 48
    NUM_CLASSES = 7

    def feature_extractor(inputs):
        feature_extractor = tf.keras.applications.DenseNet169(input_shape=(IMG_HEIGHT,IMG_WIDTH, 3),
                                                include_top=False,
                                                weights="imagenet")(inputs)

        return feature_extractor

    def classifier(inputs):
        x = tf.keras.layers.GlobalAveragePooling2D()(inputs)
        x = tf.keras.layers.Dense(256, activation="relu", kernel_regularizer = tf.keras.regularizers.l2(0.01))(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        x = tf.keras.layers.Dense(1024, activation="relu", kernel_regularizer = tf.keras.regularizers.l2(0.01))(x)
        x = tf.keras.layers.Dropout(0.5)(x)
        x = tf.keras.layers.Dense(512, activation="relu", kernel_regularizer = tf.keras.regularizers.l2(0.01))(x)
        x = tf.keras.layers.Dropout(0.5) (x)
        x = tf.keras.layers.Dense(NUM_CLASSES, activation="softmax", name="classification")(x)
        
        return x

    def final_model(inputs):
        densenet_feature_extractor = feature_extractor(inputs)
        classification_output = classifier(densenet_feature_extractor)
        
        return classification_output

    def define_compile_model():
        
        inputs = tf.keras.layers.Input(shape=(IMG_HEIGHT ,IMG_WIDTH,3))
        classification_output = final_model(inputs) 
        model = tf.keras.Model(inputs=inputs, outputs = classification_output)
        
        model.compile(optimizer=tf.keras.optimizers.legacy.SGD(0.1), 
                    loss='categorical_crossentropy',
                    metrics = ['accuracy'])

        return model

    model = define_compile_model()

    checkpoint_path = "training_1/cp.ckpt"
    checkpoint_dir = os.path.dirname(checkpoint_path)
    latest = tf.train.latest_checkpoint(checkpoint_dir)
    model.load_weights(latest)
    
    img = request.files['image']
    image = Image.open(io.BytesIO(img.read()))
    image = image.resize((IMG_WIDTH, IMG_HEIGHT))
    img = tf.keras.preprocessing.image.img_to_array(image)
    if img[0][0].size == 1: img = np.repeat(img, 3, axis=2)
    elif img[0][0].size > 3: img = img[..., :3]
    img_array = tf.keras.applications.densenet.preprocess_input(img)

    # Create an instance of ImageDataGenerator with the desired data augmentation parameters
    datagen = tf.keras.preprocessing.image.ImageDataGenerator(horizontal_flip=True,
                                                            width_shift_range=0.1,
                                                            height_shift_range=0.05)

    # Reshape the image array to fit the expected input shape of the datagen
    img_array = img_array.reshape((1,) + img_array.shape)

    # Use the datagen to preprocess the image
    preprocessed_img_array = datagen.flow(img_array, batch_size=1).next()

    # Rescale the pixel values to the range [0, 1]
    preprocessed_img_array = preprocessed_img_array / 255

    # Remove the batch dimension from the preprocessed image array
    preprocessed_img_array = preprocessed_img_array[0]

    # Pass the preprocessed image to your model for inference
    
    predictions = model.predict(np.expand_dims(preprocessed_img_array, axis=0))
    response = {'prediction': predictions.tolist()}
    return jsonify(response)