from django.shortcuts import render, redirect

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse

from decouple import config
import json
import requests

base_url = config("base_url")
paystack_key = config("PAYSTACK_KEY")

def index(request):
    # x = request.session['token']
    x = request.session.get('token', 'red')
    print(x, "xxx_dfdsf")
    if x != 'red':
        token = request.session['token']
        url= base_url+"/dashboard?token="+token  
        response = requests.get(url).text
        json_data = json.loads(response)
        request.session['token'] = token
        print(token, "token_____________-------")
        if json_data["success"] == True and  json_data["status"] == 200 and json_data["user_details"]["role"] == "0":
            # return redirect('/sp_dashboard/'+token)
            return render(request,"onboarding/login.html") 
        elif json_data["success"] == True and  json_data["status"] == 200 and json_data["user_details"]["role"] == "1":
            # return redirect('/client_dashboard/'+token)
            return render(request,"onboarding/login.html") 
    # else:
        # return render(request,"onboarding/splashscreen.html") 
    return render(request,"onboarding/login.html") 

def register_page(request):
    return render(request,"onboarding/register.html")

def logout_page(request):
    if 'token' in request.session:
        del request.session['token']
        print("token deleted_____________-------")
    return redirect('/signin')

def login_page(request):
    return render(request,"onboarding/login.html") 


def verify_page(request, id):
    return_data = {
        "id": id,
    }
    return render(request,"onboarding/verify.html", return_data) 

def verify_password_page(request, id):
    return_data = {
        "id": id,
    }
    return render(request,"onboarding/verify_password.html", return_data) 

def forget_password_page(request):
    return render(request,"onboarding/forget_password.html") 

def reset_password_page(request, id):
    return_data = {
        "id": id,
    }
    return render(request,"onboarding/reset_password.html", return_data)

def client_dashboard(request, token):
    url= base_url+"/dashboard?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    request.session['token'] = token
    print(paystack_key, "paystacktoken_____________-------")
    # print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data,
            "paystack_key":paystack_key
        } 
        return render(request,"client/home.html", return_data)
        
    return render(request,"onboarding/login.html")

def sp_dashboard(request, token):
    url= base_url+"/dashboard?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    request.session['token'] = token
    print(paystack_key, "paystacktoken_____________-------")
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data,
            "paystack_key":paystack_key
        }
        return render(request,"sp/home.html", return_data)
    return render(request,"onboarding/login.html")

def client_profile(request, token):
    url= base_url+"/profile?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    # print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data,
            "paystack_key":paystack_key
        } 
        return render(request,"client/profile.html", return_data)
    return render(request,"onboarding/login.html")

def sp_profile(request, token):
    url= base_url+"/profile?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data,
            "paystack_key":paystack_key
        }
        return render(request,"sp/profile.html", return_data)
    return render(request,"onboarding/login.html")

def sp_job(request, token):
    if token:
        url= base_url+"/services?token="+token  
        response = requests.get(url).text
        json_data = json.loads(response)
        print(response)
        if json_data["success"] == True and  json_data["status"] == 200:
            return_data = {
                "token": token,
                "data":json_data,
                "paystack_key":paystack_key
            }
            return render(request,"sp/jobs.html", return_data)
    return render(request,"onboarding/login.html")

def client_job(request, token):
    if token:
        url= base_url+"/services?token="+token  
        response = requests.get(url).text
        json_data = json.loads(response)
        print(response)
        if json_data["success"] == True and  json_data["status"] == 200:
            return_data = {
                "token": token,
                "data":json_data,
                "paystack_key":paystack_key,
            }
            return render(request,"client/jobs.html", return_data)
    return render(request,"onboarding/login.html")


def client_wallet(request, token):
    url= base_url+"/dashboard?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data,
            "paystack_key":paystack_key
        } 
        return render(request,"client/wallet.html", return_data)
    return render(request,"onboarding/login.html")

