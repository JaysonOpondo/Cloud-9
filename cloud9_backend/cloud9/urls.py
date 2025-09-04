"""
URL configuration for cloud9 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]

from django.urls import path
from payments.views import lipa_na_mpesa_online, MpesaCallbackView

urlpatterns = [
    path("api/payments/mpesa/", lipa_na_mpesa_online),
    path("payments/callback/", MpesaCallbackView.as_view()),  # callback URL
]

from django.urls import path
from products.views import list_products, add_product

urlpatterns = [
    path("api/products/", list_products),
    path("api/products/add/", add_product),
]
