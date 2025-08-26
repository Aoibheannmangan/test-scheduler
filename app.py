from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import get_data  # Import the get_data function from routes

app = Flask(__name__)
CORS(app)  

@app.route('/api/data', methods=['GET'])
def get_data_route():
    return get_data()  # Call the get_data function from routes

if __name__ == '__main__':
    app.run(debug=True)
