import os
import json
from flask import Flask, render_template, request, jsonify, send_from_directory, abort, url_for
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
PINS_FILE = os.path.join(DATA_DIR, 'pins.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

if not os.path.exists(PINS_FILE):
    with open(PINS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)


def read_pins():
    with open(PINS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def write_pins(pins):
    with open(PINS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pins, f, ensure_ascii=False, indent=2)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/pins', methods=['GET'])
def get_pins():
    pins = read_pins()
    return jsonify(pins)


@app.route('/api/pins', methods=['POST'])
def create_pin():
    if 'city' not in request.form or 'country' not in request.form or 'product_name' not in request.form:
        return jsonify({'error': 'Expects city, country, product_name'}), 400

    try:
        lat = float(request.form.get('latitude', ''))
        lng = float(request.form.get('longitude', ''))
    except ValueError:
        return jsonify({'error': 'Invalid coordinates'}), 400

    city = request.form['city'].strip()
    country = request.form['country'].strip()
    product_name = request.form['product_name'].strip()
    product_description = request.form.get('product_description', '').strip()

    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            if not allowed_file(file.filename):
                return jsonify({'error': 'Invalid file type'}), 400
            filename = secure_filename(file.filename)
            abs_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(abs_path)
            image_url = url_for('uploaded_file', filename=filename)

    pins = read_pins()
    pin_id = len(pins) + 1
    new_pin = {
        'id': pin_id,
        'latitude': lat,
        'longitude': lng,
        'city': city,
        'country': country,
        'product_name': product_name,
        'product_description': product_description,
        'image_url': image_url,
    }
    pins.append(new_pin)
    write_pins(pins)
    return jsonify(new_pin), 201


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large. Max size 5MB'}), 413


import os
import json
from flask import Flask, render_template, request, jsonify, send_from_directory, abort, url_for
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
PINS_FILE = os.path.join(DATA_DIR, 'pins.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

if not os.path.exists(PINS_FILE):
    with open(PINS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)


def read_pins():
    with open(PINS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def write_pins(pins):
    with open(PINS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pins, f, ensure_ascii=False, indent=2)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/pins', methods=['GET'])
def get_pins():
    pins = read_pins()
    return jsonify(pins)


@app.route('/api/pins', methods=['POST'])
def create_pin():
    if 'city' not in request.form or 'country' not in request.form or 'product_name' not in request.form:
        return jsonify({'error': 'Expects city, country, product_name'}), 400

    try:
        lat = float(request.form.get('latitude', ''))
        lng = float(request.form.get('longitude', ''))
    except ValueError:
        return jsonify({'error': 'Invalid coordinates'}), 400

    city = request.form['city'].strip()
    country = request.form['country'].strip()
    product_name = request.form['product_name'].strip()
    product_description = request.form.get('product_description', '').strip()

    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            if not allowed_file(file.filename):
                return jsonify({'error': 'Invalid file type'}), 400
            filename = secure_filename(file.filename)
            abs_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(abs_path)
            image_url = url_for('uploaded_file', filename=filename)

    pins = read_pins()
    pin_id = len(pins) + 1
    new_pin = {
        'id': pin_id,
        'latitude': lat,
        'longitude': lng,
        'city': city,
        'country': country,
        'product_name': product_name,
        'product_description': product_description,
        'image_url': image_url,
    }
    pins.append(new_pin)
    write_pins(pins)
    return jsonify(new_pin), 201


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large. Max size 5MB'}), 413


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

