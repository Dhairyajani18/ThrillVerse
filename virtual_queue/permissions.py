from rest_framework.permissions import BasePermission

class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role in ['Admin', 'Staff']
        )

class IsQueueOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user == request.user
