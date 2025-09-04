from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product

@api_view(["GET"])
def list_products(request):
    products = Product.objects.all()
    data = [{"id": str(p.id), "name": p.name, "price": float(p.price)} for p in products]
    return Response(data)

@api_view(["POST"])
def add_product(request):
    product = Product(
        name=request.data["name"],
        price=request.data["price"],
        description=request.data.get("description", ""),
        image_url=request.data.get("image_url", ""),
        stock=request.data.get("stock", 0),
    )
    product.save()
    return Response({"message": "Product added!"})
