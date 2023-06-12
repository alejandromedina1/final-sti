const DOMAIN = 'http://localhost:';
const PORT = 5001;
// Resources
const RESOURCE = 'result';
const POST_ROUTE = 'user-data';

let result;

const recommendationBtn = document.getElementById('recommendation-btn')

recommendationBtn.addEventListener('click', async () => sendRequest())

//Value input number
function decreaseValue() {
    var value = parseInt(document.getElementById('neighbor-input').value);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById('neighbor-input').value = value < 0 ? 0 : value;
}

  function increaseValue() {
    var value = parseInt(document.getElementById('neighbor-input').value);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('neighbor-input').value = value;
}
  
function decreaseValue2() {
    var value = parseInt(document.getElementById('amount-input').value);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById('amount-input').value = value < 0 ? 0 : value;
}

  function increaseValue2() {
    var value = parseInt(document.getElementById('amount-input').value);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('amount-input').value = value;
}
  


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

    /*function obtainUsers() {
        const app = document.getElementById('recommendations');
        app.innerHTML = `
        <p>"${userRequest.usuario}"</p>  `
    }
    
    obtainUsers();*/

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
            const resultDataElement = document.getElementById('cards-neighbors');
            const resultDataElement2 = document.getElementById('cards-movies');
            let resultHTML = '';
            let resultHTML2 = '';

            for (let i = 0; i < response.resultados.length; i++) {
                var numeroDecimal = response.resultados[i][1];
                var decimales = 3;
            
                function decimalAPorcentaje(numeroDecimal, decimales) {
                    const factor = Math.pow(10, decimales);
                    const numeroAcortado = Math.round(numeroDecimal * factor) / factor;
                    
                    const porcentaje = numeroAcortado * 100;
                    
                    return porcentaje;
                }

                var porcentaje = decimalAPorcentaje(numeroDecimal, decimales);
            
                //resultHTML += `<p>${response.resultados[i][0]}</p>`;
                //resultHTML += `<p>${porcentaje}%</p>`;
                
                resultHTML2 += `
                <div class="neighbors-movie">
                    <div class="info-movie">
                        <img src="/front/img/star.png" alt="">
                        <p>${response.resultados[i][0]}</p>
                    </div>

                    <div class="info-percent">
                        <h6>${porcentaje}%</h6>
                        <p>Recommended</p>
                    </div>
                </div>`;
                //resultHTML += `<p>${response.vecinos[i]}</p>`;
                  
            }
            for (let i = 0; i < response.vecinos.length; i++) {
                var numeroDecimal = response.vecinos[i][1];
                var decimales = 3;
            
                function decimalAPorcentaje(numeroDecimal, decimales) {
                    const factor = Math.pow(10, decimales);
                    const numeroAcortado = Math.round(numeroDecimal * factor) / factor;
                    
                    const porcentaje = numeroAcortado * 100;
                    
                    return porcentaje;
                }

                var porcentaje = decimalAPorcentaje(numeroDecimal, decimales);
            
                //resultHTML += `<p>${response.resultados[i][0]}</p>`;
                //resultHTML += `<p>${porcentaje}%</p>`;
                resultHTML += `
                                    <div class="neighbors-info">
                                        <img src="/front/img/profile.png" alt="">
                                        <p>${response.vecinos[i]}</p>
                                    </div>`;
                //resultHTML += `<p>${response.vecinos[i]}</p>`;
                  
            }



            console.log(response.resultados);

            resultDataElement.innerHTML = resultHTML;
            resultDataElement2.innerHTML = resultHTML2;
        }

        obtainMovies();
        
    } catch (error) {
        console.log(error)
    }

}

function backPage() {
    location.reload(); 
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
