from rest_framework import permissions

class AdminCheckPermission(permissions.BasePermission):
    """
    Global permission check for admin.
    """

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        else:
            return False

class IsAuthenticatedPermission(permissions.BasePermission):
    """
    To check whether an user is authenticated or not 
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated():
            return True
        else:
            if request.method == "POST":
                return True
            else:
                return False