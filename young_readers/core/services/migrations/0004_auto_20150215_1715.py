# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0003_auto_20150214_1514'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookitems',
            name='cover_type',
            field=models.CharField(max_length=30),
            preserve_default=True,
        ),
    ]
