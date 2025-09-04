from mongoengine import Document, StringField, DecimalField, DateTimeField
import datetime

class Payment(Document):
    transaction_id = StringField(required=True, unique=True)
    phone_number = StringField(required=True)
    amount = DecimalField(required=True, precision=2)
    status = StringField(default="PENDING")  # PENDING, SUCCESS, FAILED
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        "collection": "payments"
    }
