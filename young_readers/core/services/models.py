from django.db import models
from core.authentication.models import Users

class BookItems(models.Model):
    book_id = models.AutoField(primary_key = True) 
    ISBN_10 = models.CharField(max_length = 10, blank = True, null = True)
    ISBN_13 = models.CharField(max_length = 13, blank = True, null = True)
    title = models.CharField(max_length = 30)
    author = models.CharField(max_length = 30)
    item_type = models.CharField(max_length = 30, blank = True, null = True)
    cover_type = models.CharField(max_length = 30)
    image = models.URLField()
    book_rented_count = models.IntegerField(default = 0) 
    rent_price = models.CharField(max_length = 10, blank = True, null = True)
    available_count = models.IntegerField(default = 1)
    publisher = models.CharField(max_length = 50)
    description = models.TextField(blank = True, null = True)
    subject = models.CharField(max_length = 50, default = True, null = True)
    book_penalty = models.CharField(max_length = 30, default = True, null = True)
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

class Subscriptions(models.Model):
    user_id = models.ForeignKey(Users)
    subscription_type = models.CharField(max_length = 30)
    status = models.CharField(max_length = 30)
    amount = models.CharField(max_length = 30)
    payment_id = models.CharField(max_length = 50)
    sub_st_date = models.DateTimeField()
    sub_end_date = models.DateTimeField()

    class Meta:
        db_table = "subscriptions"

class Transactions(models.Model):
    user_id = models.ForeignKey(Users)
    isbn = models.ForeignKey(BookItems, related_name = "isbn")
    barcode_id = models.ForeignKey(BookItemsDtl)
    date = models.DateTimeField(null = True)
    age = models.CharField(max_length = 10, null = True)
    action = models.CharField(max_length = 10)
    dof_request = models.DateTimeField(null = True)
    dof_deliver = models.DateTimeField(null = True)
    dof_returned = models.DateTimeField(null = True)

    class Meta:
        db_table = "transactions"

class Wishlist(models.Model):
    user_id = models.ForeignKey(Users, related_name = "user")
    book_id = models.ForeignKey(BookItems, related_name = "isnb")
    audit_dttm = models.DateTimeField(null = True)
    book_name = models.CharField(max_length = 100)
    status = models.CharField(max_length = 20)

    class Meta:
        db_table = "wishlist"