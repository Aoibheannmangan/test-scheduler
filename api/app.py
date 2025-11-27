from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import get_data  # Import the get_data function from routes
from config import REDCAP_API_URL, API_TOKEN 
import os

# Creates a flask instance assigned to app
build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../build")
app = Flask(__name__, static_folder=build_dir)
CORS(app)  # Enables CORS for entire flask app (CORS allows accept requests from different regions)

# A route decorator that defines a new route for the flask application 
@app.route('/api/data', methods=['GET']) # (URL endpoint, specifies route will only respond to Get requests)
def get_data_route():
    return get_data()  # Call the get_data function from routes

#react route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve: 
    
    This serves the React frontend and static files for it to be hosted.

    Any request that is not an API endpoint is routed to `index.html`
    to support client-side routing in React.
    If the requested static file exists, it serves that file.

    Args:
        path (str): The requested path from the URL.

    Returns:
      Response: 
          - The requested static file if it exists.
          - `index.html` for client-side routing.
          - 404 error if the file or index.html is missing.
          - 500 error if an unexpected exception occurs.

    Example: 
        Get /                     -> serve index.html
        
        Get /static/js/main.js    -> serve static/js/main.js
    
    """
    try: 
        if path.startswith("api/"):
            return "API endpoint not found", 404

        file_path = os.path.join(app.static_folder, path)

        if path != "" and os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        
        index_path = os.path.join(app.static_folder, "index.html")
        if os.path.isfile(index_path):
            return send_from_directory(app.static_folder, "index.html")
        
        return "index.html not found", 404
    
    except Exception as e:
        return f"Internal Server Error: {str(e)}", 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)  