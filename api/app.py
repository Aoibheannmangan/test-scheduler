from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import get_data  # Import the get_data function from routes
from config import REDCAP_API_URL, API_TOKEN 
import os

# Creates a flask instance assigned to app
build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../build")
app = Flask(__name__, static_folder='../build')
CORS(app)  # Enables CORS for entire flask app (CORS allows accept requests from different regions)

# A route decorator that defines a new route for the flask application 
@app.route('/api/data', methods=['GET']) # (URL endpoint, specifies route will only respond to Get requests)
def get_data_route():
    return get_data()  # Call the get_data function from routes

#react route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith("api/"):
        return "API endpoint not found", 404

    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)  