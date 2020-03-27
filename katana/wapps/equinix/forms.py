from django import forms  
from katana.wapps.equinix.models import equinixgroups  
class equinixgroupsForm(forms.ModelForm):  
    class Meta:  
        model = equinixgroups
        fields = "__all__"  
       