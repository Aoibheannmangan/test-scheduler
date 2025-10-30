from flask import request, jsonify, current_app
from .models import User
from .extensions import db
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

"""Register new user"""
def register_user():
    
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
    
    
"""Login function"""
def login():
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
            "exp": datetime.now(timezone.utc) + timedelta(hours=2) # Expires in 2 hours
        }
        # Encode token
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({"message":token}), 200
    else:
        return jsonify({"error":"Invalid email or password"}), 401
    