# -*- coding: utf-8 -*-

import sqlite3
from time import gmtime, strftime
import json_graph

class sqlite_store(object):
    connection = None

    def __init__(self):
        pass

    def connect(self):
        # Connect to database
        connection = sqlite3.connect('graphdb.sqlite3')

        # Check if table already exists, create otherwise
        cursor = connection.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='graphs'")
        if cursor.rowcount == 0:
            cursor.execute("CREATE TABLE graphs(id INTEGER PRIMARY KEY, name TEXT, timestamp INTEGER, json TEXT)")
            connection.commit()

        sqlite_store.connection = connection

    def disconnect(self):
        sqlite_store.connection.close()

    def insert_graph(self, graph_json=''):
        jg = json_graph(graph=graph_json, is_json=True)
        sanatized_graph = jg.sanatize_graph()
        timestamp = gmtime()
        formated_timestamp = strftime("%d %m %Y %H:%M:%S", timestamp)
        name = 'Created on {}'.format(formated_timestamp)

        cursor = sqlite_store.connection.cursor()
        cursor.execute("INSERT INTO graphs VALUES (:name, :timestamp, :json)", {'name': name, 'timestamp': timestamp, 'json': sanatized_graph})
        generated_id = cursor.lastrowid

        sqlite_store.connection.commit()

        return generated_id
