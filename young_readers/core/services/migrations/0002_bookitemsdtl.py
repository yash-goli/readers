# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BookItemsDtl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('barcode_id', models.CharField(max_length=50)),
                ('available', models.BooleanField(default=True)),
                ('status', models.CharField(max_length=50)),
                ('cover_type', models.CharField(max_length=30)),
                ('item_type', models.CharField(max_length=30)),
                ('book_id', models.ForeignKey(to='services.BookItems')),
            ],
            options={
                'db_table': 'book_items_dtl',
            },
            bases=(models.Model,),
        ),
    ]
