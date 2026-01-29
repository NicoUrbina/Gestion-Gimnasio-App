"""
Utility functions for audit logging
"""
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
import threading

# Thread-local storage for request context
_thread_locals = threading.local()


def get_current_request():
    """Get the current request from thread-local storage."""
    return getattr(_thread_locals, 'request', None)


def set_current_request(request):
    """Store the current request in thread-local storage."""
    _thread_locals.request = request


def clear_current_request():
    """Clear the current request from thread-local storage."""
    if hasattr(_thread_locals, 'request'):
        del _thread_locals.request


def get_client_ip(request):
    """
    Extract the real client IP address from the request.
    Handles proxy headers like X-Forwarded-For.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """Extract user agent string from request."""
    return request.META.get('HTTP_USER_AGENT', '')[:255]


def get_model_changes(instance, old_instance=None):
    """
    Compare two model instances and return a dict of changes.
    
    Args:
        instance: Current instance
        old_instance: Previous instance (if None, will try to fetch from DB)
    
    Returns:
        dict: {field_name: {'old': old_value, 'new': new_value}}
    """
    if old_instance is None:
        # Try to fetch the old instance from database
        try:
            old_instance = instance.__class__.objects.get(pk=instance.pk)
        except instance.__class__.DoesNotExist:
            # This is a new instance
            return None
    
    changes = {}
    
    # Get all fields except auto fields and relations
    for field in instance._meta.fields:
        field_name = field.name
        
        # Skip auto-generated fields
        if field.auto_created:
            continue
        
        # Skip primary key
        if field.primary_key:
            continue
        
        old_value = getattr(old_instance, field_name, None)
        new_value = getattr(instance, field_name, None)
        
        # Only record if changed
        if old_value != new_value:
            changes[field_name] = {
                'old': str(old_value) if old_value is not None else None,
                'new': str(new_value) if new_value is not None else None
            }
    
    return changes if changes else None


def log_action(user, action, obj=None, changes=None, extra_data=None, success=True, error_message=''):
    """
    Manually log an audit action.
    
    Args:
        user: User instance who performed the action
        action: Action type (CREATE, UPDATE, DELETE, etc.)
        obj: The object that was affected (optional)
        changes: Dict of changes for UPDATE actions
        extra_data: Additional context data
        success: Whether the action succeeded
        error_message: Error message if failed
    
    Returns:
        AuditLog instance
    """
    from .models import AuditLog
    
    # Get request context if available
    request = get_current_request()
    ip_address = get_client_ip(request) if request else None
    user_agent = get_user_agent(request) if request else ''
    
    # Prepare log data
    log_data = {
        'user': user,
        'action': action,
        'changes': changes,
        'extra_data': extra_data,
        'ip_address': ip_address,
        'user_agent': user_agent,
        'success': success,
        'error_message': error_message,
    }
    
    # Add object info if provided
    if obj:
        log_data['model_name'] = obj.__class__.__name__
        log_data['object_id'] = obj.pk if hasattr(obj, 'pk') else None
        log_data['object_repr'] = str(obj)[:255]
    
    # Create the log entry
    return AuditLog.objects.create(**log_data)


def get_model_name(instance):
    """Get the model name from an instance."""
    return instance.__class__.__name__


def should_log_model(model_name):
    """
    Determine if a model should be automatically logged.
    
    Args:
        model_name: Name of the model
    
    Returns:
        bool: True if should be logged
    """
    # Models to log
    logged_models = [
        'Payment',
        'Invoice',
        'Membership',
        'MembershipPlan',
        'MembershipFreeze',
        'Member',
        'GymClass',
        'Reservation',
        'User',
        'Staff',
        'AccessLog',
    ]
    
    return model_name in logged_models


def format_duration(duration):
    """Format a timedelta into a human-readable string."""
    if not duration:
        return "N/A"
    
    total_seconds = int(duration.total_seconds())
    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60
    
    parts = []
    if days > 0:
        parts.append(f"{days}d")
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0 or not parts:
        parts.append(f"{minutes}m")
    
    return " ".join(parts)
