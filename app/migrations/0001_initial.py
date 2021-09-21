# Generated by Django 2.2.10 on 2021-09-21 20:33

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=500, unique=True)),
                ('firstname', models.CharField(blank=True, max_length=30, verbose_name='Firstname')),
                ('lastname', models.CharField(blank=True, max_length=30, verbose_name='Lastname')),
                ('user_phone', models.TextField(max_length=15, null=True, unique=True, verbose_name='Telephone number')),
                ('email', models.EmailField(max_length=90, unique=True, verbose_name='Email')),
                ('user_password', models.TextField(max_length=200, verbose_name='Password')),
                ('user_address', models.TextField(max_length=200, verbose_name='Address')),
                ('user_state', models.TextField(max_length=200, verbose_name='State')),
                ('ratings', models.IntegerField(default=1.0, max_length=200, verbose_name='Job Ratings')),
                ('role', models.TextField(default='client', max_length=50, verbose_name='User role')),
                ('walletBalance', models.FloatField(default=0.0, verbose_name='Balance')),
                ('account_name', models.TextField(default='Null', max_length=150, verbose_name='Account Name')),
                ('account_number', models.TextField(default='0000000000', max_length=150, verbose_name='Account Number')),
                ('bank_name', models.TextField(default='Null', max_length=150, verbose_name='Bank Name')),
                ('notification', models.BooleanField(default=False, verbose_name='Notification toggle')),
                ('date_added', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'db_table': 'Vista_user_table',
            },
        ),
        migrations.CreateModel(
            name='Verification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.TextField(blank=True, max_length=20, verbose_name='Verification Code')),
                ('isVerified', models.BooleanField(default=False)),
                ('date_added', models.DateTimeField(default=django.utils.timezone.now)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.User')),
            ],
            options={
                'db_table': 'Verification_table',
            },
        ),
    ]
