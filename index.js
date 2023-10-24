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
        this.getAuthor();
    }

    async getAuthor() {
        await fetch('https://poetrydb.org/title/Ozymandias/line.json')
            .then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw new Error('Not OK!');
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log('definitely an error\n', error);
            });
    }



    #baseUrl = "https://poetrydb.org/";
}

let poetryGetter = new PoetryGetter;