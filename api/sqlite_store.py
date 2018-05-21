# -*- coding: utf-8 -*-

import sqlite3
import json
import time
from json_graph import json_graph

class sqlite_store(object):

    def __init__(self):
        pass

    def connect(self, db):
        # Connect to database
        connection = sqlite3.connect(db)

        # Check if table already exists, create otherwise
        cursor = connection.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS graphs(name TEXT, timestamp INTEGER, graph_json TEXT, filter_json TEXT)")
        connection.commit()

        self.connection = connection

    def disconnect(self):
        self.connection.close()

    def insert_graph(self, graph_json=''):
        _, sanatized_graph, fields = json_graph.json_to_graph(graph_json=graph_json)
        now_timestamp = int(time.time())
        formated_timestamp = time.strftime("%d.%m.%Y %H:%M:%S", time.gmtime())

        if fields['name'] == '':
            name = 'Created on {}'.format(formated_timestamp)
        else:
            name = fields['name']

        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO graphs (name, timestamp, graph_json) VALUES (:name, :timestamp, :graph_json)", {'name': name, 'timestamp': now_timestamp, 'graph_json': sanatized_graph})
        generated_id = cursor.lastrowid

        self.connection.commit()

        return self.get_graph(generated_id)

    def recalculate_graph(self, id, graph_json=''):
        if not 'id' in graph_json:
            graph_json.update({'id': id})
        else:
            if graph_json['id'] != id:
                raise IndexError

        graph, _, fields = json_graph.json_to_graph(graph_json=graph_json)

        jg = json_graph(graph=graph)
        json_object = fields
        json_object.update(jg.graph_to_json())

        return json_object

    def get_all_graphs(self):
        graphs = []

        cursor = self.connection.cursor()
        cursor.execute("SELECT rowid, name, graph_json FROM graphs")
        self.connection.commit()
        
        for identifier, name, graph_json in cursor.fetchall():
            jg = json_graph(graph=graph_json, source='frontend')
            graph = {
                'id': identifier,
                'name': name
            }
            graph.update(jg.graph_to_json())
            graphs.append(graph)
        
        json_object = {'graphs': graphs}

        return json_object

    def get_graph(self, identifier):
        cursor = self.connection.cursor()
        cursor.execute("SELECT rowid, name, graph_json FROM graphs WHERE rowid=:id", {'id': identifier})
        self.connection.commit()
        
        row = cursor.fetchone()
        if row is None:
            raise FileNotFoundError

        identifier, name, graph_json = row
        jg = json_graph(graph=graph_json, source='frontend')
        graph = {
            'id': identifier,
            'name': name
        }
        graph.update(jg.graph_to_json())

        return graph

    def get_fields(self, fields):
        graphs = []

        cursor = self.connection.cursor()
        cursor.execute("SELECT rowid, timestamp, name FROM graphs")
        self.connection.commit()
        
        for identifier, timestamp, name in cursor.fetchall():
            graph = {}
            if 'id' in fields:
                graph['id'] = identifier
            if 'timestamp' in fields:
                graph['timestamp'] = timestamp
            if 'name' in fields:
                graph['name'] = name
            graphs.append(graph)
        
        json_object = {'graphs': graphs}

        return json_object

    def delete_graph(self, identifier):
        cursor = self.connection.cursor()
        cursor.execute("DELETE FROM graphs WHERE rowid=:id", {'id': identifier})
        self.connection.commit()

        if cursor.rowcount == 0:
            raise FileNotFoundError
        
        return True

    def get_filters(self, graph_id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT graph_json, filter_json FROM graphs WHERE rowid=:id", {'id': graph_id})
        self.connection.commit()
        
        row = cursor.fetchone()
        if row is None:
            raise FileNotFoundError

        graph_json, filter_json = row
        jg = json_graph(graph=graph_json, source='frontend')
        graph = jg.graph_to_json()

        if filter_json is None:
            filter = {'nodeSize': '', 'nodeColor': '', 'linkWidth': '', 'linkColor': ''}
        else:
            filter = json.loads(filter_json)

        node_size_metrics_list = [
            "in_degree",
            "in_degree_strengthen",
            "in_degree_weaken",
            "in_degree_weight",
            "in_degree_weight_absolute",
            "out_degree",
            "out_degree_strengthen",
            "out_degree_weaken",
            "out_degree_weight",
            "out_degree_weight_absolute"
            ]
        node_color_metrics_list = [
            "influence",
            ]

        for _, cycle in enumerate(graph['cycles']):
            node_color_metrics_list.append('cycle_{}'.format(cycle))

        edge_width_metrics_list = [
            "strengthen",
            "weaken",
            "weight",
            "weight_absolute"
            ]
        edge_color_metrics_list = [
            "sign",
            ]

        if not filter['nodeSize'] in node_size_metrics_list:
            filter['nodeSize'] = 'out_degree_weight_absolute'
        if not filter['nodeColor'] in node_color_metrics_list:
            filter['nodeColor'] = 'influence'
        if not filter['linkWidth'] in edge_width_metrics_list:
            filter['linkWidth'] = 'weight_absolute'
        if not filter['linkColor'] in edge_color_metrics_list:
            filter['linkColor'] = 'sign'

        filter['nodeEpochs'] = graph['influence_epochs']

        filter['nodeSizeOptions'] = node_size_metrics_list
        filter['nodeColorOptions'] = node_color_metrics_list
        filter['linkWidthOptions'] = edge_width_metrics_list
        filter['linkColorOptions'] = edge_color_metrics_list

        return {'filters': filter}

    def save_filters(self, graph_id, filter):
        set_filters = {}

        set_filters['nodeSize'] = filter['filters']['nodeSize']
        set_filters['nodeColor'] = filter['filters']['nodeColor']
        set_filters['linkWidth'] = filter['filters']['linkWidth']
        set_filters['linkColor'] = filter['filters']['linkColor']
        
        filter_json = json.dumps(set_filters, ensure_ascii=False)

        cursor = self.connection.cursor()
        cursor.execute("UPDATE graphs SET filter_json=:filter_json WHERE rowid=:id", {'filter_json': filter_json, 'id': graph_id})
        self.connection.commit()

        return self.get_filters(graph_id)

    def import_graph(self, graph_json='', timestamp=0, name=''):
        jg = json_graph(graph=graph_json, source='importer')
        graph_dict = jg.graph_to_json(graph=None, metrics=False)

        graph_json = json.JSONEncoder(ensure_ascii=False, allow_nan=False).encode(graph_dict)
        
        if timestamp == 0:
            now_timestamp = int(time.time())
        else:
            now_timestamp = int(timestamp)
        if name == '':
            formated_timestamp = time.strftime("%d %m %Y %H:%M:%S", time.gmtime())
            name = 'Created on {}'.format(formated_timestamp)

        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO graphs (name, timestamp, graph_json) VALUES (:name, :timestamp, :graph_json)", {'name': name, 'timestamp': now_timestamp, 'graph_json': graph_json})

        self.connection.commit()

        return
        