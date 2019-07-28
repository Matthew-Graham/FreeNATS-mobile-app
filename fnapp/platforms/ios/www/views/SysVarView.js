/**
 * An object controlling the display and logic of the the system variables 
 * for a particular a freenats instance.
 * @param {JSON} sysvars 
 */
function SysVarView(sysvars) {
    app.router.currPage = "sysvarread";
    this.compile(sysvars);
    this.attachEvents();
}

/**
 * @param  {JSON} sysvars
 */
SysVarView.prototype.compile = function(sysvars) {
    let sysvarsTemplate = Handlebars.compile($("#sysvarsTemplate").html());
    let sysvarsHtml = sysvarsTemplate(sysvars);
    $(".content-padded").html(sysvarsHtml);
}

/**
 *  Attachs events for Modification of a particular sysvar
 */
SysVarView.prototype.attachEvents = function() {
    $(".modifySysVar").on('click', function(event) {
        let sysvarid = $(this).siblings(".inputsysvar").val();
        let name = $(this).siblings(".labelsysvar").html();

        let url = app.fnConnObj.currUrl + "/sysvar/" + name;

        if (sysvarid == 0 || sysvarid == 1) {
            let jqxhr = $.post(url, { value: sysvarid });

            jqxhr.done(function(data) {
                alert("Variable " + name + "succesfully changed to " + sysvarid);
                console.log(data);
            });

            jqxhr.fail(function(data) {
                console.log(data.error);
            });
        } else {
            alert("enter a 1 or 0");
        }

    });
}