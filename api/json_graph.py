# -*- coding: utf-8 -*-

import codecs
import json
from math import copysign
import networkx as nx
from collections import defaultdict

class json_graph(object):
    def __init__(self, graph=None, source=''):
        if source == 'frontend':
            self.graph, _, _ = json_graph.json_to_graph(graph_json=graph)
        elif source == 'importer':
            self.graph = json_graph.import_graph(graph)
        else:
            self.graph = graph

    # Extracts action systems from loaded data
    @staticmethod
    def get_action_systems(data):
        entries = {}
        
        for _, entry in enumerate(data):
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
        """Generate a NetworkX graph from original JSON files.

        Keyword arguments:
        graph_json -- JSON encoded string in original structure
        """
        
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
                    sign = int(copysign(1, weight))
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
            for _, weight in enumerate(weights):
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
        for _, weight in enumerate(weights):
            metric_data['degree_{}'.format(weight)] = graph.degree(weight=weight)
            metric_data['in_degree_{}'.format(weight)] = graph.in_degree(weight=weight)
            metric_data['out_degree_{}'.format(weight)] = graph.out_degree(weight=weight)
        
        metric_data['degree'] = graph.degree()
        metric_data['in_degree'] = graph.in_degree()
        metric_data['out_degree'] = graph.out_degree()

        return metric_data

    def graph_to_json(self, graph=None, metrics=True):
        """Generate a JSON formated string of the graph object with all possible
        and enabled metrics provided by networkx

        Keyword arguments:
        graph -- the graph for which metrics should be generated
        metrics -- if metrics shound be included in output
        """
        
        if graph == None:
            graph = self.graph

        json_object = {}
        nodes = []
        links = []
        
        # If a key does not exist on access, generate empty list
        # So every node gets a 'cycle' attribute, even if it's just an empty list
        cycles = defaultdict(list)
        
        # Create node_metrics list
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
                for _, node in enumerate(cycle):
                    cycles[node].append(i)
            
        # Fill 'nodes' dict
        for i, (node_id, node_attributes) in enumerate(graph.nodes(data=True)):
            attributes = {
                'id': node_attributes['id'],
                'label': node_attributes['label'],
                'influence': node_attributes['influence'],
                'actionSystemId': node_attributes['actionSystemId'],
                'actionSystem':node_attributes['actionSystem'],
            }

            if metrics:
                attributes['cycles'] = cycles[node_attributes['id']]
                for _, metric in enumerate(node_metrics):
                    if not node_metrics[metric] is None:
                        attributes[metric] = node_metrics[metric][node_attributes['id']]
            
            nodes.append(attributes)

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
        for (from_node, to_node, edge_attributes) in graph.edges(data=True):
            attributes = {
                'source': from_node,
                'target': to_node,
                'weight': edge_attributes['weight'],
                'weight_absolute': edge_attributes['weight_absolute'],
                'strengthen': edge_attributes['strengthen'],
                'weaken': edge_attributes['weaken'],
                'sign': edge_attributes['sign'],
            }

            if metrics:
                for _, metric in enumerate(edge_metrics):
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
    def json_to_graph(graph_json=''):
        """Generate a NetworkX graph, JSON encoded string of graph without metrics,
        and a fields dictionary containing the metadata

        Keyword arguments:
        graph_json -- JSON encoded string/object of graph
        """

        if isinstance(graph_json, str):
            json_graph_object = json.JSONDecoder().decode(graph_json)
        else:
            json_graph_object = graph_json
        

        graph = nx.MultiDiGraph()
        sanatized_graph_json = {}
        fields = {}

        if not isinstance(graph_json, str):
            if 'id' in json_graph_object:
                fields['id'] = json_graph_object['id']
            fields['name'] = json_graph_object['name']
        
        for _, graph_attribute in enumerate(json_graph_object):
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
                    graph.add_node(node['id'], id=node['id'], 
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
