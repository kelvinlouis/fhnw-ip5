# -*- coding: utf-8 -*-

import json
import time
import json_graph
from graph_model import Graph

class gcloud_store(object):

    def __init__(self):
        pass

    def connect(self):
        pass

    def disconnect(self):
        pass

    def insert_graph(self, graph_json=''):
        _, sanatized_graph = json_graph.json_graph.json_to_graph(graph_json=graph_json, raw=False)
        now_timestamp = int(time.time())
        formated_timestamp = time.strftime("%d.%m.%Y %H:%M:%S", time.gmtime())
        name = 'Created on {}'.format(formated_timestamp)

        graph = Graph(name=name, timestamp=now_timestamp, json=sanatized_graph)
        
        graph_key = graph.put()

        return get_graph(graph_key.get())

    def get_all_graphs(self):
        graphs = []

        cursor = self.connection.cursor()
        cursor.execute("SELECT rowid, name, json FROM graphs")
        self.connection.commit()

        for identifier, name, graph_json in cursor.fetchall():
            jg = json_graph.json_graph(graph=graph_json, is_json=True)
            graph = {
                'id': identifier,
                'name': name
            }
            graph.update(jg.graph_to_json())
            graphs.append(graph)
        
        json_object = {'graphs': graphs}

        return json.JSONEncoder(ensure_ascii=False, allow_nan=False).encode(json_object)

    def get_graph(self, identifier):
        ds = datastore.Client()

        query = ds.query(kind='graph', order=('-timestamp',))
        query.add_filter('property', '=', 'val')


        cursor = self.connection.cursor()
        cursor.execute("SELECT rowid, name, json FROM graphs WHERE rowid=:id", {'id': identifier})
        self.connection.commit()
        
        identifier, name, graph_json = cursor.fetchone()
        if identifier:
            jg = json_graph.json_graph(graph=graph_json, is_json=True)
            graph = {
                'id': identifier,
                'name': name
            }
            graph.update(jg.graph_to_json())
        else:
            raise FileNotFoundError

        return json.JSONEncoder(ensure_ascii=False, allow_nan=False).encode(graph)

    def delete_graph(self, identifier):
        cursor = self.connection.cursor()
        cursor.execute("DELETE FROM graphs WHERE rowid=:id", {'id': identifier})
        self.connection.commit()

        if cursor.rowcount == 0:
            raise FileNotFoundError
        
        return True

    def import_graph(self, graph_json='', timestamp=0, name=''):
        jg = json_graph.json_graph(graph=json_graph.json_graph.import_graph(graph_json))
        graph_json = jg.graph_to_json(graph=None, metrics=False)

        if timestamp == 0:
            timestamp = int(time.time())
        if name == '':
            formated_timestamp = time.strftime("%d %m %Y %H:%M:%S", time.gmtime())
            name = 'Created on {}'.format(formated_timestamp)

        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO graphs VALUES (:name, :timestamp, :json)", {'name': name, 'timestamp': timestamp, 'json': graph_json})

        self.connection.commit()

        return
        