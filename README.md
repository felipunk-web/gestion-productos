# API REST de Productos
En la terminal ejecuta `npm install` para descargar todas las dependencias.  
Crea un archivo .env con la variable `DB_URL` para conectarte a MongoDB.  
Por último, ejecuta `npm start` para levantar el servidor (que corre en `http://localhost:3000`)

# Reorganización
## Backend:  
- Se separó el codigo en 3 capas (rutas, casos de uso, repositorio), agrupadas por dominio (/products, /auth) en vez de por tipo de archivo.  
- Todo eso se hizo para que la lógica de negocio (validaciones, reglas) no dependa directamente de Express ni de Mongoose, permitiendo poder testear o cambiar de base de datos sin tocar esa logica.  
## Frontend:  
- Se separaron los hooks y el esquema de Zod del componente principal, que solo debería encargarse de la UI. 
