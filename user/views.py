from django.http import HttpResponse
from django.template.loader import get_template


def login(request):
    if request.method == 'GET':
        template = get_template('login.html')
        html = template.render()
        
        return HttpResponse(html)


def logout(request):
    if request.method == 'GET':
        template = get_template('logout.html')
        html = template.render()
    
        return HttpResponse(html)


def register(request):
    if request.method == 'GET':
        template = get_template('register.html')
        html = template.render()
    
        return HttpResponse(html)