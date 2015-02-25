# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_auto_20150215_1715'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookitems',
            name='subject',
            field=models.CharField(default=True, max_length=200, null=True),
            preserve_default=True,
        ),
    ]
