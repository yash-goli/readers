from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter
from core.authentication.viewsets import UsersViewSet
from core.services.viewsets import BookItemsViewSet, BookItemsDetailViewSet, SubscriptionsViewSet, TransactionsViewSet, WishlistViewSet

router = DefaultRouter()

router.register(r'profile', UsersViewSet)
router.register(r'books', BookItemsViewSet)
router.register(r'books_list', BookItemsDetailViewSet)
router.register(r'subscriptions', SubscriptionsViewSet)
router.register(r'transactions', TransactionsViewSet)
router.register(r'wishlist', WishlistViewSet)



urlpatterns = patterns('',
    url(r'^', include('core.authentication.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^get_book_data/', 'core.services.views.get_book_data'),
    url(r'^generate_codes/', 'core.services.views.generate_codes'),
    #catch all
    url(r'^.*/$', 'core.authentication.views.CatchAllUrl'),
)
