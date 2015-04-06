# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0009_bookitems_pages'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactions',
            name='quantity',
            field=models.IntegerField(default=1),
            preserve_default=True,
        ),
    ]
