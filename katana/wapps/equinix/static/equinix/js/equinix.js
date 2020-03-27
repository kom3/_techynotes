var equinix = {

measure_func: function(){
    $(".result").val("")
    if($(".api_res").css("display") == "none"){
        $(".api_res").css("display", "block");
    }
    if($(".loader").css("display") == "none"){
        $(".loader").show();
    }
    $(".set_btn").attr("disabled", true);
    $(".msr_btn").attr("disabled", true);
   $odi = $(".msr_odi").val()
   $msr_pr_type = $(".msr_pr_type").find(":selected").text()
   console.log($odi, $msr_pr_type)
   $.ajax({
    headers: {
        'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
    },
    type: 'GET',
    url: 'equinix/measure/',
    dataType: "json",
    async:false,
    data: {"odi": $odi, "pr_type":$msr_pr_type}
}).done(function(data){
    $(".loader").css("display", "none");
    $(".result").val(JSON.stringify(data, null, 4));
    $(".set_btn").attr("disabled", false);
    $(".msr_btn").attr("disabled", false);

})
},

set_func: function(){
    $(".result").val("")
    if($(".api_res").css("display") == "none"){
        $(".api_res").css("display", "block");
    }
    if($(".loader").css("display") == "none"){
        $(".loader").show();
    }
    $(".set_btn").attr("disabled", true);
    $(".msr_btn").attr("disabled", true);
   $odi = $(".set_odi").val()
   $set_pr_type = $(".set_pr_type").find(":selected").text()
   console.log($odi, $set_pr_type)
   $.ajax({
    headers: {
        'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
    },
    type: 'GET',
    url: 'equinix/set/',
    dataType: "json",
    async:false,
    data: {"odi": $odi, "pr_type":$set_pr_type}
}).done(function(data){
    $(".loader").css("display", "none");
    $(".result").val(JSON.stringify(data, null, 4));
    $(".set_btn").attr("disabled", false);
    $(".msr_btn").attr("disabled", false);

})
},
openaddgroupform: function(){
    $(".show-hide").show()
    $(".modal-title").text("Add")
    $(".show-hide :input").prop("disabled", false)
    $("#toggle-for-add-edit").html("<p></p>")
    $(".show-hide :input").val("");
    $(".modal-footer").html("<p></p>")
    btns = '<button type="button" class="btn btn-default" id="add_close" data-dismiss="modal">Close</button><button type="button" action-type="addsave" class="btn btn-default" onclick="equinix.save(this)">Save</button>' 
    $(".modal-footer").html(btns)
},
openeditgroupform: function(){
    $(".show-hide").hide()
    $(".modal-title").text("Edit")
    $(".show-hide :input").prop("disabled", false)
    label = '<label>Select group name:</label>'
    $.ajax({
        headers: {
            'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
        },
        type: 'POST',
        url: 'equinix/get_group_list/',
        async:false,
        data: {}
    }).done(function(data){
        console.log(typeof(data))
        data = data.replace(/'/g, '"');
        data = JSON.parse(data)
        console.log(data)
        options = "<option>None</option>"
        if (data.length){
        for(grp=0; grp<data.length; grp++){
            console.log(data[grp])
            options += "<option>"+String(data[grp])+"</option>"
        }
        }
        groups_list = '<select class="selected_group" style="margin:0;" onchange="equinix.fetch_group_details()">'+options+'</select>'
        $("#toggle-for-add-edit").html("<p></p>")
        $("#toggle-for-add-edit").html(label+groups_list)
    });
    $(".modal-footer").html("<p></p>")
    btns = '<button type="button" class="btn btn-default" id="edit_close" data-dismiss="modal">Close</button><button type="button" action-type="editsave" class="btn btn-default" onclick="equinix.save(this)">Save</button>' 
    $(".modal-footer").html(btns)
},
openviewgroupform: function(){
    $(".show-hide").hide()
    $(".modal-title").text("View")
    $(".show-hide :input").val("");
    $(".show-hide :input").prop("disabled", true)
    label = '<label>Select group name:</label>'
    $.ajax({
        headers: {
            'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
        },
        type: 'POST',
        url: 'equinix/get_group_list/',
        // dataType: "json",
        async:false,
        data: {}
    }).done(function(data){
        console.log(typeof(data))
        data = data.replace(/'/g, '"');
        data = JSON.parse(data)
        console.log(data)
        options = "<option>None</option>"
        if (data.length){
        for(grp=0; grp<data.length; grp++){
            console.log(data[grp])
            options += "<option>"+String(data[grp])+"</option>"
        }
        }
        groups_list = '<select class="selected_group" style="margin:0;" onchange="equinix.fetch_group_details()">'+options+'</select>'
        $("#toggle-for-add-edit").html("<p></p>")
        $("#toggle-for-add-edit").html(label+groups_list)
    });
    $(".modal-footer").html("<p></p>")
    btns = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' 
    $(".modal-footer").html(btns)
},

save: function(e){
    save_type = $(e).attr("action-type")
    console.log(save_type)
    grpname = $(".groupname").val()
    tsname = $(".tsname").val()
    tsip = $(".tsip").val()
    tsuname = $(".tsuname").val()
    tspassword = $(".tspassword").val()
    opsname = $(".opsname").val()
    opsip = $(".opsip").val()
    opsuname = $(".opsuname").val()
    opspassword = $(".opspassword").val()
    interfacename = $(".interfacename").val()
    
    if(save_type == "addsave"){
        console.log("adding new group....")
        console.log(grpname,tsname, tsip, tsuname, tspassword, opsname, opsip, opsuname, opspassword, interfacename)
        $.ajax({
            headers: {
                'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
            },
            type: 'POST',
            url: 'equinix/add_new_group/',
            // dataType: "json",
            async:false,
            data: {"groupname":grpname, "transpondername":tsname, "transponderip":tsip, "transponderusername":tsuname, "transponderpassword":tspassword, "opsname":opsname, "opsip":opsip, "opsusername":opsuname, "opspassword":opspassword, "interfacename":interfacename}
        }).done(function(data){
           if(data == "success"){
               equinix.success_alert("Success!","Succesfully added a group.","success")
               $("#add_close").trigger("click");
           }
           else if(data == "duplicate"){
            equinix.success_alert("Error!","Group name already exists.","error")
           }
           else{
            equinix.success_alert("Error!","Failed to add a group.","error")
           }
        });
    }
    else if(save_type == "editsave"){
        console.log("adding new group....")
        selgrpname = $(".selected_group").find(":selected").text()
        console.log(selgrpname,grpname,tsname, tsip, tsuname, tspassword, opsname, opsip, opsuname, opspassword, interfacename)
        $.ajax({
            headers: {
                'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
            },
            type: 'POST',
            url: 'equinix/edit_group/',
            async:false,
            data: {"selgrpname":selgrpname, "groupname":grpname, "transpondername":tsname, "transponderip":tsip, "transponderusername":tsuname, "transponderpassword":tspassword, "opsname":opsname, "opsip":opsip, "opsusername":opsuname, "opspassword":opspassword, "interfacename":interfacename}
        }).done(function(data){
           if(data == "success"){
               equinix.success_alert("Success!","Succesfully added a group.","success")
               $("#edit_close").trigger("click");
            }
           else if(data == "duplicate"){
            equinix.success_alert("Error!","Group name already exists.","error")
           }
           else{
            equinix.success_alert("Error!","Failed to add a group.","error")
           }
        });
    }
},

success_alert: function(header,message,message_type){
    console.log("calling");
    swal.fire(
        header,
        message,
        message_type
    )
    },

fetch_group_details:function(){
     groupname = $(".selected_group").find(":selected").text()
     if(groupname == "None"){
        $(".show-hide").hide()
     }
     else{
        $(".show-hide").show() 
        $.ajax({
            headers: {
                'X-CSRFToken': katana.$activeTab.find('input[name="csrfmiddlewaretoken"]').attr('value')
            },
            type: 'POST',
            url: 'equinix/fetch_group_details/',
            // dataType: "json",
            async:false,
            data: {"groupname":groupname}
        }).done(function(data){
            data["groupname"]
            grpname = $(".groupname").val(data["groupname"])
            tsname = $(".tsname").val(data["transpondername"])
            tsip = $(".tsip").val(data["transponderip"])
            tsuname = $(".tsuname").val(data["transponderusername"])
            tspassword = $(".tspassword").val(data["transponderpassword"])
            opsname = $(".opsname").val(data["opsname"])
            opsip = $(".opsip").val(data["opsip"])
            opsuname = $(".opsuname").val(data["opsusername"])
            opspassword = $(".opspassword").val(data["opspassword"])
            interfacename = $(".interfacename").val(data["interfacename"])

        })
     }
    },

}