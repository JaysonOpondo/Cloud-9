from mongoengine import Document, StringField, DecimalField, IntField, URLField

class Product(Document):
    name = StringField(required=True, max_length=100)
    price = DecimalField(required=True, precision=2)
    description = StringField()
    image_url = URLField()
    stock = IntField(default=0)

    meta = {
        "collection": "products"
    }
