function SendRokuCommandWithCallback(command, callback) {
    var url = "http://" + GetRokuIPString() + ":8060/" + command;
    $.ajax({
        url: url,
        type: "POST",
        success: callback,
        error: callback
    });
};

function DelayForSecondsWithCallback(seconds, callback) {
    setTimeout(callback, seconds * 1000);
}

function GetRokuIPString(){
    var ipComponents = [];
    var error = false;
    for (var i = 0; i < 4; i++){
        var comp = localStorage["roku-ip-array-" + i];
        if (comp === undefined) error = true;
        else ipComponents.push(comp);
    }
    if (!error) {
        return ipComponents.join(".");
    } else {
        console.log("Saved IP not found. Using loopback.");
        return "127.0.0.1";
    }
}


function getVarType(variable) {
    try{
        variable.toFixed();
        return "Number";
    } catch(e){};
    try {
        variable.toUpperCase();
        return "String";
    } catch(e){};
    return undefined;
}



function performSequence(arrayOfTasks, completion) {
    if (completion != undefined){
        Window.Completion = completion;
    }
    if (arrayOfTasks.length > 0) {
        
        arrayOfTasks = arrayOfTasks.slice();
            
        var nextThing = arrayOfTasks.shift();
        var nextThingType = getVarType(nextThing);
        var callback = function(){
            performSequence(arrayOfTasks);
        }
        
        if (nextThingType === "String") {
            SendRokuCommandWithCallback(nextThing, callback);
        } else if (nextThingType === "Number") {
            DelayForSecondsWithCallback(nextThing, callback);
        } else {
            console.log("Error parsing type");
        }
        
    } else {
        var _completion = Window.Completion;
        if (_completion != undefined){
            _completion();
        } else {
            alert("done with no completion");
        }
    }
}