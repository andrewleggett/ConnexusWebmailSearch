// element.addEventListener("click", funcName); //

const ccrCWS = { //namespace things to prevent accidental overwrites
    periodically() { //set up an interval to check whether or not we need to add the searchbox
        ccrCWS.interval = setInterval(ccrCWS.check, 750); //run check function every 750ms
    },
    check() { //check whether or not to add the searchbox
        //if the element in the add recipients popup that we add the searchbox to is present, and the searchbox isn't
        if (document.getElementById("selectRecipientsHeader") && !(document.getElementById("ccrSearchbox"))) {
            ccrCWS.addSearch(); //add the searchbox
        }
    },
    addSearch() { //add the search box and a clarifying label to the top of the page
        let head = document.getElementById("selectRecipientsHeader"); //get the element we want to insert the search box inside of
        //add HTML for our searchbox and a descriptive label into the element
        head.parentElement.innerHTML+= `<br><label class="primaryLabel" for="listName">Filter Available Recipients: </label>
            <!--Make sure the form has the autocomplete function switched off:-->
            <form autocomplete="off">
                <div class="autocomplete" style="width:300px;">
                    <input id="ccrSearchBox" type="text" name="ccrSearchText" placeholder="Country">
                </div>
                <input type="submit">
            </form>`;
        ccrSearchbox.onkeyup = function() { //declare a function to run whenever someone releases a key inside the search box
            if (document.getElementById("recipients").options.length > 500) {
                ccrSpinner.hidden = false; //reveal a spinner to reassure users that the browser has not totally crashed
                ccrCWS.timeout = null; //if this has already been triggered, abort triggering it
                ccrCWS.searchText = ccrSearchbox.value; //record what was typed so we can not run the search if the user was still typing
                ccrCWS.timeout = setTimeout(ccrCWS.search, 1000); //trigger the search after 1 second
            } else {
                ccrSpinner.hidden = false; //reveal a spinner to reassure users that the browser has not totally crashed
                ccrCWS.searchText = ccrSearchbox.value; //record what was typed so search works
                ccrCWS.search(); //run the search
            }
        }
    },
    searchText: "",
    timeout: null,
    async search() { //search for users matching what was typed
        let text = ccrSearchbox.value; //get the text they've entered
        if (ccrCWS.searchText !== text) {
            ccrSpinner.hidden = true; //hide the spinner
        } else {
            text = text.toLowerCase(); //convert that text to lower case - so we can match things without regard of case
            let options = document.getElementById("recipients").options; //get the list of recipients in the available recipients box
            for (let i=0;i<options.length;i++) { //iterate over these recipients
                let o = ""; //declare a string
                o += options[i].innerText; //add the recipient's name to that string
                o = o.toLowerCase(); //convert the recipient's name to lower case so we can match without regard of case
                if (o.indexOf(text) === -1) { //if the text entered in the search box does not appear in the recipient name text,
                    options[i].hidden = true; //hide the recipient
                } else { //otherwise, if it does appear,
                    options[i].hidden = false; //unhide the recipient
                }
            }
            ccrSpinner.hidden = true; //hide the spinner
        }
    }
};

//CSS
var styles = `
    .ccr_t {
        border: 0px;
    }
    .ccr_td {
        border: 0px;
    }
    .ccr_loader {
        border: 3px solid #f3f3f3; /* Light grey */
        border-top: 3px solid #d66127; /* Connections Orange */
        border-bottom: 3px solid #fed141; /* Connections Yellow */
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: ccr_spin 2s linear infinite;
    }

    @keyframes ccr_spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.body.appendChild(styleSheet);

ccrCWS.periodically(); //start the program