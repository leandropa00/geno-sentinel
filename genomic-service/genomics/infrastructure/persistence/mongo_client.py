from __future__ import annotations

from functools import lru_cache
from typing import Any

from django.conf import settings
from pymongo import MongoClient


@lru_cache
def get_mongo_client() -> MongoClient[Any]:
    return MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)


def get_database():  # type: ignore[return-type]
    return get_mongo_client()[settings.MONGO_DB_NAME]
