# -*- coding: utf-8 -*-


from django.db import models

# Create your models here.
class equinixgroups(models.Model):  
        groupname = models.CharField(max_length=100,primary_key=True)  
        transpondername = models.CharField(max_length=100)  
        transponderip = models.CharField(max_length=100)
        transponderusername = models.CharField(max_length=100)
        transponderpassword = models.CharField(max_length=100)
        opsname = models.CharField(max_length=100)
        opsip = models.CharField(max_length=100)
        opsusername = models.CharField(max_length=100)
        opspassword = models.CharField(max_length=100)
        interfacename = models.CharField(max_length=100)

class Meta:  
            db_table = "equinix"
            app_label = "equinix"