from django.db import models


class BookItems(models.Model):
    book_id = models.AutoField(primary_key = True) 
    ISBN = models.CharField(max_length = 30)
    title = models.CharField(max_length = 30)
    author = models.CharField(max_length = 30)
    item_type = models.CharField(max_length = 30)
    cover_type = models.CharField(max_length = 30)
    image = models.CharField(max_length = 30)
    book_rented_count = models.IntegerField(default = 0) 
    rent_price = models.CharField(max_length = 10)
    available_count = models.IntegerField(default = 1)
    publisher = models.CharField(max_length = 50)
    subject = models.CharField(max_length = 50)
    book_penalty = models.CharField(max_length = 30)
    total_count = models.IntegerField(default = 1)

    class Meta:
        db_table = "book_items"


class BookItemsDtl(models.Model):
    book_id = models.ForeignKey(BookItems, related_name = "books")
    barcode_id = models.CharField(max_length = 50)
    available = models.BooleanField(default = True)
    status = models.CharField(max_length = 50)
    cover_type = models.CharField(max_length = 30)
    item_type = models.CharField(max_length = 30)


    class Meta:
        db_table = "book_items_dtl"