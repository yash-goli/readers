# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('services', '0002_bookitemsdtl'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscriptions',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('subscription_type', models.CharField(max_length=30)),
                ('status', models.CharField(max_length=30)),
                ('amount', models.CharField(max_length=30)),
                ('payment_id', models.CharField(max_length=50)),
                ('sub_st_date', models.DateTimeField()),
                ('sub_end_date', models.DateTimeField()),
                ('user_id', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'subscriptions',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(null=True)),
                ('age', models.CharField(max_length=10, null=True)),
                ('action', models.CharField(max_length=10)),
                ('dof_request', models.DateTimeField(null=True)),
                ('dof_deliver', models.DateTimeField(null=True)),
                ('dof_returned', models.DateTimeField(null=True)),
                ('barcode_id', models.ForeignKey(to='services.BookItemsDtl')),
                ('isbn', models.ForeignKey(related_name='isbn', to='services.BookItems')),
                ('user_id', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'transactions',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('audit_dttm', models.DateTimeField(null=True)),
                ('book_name', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=20)),
                ('book_id', models.ForeignKey(related_name='isnb', to='services.BookItems')),
                ('user_id', models.ForeignKey(related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'wishlist',
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='bookitems',
            name='ISBN',
        ),
        migrations.AddField(
            model_name='bookitems',
            name='ISBN_10',
            field=models.CharField(max_length=10, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bookitems',
            name='ISBN_13',
            field=models.CharField(max_length=13, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bookitems',
            name='description',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='book_penalty',
            field=models.CharField(default=True, max_length=30, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='cover_type',
            field=models.URLField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='image',
            field=models.URLField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='item_type',
            field=models.CharField(max_length=30, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='rent_price',
            field=models.CharField(max_length=10, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitems',
            name='subject',
            field=models.CharField(default=True, max_length=50, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='bookitemsdtl',
            name='book_id',
            field=models.ForeignKey(related_name='books', to='services.BookItems'),
            preserve_default=True,
        ),
    ]
