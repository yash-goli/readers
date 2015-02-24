from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.views.generic import View
from django.contrib.auth import authenticate,login,logout
import json



def home(request):
	return render_to_response("base.html", {}, context_instance = RequestContext(request))


def userLogin(request):
    data = {}
    if request.method == "GET":
        pass
    if request.method == "POST":
        uname = request.POST.get('username')
        pwd = request.POST.get('password')
        user = authenticate(email = uname, password = pwd)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/")
        else:
            data = {
                'message':'Invalid User Credentials'
            }
            return HttpResponseServerError('Not Authenticated')
    return render_to_response('login.html', data, context_instance=RequestContext(request))

""" For user logout """
def userLogout(request):
    logout(request)
    return HttpResponseRedirect("/")





def if_partial_url(url):
    partial_urls = ['/books']
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
