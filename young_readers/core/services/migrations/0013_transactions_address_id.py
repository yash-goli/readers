# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '__first__'),
        ('services', '0012_transactions_order_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactions',
            name='address_id',
            field=models.ForeignKey(default='', to='authentication.Addresses'),
            preserve_default=False,
        ),
    ]
