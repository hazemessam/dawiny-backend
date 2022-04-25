from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from model import predictDisease
import json


class APIException(Exception):
    def __init__(self, msg, code) -> None:
        self.msg: str = msg
        self.code: int = code


app: Flask = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return jsonify({'msg': 'Server is running...'})


@app.route('/ml', methods=['POST'])
def ml():
    try:
        data: dict = json.loads(request.data)
    except: raise APIException('Bad request', 400)

    symptoms: list = data.get('symptoms')  # ["Itching", "Skin Rash", "Nodal Skin Eruptions"]
    if not symptoms: raise APIException('Missing symptoms', 400)

    try:
        disease: str = predictDisease(symptoms)
    except: raise APIException('Internal server error', 500)

    return jsonify({'disease': disease})


@app.errorhandler(APIException)
def err_handler(err: APIException):
    return jsonify({
        'success': False,
        'msg': err.msg
    }), err.code


if __name__ == '__main__':
    app.run()
