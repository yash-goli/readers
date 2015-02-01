# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BookItems',
            fields=[
                ('book_id', models.AutoField(serialize=False, primary_key=True)),
                ('ISBN', models.CharField(max_length=30)),
                ('title', models.CharField(max_length=30)),
                ('author', models.CharField(max_length=30)),
                ('item_type', models.CharField(max_length=30)),
                ('cover_type', models.CharField(max_length=30)),
                ('image', models.CharField(max_length=30)),
                ('book_rented_count', models.IntegerField(default=0)),
                ('rent_price', models.CharField(max_length=10)),
                ('available_count', models.IntegerField(default=1)),
                ('publisher', models.CharField(max_length=50)),
                ('subject', models.CharField(max_length=50)),
                ('book_penalty', models.CharField(max_length=30)),
                ('total_count', models.IntegerField(default=1)),
            ],
            options={
                'db_table': 'book_items',
            },
            bases=(models.Model,),
        ),
    ]
