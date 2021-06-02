from django.db import models
from django.utils import timezone
import datetime

# Create your models here.
# USER
class User(models.Model):
    class Meta:
        db_table = "Vista_user_table"
    # personal details
    user_id = models.CharField(max_length=500,unique=True)
    firstname = models.CharField(max_length=30,verbose_name="Firstname",blank=True)
    lastname = models.CharField(max_length=30,verbose_name="Lastname",blank=True)
    user_phone = models.TextField(max_length=15, unique=True, null=True, verbose_name="Telephone number")
    email = models.EmailField(max_length=90, unique=True,verbose_name="Email")
    user_password = models.TextField(max_length=200,verbose_name="Password")
    user_address = models.TextField(max_length=200,verbose_name="Address")
    user_state = models.TextField(max_length=200,verbose_name="State")
    ratings = models.IntegerField(max_length=200,verbose_name="Job Ratings", default=1.0)
    role = models.TextField(max_length=50,verbose_name="User role",default="client")
    walletBalance = models.FloatField(verbose_name="Balance",default=0.00)
    # account details
    account_name = models.TextField(max_length=150,verbose_name="Account Name",default="Null")
    account_number = models.TextField(max_length=150,verbose_name="Account Number",default="0000000000")
    bank_name = models.TextField(max_length=150,verbose_name="Bank Name",default="Null")

    
    #notification toggle
    notification = models.BooleanField(default=False, verbose_name="Notification toggle")
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user_id} - {self.firstname} - {self.lastname} - {self.user_phone} - {self.email} - {self.user_state} - {self.role} - {self.walletBalance}"


class Verification(models.Model):
    class Meta:
        db_table = "Verification_table"
    # Verify Users
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.TextField(max_length=20,verbose_name="Verification Code",blank=True)
    isVerified = models.BooleanField(default=False)
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user_id} - {self.code} - {self.isVerified}"
