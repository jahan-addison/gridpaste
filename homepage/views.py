from django.http import HttpResponse
from django.template.loader import get_template
from django.shortcuts import render

from pastes.models import Pastes


def index(request):
    template = get_template('index.html')
    html = template.render()
    return HttpResponse(html)


def examples(request):
    p = Pastes.objects.filter(user='examples')
    return render(request, 'examples.html', {'pastes': p})