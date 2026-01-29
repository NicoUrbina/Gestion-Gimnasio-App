"""
Audit Middleware
Captures HTTP request context for audit logging
"""
from .utils import set_current_request, clear_current_request


class AuditMiddleware:
    """
    Middleware to store the current request in thread-local storage.
    This allows signal handlers to access request information like IP and user agent.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Store request in thread-local storage
        set_current_request(request)
        
        try:
            response = self.get_response(request)
        finally:
            # Clear request from thread-local storage
            clear_current_request()
        
        return response
