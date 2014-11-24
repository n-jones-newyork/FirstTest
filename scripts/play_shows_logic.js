$(window).load(function(){
    loadIPFromLocalStorage();
    saveIPToLocalStorage();
    // ON LOAD FETCH ACTION JSON FILE
    $.getJSON("jsondata/actions.json", function(actionsDict){
        if (actionsDict === undefined) {
            alert("No actions found");
            return;
        }
        Window.ActionsDict = actionsDict;
        var actionTitles = [];
        var actionIdsByTitle = {};
        $.each( actionsDict, function(key, value){
            var title = value["title"];
            actionIdsByTitle[title] = key;
            actionTitles.push(title);
        });
        $('.action_selector').each(function(index, select){
            $.each(actionTitles, function(index, title){
                $(select).append('<option id="' + actionIdsByTitle[title] + '">' + title + '</option>');
            });
        });
        Window.ActionTitles = actionTitles;
        Window.ActionIdsByTitle = actionIdsByTitle;
    });
    // HANDLE GO BUTTON
    $("#go").click(function(event){
        event.target.setAttribute("disabled", true);
        $('.action_selector').each(function(index, select){
            $(select).attr("disabled","disabled")
            
            var delay = select.getAttribute("minute_delay");
            var selectedActionTitle = $(select).val();
            var selectedActionId = Window.ActionIdsByTitle[selectedActionTitle];
            var selectedAction = Window.ActionsDict[selectedActionId];
            var selectedSequence = selectedAction["sequence"];
            
            // Schedule the action using setTimeout() and its odd syntax.
            setTimeout(function(){
                performSequence(selectedSequence, function(){
                    $(select).addClass("done");
                });
            },(delay * 60 * 1000));
        });
    });
    $(".ip").each(function(index, ipInput){
        $(ipInput).on("change", function(event){
            var changedInputField = event.target;
            var newValue = changedInputField.value;
            if (newValue < 0) {
                changedInputField.value = 0;
            } else if (newValue > 255) {
                changedInputField.value = 255;
            } 
            saveIPToLocalStorage();
        });
    });
});

function ipChangeEvent(e){
    alert("Change");
}


function saveIPToLocalStorage(){
    console.log("save called");
    $(".ip").each(function(index, ipInput){
        localStorage["roku-ip-array-" + index] = ipInput.value; 
    });
}
function loadIPFromLocalStorage(){
    console.log("load called");
    $(".ip").each(function(index, ipInput){        
        var valueForField = localStorage["roku-ip-array-" + index];
        if (valueForField != undefined) {
            ipInput.value = valueForField;
        }
    });
}
