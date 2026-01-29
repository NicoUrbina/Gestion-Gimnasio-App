"""
Django signals for automatic audit logging
"""
from django.db.models.signals import post_save, post_delete
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
from django.utils import timezone
from .models import AuditLog, UserSession
from .utils import (
    log_action, 
    get_model_changes, 
    get_model_name, 
    should_log_model,
    get_current_request,
    get_client_ip,
    get_user_agent
)


# Track instances before save to detect changes
_pre_save_instances = {}


@receiver(post_save)
def log_model_save(sender, instance, created, **kwargs):
    """
    Automatically log CREATE and UPDATE actions for important models.
    """
    model_name = get_model_name(instance)
    
    # Skip audit log itself to prevent recursion
    if model_name == 'AuditLog' or model_name == 'UserSession':
        return
    
    # Only log specific models
    if not should_log_model(model_name):
        return
    
    # Get the user from request context
    request = get_current_request()
    user = request.user if request and request.user.is_authenticated else None
    
    # Determine action and changes
    if created:
        action = 'CREATE'
        changes = None
    else:
        action = 'UPDATE'
        # Try to get the old instance from cache
        cache_key = f"{model_name}_{instance.pk}"
        old_instance = _pre_save_instances.get(cache_key)
        changes = get_model_changes(instance, old_instance)
        
        # Clean up cache
        if cache_key in _pre_save_instances:
            del _pre_save_instances[cache_key]
    
    # Log the action
    log_action(
        user=user,
        action=action,
        obj=instance,
        changes=changes
    )


@receiver(post_delete)
def log_model_delete(sender, instance, **kwargs):
    """
    Automatically log DELETE actions.
    """
    model_name = get_model_name(instance)
    
    # Skip audit log itself
    if model_name == 'AuditLog' or model_name == 'UserSession':
        return
    
    # Only log specific models
    if not should_log_model(model_name):
        return
    
    # Get the user from request context
    request = get_current_request()
    user = request.user if request and request.user.is_authenticated else None
    
    # Log the deletion
    log_action(
        user=user,
        action='DELETE',
        obj=instance
    )


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """
    Log user login and create session tracking.
    """
    ip_address = get_client_ip(request)
    user_agent = get_user_agent(request)
    
    # Create user session
    session_key = request.session.session_key
    if session_key:
        UserSession.objects.create(
            user=user,
            session_key=session_key,
            ip_address=ip_address,
            user_agent=user_agent,
            is_active=True
        )
    
    # Log the login action
    log_action(
        user=user,
        action='LOGIN',
        extra_data={
            'ip': ip_address,
            'user_agent': user_agent
        }
    )


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    """
    Log user logout and update session.
    """
    if user:
        # Update session
        session_key = request.session.session_key
        if session_key:
            try:
                session = UserSession.objects.filter(
                    user=user,
                    session_key=session_key,
                    is_active=True
                ).first()
                
                if session:
                    session.logout_time = timezone.now()
                    session.is_active = False
                    session.save()
            except Exception:
                pass
        
        # Log the logout
        log_action(
            user=user,
            action='LOGOUT'
        )


@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    """
    Log failed login attempts for security monitoring.
    """
    ip_address = get_client_ip(request)
    user_agent = get_user_agent(request)
    
    # Log failed login
    AuditLog.objects.create(
        user=None,  # No user since login failed
        action='FAILED_LOGIN',
        model_name='User',
        object_repr=credentials.get('email', 'Unknown'),
        ip_address=ip_address,
        user_agent=user_agent,
        success=False,
        error_message='Intento de login fallido',
        extra_data={
            'attempted_email': credentials.get('email', 'Unknown')
        }
    )


# Custom signals for business logic
from django.dispatch import Signal

# Signal for payment approval
payment_approved = Signal()
payment_rejected = Signal()

# Signal for membership changes
membership_frozen = Signal()
membership_unfrozen = Signal()


@receiver(payment_approved)
def log_payment_approval(sender, payment, approved_by, **kwargs):
    """Log payment approval action."""
    log_action(
        user=approved_by,
        action='APPROVE',
        obj=payment,
        extra_data={
            'amount': str(payment.amount),
            'member': payment.member.user.get_full_name(),
            'payment_method': payment.payment_method
        }
    )


@receiver(payment_rejected)
def log_payment_rejection(sender, payment, rejected_by, reason, **kwargs):
    """Log payment rejection action."""
    log_action(
        user=rejected_by,
        action='REJECT',
        obj=payment,
        extra_data={
            'amount': str(payment.amount),
            'member': payment.member.user.get_full_name(),
            'reason': reason
        }
    )


@receiver(membership_frozen)
def log_membership_freeze(sender, membership, user, days, **kwargs):
    """Log membership freeze action."""
    log_action(
        user=user,
        action='FREEZE',
        obj=membership,
        extra_data={
            'member': membership.member.user.get_full_name(),
            'plan': membership.plan.name,
            'freeze_days': days
        }
    )


@receiver(membership_unfrozen)
def log_membership_unfreeze(sender, membership, user, **kwargs):
    """Log membership unfreeze action."""
    log_action(
        user=user,
        action='UNFREEZE',
        obj=membership,
        extra_data={
            'member': membership.member.user.get_full_name(),
            'plan': membership.plan.name
        }
    )
