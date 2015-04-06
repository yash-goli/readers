# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0011_wishlist_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactions',
            name='order_id',
            field=models.CharField(default='', unique=True, max_length=20),
            preserve_default=False,
        ),
    ]
