const DOMAIN = 'http://localhost:';
const PORT = 5001;
// Resources
const RESOURCE = 'result';
const POST_ROUTE = 'user-data';

let result;

const recommendationBtn = document.getElementById('recommendation-btn')

recommendationBtn.addEventListener('click', async () => sendRequest())

const sendRequest = async () => {
    const name = document.getElementById('name-input').value
    const numberOfNeighbors = parseInt(document.getElementById('neighbor-input').value)
    const numberOfMovies = parseInt(document.getElementById('amount-input').value)
    const aggregationMethod = document.getElementById('aggregation-dropdown').value

    const userRequest = {
        usuario: name,
        vecinos: numberOfNeighbors,
        aggregation: aggregationMethod,
        N: numberOfMovies
    }
    await postEndpoint(userRequest)

    console.log(userRequest)

    function obtainUsers() {
        const app = document.getElementById('recommendations');
        app.innerHTML = `
        <p>"${userRequest.usuario}"</p>  `
    }
    
    obtainUsers();

    function changeScreen() {
        var screen1 = document.querySelector('.data-filter');
        var screen2 = document.querySelector('.data-container');
        var body = document.body;

        if (screen1.style.display === "none") {
            screen1.style.display = "block";
            screen2.style.display = "none";
            body.style.backgroundImage = ""; 
            
          } else {
            screen1.style.display = "none";
            screen2.style.display = "block";
            body.style.backgroundImage = "none"; 
          }
       
    };

    changeScreen();
}


const postEndpoint = async (request) => {
    try {
        const raw = await fetch(`${DOMAIN}${PORT}/${POST_ROUTE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
        const response = await raw.json()
        console.log(response)
        result = response

        function obtainMovies() {
            const app1 = document.getElementById('neighborhood');
            app1.innerHTML = `
            <p>"${response.resultados[0][0]}"</p>
              `

            const resultDataElement = document.getElementById('result-data');
            let resultHTML = '';

            for (let i = 0; i < response.resultados.length; i++) {
                resultHTML += `<p>${response.resultados[i][0]}</p>`;
                resultHTML += `<p>${response.resultados[i][1]}</p>`;
                resultHTML += `<p>${response.vecinos[i]}</p>`;
                
            }

            console.log(response.resultados);

            resultDataElement.innerHTML = resultHTML;
        }
        
        obtainMovies();
        
    } catch (error) {
        console.log(error)
    }

}


const getResult = async () => {
    try {
        const raw = await fetch(`${DOMAIN}${PORT}/${RESOURCE}`);
        const response = await raw.json();
        result = response
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
