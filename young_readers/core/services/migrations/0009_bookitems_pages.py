# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0008_auto_20150319_1633'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookitems',
            name='pages',
            field=models.IntegerField(default=1),
            preserve_default=True,
        ),
    ]
