import requests, base64, datetime
from django.http import JsonResponse
from decouple import config
from .models import Payment

def get_access_token():
    consumer_key = config("DARAJA_CONSUMER_KEY")
    consumer_secret = config("DARAJA_CONSUMER_SECRET")
    auth_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(auth_url, auth=(consumer_key, consumer_secret))
    return response.json()['access_token']

def lipa_na_mpesa_online(request):
    access_token = get_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(
        (config("BUSINESS_SHORTCODE") + config("PASSKEY") + timestamp).encode()
    ).decode('utf-8')

    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "BusinessShortCode": config("BUSINESS_SHORTCODE"),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 1,  # Example amount
        "PartyA": "2547XXXXXXXX",  # Customer phone number
        "PartyB": config("BUSINESS_SHORTCODE"),
        "PhoneNumber": "2547XXXXXXXX",
        "CallBackURL": "https://yourdomain.com/payments/callback/",
        "AccountReference": "Cloud9Store",
        "TransactionDesc": "Payment for clothing order"
    }

    response = requests.post(api_url, json=payload, headers=headers)
    result = response.json()

    # Save in MongoDB
    if "CheckoutRequestID" in result:
        Payment(
            transaction_id=result["CheckoutRequestID"],
            phone_number=payload["PhoneNumber"],
            amount=payload["Amount"],
            status="PENDING"
        ).save()

    return JsonResponse(result)

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
import json

@method_decorator(csrf_exempt, name="dispatch")
class MpesaCallbackView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        checkout_id = data["Body"]["stkCallback"]["CheckoutRequestID"]
        result_code = data["Body"]["stkCallback"]["ResultCode"]

        # Update payment status
        payment = Payment.objects(transaction_id=checkout_id).first()
        if payment:
            if result_code == 0:
                payment.status = "SUCCESS"
            else:
                payment.status = "FAILED"
            payment.save()

        return JsonResponse({"ResultCode": 0, "ResultDesc": "Accepted"})
