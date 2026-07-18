"""
core.pagination
~~~~~~~~~~~~~~~
Custom paginator that wraps paginated results inside the project
success envelope:

    {
        "success": true,
        "count": ...,
        "next": ...,
        "previous": ...,
        "results": [ ... ]
    }

Register in settings.py → REST_FRAMEWORK["DEFAULT_PAGINATION_CLASS"].
"""

from collections import OrderedDict
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    """
    Page-number pagination with a standardised response envelope.

    Defaults:
        page_size      = 12   (project standard)
        max_page_size  = 100
        page_size_query_param = 'page_size'  (client can request fewer/more)
    """
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('success', True),
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
        ]))

    def get_paginated_response_schema(self, schema):
        """Schema override for drf-spectacular compatibility."""
        return {
            'type': 'object',
            'required': ['success', 'count', 'results'],
            'properties': {
                'success': {'type': 'boolean', 'example': True},
                'count': {'type': 'integer', 'example': 123},
                'next': {'type': 'string', 'nullable': True, 'format': 'uri'},
                'previous': {'type': 'string', 'nullable': True, 'format': 'uri'},
                'results': schema,
            },
        }
