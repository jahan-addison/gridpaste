import json
from django.shortcuts import render
from django.http import HttpResponse
from django.template.response import TemplateResponse

from django.core.serializers import serialize

from .models import Pastes
from . import tokens

def list(request):
    p = Pastes.objects.filter(user=request.user.id)
    return render(request, 'pastes.html', {'pastes': p})

def delete(request, id):
    pass

def edit(request, id):
    pass
    
def show(request, token):
    if token.isdigit():
        p = Pastes.objects.filter(id=token).values('paste')
        return render(request, 'show.html', {'paste': p[0]})
    else:
        p = Pastes.objects.filter(token=token).values('paste')
        return render(request, 'show.html', {'paste': p[0]})

def paste(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        token = tokens.generate_token()

        p = Pastes.objects.create(
            title=body['title'],
            user=request.user.id,
            paste=body['paste'],
            token=token,
        )
        p.save()

        return HttpResponse(
            json.dumps({'token': token,}),
            content_type="application/json"
        )
