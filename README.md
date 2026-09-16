# Proyecto FullStack de Gestión de Productos  

## Reorganización
### Backend:  
- Se separó el codigo en 3 capas (rutas, casos de uso, repositorio), agrupadas por dominio (/products, /auth) en vez de por tipo de archivo.  
- Todo eso se hizo para que la lógica de negocio (validaciones, reglas) no dependa directamente de Express ni de Mongoose, permitiendo poder testear o cambiar de base de datos sin tocar esa logica.  
### Frontend:  
- Se separaron los hooks y el esquema de Zod del componente principal, que solo debería encargarse de la UI.

## Cómo levantar el proyecto  

### Backend (microservicios)  
- Requisito: Docker Desktop corriendo.  
- Comando: `docker compose up` desde la raíz del repo.  
- Levanta 4 contenedores: products-service (puerto 3000), auth-service (puerto 3001), y sus respectivas bases de datos.  
- Para detener: Ctrl+C, o `docker compose down`  

### Frontend  
- `cd frontend`  
- `npm install`  
- `npm run dev`  
- Corre en http://localhost:5173

## Arquitectura de microservicios  
- Se separó el backend en 2 servicios independientes: products-service y auth-service.  
- Cada uno tiene su propia base de datos.  
- Comunicación entre servicios: antes de crear un producto (POST /products), products-service le pregunta a auth-service (vía REST, endpoint /verify) si el token recibido es válido. Solo si la respuesta es afirmativa, continúa con la creación.