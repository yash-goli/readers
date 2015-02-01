from .serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from compiler.viewsets import CustomModelViewSet
from compiler.permissions import IsAuthenticatedPermission, AdminCheckPermission
from django.http import HttpResponse
from rest_framework.decorators import detail_route
import json

#import models
from core.services.models import BookItems, BookItemsDtl
#import serializers
from core.services.serializers import BookItemsSerializer, BookItemsListSerializer, BookItemsDtlSerializer, BookItemsDetailSerializer


class BookItemsViewSet(CustomModelViewSet):
    """ All Book Items Management """
    
    queryset = BookItems.objects.all()
    
    parser = {
        'list':BookItemsListSerializer,
        'admin_list':BookItemsSerializer,
        'retrieve':BookItemsDtlSerializer,
        'admin_retrieve':BookItemsSerializer,
        'default':BookItemsSerializer
    }


    lookup_field = "book_id"
    
    """ Only admin can add books """
    def create(self, *args, **kwargs):
        if self.request.user.is_authenticated() and self.request.user.is_superuser:
            return super(BookItemsViewSet, self).create(*args, **kwargs)            
        else:
            return Response({'message':'Invalid Operation'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


    """ Only admin can edit books """
    def update(self, *args, **kwargs):
        if self.request.user.is_authenticated() and self.request.user.is_superuser:
            return super(BookItemsViewSet, self).update(*args, **kwargs)            
        else:
            return Response({'message':'Invalid Operation'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


    """ No one can delete book items other than superuser """
    def destroy(self, *args, **kwargs):
        if self.request.user.is_superuser:
            return super(BookItemsViewSet, self).destroy(*args, **kwargs)            
        else:
            return Response({'message':'Invalid Request'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



class BookItemsDetailViewSet(CustomModelViewSet):
    """ All Book Items Management """
    
    queryset = BookItemsDtl.objects.all()
    permission_classes = [IsAuthenticatedPermission, AdminCheckPermission]
    
    parser = {
        'default':BookItemsDetailSerializer
    }


    lookup_field = "barcode_id"
    
    
