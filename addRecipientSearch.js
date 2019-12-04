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
        //add HTML for our searchbox and a descriptive label into a suitable part of the page
        document.getElementsByClassName("formRow addressBookList ng-scope")[0].insertAdjacentHTML("afterend", `<br><label class="primaryLabel" for="listName">Filter Available Recipients: </label>
            <br><table class="ccr_t">
                <tr class="ccr_tr">
                    <td class="ccr_td">
                        <textarea id="ccrSearchbox" rows="1" cols="50"></textarea>
                    </td>
                    <td class="ccr_td" width="30">
                        <div id="ccrSpinner" hidden="true" class="ccr_loader"></div>
                    </td>
                </tr>
            </table>`);
        ccrSearchbox.onkeyup = function() { //declare a function to run whenever someone releases a key inside the search box
            if (document.getElementById("recipients").options.length > 200) { //if the recipients list is long - and likely to lead to an unpleasant user experience with a more simple option hiding approach,
                ccrSpinner.hidden = false; //reveal a spinner to reassure users that the browser has not totally crashed
                ccrCWS.searchText = ccrSearchbox.value; //record what was typed so we can not run the search if the user was still typing
                setTimeout(ccrCWS.bigSearch, 300); //run the alternative search function for handling large lists - after a pause so that we run fewer searches during fast typing
            } else { //otherwise,
                ccrSpinner.hidden = false; //reveal a spinner to reassure users that the browser has not totally crashed
                ccrCWS.searchText = ccrSearchbox.value; //record what was typed so search works
                setTimeout(ccrCWS.search, 300); //run the search after a pause, so that we run fewer searches during fast typing
            }
        }
    },
    searchText: "", //property to hold our record of what was typed into the search box
    async search() { //search for users matching what was typed
        let text = ccrSearchbox.value; //get the text they've entered
        if (ccrCWS.searchText !== text) { //see whether the text entered when the function was called matches what's in the search box right now - this reduces the number of unneccessary function calls and delays searching while a user is typing quickly
            ccrSpinner.hidden = true; //hide the spinner, and finish there until there's a 300ms pause in typing
        } else {
            text = text.toLowerCase(); //convert that text to lower case - so we can match things without regard for case
            let options = document.getElementById("recipients").options; //get the list of recipients in the available recipients box
            for (let i=0;i<options.length;i++) { //iterate over these recipients
                let o = ""; //declare a string
                o += options[i].innerText; //add the recipient's name to that string
                o = o.toLowerCase(); //convert the recipient's name to lower case so we can match without regard for case
                if (o.indexOf(text) === -1) { //if the text entered in the search box does not appear in the recipient name text,
                    options[i].hidden = true; //hide the recipient
                } else { //otherwise, if it does appear,
                    options[i].hidden = false; //unhide the recipient
                }
            }
            ccrSpinner.hidden = true; //hide the spinner
        }
    },
    async bigSearch() { //same as above, but this time we hide the whole recipients box while we make changes to dodge issues associated with making thousands of DOM changes in quick succession (serious crashing issues were seen when testing)
        let text = ccrSearchbox.value; //get the text they've entered
        if (ccrCWS.searchText !== text) { //see whether the text entered when the function was called matches what's in the search box right now - this reduces the number of unneccessary function calls and delays searching while a user is typing quickly
            ccrSpinner.hidden = true; //hide the spinner
        } else {
            text = text.toLowerCase(); //convert that text to lower case - so we can match things without regard of case
            let options = document.getElementById("recipients").options; //get the list of recipients in the available recipients box
            document.getElementById("recipients").hidden = true; //hide the recipients list to reduce strain
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
            document.getElementById("recipients").hidden = false; //reveal the updated recipients box
            ccrSpinner.hidden = true; //hide the spinner
        }
    }
};

//Add CSS for a spinner - the loading display the page has already is excessively obtrusive for our purposes
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

var styleSheet = document.createElement("style"); //begin creating a stylesheet element
styleSheet.type = "text/css"; //give styleSheet it's text/css type
styleSheet.innerText = styles; //add the spinner CSS text to the element
document.body.appendChild(styleSheet); //add the element to the page

ccrCWS.periodically(); //start the program