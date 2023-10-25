class PoetryGetter {

    constructor() {
        this.createListeners();
    }

    createListeners() {
        document.getElementById('submitButton').addEventListener('click', e => this.handleSubmitButtonClicked());
        document.getElementById('authorCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('titleCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('linesCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
        document.getElementById('lineCountCheckbox').addEventListener('click', e => this.handlePredicateActivated(e.target));
    }

    handleSubmitButtonClicked() {
        this.clearData();
        this.getPoetry();
    }

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


    getPredicates() {
        let predicateCheckboxes = document.querySelectorAll('input[name="predicate"]');
        let checkedPredicates = [];

        predicateCheckboxes.forEach(predicate => {
            if (predicate.checked) checkedPredicates.push(predicate.value);
        });

        let predicateArg = checkedPredicates.join(',');

        return predicateArg;
    }

    getSearchTerms()
    {
        let searchTermInputs = document.querySelectorAll('input[name="term"]')
        let enabledTerms = [];

        searchTermInputs.forEach(termInput => {
            if (!termInput.disabled) enabledTerms.push(termInput.value);
        });

        let searchTermArg = enabledTerms.join(';');

        return searchTermArg;

    }

    async getPoetry() {
        let predicateArg = this.getPredicates();
        let searchTermArg = this.getSearchTerms() 

        if (predicateArg === "" || searchTermArg === "") return;

        let url = `https://poetrydb.org/${predicateArg}/${searchTermArg}/lines,title,author,linecount`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                let data = await response.json();
                this.createEntires(data);
            }
            else {
                throw new Error("Not Ok!");
            }
        } catch (error) {
            console.error(error);
        };
    }

    createEntires(poemsData) {
        if (poemsData.length)
        {
            poemsData.forEach(poemData => {
                this.createEntry(poemData);
            });
        } else {
            let logDataSection = document.getElementById('logData')
            logDataSection.innerText = "No Results..."
        }
    }

    createEntry(poemData) {
        let logDataSection = document.getElementById('logData')

        let poemDataContainer = logDataSection.appendChild(document.createElement('div'))

        let poemDetailsEl = poemDataContainer.appendChild(document.createElement('h3'))

        poemDetailsEl.innerText = `${poemData.title} by ${poemData.author} - ${poemData.linecount} lines`;

        let linesContainer = poemDataContainer.appendChild(document.createElement('div'))

        poemData.lines.forEach((line) => {
            let lineElement = linesContainer.appendChild(document.createElement('p'))
            lineElement.innerText = line;
        });
    }

    clearData() {
        let logDataSection = document.getElementById('logData')
        let child = logDataSection.lastElementChild;

        if (logDataSection.children.length > 0) {
            while (child) {
                logDataSection.removeChild(child);

                child = logDataSection.lastElementChild;
            }
        }
        logDataSection.innerText = '';
    }
}


let poetryGetter = new PoetryGetter;