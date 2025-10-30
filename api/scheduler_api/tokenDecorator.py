from functools import wraps
from flask import request, jsonify, current_app
import jwt
from .models import User

def token_required(f): # f is the function being decorated
    @wraps(f) # Copies original metadeta + maintains original function's identity
    def decorated(*args, **kwargs): 
        token = None
        
        # Check for 'Authorization header'
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                
        if not token:
            return jsonify({"message":"Token is missing"}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(email=data["email"]).first()
        
        except jwt.ExpiredSignatureError:
            return jsonify({"message":"Token has expired"}), 401
        
        except jwt.InvalidTokenError:
            return jsonify({"message":"Token is invalid"}), 401 
        
        if not current_user:
            return jsonify({"message":"User not found"}), 401
        
        # Pass the current user to the decorated function
        return f(current_user, *args, **kwargs)
    
    return decorated