from django.shortcuts import render, redirect

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse

from decouple import config
import json
import requests

base_url = config("base_url")

def index(request):
    return render(request,"onboarding/splashscreen.html") 

def register_page(request):
    return render(request,"onboarding/register.html")

def logout_page(request):
    if 'user_id' in request.session:
        del request.session['user_id']
    return redirect('/login')

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
    # print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data
        } 
        return render(request,"client/home.html", return_data)
        
    return render(request,"onboarding/login.html")

def sp_dashboard(request, token):
    url= base_url+"/dashboard?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data
        }
        return render(request,"sp/home.html", return_data)
    return render(request,"onboarding/login.html")

def client_profile(request, token):
    url= base_url+"/profile?token="+token  
    response = requests.get(url).text
    json_data = json.loads(response)
    print(response)
    if json_data["success"] == True and  json_data["status"] == 200:
        return_data = {
            "token": token,
            "data":json_data
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
            "data":json_data
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
                "data":json_data
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
                "data":json_data
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
            "data":json_data
        } 
        return render(request,"client/wallet.html", return_data)
    return render(request,"onboarding/login.html")

# def job_details(request, token):
#     if token:
#         url= base_url+"/job_details?token="+token  
#         response = requests.get(url).text
#         json_data = json.loads(response)
#         print(response)
#         if json_data["success"] == True and  json_data["status"] == 200:
#             return_data = {
#                 "token": token,
#                 "data":json_data
#             }
#             return return_data
#     return render(request,"onboarding/login.html")


# RESEND VERIFICATION CODE API
@api_view(["POST"])
def resend_code_api(request):
    try:
        email = request.data.get('email',None)
        field = [email]
        if not None in field and not "" in field:
            if User.objects.filter(email =email).exists():
                verificationData = Verification.objects.get(user_id__email = email)
                userData = User.objects.get(email=email)
                firstName = userData.firstname
                code = verificationData.code
                if code:
                    return_data = {
                        "error": False,
                        "message": "Verfication Code sent again!"
                    }
                else:
                    return_data = {
                        "error": False,
                        "message": "We could not retrieve your Verification Code. Kindly register!"
                    }
            elif validator.checkmail(email) == False:
                return_data = {
                    "error": True,
                    "message": "Email is Invalid"
                }
        else:
            return_data = {
                "error":True,
                "message": "One or more fields is empty!"
            }
    except Exception as e:
        return_data = {
            "error": True,
            # "message": str(e)
            "message": "Something went wrong!"
        }
    return Response(return_data)


# # ONBOARDING APIS

# # SIGN UP API
# @api_view(["POST"])
# def register_api(request):
#     try:
#         firstName = request.data.get('firstname',None)
#         lastName = request.data.get('lastname',None)
#         phoneNumber = request.data.get('phonenumber',None)
#         email = request.data.get('email',None)
#         password = request.data.get('password',None)
#         address = request.data.get('address',None)
#         state = request.data.get('state',None)
#         role = request.data.get('role',None)
#         reg_field = [firstName,lastName,phoneNumber,email,password,address, role]
#         if not None in reg_field and not "" in reg_field:
#             if User.objects.filter(user_phone =phoneNumber).exists() or User.objects.filter(email =email).exists():
#                 return_data = {
#                     "error": True,
#                     "message": "User Exists, Kindly login"
#                 }
#             elif validator.checkmail(email) == False:
#                 return_data = {
#                     "error": True,
#                     "message": "Email is Invalid"
#                 }
#             else:
#                 #generate user_id
#                 if role == "artisan":
#                     userRandomId = "ART"+string_generator.numeric(4)
#                 else:
#                     userRandomId = "CLT"+string_generator.numeric(4)
#                 #encrypt password
#                 encryped_password = password_functions.generate_password_hash(password)
#                 #Save user_data
#                 new_userData = User(user_id=userRandomId,firstname=firstName,lastname=lastName,
#                                 email=email,user_phone=phoneNumber,
#                                 user_password=encryped_password,user_address=address, user_state=state, role=role, terms_conditions=True)
#                 new_userData.save()
#                 #Generate OTP
#                 code = string_generator.numeric(4)
#                 #Save OTP
#                 user_OTP =Verification(user_id=new_userData,code=code, isVerified=False)
#                 user_OTP.save()
#                 # Send mail using SMTP
#                 mail_subject = 'Activate your Fida account.'
#                 email = {
#                     'subject': mail_subject,
#                     'html': '<h4>Hello, '+firstName+'!</h4><p>Kindly use the Verification Code below to activate your Fida Account</p> <h1>'+code+'</h1>',
#                     'text': 'Hello, '+firstName+'!\nKindly use the Verification Code below to activate your Fida Account',
#                     'from': {'name': 'Fida Synergy', 'email': 'donotreply@wastecoin.co'},
#                     'to': [
#                         {'name': firstName, 'email': email}
#                     ]
#                 }
#                 SPApiProxy.smtp_send_mail(email)
#                 request.session['email'] = new_userData.email
#                 return_data = {
#                     "error": False,
#                     "message": "Registrated successfully. Kind check your email to activate your account.",
#                     }
#         else:
#             return_data = {
#                 "error":True,
#                 "message": "One or more fields is empty!"
#             }
#     except Exception as e:
#         return_data = {
#             "error": True,
#             "message": str(e)
#             # "message": "Something went wrong!"
#         }
#     return Response(return_data)

# #SIGNIN API FOR BOTH ARTISAN AND CLIENT
# @api_view(["POST"])
# def login_api(request):
#     try:
#         email = request.data.get("email",None)
#         password = request.data.get("password",None)
#         field = [email,password]
#         if not None in field and not '' in field:
#             validate_mail = validator.checkmail(email)
#             if validate_mail == True:
#                 if User.objects.filter(email =email).exists() == False:
#                     return_data = {
#                         "error": True,
#                         "message": "User does not exist"
#                     }
#                 else: 
#                     user_data = User.objects.get(email=email)
#                     request.session['user_id'] = user_data.user_id
#                     request.session['email'] = user_data.email
#                     is_valid_password = password_functions.check_password_match(password,user_data.user_password)
#                     isVerified= Verification.objects.get(user_id__user_id=user_data.user_id).isVerified
#                     if is_valid_password and isVerified:
#                         # request.session['user_id'] = user_data.user_id
#                         # request.session['email'] = user_data.email
#                         if user_data.role == "artisan":
#                             return_data = {
#                             "error": False,
#                             "profileComplete": user_data.profile_complete,
#                             "user_name": f"{user_data.firstname}"
#                             }
#                             return render(request,"artisan/home/home.html", return_data)
#                         else:
#                             return_data = {
#                             "error": False,
#                             "profileComplete": user_data.profile_complete,
#                             "user_name": f"{user_data.firstname}"
#                             }
#                             return render(request,"client/home/home.html", return_data)
#                     elif isVerified == False:
#                         user_email = request.session['email']
#                         return_data = {
#                             "error" : True,
#                             "email":user_email,
#                             "message": "Sorry, Your account is not yet activated. Click on Resend code to get new Activation codes",
#                         }
#                         return render(request,"onboarding/verify.html", return_data)
#                     else:
#                         return_data = {
#                             "error" : True,
#                             "message" : "Wrong Password"
#                         }
#             else:
#                 return_data = {
#                     "error": True,
#                     "message": "Email is Invalid"
#                 }
#         else:
#             return_data = {
#                 "error" : True,
#                 "message" : "Invalid Parameters"
#                 }
#     except Exception as e:
#         return_data = {
#             "error": True,
#             "message": str(e)
#         }
#     return render(request,"onboarding/login.html", return_data)


