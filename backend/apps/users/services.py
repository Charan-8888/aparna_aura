from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

def create_user(email, password, first_name, last_name, role='customer'):
    try:
        validate_password(password)
    except ValidationError as e:
        raise ValueError(e.messages)

    if User.objects.filter(email=email).exists():
        raise ValueError(["User with this email already exists."])
        
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=role
    )
    return user

def change_user_password(user, old_password, new_password):
    if not user.check_password(old_password):
        raise ValueError(["Incorrect old password."])
        
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        raise ValueError(e.messages)
        
    user.set_password(new_password)
    user.save()
    return user

def request_password_reset(email):
    """
    Mock implementation of forgot password. 
    In production, generate a reset token, store it, and email a reset link.
    """
    user = User.objects.filter(email=email).first()
    if user:
        # Mock logic to simulate token generation and email dispatch
        print(f"[MOCK] Password reset link sent to {email}")
    return True

def reset_password(token, new_password):
    """
    Mock implementation of reset password.
    In production, verify the token and apply the new password.
    """
    try:
        validate_password(new_password)
    except ValidationError as e:
        raise ValueError(e.messages)
        
    if not token or token == "invalid":
        raise ValueError(["Invalid or expired reset token."])
    
    # Mock logic: update user password based on token verification
    print(f"[MOCK] Password reset successful using token.")
    return True
