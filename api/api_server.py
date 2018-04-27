from flask import Flask, request
import os
import codecs
import sqlite_store
import json_graph

app = Flask(__name__)
store = sqlite_store.sqlite_store()
store.connect()

path = 'data/dataset_20180403/'
imported_path = 'data/dataset_20180403/imported/'
if not os.path.exists(imported_path):
    os.makedirs(imported_path)

files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
for file in files:
    filename = os.path.join(path, file)
    opened_file = codecs.open(filename, "r", "utf-8-sig")
    import_json = opened_file.read()
    opened_file.close()
    file_timestamp = os.path.getmtime(filename)
    store.import_graph(graph_json=import_json, timestamp=file_timestamp, name=file)
    os.rename(filename, os.path.join(imported_path, file))

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/graph/<int:graph_id>', methods=['GET'])
def show_graph(graph_id):
    return store.get_graph(graph_id)

@app.route('/graph/', methods=['GET', 'PUT'])
def show_graphs():
    if request.method == 'PUT':
        if request.is_json:
            content = request.get_json()
            return store.insert_graph(graph_json=content)
        else:
            return 
    else:
        return store.get_all_graphs()

if __name__ == "__main__":
    app.run()
