from django.db import models
from django.contrib.auth.models import AbstractBaseUser,UserManager


class Users(AbstractBaseUser):
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default = False)
    date_joined = models.DateTimeField(null = True)
    date_of_birth = models.DateTimeField(null = True)
    premium_user = models.BooleanField(default = False)
    subscription_date = models.DateTimeField(null = True)
    noti_count = models.IntegerField(default = 0)
    profile_pic = models.CharField(max_length=100, null=True)
    mobile_no = models.CharField(max_length=20)
    mobile_verified = models.BooleanField(default = False)
    subscription_type = models.CharField(max_length=30, null=True)
    books_hold = models.IntegerField(null = True)
    address = models.CharField(max_length=200, null=True)
    auth_thru = models.CharField(max_length=30, null=True)
    facebook_id = models.CharField(max_length=100, null =True)
    google_id = models.CharField(max_length=100, null=True)
    
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = "auth_user"


class UserChilds(models.Model):

    user = models.ForeignKey(Users,related_name='childs')
    child_name = models.CharField(max_length = 30, null = True)
    age = models.IntegerField(null = True)