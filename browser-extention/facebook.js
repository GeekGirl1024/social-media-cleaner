function clickConfirm() {
    let item = document.querySelector("[aria-hidden='false'] [aria-label='Delete']");
    if (item == null) {
        item = document.querySelector("[aria-hidden='false'] [aria-label='Move to Trash']")
    }
    if (item == null) {
        item = document.querySelector("[aria-hidden='false'] [aria-label='Remove']")
    }
    if(item != null) {
        item.click();
    } else {
        // dismiss overlay


        document.body.click();
    }
}

var lineIndex = 0;
var intervalId = 0;
var PrevActionOptions;
function deleteTimeline() {
    clearInterval(intervalId);
    lineIndex = 0;
    intervalId = setInterval(() => {

        ActionOptions = document.querySelectorAll("[aria-label='Action options']")[lineIndex];

        if(PrevActionOptions == ActionOptions) {
            PrevActionOptions = ActionOptions;
            lineIndex++;
            setStatus("Undeleted element detected. \nSkipping First " + (lineIndex) + " Lines");
            return;
        }

        PrevActionOptions = ActionOptions;

        ActionOptions.click();

        setTimeout(() => {
            menuOption = document.evaluate("//span[contains(text(), 'trash')]",
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if(menuOption == null) {
                menuOption = document.evaluate("//span[contains(text(), 'Remove')]",
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
            if(menuOption == null) {
                menuOption = document.evaluate("//span[contains(text(), 'Delete')]",
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
            if(menuOption == null) {
                menuOption = document.evaluate("//span[contains(text(), 'Unlike')]",
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }

            if(menuOption != null) {
                menuOption.click();
                setTimeout(clickConfirm, .2*1000);
            } else {
                lineIndex++;
                setStatus("No removal menu option detected. Skipping First " + (lineIndex) + "Lines");
            }

        }, .2*1000);
    
    }, 2*1000);
}

function createUI() {
    var buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.margin = "10px";
    buttonContainer.style.zIndex = "10000";
    buttonContainer.style.top = "0";
    buttonContainer.style.height = "30px";
    buttonContainer.style.width = "300px"
    buttonContainer.style.left = "100px";
    buttonContainer.style.backgroundColor = "powderblue";
    buttonContainer.style.border = "darkgrey solid 1px";
    buttonContainer.style.overflow = "hidden";

    var expandCollapseButton = document.createElement("button");
    var expanded = false;
    expandCollapseButton.innerText = "🔽";
    expandCollapseButton.onclick = () => {
        if(expanded) {
            expanded = false;
            expandCollapseButton.innerText = "🔼";
            buttonContainer.style.height = "30px";
        } else {
            expanded = true;
            expandCollapseButton.innerText = "🔽";
            buttonContainer.style.height = "300px";
        }
    };
    expandCollapseButton.style.margin = "5px";

    buttonContainer.appendChild(expandCollapseButton);

    var startButton = document.createElement("button");
    startButton.innerText = "Start Deletion";
    startButton.onclick = deleteTimeline;
    startButton.style.margin = "5px";


    buttonContainer.appendChild(startButton);

    var stopButton = document.createElement("button");
    stopButton.innerText = "Stop Deletion";
    stopButton.onclick = () => { setStatus("stop deletion"); clearInterval(intervalId) };
    stopButton.style.margin = "5px";

    buttonContainer.appendChild(stopButton);

    buttonContainer.appendChild(document.createElement("br"));


    var textarea = document.createElement("textarea");
    textarea.id = "cleanerstatus"
    textarea.style.margin = "5px";
    textarea.style.backgroundColor = "white";
    textarea.style.width = "250px";
    textarea.style.height = "250px";
    buttonContainer.appendChild(textarea);
    document.body.appendChild(buttonContainer);

    setStatus("UI ready");
}


function clearStatus() {
    var textarea = document.getElementById("cleanerstatus");
    textarea.value = "";
}

function setStatus(status) {
    var textarea = document.getElementById("cleanerstatus");
    textarea.value = status + "\n" + textarea.value;
}

createUI()
