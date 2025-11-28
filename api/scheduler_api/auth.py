from flask import request, jsonify, current_app
from .models import User
from .extensions import db
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

def register_user():
    """
    Register a new user in the application.
    
    This function handles user registration with multiple layers of validation.
    
    **Request JSON Payload:**  
        - email (str): University email address (must end with '@ucc.ie')  
        - password (str): User's password (will be hashed)  
        - staff_number (str): 5-digit staff number
    
    Security Measures:
        - Passwords are hashed using bcrypt before storage
        - Prevents duplicate user registrations
    
    Validation Checks:
        - Email domain must be '@ucc.ie'
        - Staff number must be exactly 5 characters long
        - All fields are required
    
    Returns:
        Response (JSON):
            - 201 Created: User successfully registered
                `{"message": "User successfully created"}`
            - 400 Bad Request: Validation failed
                `{"error": "Specific validation error message"}`
    
    Raises:
        ValueError: If required fields are missing or invalid
    
    Example:
        POST /register  
        {  
            "email": "staff@ucc.ie",  
            "password": "securePassword123",  
            "staff_number": "12345"  
        }
    """
    
    # Get required fields for validation/ signing in
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    staff_number = data.get("staff_number")
    
    # Basic validation
    if not all([email,password,staff_number]):
        return jsonify({"error":"Missing required field"}), 400
    
    if not email.endswith("@ucc.ie"):
        return jsonify({"error":"Invalid email address. Must be @ucc.ie"}), 400
    
    if len(staff_number) != 5:
        return jsonify({"error":"Invalid staff number. Must be length of 5"}), 400
    
    # Check for existing user
    if User.query.filter_by(email=email).first() or User.query.filter_by(staff_number=staff_number).first():
        return jsonify({"error":"User already exists"}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    
    # Create user
    new_user = User(
        email=email,
        staff_number=staff_number,
        password_hash=hashed_password.decode("utf-8"),
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message":"User successfully created"}), 201
    
    
def login():
    """
    Authenticate user and generate JSON Web Token (JWT).
    
    This function processes user login credentials and provides 
    secure authentication with time-limited access token.
    
    Request JSON Payload:
        - email (str): User's registered email address
        - password (str): User's password
    
    Security Features:
        - Uses bcrypt for password verification
        - Expiring token
        - Prevents login with incorrect credentials
    
    Returns:
        Response (JSON):
            - 200 OK: Successful login returns `{"message": "JWT_TOKEN"}`
            - 400 Bad Request: Missing credentials returns `{"error": "Missing email or password"}`
            - 401 Unauthorized: Invalid credentials returns `{"error": "Invalid email or password"}`
    
    Token Characteristics:
        - Algorithm: HS256
        - Expiration: 24 hours from creation
        - Contains user email in payload
    
    Raises:
        AuthenticationError: If login process fails
    
    Example:
        POST /login  
        {  
            "email": "staff@ucc.ie",  
            "password": "correctPassword"  
        }
    """
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not all([email, password]):
        return jsonify({"error":"Missing email or password"}), 400
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and password is correct
    if user and bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
    
        #JWT payload
        payload = {
            "email":user.email,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24) # Expires in 24 hours
        }
        # Encode token
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({"message":token}), 200
    else:
        return jsonify({"error":"Invalid email or password"}), 401
    