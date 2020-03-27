
import collections
import json
import os
import re
import xmltodict
import requests
from collections import OrderedDict
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views import View
from katana.utils.directory_traversal_utils import join_path, get_dir_from_path, get_parent_dir_path
from katana.utils.json_utils import read_json_data
from katana.utils.navigator_util import Navigator
from katana.wapps.cases.cases_utils.defaults import impacts, on_errors, runmodes, iteration_types, contexts
from katana.wapps.cases.cases_utils.get_drivers import GetDriversActions
from katana.wapps.cases.cases_utils.verify_case_file import VerifyCaseFile
from katana.wapps.equinix.models import equinixgroups
from katana.wapps.equinix.forms import equinixgroupsForm
navigator = Navigator()
equinix_measure_data_json_path = join_path(navigator.get_katana_dir(), "wapps/equinix/equinix_measure_data.json")
equinix_set_data_json_path = join_path(navigator.get_katana_dir(), "wapps/equinix/equinix_set_data.json")

class EquinixView(View):

    def get(self, request):
        """
        Get Request Method
        """
        return render(request, 'equinix/equinix_home.html')

def set_api(request):
    otsi_interface_name = request.GET.get("odi")
    set_freq = request.GET.get("set_freq")
    pr_type = request.GET.get("pr_type")
    equinix_json_data = read_json_data(equinix_set_data_json_path)
    devices = equinix_json_data["devices"].keys()
    for device in devices:
        equinix_json_data["devices"][device]["interface_name"] = otsi_interface_name
        equinix_json_data["devices"][device]["protection_type"] = pr_type
    with open(equinix_set_data_json_path, "w") as f:
        json.dump(equinix_json_data, f)
    response = requests.post('http://0.0.0.0:5002/set', json=read_json_data(equinix_set_data_json_path))
    return HttpResponse(response)

def measure_api(request):
    # getdata(request)
    otsi_interface_name = request.GET.get("odi")
    pr_type = request.GET.get("pr_type")
    equinix_json_data = read_json_data(equinix_measure_data_json_path)
    devices = equinix_json_data["devices"].keys()
    for device in devices:
        equinix_json_data["devices"][device]["interface_name"] = otsi_interface_name
        equinix_json_data["devices"][device]["protection_type"] = pr_type
    with open(equinix_measure_data_json_path, "w") as f:
        json.dump(equinix_json_data, f)
    response = requests.post('http://0.0.0.0:5002/measure', json=read_json_data(equinix_measure_data_json_path))
    return HttpResponse(response)

def add_group(request):
    new_group_data = equinixgroupsForm(request.POST)
    
    try:
        groups_list=[]
        data = equinixgroups.objects.all()
        for i in data:
           groups_list.append(i.groupname)
        if request.POST.get("groupname") in groups_list:
            return HttpResponse("duplicate")
        else:
            new_group_data.save()
            response = "success"
    except:
        response = "fail"
        return HttpResponse(response)
    else:
        return HttpResponse(response)
   
def get_group_list(request):
    new_group_data = equinixgroupsForm(request.POST)

    try:
        groups_list=[]
        data = equinixgroups.objects.all()
        for i in data:
            groups_list.append(i.groupname)
    except:
        print("=================================================================================")
        print("Something went wrong!\n Unable to get a list of groups from database.")
        print("=================================================================================")

    else:
        print(groups_list)
        return HttpResponse(str(groups_list))

def fetch_group_details(request):
    details_json = {}
    groupname = request.POST.get("groupname")
    group_details = equinixgroups.objects.get(groupname=groupname)
    details_json["groupname"] = group_details.groupname
    details_json["transpondername"]=group_details.transpondername
    details_json["transponderip"]=group_details.transponderip
    details_json["transponderusername"]=group_details.transponderusername
    details_json["transponderpassword"]=group_details.transponderpassword
    details_json["opsname"]=group_details.opsname
    details_json["opsip"]=group_details.opsip
    details_json["opsusername"]=group_details.opsusername
    details_json["opspassword"]=group_details.opspassword
    details_json["interfacename"]=group_details.interfacename
    print(type(details_json))
    return JsonResponse(details_json)

def edit_group(request):
    edit_group_data = equinixgroupsForm(request.POST)
    # print("validation output",edit_group_data)
    try:
        groups_list=[]
        data = equinixgroups.objects.all()
        for i in data:
           groups_list.append(i.groupname)
        if request.POST.get("groupname") in list(set(groups_list) - {request.POST.get("selgrpname")}):
            return HttpResponse("duplicate")
        else:
            if (request.POST.get("groupname")).strip() != "" and (request.POST.get("transpondername")).strip() != "" and (request.POST.get("transponderip")).strip() != ""\
               and (request.POST.get("transponderusername")).strip() != "" and (request.POST.get("transponderpassword")).strip() != "" and (request.POST.get("opsname")).strip() != ""\
                    and (request.POST.get("opsip")).strip() != "" and (request.POST.get("opsusername")).strip() != "" and (request.POST.get("opspassword")).strip() != "" \
                    and (request.POST.get("interfacename")).strip() != "":
                    group_detail = equinixgroups.objects.get(groupname = request.POST.get("selgrpname"))  
                    group_detail.delete()
            edit_group_data.save()
            response = "success"
    except Exception as e:
        print(str(e))
        response = "fail"
        return HttpResponse(response)
    else:
        return HttpResponse(response)
   