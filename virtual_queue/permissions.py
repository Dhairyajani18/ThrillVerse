from rest_framework.permissions import BasePermission

class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff or request.user.is_superuser:
            return True
        return (
            hasattr(request.user, 'profile') and
            request.user.profile.role and
            str(request.user.profile.role).lower() in ['admin', 'staff']
        )

class IsQueueOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user == request.user
