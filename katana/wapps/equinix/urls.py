from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.EquinixView.as_view(), name='index'),
    url(r'^set/$', views.set_api, name='set_api'),
    url(r'^measure/$', views.measure_api, name='measure_api'),
    url(r'^add_new_group/$', views.add_group, name='add_group'),
    url(r'^get_group_list/$', views.get_group_list, name='get_group_list'),
    url(r'^fetch_group_details/$', views.fetch_group_details, name='fetch_group_details'),
    url(r'^edit_group/$', views.edit_group, name='edit_group'),
    
]
