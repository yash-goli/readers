from rest_framework import serializers
from .models import BookItems, BookItemsDtl


class BookItemsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookItemsDtl
        # fields = ('barcode_id','available','status','cover_type','item_type')
        
class BookItemsSerializer(serializers.ModelSerializer):
    books = BookItemsDetailSerializer(many = True, read_only = True)
    
    class Meta:
        model = BookItems

class BookItemsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookItems
        fields = ('ISBN','title','author','item_type','cover_type','image','available_count','publisher','subject','total_count')
 
class BookItemsDtlSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookItems
        fields = ('ISBN','title','author','item_type','cover_type','image','available_count','publisher','subject','total_count')
        

