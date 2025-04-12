from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client['vistara-news-3']
users_collection = db['users']

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    country = data.get('country')
    agreeToTerms = data.get('agreeToTerms')


    if not agreeToTerms:
        return jsonify({'message': 'You must agree to the Terms and Conditions.'}), 400

    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'User already exists with this email.'}), 400

    hashed_password = generate_password_hash(password)

   

    result=users_collection.insert_one({
        
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hashed_password,
        'country': country,
        'agreeToTerms': agreeToTerms,
        'saved': [],
        'liked': []
    })
    new_user = {
        '_id': str(result.inserted_id),
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hashed_password,
        'country': country,
        'agreeToTerms': agreeToTerms,
        'saved': [],
        'liked': []
    }

    del new_user['password']  # Don't return password
    return jsonify({'message': 'User registered successfully', 'user': new_user}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password.'}), 400

    user.pop('password', None)
    user['_id'] = str(user['_id'])
    
    return jsonify({'message': 'Login successful', 'user': user}), 200


@app.route('/google-login', methods=['POST'])
def google_login():
    data = request.json
    email = data.get('email')

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found, please sign up.'}), 404

    user.pop('password', None)
    user['_id'] = str(user['_id'])
    return jsonify({'message': 'Login successful', 'user': user}), 200


@app.route('/api/articles/save', methods=['POST'])
def save_article():
    data = request.json
    title = data.get('title')
    newsUrl = data.get('newsUrl')
    category = data.get('category')
    description = data.get('description')
    email = data.get('email')
    print(email)

    if not all([title, newsUrl, category, description, email]):
        return jsonify({'error': 'Title, newsUrl, category, description and email are required'}), 400

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    saved_articles = user.get('saved', [])
    if any(article['newsUrl'] == newsUrl for article in saved_articles):
        return jsonify({'message': 'Article already saved'}), 409

    new_article = {
        'title': title,
        'newsUrl': newsUrl,
        'category': category,
        'description': description
    }

    users_collection.update_one(
    {'email': email},
    {'$push': {'saved': {'$each': [new_article], '$position': 0}}})


    return jsonify({'message': "Article saved to user's list successfully"}), 201


@app.route('/api/userbasic', methods=['GET'])
def user_basic():
    raw_email = request.args.get('email')
    if not raw_email:
        return jsonify({'error': 'Email is required'}), 400

    email = raw_email.strip()
    print(email)

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    basic_info = {
        'firstName': user.get('firstName'),
        'lastName': user.get('lastName'),
        'email': user.get('email'),
        'country': user.get('country')
    }

    return jsonify(basic_info)

@app.route('/api/saved-articles', methods=['GET'])
def get_saved_articles():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = users_collection.find_one({'email': email})
    if not user or 'saved' not in user:
        return jsonify([])

    return jsonify(user['saved'])


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Server is running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
