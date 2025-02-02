import os

from decouple import config

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class Config:
    """Defines base class configuration"""

    SECRET_KEY = config("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = config("SQLALCHEMY_TRACK_MODIFICATIONS", cast=bool)


class DevConfig(Config):
    """Defines development configuration"""

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "dev.db")
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProdConfig(Config):
    """Defines production configuration"""
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI = config('DATABASE_URL')
    DEBUG = config("DEBUG", cast=bool)
    SQLALCHEMY_ECHO = config("ECHO", cast=bool)
    SQLALCHEMY_TRACK_MODIFICATIONS = config("SQLALCHEMY_TRACK_MODIFICATIONS", cast=bool)