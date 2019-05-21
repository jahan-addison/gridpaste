from django.http import HttpResponse
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt


def index(request):
    template = get_template('index.html')
    html = template.render()
    return HttpResponse(html)


def examples(request):
    template = get_template('examples.html')
    html = template.render()
    return HttpResponse(html)