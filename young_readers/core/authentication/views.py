from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.views.generic import View
from django.contrib.auth import authenticate,login,logout
from .models import Users
from django.contrib.auth.hashers import check_password,make_password
import json



def home(request):
	return render_to_response("base.html", {}, context_instance = RequestContext(request))


def userLogin(request):
    data = {}
    if request.method == "GET":
        pass
    if request.method == "POST":
        email = request.POST.get('email')
        pwd = request.POST.get('password')
        user = authenticate(email = email, password = pwd)
        if user is not None:
            login(request, user)
            data = {
                'message':'success'
            }
            return HttpResponse(json.dumps(data))
        else:
            data = {
                'message':'Invalid User Credentials'
            }
            return HttpResponseServerError('Not Authenticated')
    return render_to_response('login.html', data, context_instance=RequestContext(request))

def userRegister(request):
    import re
    from datetime import datetime
    reg = re.compile("^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$")
    data = {}
    if request.method == "POST":
        uname = request.POST.get('username')
        email = request.POST.get('email')
        pwd = request.POST.get('password')
        user = Users()
        if reg.match(email):
            user.email = email
        else:
            return HttpResponseServerError('Invaild Email') 
        user.username = uname
        user.password = make_password(pwd)
        user.date_joined = datetime.now()
        user.mobile_no = ""
        user.save()
        data = {
            'message':'success'
        }
        return HttpResponse(json.dumps(data))
    
""" For user logout """
def userLogout(request):
    data = {}
    logout(request)
    data = {
        'message':'success'
    }
    return HttpResponse(json.dumps(data))





def if_partial_url(url):
    partial_urls = ['/books','/account','/book_detail']
    proceed = False
    for purl in partial_urls:
        if url.startswith(purl):
            proceed = True
    return proceed


def CatchAllUrl(request):
    purl = if_partial_url(request.path)
    if purl:
        if not request.user_agent.is_bot:
            return render_to_response('base.html', {}, context_instance=RequestContext(request))
    else:
        return HttpResponse("Page Not Found")
