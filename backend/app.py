from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# 使用环境变量设置密钥，如果没有则使用默认值
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')

# Mock data for rooms and bookings
rooms = [
    {"id": 1, "name": "Cozy Single", "price": 50, "capacity": 1},
    {"id": 2, "name": "Double Delight", "price": 80, "capacity": 2},
    {"id": 3, "name": "Family Suite", "price": 120, "capacity": 4},
    {"id": 4, "name": "Luxury Penthouse", "price": 200, "capacity": 2},
    {"id": 5, "name": "Garden View", "price": 90, "capacity": 2},
    {"id": 6, "name": "Ocean Breeze", "price": 150, "capacity": 3},
]

bookings = [
    {"id": 1, "room_id": 1, "guest_name": "John Doe", "check_in": "2024-03-15", "check_out": "2024-03-18"},
    {"id": 2, "room_id": 2, "guest_name": "Jane Smith", "check_in": "2024-03-20", "check_out": "2024-03-25"},
]

users = [
    {"id": 1, "username": "admin", "password": "admin123", "is_admin": True},
    {"id": 2, "username": "user", "password": "user123", "is_admin": False},
]

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    return jsonify(rooms)

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    booking = request.json
    booking['id'] = len(bookings) + 1
    bookings.append(booking)
    return jsonify(booking), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = next((user for user in users if user['username'] == data['username'] and user['password'] == data['password']), None)
    if user:
        return jsonify({"success": True, "is_admin": user['is_admin']}), 200
    return jsonify({"success": False}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if any(user['username'] == data['username'] for user in users):
        return jsonify({"success": False, "message": "Username already exists"}), 400
    new_user = {
        "id": len(users) + 1,
        "username": data['username'],
        "password": data['password'],
        "is_admin": False
    }
    users.append(new_user)
    return jsonify({"success": True}), 201

@app.route('/api/admin/rooms', methods=['POST'])
def add_room():
    room = request.json
    room['id'] = len(rooms) + 1
    rooms.append(room)
    return jsonify(room), 201

@app.route('/api/admin/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    room = next((room for room in rooms if room['id'] == room_id), None)
    if room:
        room.update(request.json)
        return jsonify(room), 200
    return jsonify({"error": "Room not found"}), 404

@app.route('/api/admin/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    global rooms
    rooms = [room for room in rooms if room['id'] != room_id]
    return '', 204

@app.route('/api/check_availability', methods=['POST'])
def check_availability():
    data = request.json
    check_in = datetime.strptime(data['check_in'], '%Y-%m-%d')
    check_out = datetime.strptime(data['check_out'], '%Y-%m-%d')
    
    available_rooms = []
    for room in rooms:
        is_available = True
        for booking in bookings:
            if booking['room_id'] == room['id']:
                booking_check_in = datetime.strptime(booking['check_in'], '%Y-%m-%d')
                booking_check_out = datetime.strptime(booking['check_out'], '%Y-%m-%d')
                if (check_in < booking_check_out and check_out > booking_check_in):
                    is_available = False
                    break
        if is_available:
            available_rooms.append(room)
    
    return jsonify(available_rooms)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)