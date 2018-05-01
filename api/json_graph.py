# -*- coding: utf-8 -*-

import codecs
import json
import numpy as np
import networkx as nx
from collections import defaultdict

class json_graph(object):
    def __init__(self, graph=None, source=''):
        if source == 'frontend':
            self.graph, _, _ = json_graph.json_to_graph(graph_json=graph, raw=True)
        elif source == 'importer':
            self.graph = json_graph.import_graph(graph)
        else:
            self.graph = graph

    # Extracts action systems from loaded data
    @staticmethod
    def get_action_systems(data):
        entries = {}
        
        for i, entry in enumerate(data):
            entries[entry['id']] = entry['name']
        
        return entries

    @staticmethod
    def get_life_entries(data, action_systems):
        identifier = {}
        labels = {}
        node_action_systems_id = {}
        node_action_systems = {}
        influences = {}
        
        for i, entry in enumerate(data):
            identifier[i] = entry['id']
            labels[i] = entry['title']
            node_action_systems_id[i] = entry['actionSystemId']
            node_action_systems[i] = action_systems[entry['actionSystemId']]
            influences[i] = entry['influence']
        
        return identifier, labels, node_action_systems_id, node_action_systems, influences

    # Loads the inital json and creates a networkx multidi graph
    @staticmethod
    def import_graph(graph_json):
        json_data = json.JSONDecoder().decode(graph_json)
        action_systems = {}

        # Get action systems
        action_systems = json_graph.get_action_systems(json_data['actionSystems'])

        edge_weight_map = { '++': 2, '+': 1, '0': 0, '-': -1, '--': -2 }

        graph = nx.MultiDiGraph()

        for i, life_entry in enumerate(json_data['lifeEntries']):
            graph.add_node(i, id=life_entry['id'], 
                        label=str(life_entry['title']), 
                        influence=int(life_entry['influence']),
                        actionSystemId=life_entry['actionSystemId'],
                        actionSystem=str(action_systems[life_entry['actionSystemId']]))
        
        for i, connection_row in enumerate(json_data['connections']):
            for j, connection_cell in enumerate(connection_row):
                if connection_cell != '0':
                    source = json_data['lifeEntries'][i]['id']
                    target = json_data['lifeEntries'][j]['id']
                    weight = int(edge_weight_map[connection_cell])
                    weight_absolute = int(abs(weight))
                    sign = int(np.sign(weight))
                    strengthen = int(weight_absolute if sign == 1 else 0)
                    weaken = int(weight_absolute if sign == -1 else 0)
                    
                    graph.add_edge(source, target, source=source,
                            target=target,
                            weight=weight,
                            weight_absolute=weight_absolute,
                            strengthen=strengthen,
                            weaken=weaken,
                            sign=sign)
        
        return graph

    def generate_metric(self, graph, metric_name, metric_function, weights=[]):
        """Generate a Dictonary of all nodes/edges metrics returned by func
        If weight list is provided a emtry will be generated for each weight

        Keyword arguments:
        graph -- the graph for which metrics should be generated
        metric_name -- key in dictionary for this metric
        metric_function -- function to calculate metric, func(G [, weight=weights])
        weights -- list of weight attribute names in graph (default [])
        """
        
        metric_data = {}
        if len(weights) == 0:
            # Metric is unweighted
            metric_data[metric_name] = metric_function(graph)
        else:
            # Metric is weighted, go though every weight attribute
            for i, weight in enumerate(weights):
                metric_data['{}_{}'.format(metric_name, weight)] = metric_function(graph, weight=weight)
                
        return metric_data

    def rebuild_metric(self, graph, weights=[]):
        """Generate a Dictonary of all nodes/edges metrics provided by networkx
        If weight list is provided a emtry will be generated for each weight

        Keyword arguments:
        graph -- the graph for which metrics should be generated
        weights -- list of weight attribute names in graph (default [])
        """
        
        metric_data = {}
        temp_data = {}
        for i, weight in enumerate(weights):
            temp_data['degree_{}'.format(weight)] = graph.degree(weight=weight)
            temp_data['in_degree_{}'.format(weight)] = graph.in_degree(weight=weight)
            temp_data['out_degree_{}'.format(weight)] = graph.out_degree(weight=weight)
        
        temp_data['degree'] = graph.degree()
        temp_data['in_degree'] = graph.in_degree()
        temp_data['out_degree'] = graph.out_degree()
        
        for i, metric in enumerate(temp_data):
            metric_data[metric] = {}
            for j, (node_id, value) in enumerate(temp_data[metric]):
                metric_data[metric][node_id] = value
        
        return metric_data

    def graph_to_json(self, graph=None, metrics=True):
        """Generate a JSON formated string og the graph object with all possible
        metrics provided by networkx

        Keyword arguments:
        graph -- the graph for which metrics should be generated
        """
        
        if graph == None:
            graph = self.graph

        json_object = {}
        nodes = []
        links = []
        
        # If a key does not exist on access, generate empty list
        # So every node gets a 'cycle' attribute, even if it's just an empty list
        cycles = defaultdict(list)
        
        # Get attributes from nodes (generated by JSON importer)
        identifier = nx.get_node_attributes(graph, name='id')
        labels = nx.get_node_attributes(graph, name='label')
        action_systems_id = nx.get_node_attributes(graph, name='actionSystemId')
        action_systems = nx.get_node_attributes(graph, name='actionSystem')
        influences = nx.get_node_attributes(graph, name='influence')
        
        node_metrics = {'influence': None}

        # Get all possible directed graph metrics and add them to 'node_metrics' dict
        if metrics:
            degree_metrics = self.rebuild_metric(graph, ['weight','weight_absolute','strengthen','weaken'])
            node_metrics.update(degree_metrics)
            # degree_centrality = self.generate_metric(graph, 'degree_centrality', nx.degree_centrality)
            # node_metrics.update(degree_centrality)
            # in_degree_centrality = self.generate_metric(graph, 'in_degree_centrality', nx.in_degree_centrality)
            # node_metrics.update(in_degree_centrality)
            # out_degree_centrality = self.generate_metric(graph, 'out_degree_centrality', nx.out_degree_centrality)
            # node_metrics.update(out_degree_centrality)
            # eigenvector_centrality_numpy = self.generate_metric(graph, 'eigenvector_centrality_numpy', nx.eigenvector_centrality_numpy)
            # node_metrics.update(eigenvector_centrality_numpy)
            # eigenvector_centrality_numpy_weighted = self.generate_metric(graph, 'eigenvector_centrality_numpy', nx.eigenvector_centrality_numpy, ['weight','weight_absolute','strengthen','weaken'])
            # node_metrics.update(eigenvector_centrality_numpy_weighted)
            # closeness_centrality = self.generate_metric(graph, 'closeness_centrality', nx.degree_centrality)
            # node_metrics.update(closeness_centrality)
            # betweenness_centrality = self.generate_metric(graph, 'betweenness_centrality', nx.betweenness_centrality)
            # node_metrics.update(betweenness_centrality)
            # betweenness_centrality_weighted = self.generate_metric(graph, 'betweenness_centrality', nx.betweenness_centrality, ['weight','weight_absolute','strengthen','weaken'])
            # node_metrics.update(betweenness_centrality_weighted)
            # load_centrality = self.generate_metric(graph, 'load_centrality', nx.load_centrality)
            # node_metrics.update(load_centrality)
            # load_centrality_weighted = self.generate_metric(graph, 'load_centrality', nx.load_centrality, ['weight_absolute','strengthen','weaken'])
            # node_metrics.update(load_centrality_weighted)
            # harmonic_centrality = self.generate_metric(graph, 'harmonic_centrality', nx.harmonic_centrality)
            # node_metrics.update(harmonic_centrality)
            # betweenness_centrality_weighted = self.generate_metric(graph, 'betweenness_centrality', nx.betweenness_centrality, ['weight','weight_absolute','strengthen','weaken'])
            # node_metrics.update(betweenness_centrality_weighted)

            self.node_metrics_list = sorted(list(node_metrics.keys()))
        
            # Find cycles and build a 'cycle id' list
            # Nodes with the same 'cycle id' belong to the same cycle
            cycles_list = []
            for i, cycle in enumerate(list(nx.simple_cycles(graph))):
                cycles_list.append(i)
                for j, node in enumerate(cycle):
                    cycles[node].append(i)
            
        # Fill 'nodes' dict
        for i in range(len(identifier)):
            attributes = {
                'id': identifier[i],
                'label': labels[i],
                'influence': influences[i],
                'actionSystemId': action_systems_id[i],
                'actionSystem': action_systems[i],
            }

            if metrics:
                attributes['cycles'] = cycles[identifier[i]]
                for k, metric in enumerate(node_metrics):
                    if not node_metrics[metric] is None:
                        attributes[metric] = node_metrics[metric][identifier[i]]
            
            nodes.append(attributes)

        # Get attributes from edges (generated by JSON importer)
        weight_absolute = nx.get_edge_attributes(graph, name='weight_absolute')
        strengthen = nx.get_edge_attributes(graph, name='strengthen')
        weaken = nx.get_edge_attributes(graph, name='weaken')
        sign = nx.get_edge_attributes(graph, name='sign')

        edge_metrics = {'weight':None, 'weight_absolute': None, 'strengthen': None, 'weaken': None, 'sign': None}
        
        # Get all possible directed graph metrics and add them to 'edge_metrics' dict
        if metrics:
            # edge_betweenness_centrality = self.generate_metric(graph, 'edge_betweenness_centrality', nx.edge_betweenness_centrality)
            # edge_metrics.update(edge_betweenness_centrality)
            # edge_betweenness_centrality_weighted = self.generate_metric(graph, 'edge_betweenness_centrality', nx.edge_betweenness_centrality, weights=['weight','weight_absolute','strengthen','weaken'])
            # edge_metrics.update(edge_betweenness_centrality_weighted)
            # edge_load_centrality = self.generate_metric(graph, 'edge_load_centrality', nx.edge_load_centrality)
            # edge_metrics.update(edge_load_centrality)
            
            self.edge_metrics_list = sorted(list(edge_metrics.keys()))
        
        # Fill 'links' dict
        for (from_node, to_node, weight) in graph.edges(data='weight'):
            attributes = {
                'source': from_node,
                'target': to_node,
                'weight': weight,
                'weight_absolute': weight_absolute[(from_node, to_node, 0)],
                'strengthen': strengthen[(from_node, to_node, 0)],
                'weaken': weaken[(from_node, to_node, 0)],
                'sign': sign[(from_node, to_node, 0)]
            }

            if metrics:
                for k, metric in enumerate(edge_metrics):
                    if not edge_metrics[metric] is None:
                        attributes[metric] = edge_metrics[metric][(from_node, to_node)]
                    
            links.append(attributes)
        
        if metrics:
            json_object['cycles'] = cycles_list
            #json_object['nodeProperties'] = node_metrics_list
            #json_object['edgeProperties'] = edge_metrics_list
        json_object['nodes'] = nodes
        json_object['links'] = links
        
        return json_object

    @staticmethod
    def json_to_graph(graph_json='', raw=True):
        if raw:
            json_graph_object = json.JSONDecoder().decode(graph_json)
        else:
            json_graph_object = graph_json
        

        graph = nx.MultiDiGraph()
        sanatized_graph_json = {}
        fields = {}

        if raw == False:
            if 'id' in json_graph_object:
                fields['id'] = json_graph_object['id']
            fields['name'] = json_graph_object['name']
        
        for i, graph_attribute in enumerate(json_graph_object):
            if graph_attribute == 'nodes':
                sanatized_graph_json[graph_attribute] = []
                for j, node in enumerate(json_graph_object[graph_attribute]):
                    node_attributes = {
                        'id': node['id'],
                        'label': node['label'],
                        'influence': node['influence'],
                        'actionSystemId': node['actionSystemId'],
                        'actionSystem': node['actionSystem']
                    }
                    graph.add_node(j, id=node['id'], 
                        label=node['label'], 
                        influence=node['influence'],
                        actionSystemId=node['actionSystemId'],
                        actionSystem=node['actionSystem'])
                    sanatized_graph_json[graph_attribute].append(node_attributes)
            elif graph_attribute == 'links':
                sanatized_graph_json[graph_attribute] = []
                for j, edge in enumerate(json_graph_object[graph_attribute]):
                    edge_attributes = {
                        'source': edge['source'],
                        'target': edge['target'],
                        'weight': edge['weight'],
                        'weight_absolute': edge['weight_absolute'],
                        'strengthen': edge['strengthen'],
                        'weaken': edge['weaken'],
                        'sign': edge['sign']
                    }
                    graph.add_edge(edge['source'], edge['target'], source=edge['source'],
                        target=edge['target'],
                        weight=edge['weight'],
                        weight_absolute=edge['weight_absolute'],
                        strengthen=edge['strengthen'],
                        weaken=edge['weaken'],
                        sign=edge['sign'])
                    sanatized_graph_json[graph_attribute].append(edge_attributes)

        sanatized_graph_json = json.JSONEncoder(ensure_ascii=False, allow_nan=False).encode(sanatized_graph_json)

        return graph, sanatized_graph_json, fields
