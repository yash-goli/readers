# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0006_auto_20150224_1853'),
    ]

    operations = [
        migrations.CreateModel(
            name='Barcodes',
            fields=[
                ('barcode_id', models.AutoField(serialize=False, primary_key=True)),
                ('barcode', models.CharField(max_length=15)),
            ],
            options={
                'db_table': 'barcodes',
            },
            bases=(models.Model,),
        ),
    ]
