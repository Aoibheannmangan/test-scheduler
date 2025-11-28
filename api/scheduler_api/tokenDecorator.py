from functools import wraps
from flask import request, jsonify, current_app
import jwt
from .models import User

def token_required(f): # f is the function being decorated
    """
    This is a decorator to secure Flask routes using JWT-based authentication.

    This decorator checks for a Bearer token in the request's Authorization header.
    If a token is provided, it is decoded using the application's `SECRET_KEY`.
    The token must be valid, not expired, and correspond to an existing user in the database.

    On success:
        - Retrieves the current user based on the email in the token.
        - Passes the current user as the first argument to the decorated function.

    Handles errors and returns `401 Unauthorized` in the following cases:
        - Missing token
        - Expired token
        - Invalid token
        - User not found in the database

    Example:
        ```python
        @app.route("/protected")  
        @token_required  
        def protected_route(current_user):  
            return jsonify({"message": f"Hello {current_user.email}"})  
        ```
    """
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