# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0007_barcodes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookitems',
            name='item_type',
            field=models.CharField(default=b'book', max_length=30, null=True, blank=True),
            preserve_default=True,
        ),
    ]
