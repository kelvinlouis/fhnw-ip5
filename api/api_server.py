from flask import Flask, request
import os
import codecs
import gcloud_store
import json_graph

app = Flask(__name__)
store = gcloud_store.gcloud_store()
store.connect()

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/graph/<int:graph_id>', methods=['GET'])
def show_graph(graph_id):
    return store.get_graph(graph_id)

@app.route('/graph/', methods=['GET', 'POST'])
def show_graphs():
    if request.method == 'POST':
        if request.is_json:
            content = request.get_json()
            return store.insert_graph(graph_json=content)
        else:
            return 
    else:
        return store.get_all_graphs()

if __name__ == "__main__":
    app.run()
