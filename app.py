
from flask import Flask, render_template, request, send_file
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

@app.route('/')
def index():
    return 'RAMS/CPP Generator - MVP Home Page'

if __name__ == '__main__':
    app.run(debug=True)
