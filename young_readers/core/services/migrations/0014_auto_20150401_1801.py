# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0013_transactions_address_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transactions',
            old_name='isbn',
            new_name='book_id',
        ),
    ]
