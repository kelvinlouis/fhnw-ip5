from google.appengine.ext import ndb

class Graph(ndb.Model):
    name = ndb.StringProperty()
    timestamp = ndb.IntegerProperty()
    json = ndb.TextProperty()