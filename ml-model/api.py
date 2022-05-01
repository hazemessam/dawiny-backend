import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from werkzeug.http import HTTP_STATUS_CODES
from model import predict_disease


class APIException(Exception):
    def __init__(self, description, code) -> None:
        self.description: str = description
        self.code: int = code
        self.name: str = HTTP_STATUS_CODES.get(code, 'Unknown Error')


app: Flask = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return jsonify({'msg': 'Server is running...'})


@app.route('/ml', methods=['POST'])
def predict():
    try: data: dict = json.loads(request.data)
    except: raise APIException('Can not parse the request body', 400)

    if not isinstance(data, dict): raise APIException('Can not parse the request body', 400)

    symptoms: list = data.get('symptoms')  # ["Itching", "Skin Rash", "Nodal Skin Eruptions"]
    if not symptoms: raise APIException('Missing symptoms', 400)

    try: disease: str = predict_disease(symptoms)
    except: raise APIException('An exception happened while the ML model was running', 500)

    return jsonify({'disease': disease})


@app.errorhandler(Exception)
def err_handler(err: Exception):
    if isinstance(err, APIException) or isinstance(err, HTTPException):
        return jsonify({'name': err.name, 'description': err.description}), err.code

    return jsonify({'name': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
