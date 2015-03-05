from django.shortcuts import render
from django.http import HttpResponse
from api import Amazon
import requests, xmltodict, json
from django.conf import settings
import collections
# Create your views here.
def get_book_data(request):
    isbn_urls = {
        'isbndb' : 'http://isbndb.com/api/v2/json/WRENAJ6U/book/',
        'google' : 'https://www.googleapis.com/books/v1/volumes?q=isbn:',
    }

    SERVICE_DOMAINS = ['US', 'IN', 'UK', 'CA', 'CN', 'DE', 'ES', 'FR', 'IT', 'JP']

    data = {
        'image' : '',
        'title' : '',
        'publisher' : '',
        'isbn_10' : '',
        'isbn_13' : '',
        'description' : '',
        'author' : '',
        'subject' : [],
    }

    domain_status = {
        'amazon' : False,
        'google' : False,
        'isbndb' : False, 
    }
    
    def from_amazon(book):
        desc = ""

        data['image'] = book['LargeImage']['URL']
        data["title"] = book["ItemAttributes"]["Title"]
        if "Publisher" in book["ItemAttributes"]:
            data["publisher"] = book["ItemAttributes"]["Publisher"]
        else:
            data["publisher"] = ""

        if "EAN" in book["ItemAttributes"]:
            data["isbn_13"] = book["ItemAttributes"]["EAN"]
        elif "EISBN" in book["ItemAttributes"]:
            data["isbn_13"] = book["ItemAttributes"]["EISBN"]
        else:
            data["isbn_13"] = ""

        if "ISBN" in book["ItemAttributes"]:
            data["isbn_10"] = book["ItemAttributes"]["ISBN"]
        else:
            data["isbn_10"] = ""

        if "Author" in book["ItemAttributes"]:
            data["author"] = book["ItemAttributes"]["Author"]
        else:
            data["author"] = ""
            
        data["more"] = book["DetailPageURL"]

        if "EditorialReviews" in book:
            if type(book["EditorialReviews"]["EditorialReview"]) == collections.OrderedDict:
                data["description"] = book["EditorialReviews"]["EditorialReview"]["Content"]
            else:
                for content in book["EditorialReviews"]["EditorialReview"]:
                    desc = desc + content["Content"]

        if 'BrowseNodes' in book:
            if type(book["BrowseNodes"]["BrowseNode"]) == collections.OrderedDict:
                data['subject'].append(get_tags(book["BrowseNodes"]["BrowseNode"])[1:])
            else:
                for nodes in book["BrowseNodes"]["BrowseNode"]:
                    data['subject'].append(get_tags(nodes)[1:])

    def from_google(book):
        data['image'] = book['imageLinks']['thumbnail']

        if "subtitle" in book:
            data["title"] = book["title"] + " " + book["subtitle"]
        else:
            data["title"] = book["title"]

        if 'categories' in book:
            data["publisher"] = book["publisher"]
        else:
            data["publisher"] = ""

        if 'description' in book:
            data["description"] = book["description"]
        else:
            data["description"] = ""

        for identifier in book["industryIdentifiers"]:
            if identifier['type'] == "ISBN_10":
                data["isbn_10"] = identifier["identifier"]
            if identifier['type'] == "ISBN_13":
                data["isbn_13"] = identifier["identifier"]

        if len(book["authors"]) == 1:
            data["author"] = book["authors"][0]
        else:
            data["author"] = []
            for author in book["authors"]:
                data["author"].append(author)

        if 'categories' in book:
            for category in book['categories']:
                data['subject'].append(category)

        data["more"] = book["previewLink"]

    def from_isbndb(book):
        data["title"] = book["title"]
        data["isbn_10"] = book["isbn10"]
        data["isbn_13"] = book["isbn13"]
        data["description"] = book["summary"]
        data['publisher'] = book["publisher_name"]
        for category in book['subject_ids']:
            data['subject'].append(category.replace("_", " "))

        if len(book["author_data"]) == 1:
            data["author"] = book[0]["name"]
        else:
            data["author"] = []
            for author in book['author_data']:
                data["author"] = author["name"]
    
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
    
    items = toJSON['ItemLookupResponse']['Items']['Item']

    if type(items) == collections.OrderedDict:
        from_amazon(items)
        domain_status['amazon'] = True
    if type(items) == list:
        from_amazon(items[0])
        domain_status['amazon'] = True

    if domain_status['amazon'] == False:
        toJSON = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+request.GET['isbn'])
        toJSON = toJSON.json()
        if toJSON['totalItems'] != 0:
            from_google(toJSON['items'][0]['volumeInfo'])
            domain_status['google'] = True

    if domain_status['amazon'] == False and domain_status['google'] == False:
        toJSON = requests.get("http://isbndb.com/api/v2/json/WRENAJ6U/book/"+request.GET['isbn'])
        toJSON = toJSON.json()
        if 'error' not in toJSON:
            from_isbndb(toJSON['data'][0])
            domain_status['isbndb'] = True
    
    if domain_status['amazon'] == False and domain_status['google'] == False and domain_status['isbndb'] == False:
        data = {
            'error' : 'Unable to Find Data in any of our sources,Enter field manually'
        }
    return HttpResponse(json.dumps(data))

def get_tags(nodes):
    non_tags = ["Books","Subjects","Categories"]
    if 'Ancestors' in nodes:
        if not nodes['Name'] in non_tags:
            tags = nodes['Name']
            tags = get_tags(nodes['Ancestors']['BrowseNode']) + "-" + tags
        else:
            tags = ""
    else:
        tags = nodes['Name']
    return tags

def generate_codes(request):
    from .models import Barcodes
    from barcodes import MyBarcodeDrawing
    import datetime
    code = int(datetime.datetime.now().strftime('%m%d%y%H%M%S'))
    data = []
    for val in xrange(int(request.GET['codes'])):
        code = code + (val + 1)
        text = str(code)
        b = MyBarcodeDrawing(text)
        b.save(formats=['png'],outDir='assets/images/barcode/',fnRoot=text)

        bcode = Barcodes(barcode = text)
        bcode.save()

        data.append(text)
    return HttpResponse(json.dumps(data))