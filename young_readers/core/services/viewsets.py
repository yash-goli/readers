from .serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from compiler.viewsets import CustomModelViewSet
from compiler.permissions import IsAuthenticatedPermission, AdminCheckPermission
from django.http import HttpResponse
from rest_framework.decorators import detail_route
import json
from datetime import datetime
from django.shortcuts import get_object_or_404

#import models
from core.services.models import BookItems, BookItemsDtl, Subscriptions, Transactions, Wishlist
#import serializers
from core.services.serializers import BookItemsSerializer, BookItemsListSerializer, BookItemsDtlSerializer, BookItemsDetailSerializer, SubscriptionsSerializer, TransactionsSerializer, TransactionsDtlSerializer, WishlistSerializer


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
    
    filter_fields = ('title', 'author')

    def filtering(self, params, queryset, user=None):
        if "title" in params and params['title'] != "":
            queryset = queryset.filter(title = params['title'])
        return queryset

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

    filter_fields = ('barcode_id', 'available')

    def filtering(self, params, queryset, user=None):
        if "barcode_id" in params and params['barcode_id'] != "":
            queryset = queryset.filter(barcode_id = params['barcode_id'])
        return queryset

    
    
class SubscriptionsViewSet(CustomModelViewSet):
    """ Subscription Management """

    queryset = Subscriptions.objects.all()
    permission_classes = [IsAuthenticatedPermission, AdminCheckPermission]

    parser = {
        'default':SubscriptionsSerializer
    }

    filter_fields = ('subscription_type','status','sub_st_date')

    def filtering(self, params, queryset, user=None):
        if "subscription_type" in params and params['subscription_type'] != "":
            queryset = queryset.filter(subscription_type = params['subscription_type'])
        return queryset


    """ No one can delete book items other than superuser """
    def destroy(self, *args, **kwargs):
        return Response({'message':'Invalid Request'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class TransactionsViewSet(CustomModelViewSet):
    """ Transaction Management """

    queryset = Transactions.objects.all()
    parser = {
        'retrieve':TransactionsDtlSerializer,
        'admin_retrieve':TransactionsSerializer,
        'default':TransactionsSerializer
    }

    """ Only admin can see all transactions and User can see his transactions only"""
    def list(self, *args, **kwargs):
        if self.request.user.is_superuser:
            queryset = Transactions.objects.all()
        else:
           queryset = Transactions.objects.all(user_id = self.request.user.pk)
        serializer = TransactionsSerializer(queryset, many=True)
        return Response(serializer.data)

    def populate(self, request, params, mode):
        if mode == "create":
            book_dtl = BookItemsDtl.objects.filter(book_id = params['data']['book_id'], available = True)
            if len(book_dtl) != 0:
                params['data']['barcode_id'] = book_dtl[0].pk
            else:
                return Response({'message':'Book is Out of Stock'}, status=status.HTTP_406_NOT_ACCEPTABLE)
            params['data']['order_id'] = "ORD" + datetime.now().strftime('%m%d%y%H%M%S')
            params['data']['date'] = datetime.now()
            params['data']['dof_request'] = datetime.now()
            return params['data']

    def post_save(self, obj, created):
        if created:
            wishlist_objs = Wishlist.objects.filter(book_id = obj.book_id, status = "order", user_id = obj.user_id)
            for wishlist_obj in wishlist_objs:
                wishlist_obj.delete()

    """ Admin can see any order detail but user can see his detail only """
    def retrieve(self, *args, **kwargs):
        if self.request.user.is_superuser:   
            queryset = Transactions.objects.all()
            instance = get_object_or_404(queryset, pk=kwargs['pk'])
            serializer = TransactionsSerializer(instance)
        else:
            queryset = Transactions.objects.filter(user_id = self.request.user.pk)
            instance = get_object_or_404(queryset, pk=kwargs['pk'])
            serializer = TransactionsDtlSerializer(instance)
        return Response(serializer.data)

    """ No one can delete Transactions """
    def destroy(self, *args, **kwargs):
        return Response({'message':'Invalid Request'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ Only subscribed user can make a tansaction """
    def create(self, *args, **kwargs):
        user = self.request.user
        sub_st_date = datetime.now() 
        subRef = Subscriptions.objects.filter(user_id = user, sub_end_date__gt = sub_st_date)
        
        if len(subRef) > 0:
            return super(TransactionsViewSet, self).create(*args, **kwargs)
        else:
            return Response({'message':'You\'re not a valid subscriber'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ Only administrator can update the transaction """
    def update(self, *args, **kwargs):
        if self.request.user.is_superuser:
            return super(TransactionsViewSet, self).update(*args, **kwargs)
        else:
            return Response({'message':'Invalid Request'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ only the requested user can cancel the request """
    @detail_route(methods = ['POST'])
    def cancel(self, *args, **kwargs):
        import pdb;pdb.set_trace()
        pass

class WishlistViewSet(CustomModelViewSet):
    """ Transaction Management """

    queryset = Wishlist.objects.all()
    permission_classes = [IsAuthenticatedPermission]
    parser = {
        'default':WishlistSerializer,
    }

    def filtering(self, params, queryset, user=None):
        if "user_id" in params and params['user_id'] != "":
            queryset = queryset.filter(user_id = params['user_id'])
        if "status" in params and params['status'] != "":
            queryset = queryset.filter(status = params['status'])
        return queryset

    """ User can see his own Wishlist """
    def list(self, *args, **kwargs):   
        # import pdb;pdb.set_trace()  
        if self.request.user.is_superuser:   
            queryset = Wishlist.objects.all()
        else:
            if self.request.user.is_authenticated():
                queryset = Wishlist.objects.all()
                if 'user_id' in self.request.GET and self.request.GET['user_id'] != "":
                    queryset = queryset.filter(user_id = self.request.GET['user_id'])
                if 'status' in self.request.GET and self.request.GET['status'] != "":
                    queryset = queryset.filter(status = self.request.GET['status'])
                serializer = WishlistSerializer(queryset, many=True)
                return Response(serializer.data)
            else:
                return Response({'message':'Invalid Operation'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    """ Only his Wishlist item will get retrieved """
    def retrieve(self, *args, **kwargs):
        if self.request.user.is_superuser:   
            queryset = Wishlist.objects.all()
        else:
            queryset = Wishlist.objects.filter(user_id = self.request.user.pk)
        instance = get_object_or_404(queryset, pk=kwargs['pk'])
        serializer = WishlistSerializer(instance)
        return Response(serializer.data)

    """ No one can update the wishlist """
    def update(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return super(WishlistViewSet, self).update(*args, **kwargs)            
        else:
            return Response({'message':'Invalid Operation'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        
