class PoetryGetter {

    constructor() {
        this.createListeners();
    }

    // adds listeners to input elements for handling
    createListeners() {
        document.getElementById('submitButton').addEventListener('click', e => this.handleSubmitButtonClicked());
        document.getElementById('authorCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('titleCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('linesCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('lineCountCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
    }

    // handles when user clicks the submit button
    handleSubmitButtonClicked() {
        this.clearData();
        this.getPoetry();
    }

    /*
    handles switching state of text inputs 
    based on whether related checkbox is checked or not
    */
    handlePredicateActivated(checkbox) {
        let isDisabled = !checkbox.checked;

        switch (checkbox.id) {
            case "authorCheckbox": {
                document.getElementById('authorVal').disabled = isDisabled;
                break;
            }
            case "titleCheckbox": {
                document.getElementById('titleVal').disabled = isDisabled;
                break;
            }
            case "linesCheckbox": {
                document.getElementById('linesVal').disabled = isDisabled;
                break;
            }
            case "lineCountCheckbox": {
                document.getElementById('lineCountVal').disabled = isDisabled;
                break;
            }
            default: { break; }
        }
 
    }

    /*
    gets all predicate checkboxes and creates a predicate string
    from all the checked boxes
    */
    getPredicates() {
        let predicateCheckboxes = document.querySelectorAll('input[name="predicate"]'); // find all inputs named "predicate"
        let checkedPredicates = [];

        predicateCheckboxes.forEach(predicate => {
            if (predicate.checked) checkedPredicates.push(predicate.value); // if the predicate is enabled, push the value to our string array
        });

        let predicateArg = checkedPredicates.join(','); // create comma-delimited string

        return predicateArg;
    }

    /*
    gets all search term text inputs and creates a semicolon-delimited string
    from all the active inputs
    */
    getSearchTerms()
    {
        let searchTermInputs = document.querySelectorAll('input[name="term"]') // find all inputs named "term"
        let enabledTerms = [];

        searchTermInputs.forEach(termInput => {
            if (!termInput.disabled) enabledTerms.push(termInput.value); // if the input is not disabled, push the value to our string array
        });

        let searchTermArg = enabledTerms.join(';'); // create a semicolon-delimited string

        return searchTermArg;

    }

    // formulates url and makes request to server and handles results
    async getPoetry() {
        let predicateArg = this.getPredicates(); // create predicate string (can be comma-delimited)
        let searchTermArg = this.getSearchTerms() // create search term string (can be semi-colon delimited)

        if (predicateArg === "" || searchTermArg === "")  // if user has not entered a predicate or search term
        {
            let logDataSection = document.getElementById('logData')
            logDataSection.innerText = "Please enter search criteria";

            return; // do not make a call to the server
        }

        let url = `https://poetrydb.org/${predicateArg}/${searchTermArg}/lines,title,author,linecount`; // create the url string

        try {
            const response = await fetch(url); // make call to the server
            if (response.status === 200) { // if the status is 200
                let data = await response.json(); // get the json from response
                this.createEntires(data); // create entries from json
            }
            else { // throw an error if the status is not 200

                // NOTE: sometimes, the status code of the response is 200,
                // but the data returned from the server has a key:value pair of 'status: 404'.
                // I'm not handling that because it's actually a 200 response from the server.

                throw new Error("Status is not 200!");  // throw the errir
            }
        } catch (error) {
            console.error(error); // send error to console
        };
    }

    // loops through data received from server and creates html elements from them
    createEntires(poemsData) {
        if (poemsData.length) // if a result was found
        {
            // loop through the data and create an entry from them
            poemsData.forEach(poemData => {
                this.createEntry(poemData);
            });
        } else { // if no result was found
            let logDataSection = document.getElementById('logData') // insert text into log area to inform user
            logDataSection.innerText = "No Results..."
        }
    }

    // creates an individual poetry data entry element that contains
    // child elements that show the line values of each poem
    createEntry(poemData) {
        let logDataSection = document.getElementById('logData') // get the container section div

        let poemDataContainer = logDataSection.appendChild(document.createElement('div')) // append a child container element to contain author, title, lines, linecount

        let poemDetailsEl = poemDataContainer.appendChild(document.createElement('h3')) // append child to container to display author, title, linecount

        poemDetailsEl.innerText = `${poemData.title} by ${poemData.author} - ${poemData.linecount} lines`; // insert the author, title, linecount into element

        let linesContainer = poemDataContainer.appendChild(document.createElement('div')) // create a containter for the lines of the poem

        // for each line in the poem, create an element and insert the text
        poemData.lines.forEach((line) => {
            let lineElement = linesContainer.appendChild(document.createElement('p')) 
            lineElement.innerText = line;
        });
    }

    // reset the logDataSection container so that fresh data can be presented
    clearData() {
        let logDataSection = document.getElementById('logData') // get the container section div
        let child = logDataSection.lastElementChild; // get the last child element in the div

        // loop through all the children of the container and remove them
        if (logDataSection.children.length > 0) {
            while (child) {
                logDataSection.removeChild(child);

                child = logDataSection.lastElementChild;
            }
        }
        logDataSection.innerText = ''; // also remove left over text that is not an element
    }
}


let poetryGetter = new PoetryGetter; // instantiate PoetryGetter