import json
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect

from .models import Pastes
from . import tokens

def list(request):
    p = Pastes.objects.filter(user=request.user.id)
    return render(request, 'pastes.html', {'pastes': p})


def delete(request, id):
    p = Pastes.objects.filter(id=id).delete()
    return redirect('/')
    

def show(request, token):
    if token.isdigit():
        p = Pastes.objects.filter(id=token).values('paste').first()
        print(p)
        return render(request, 'show.html', {'paste': p})
    else:
        p = Pastes.objects.filter(token=token).values('paste').first()
        return render(request, 'show.html', {'paste': p})


def paste(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        token = tokens.generate_token()


        if request.user.id is None:
            userid = 'anonymous'
        else:
            userid = request.user.id

        p = Pastes.objects.create(
            title=body['title'],
            user=userid,
            paste=body['paste'],
            token=token,
        )
        p.save()

        return HttpResponse(
            json.dumps({'token': token,}),
            content_type="application/json"
        )

