from flask import Flask, request, jsonify
import os
import codecs
import sqlite_store
import json_graph

app = Flask(__name__)
app.config.update(
    DATABASE='graphdb.sqlite3',
    JSON_SORT_KEYS=False,
    JSON_AS_ASCII=False
)

store = sqlite_store.sqlite_store()
store.connect(app.config['DATABASE'])

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
    print('Importing file: {}'.format(filename))
    store.import_graph(graph_json=import_json, timestamp=file_timestamp, name=file)
    os.rename(filename, os.path.join(imported_path, file))

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/api/graph/<int:graph_id>', methods=['GET','DELETE'])
def show_graph(graph_id):
    if request.method == 'GET':
        try:
            return jsonify(store.get_graph(graph_id))
        except FileNotFoundError:
            return not_found()
    elif request.method == 'DELETE':
        try:
            if store.delete_graph(graph_id):
                content = {'message': 'graph deleted'}
                return jsonify(content)
        except FileNotFoundError:
            return not_found()

@app.route('/api/graph/<int:graph_id>/snapshot', methods=['POST'])
def recalculate_graph(graph_id):
    if request.is_json:
        content = request.get_json()
        try:
            return jsonify(store.recalculate_graph(graph_id, graph_json=content))
        except IndexError:
            message = {
                'status': 400,
                'message': 'id in body does not match id in resource path',
            }
            resp = jsonify(message)
            resp.status_code = 400
            return resp
    else:
        return 

@app.route('/api/graph/', methods=['GET', 'POST'])
def show_graphs():
    if request.method == 'POST':
        if request.is_json:
            content = request.get_json()
            return jsonify(store.insert_graph(graph_json=content))
        else:
            return 
    else:        
        if 'fields' in request.args:
            return jsonify(store.get_fields(request.args['fields']))
        else:
            return jsonify(store.get_all_graphs())

@app.errorhandler(404)
def not_found(error=None):
    message = {
            'status': 404,
            'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp

if __name__ == "__main__":
    app.run()
