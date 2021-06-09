from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signup', views.register_page, name='signup'),
    path('signin', views.login_page, name='signin'),

    path("signout", views.logout_page, name="signout"),
    path("verify/<id>", views.verify_page, name="verify"),
    path("verify_password/<id>", views.verify_password_page, name="verify_password"),
    path("forget_password", views.forget_password_page, name="forget_password"),
    path("reset_password/<id>", views.reset_password_page, name="reset_password"),

    # client
     path('client_dashboard/<token>', views.client_dashboard, name='dashboard'),
     path('client_profile/<token>', views.client_profile, name='profile'),
     path('client_wallet/<token>', views.client_wallet, name='wallet'),


    #  service provider
    path('sp_dashboard/<token>', views.sp_dashboard, name='sp_dashboard'),
    path('sp_profile/<token>', views.sp_profile, name='sp_profile'),
    # USERS APIS
    # path('signin_api', views.login_api, name='signin_api'),
    # path('resend_code', views.resend_code_api, name='resend_code'),
]