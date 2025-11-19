from pymongo import MongoClient
from django.conf import settings

_client = None
_db = None


def get_mongo_client():
    global _client
    if _client is None:
        _client = MongoClient(
            host=settings.MONGODB_SETTINGS['host'],
            port=settings.MONGODB_SETTINGS['port'],
            serverSelectionTimeoutMS=5000
        )
    return _client


def get_db():
    global _db
    if _db is None:
        client = get_mongo_client()
        _db = client[settings.MONGODB_SETTINGS['db']]
    return _db


def get_genes_collection():
    return get_db()['genes']


def get_variants_collection():
    return get_db()['genetic_variants']


def get_reports_collection():
    return get_db()['patient_variant_reports']
