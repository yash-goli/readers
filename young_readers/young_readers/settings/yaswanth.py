from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'youngreaders',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'integra',
        'PASSWORD': 'integra',
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
        'ATOMIC_REQUESTS': True,    #to wrap http request/response cycle into a transaction
    }
}
