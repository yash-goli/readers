from django.shortcuts import render
from django.http import HttpResponse
from api import Amazon
import requests, xmltodict, json
from django.conf import settings

# Create your views here.
def get_book_data(request):
    isbn_urls = {
        'isbndb' : 'http://isbndb.com/api/v2/json/WRENAJ6U/book/',
        'google' : 'https://www.googleapis.com/books/v1/volumes?q=isbn:',
    }

    SERVICE_DOMAINS = ['US', 'IN', 'UK', 'CA', 'CN', 'DE', 'ES', 'FR', 'IT', 'JP']

    data = {}

    for url in isbn_urls:
        data[url] = isbn_urls[url] + request.GET['isbn']
        data[url] = requests.get(data[url])
        data[url] = data[url].json()

    for domain in SERVICE_DOMAINS:
        amazon = Amazon(settings.AMAZON_ACCESS_ID, settings.AMAZON_SECRET_ID, settings.AMAZON_ASSOCIATE_TAG,Version = "2013-08-01", Region = domain)
        try:
            if len(request.GET['isbn']) == 10:
                response = amazon.ItemLookup(ItemId=request.GET['isbn'], ResponseGroup="Large,ItemAttributes,EditorialReview", IdType="ASIN", Condition = "All")
            else:
                response = amazon.ItemLookup(ItemId=request.GET['isbn'], ResponseGroup="Large,ItemAttributes,EditorialReview", IdType="ISBN", SearchIndex = "Books", Condition = "All")
        
            toJSON = xmltodict.parse(response)
        except:
            pass
            
        if 'Item' in toJSON['ItemLookupResponse']['Items']:
            break
    data['amazon'] = toJSON
    del data['amazon']['ItemLookupResponse']['OperationRequest']
    return HttpResponse(json.dumps(data))