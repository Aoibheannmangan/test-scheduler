from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import get_data  # Import the get_data function from routes
from config import REDCAP_API_URL, API_TOKEN 


# Creates a flask instance assigned to app
app = Flask(__name__)
CORS(app)  # Enables CORS for entire flask app (CORS allows accept requests from different regions)

# A route decorator that defines a new route for the flask application 
@app.route('/api/data', methods=['GET']) # (URL endpoint, specifies route will only respond to Get requests)
def get_data_route():
    return get_data()  # Call the get_data function from routes

if __name__ == '__main__':
    app.run(debug=True)
