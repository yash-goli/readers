from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter
from core.authentication.viewsets import UsersViewSet
from core.services.viewsets import BookItemsViewSet, BookItemsDetailViewSet

router = DefaultRouter()

router.register(r'profile', UsersViewSet)
router.register(r'books', BookItemsViewSet)
router.register(r'books_list', BookItemsDetailViewSet)



urlpatterns = patterns('',
    url(r'^', include('core.authentication.urls')),
    url(r'^api/', include(router.urls)),
    #catch all
    url(r'^.*/$', 'core.authentication.views.CatchAllUrl'),
)
