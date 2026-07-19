import os
import django
from django.urls import get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def get_urls(resolver, prefix=''):
    for p in resolver.url_patterns:
        if hasattr(p, 'url_patterns'):
            get_urls(p, prefix + str(p.pattern))
        else:
            print(prefix + str(p.pattern))

get_urls(get_resolver())
