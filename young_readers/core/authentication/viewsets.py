from .serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from compiler.viewsets import CustomModelViewSet
from compiler.permissions import IsAuthenticatedPermission
from django.http import HttpResponse
from rest_framework.decorators import detail_route

#import models
from core.authentication.models import Users, UserChilds
#import serializers
from core.authentication.serializers import UsersListSerializer, UsersDtlSerializer, UsersCreateSerializer, UsersUpdateSerializer, UserChildsSerializer


class UsersViewSet(CustomModelViewSet):
    """ All User profile Management """
    
    queryset = Users.objects.all()
    permission_classes = (IsAuthenticatedPermission,)
    
    parser = {
        'list':UsersListSerializer,
        'create':UsersCreateSerializer,
        'update':UsersUpdateSerializer,
        'retrieve':UsersDtlSerializer,
        'default':UsersListSerializer
    }


    lookup_field = "username"
    
    """ Only non logged in user can access """
    def create(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return Response({'message':'Invalid Operation'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            return super(UsersViewSet, self).create(*args, **kwargs)

    """ Only super user can see all user profiles """
    def list(self, *args, **kwargs):
        if self.request.user.is_superuser:
            return super(UsersViewSet, self).list(*args, **kwargs)
        else:
            return Response({'message':'Youre not Authorized'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ user can update only his detail but super user can see all other users """
    def update(self, *args, **kwargs):
        if self.request.user.username == kwargs['username']:
            return super(UsersViewSet, self).update(*args, **kwargs)
        else:
            return Response({'message':'Youre not Authorized'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


    """ user can retrieve only his detail but super user can see all other users """
    def retrieve(self, *args, **kwargs):
        if self.request.user.is_superuser:
            return super(UsersViewSet, self).retrieve(*args, **kwargs)
        else:
            if self.request.user.username == kwargs['username']:
                return super(UsersViewSet, self).retrieve(*args, **kwargs)
            else:
                return Response({'message':'Youre not Authorized'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ No one can delete user account including superuser """
    def destroy(self, *args, **kwargs):
        return Response({'message':'Invalid Request'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ User can change password using POST method """
    @detail_route(methods=['POST'])
    def password(self, request, *args, **kwargs):
        return HttpResponse("Ok")

    """ User can set notification of his account only """
    @detail_route(methods=['POST', 'GET'])
    def notifications(self, request, *args, **kwargs):
        return HttpResponse("Ok")

    """ Add/View/Delete childs """
    @detail_route(methods=['POST', 'GET', 'PATCH'])
    def childs(self, request, *args, **kwargs):
        if request.method == "GET":
            return HttpResponse("Get")
        if request.method == "POST":
            return HttpResponse("Post")
        if request.method == "PATCH":
            return HttpResponse("Patch")


