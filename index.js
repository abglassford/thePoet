class PoetryGetter {

    constructor() {
        console.log('Hello Poetry!');

        this.createListeners();
    }

    createListeners() {
        document.getElementById('submitButton').addEventListener('click', e => this.handleSubmitButtonClicked());
    }

    handleSubmitButtonClicked() {
        console.log('submitButtonClicked');
        this.getPoetry();
    }

    async getPoetry() {
        let predicateArg = document.getElementById("predicateSelect").value
        let searchTermArg = document.getElementById('searchTermInput').value;
        let logDataSection = document.getElementById('logData')

        let url = `${this.baseUrl}/${predicateArg}/${searchTermArg}/lines.json`;

        await fetch(url)
            .then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw new Error('Not OK!');
            })
            .then((data) => {
                console.log(data);
                logDataSection.innerHTML = JSON.stringify(data);
            })
            .catch((error) => {
                console.log('definitely an error\n', error);
            });
    }

    baseUrl = "https://poetrydb.org";
}

let poetryGetter = new PoetryGetter;