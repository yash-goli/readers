# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0005_auto_20150224_1850'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookitems',
            name='title',
            field=models.CharField(max_length=60),
            preserve_default=True,
        ),
    ]
