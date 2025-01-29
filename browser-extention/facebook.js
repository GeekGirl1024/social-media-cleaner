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
            lineIndex++;
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
            if(!menuOption == null) {
                menuOption = document.evaluate("//span[contains(text(), 'Delete')]",
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }

            if(menuOption != null) {
                menuOption.click();
                setTimeout(clickConfirm, .2*1000);
            } else {
                lineIndex++;
            }

        }, .2*1000);
    
    }, 2*1000);
}

var bodyElement = document.getElementsByTagName("body")[0];

var buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.margin = "10px";
buttonContainer.style.zIndex = "10000";
buttonContainer.style.top = "0";
buttonContainer.style.left = "100px"

var startButton = document.createElement("button");
startButton.innerText = "Start Deletion";
startButton.onclick = deleteTimeline;


buttonContainer.appendChild(startButton);

var stopButton = document.createElement("button");
stopButton.innerText = "Stop Deletion";
stopButton.onclick = () => { clearInterval(intervalId) };

buttonContainer.appendChild(document.createElement("br"));
buttonContainer.appendChild(stopButton);

bodyElement.appendChild(buttonContainer);