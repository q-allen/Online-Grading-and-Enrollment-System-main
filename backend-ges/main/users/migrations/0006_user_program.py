# Generated by Django 5.2.1 on 2025-05-30 23:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('programs', '0002_schedule'),
        ('users', '0005_alter_user_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='programs.program'),
        ),
    ]
