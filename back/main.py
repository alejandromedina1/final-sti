from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity

# Declare the APP server instance
app = Flask(__name__)
# Enable CORS policies
CORS(app)



@app.route('/user-data', methods=['POST'])
def create_data():
    # Get the data from the POST endpoint
    data = request.get_json()
    print(data)

    
    if not data:
        return (jsonify({'error': 'No data provided'}), 400)
    return (data)

# Traer los datos de la interfaz

# usuario_referencia = user_data.usuario_referencia
# k_vecinos = user_data.k_vecinos
# metodo_aggregation = user_data.metodo_aggregation
# N = user_data.N

# Leer la base de datos con pandas

def importar_base_datos(ruta_archivo):
    return pd.read_csv(ruta_archivo, index_col='Usuarios')

# Se carga la base de datos de los usuarios
df_usuarios = importar_base_datos('base_de_datos_usuarios.csv')
print(df_usuarios)

# Se guardan los usuarios en un arreglo para enviarlo al FRONT y que se pueda escoger al usuario con un dropdown
usuarios = df_usuarios.index.tolist()
print(usuarios)

# Calcular la similitud coseno entre el usuario de referencia y los vecinos más cercanos
def calcular_similitud_coseno(datos, usuario_referencia, k):
    usuario_referencia = datos.loc[usuario_referencia]
    datos = datos.drop(usuario_referencia.name)
    
    # Calcular la similitud coseno utilizando la función cosine_similarity de sklearn
    similitudes = cosine_similarity([usuario_referencia], datos)[0]
    
    # Obtener los k vecinos más cercanos
    indices_k_vecinos = np.argsort(similitudes)[-k:][::-1]
    similitudes_k_vecinos = similitudes[indices_k_vecinos]
    
    # Crear el diccionario con los nombres de los usuarios y las similitudes coseno
    resultados = {}
    for i in range(len(indices_k_vecinos)):
        resultados[datos.index[indices_k_vecinos[i]]] = similitudes_k_vecinos[i]
    
    return resultados

#usuario_referencia = "Juan José Rodriguez"  # Nombre del usuario de referencia
#k_vecinos = 2  # Número de vecinos a considerar

resultados_similitud = calcular_similitud_coseno(df_usuarios, usuario_referencia, k_vecinos)
print(resultados_similitud)

# Crear la protopersona basada en los vecinos más cercanos
def crear_protopersona(datos, vecinos):
    protopersona = datos.loc[vecinos].mean()
    return protopersona

# Utilizar los resultados de similitud para obtener los nombres de los vecinos más cercanos
vecinos_cercanos = list(resultados_similitud.keys())

# Crear la protopersona
protopersona = crear_protopersona(df_usuarios, vecinos_cercanos)
print(protopersona)

# Función para calcular el máximo
def calcular_maximo(datos, protopersona):
    promedios = datos.mean()
    categorias_maximo = promedios[promedios > protopersona].index.tolist()
    return categorias_maximo

# Función para calcular el mínimo
def calcular_minimo(datos, protopersona):
    valores_minimos = datos.min()
    categorias_minimo = valores_minimos[valores_minimos < protopersona].index.tolist()
    return categorias_minimo

# Función para calcular el promedio
def calcular_promedio(datos, protopersona):
    promedios = datos.mean()
    categorias_promedio = promedios[promedios > 3].index.tolist()
    return categorias_promedio

# Función para calcular la desviación estándar
def calcular_desviacion_estandar(datos, protopersona):
    desviaciones = datos.std()
    categorias_desviacion = desviaciones[desviaciones < 1.1].index.tolist()
    return categorias_desviacion

# Función principal para seleccionar el método de Aggregation y obtener las categorías que cumplen el requisito
def obtener_categorias(datos, protopersona, metodo):
    if metodo == 'maximo':
        categorias = calcular_maximo(datos, protopersona)
    elif metodo == 'minimo':
        categorias = calcular_minimo(datos, protopersona)
    elif metodo == 'promedio':
        categorias = calcular_promedio(datos, protopersona)
    elif metodo == 'desviacion':
        categorias = calcular_desviacion_estandar(datos, protopersona)
    else:
        raise ValueError("El método seleccionado no es válido.")
    
    categorias_dict = {categoria: protopersona[categoria] for categoria in categorias}
    return categorias_dict


#metodo_aggregation = 'maximo'  # Método de Aggregation a utilizar

categorias_cumplen_requisito = obtener_categorias(df_usuarios, protopersona, metodo_aggregation)
print(categorias_cumplen_requisito)

df_peliculas = pd.read_csv('combined_movies_2.csv')
print(df_peliculas)

# Crear una lista con los nombres de los géneros
generos = list(categorias_cumplen_requisito.keys())

# Crear una lista con las calificaciones
calificaciones = list(categorias_cumplen_requisito.values())

# Crear un dataframe de una línea y dos columnas
data = {
    "movie_name": ["Proto-pelicula"],
    "genre": [generos]
}

df = pd.DataFrame(data)

print(df)


# Crear una nueva base de datos con las columnas de nombres de películas y géneros
new_data = df_peliculas[['movie_name', 'genre']].copy()

# Separar los géneros para cada película
new_data['genre'] = new_data['genre'].str.split(', ')

# Mostrar la nueva base de datos
print(new_data)


# Unir los dos dataframes
merged_data = pd.concat([new_data, df], ignore_index=True)

print(merged_data)


proto_generos = merged_data.loc[merged_data["movie_name"] == "Proto-pelicula", "genre"].iloc[0]

# Realizar el reemplazo de los géneros en las listas de géneros de las películas
merged_data["genre"] = merged_data["genre"].apply(lambda x: [1 if g in proto_generos else 0 for g in x])

# Mostrar el dataframe actualizado
print(merged_data)


# Obtener la lista de géneros de la proto-pelicula
proto_generos = merged_data.loc[merged_data["movie_name"] == "Proto-pelicula", "genre"].iloc[0]

# Ajustar las dimensiones de las listas de géneros de las películas
merged_data["genre"] = merged_data["genre"].apply(lambda x: x[:len(proto_generos)] if len(x) > len(proto_generos) else x + [0.5] * (len(proto_generos) - len(x)))

# Mostrar el dataframe actualizado
print(merged_data)


# Obtener la lista de géneros de la proto-pelicula
proto_generos = merged_data.loc[merged_data["movie_name"] == "Proto-pelicula", "genre"].iloc[0]

# Calcular la similitud coseno entre las películas y la proto-pelicula
merged_data["Similitud"] = merged_data["genre"].apply(lambda x: cosine_similarity([proto_generos], [x])[0][0])

# Ordenar las películas por similitud en orden descendente y excluir la proto-pelicula
recomendaciones = merged_data[merged_data["movie_name"] != "Proto-pelicula"].sort_values(by="Similitud", ascending=False)

# Escoger el número N de películas recomendadas
#N = 5
recomendaciones = recomendaciones.head(N)

# Mostrar las películas recomendadas y su valor de similitud
print(recomendaciones[["movie_name", "Similitud"]])


# Execute the app instance
# The app will run locally in: http://localhost:5001/ after execution
if __name__ == "__main__":
  app.run(debug=True, port=5001)


