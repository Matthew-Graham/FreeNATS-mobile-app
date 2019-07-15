function SysVarView(sysvars) {  
    this.systemVars = sysvars;
    console.table(this.systemVars);
    app.router.currPage = "sysvar";
    this.compile();
    this.attachEvents();
    self = this;
    //console.log("sys vars"+ sysvars);
}


SysVarView.prototype.compile = function () {
     let sysvarsTemplate = Handlebars.compile($("#sysvarsTemplate").html());
     let sysvarsHtml = sysvarsTemplate(this.systemVars);
     $(".content-padded").html(sysvarsHtml);
}

SysVarView.prototype.attachEvents = function(){
    $(".modifySysVar").on('click', function (event) {     
        let sysvarid = $(this).siblings(".inputsysvar").val();
        let name = $(this).siblings(".labelsysvar").html();
        console.log("yes"+sysvarid);
        //fnConnObj.query({path1:name,path2:sysvarid});

        //post
        let url = sessionStorage.getItem("url") +"/sysvar/"+name+"?fn_skey="+ sessionStorage.getItem("skey")+"&fn_sid="+ sessionStorage.getItem("sid");
        let jqxhr = $.post(url,{value:sysvarid});

        jqxhr.done(function(data){
            alert("Variable "+name+"succesfully changed to "+sysvarid);
            console.log(data);

        });
        jqxhr.fail(function(data){
            console.log(data.error);
        });
    });
}
