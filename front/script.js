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

    const recommendationSection = document.getElementById('recommendations')


    console.log(userRequest)

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




