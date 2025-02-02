var lineIndex = 0;
var intervalId = 0;
var PrevActionOptions;

function scheduleDeleteTimeline() {
    clearInterval(intervalId);
    lineIndex = 0;
    intervalId = setInterval(deleteTimeline, 1*1000);
    setStatus("stopping previous action");
    setStatus("starting delete timeline");
}

function scheduleUnlikeTimeline() {
    clearInterval(intervalId);
    lineIndex = 0;
    intervalId = setInterval(unlikeTimeline, 1*1000);
    setStatus("stopping previous action");
    setStatus("starting unlike");
}

function unlikeTimeline() {
    let unlike = document.querySelector("[data-testid='unlike']");
    if (unlike) {
        unlike.click();
    } else {
        setStatus("Nothing to unlike. Scrolling page");
        window.scrollTo(0, document.body.scrollHeight);
    }
}

function clickDelete() {
    let deleteButton = document.evaluate("//div[@role='menu']//div[@role='menuitem']//span[contains(text(), 'Delete')]",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(deleteButton) {
        deleteButton.click();
        setTimeout(clickConfirm, .1*1000);
    }
}

function clickConfirm() {
    let confirmButton = document.querySelector("div[data-testid='confirmationSheetDialog'] [role='button']");
    if (confirmButton) {
        confirmButton.click();
        
    }
}

var previousMoreButton;
function deleteTimeline() {
    let moreButton = document.querySelectorAll("[aria-haspopup='menu'][aria-label='More']")[lineIndex];

    if(previousMoreButton && (previousMoreButton == moreButton)) {
        previousMoreButton = moreButton;
        lineIndex++;
        setStatus("Undeleted element detected. \nSkipping First " + (lineIndex) + " Lines");
        return;
    }

    previousMoreButton = moreButton;

    if (moreButton) {
        moreButton.click();
        setTimeout(clickDelete, .1*1000);
    } else {
        window.scrollTo(0, document.body.scrollHeight);
        setStatus("No more elements detected. Scrolling Page")
    }


    
}

function clearStatus() {
    var textarea = document.getElementById("cleanerstatus");
    textarea.value = "";
}

function setStatus(status) {
    var textarea = document.getElementById("cleanerstatus");
    textarea.value = status + "\n" + textarea.value;
}

function createUI() {
    var buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.margin = "10px";
    buttonContainer.style.zIndex = "10000";
    buttonContainer.style.top = "0";
    buttonContainer.style.height = "35px";
    buttonContainer.style.width = "400px"
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
            expandCollapseButton.innerText = "🔽";
            buttonContainer.style.height = "35px";
        } else {
            expanded = true;
            expandCollapseButton.innerText = "🔼";
            buttonContainer.style.height = "305px";
        }
    };
    expandCollapseButton.style.margin = "5px";

    buttonContainer.appendChild(expandCollapseButton);

    var startButton = document.createElement("button");
    startButton.innerText = "Start Deletion";
    startButton.onclick = scheduleDeleteTimeline;
    startButton.style.margin = "5px";

    buttonContainer.appendChild(startButton);

    
    var unlikeButton = document.createElement("button");
    unlikeButton.innerText = "Start Unlike";
    unlikeButton.onclick = scheduleUnlikeTimeline;
    unlikeButton.style.margin = "5px";

    buttonContainer.appendChild(unlikeButton);
    

    var stopButton = document.createElement("button");
    stopButton.innerText = "Stop Action";
    stopButton.onclick = () => { setStatus("stop action"); clearInterval(intervalId) };
    stopButton.style.margin = "5px";

    buttonContainer.appendChild(stopButton);

    buttonContainer.appendChild(document.createElement("br"));


    var textarea = document.createElement("textarea");
    textarea.id = "cleanerstatus"
    textarea.style.color = "black";
    textarea.style.margin = "5px";
    textarea.style.backgroundColor = "white";
    textarea.style.width = "calc(100% - 15px)";
    textarea.style.height = "250px";
    buttonContainer.appendChild(textarea);
    document.body.appendChild(buttonContainer);

    setStatus("UI ready");
}

createUI()
