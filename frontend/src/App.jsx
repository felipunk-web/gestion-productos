import { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from './hooks/useProducts';
import { useCreateProduct } from './hooks/useCreateProduct';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const zodProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.coerce.number().positive("El precio debe ser un número positivo"),
  stock: z.coerce.number().min(1, "El stock debe ser un número no positivo")
});

function ProductList() {
  const { data, isLoading, isError } = useProducts();
  if (isLoading) return <p>Cargando productos...</p>
  if (isError) return <p>Error cargando productos: {error.message}</p>
  if (!data || data.length === 0) return <p>No hay productos disponibles</p>
  return (
    <ul>
      {data.map(product => (
        <li key={product._id ?? product.id}>
          {product.name} - ${product.price} - Stock: {product.stock}
        </li>
      ))}
    </ul>
  )
}

function ProductForm() {
  const createProduct = useCreateProduct();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(zodProductSchema)
  });
  const { mutate, isLoading, isError, error } = useCreateProduct();
  const onSubmit = (data) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        reset();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "1.5rem" }}>
      <div>
        <label htmlFor="name">Nombre:</label>
        <input id="name" {...register("name")} placeholder="Nombre del producto" />
        {errors.name && <p style={{ color: "crimson" }}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="price">Precio:</label>
        <input id="price" type="number" step="0.01" {...register("price")} placeholder="Precio del producto" />
        {errors.price && <p style={{ color: "crimson" }}>{errors.price.message}</p>}
      </div>
      <div>
        <label htmlFor="stock">Stock:</label>
        <input id="stock" type="number" {...register("stock")} placeholder="Stock del producto" />
        {errors.stock && <p style={{ color: "crimson" }}>{errors.stock.message}</p>}
      </div>
      <button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? "Creando..." : "Crear Producto"}
      </button>
      {createProduct.isError && <p style={{ color: "red" }}>{createProduct.error.message}</p>}
      {createProduct.isSuccess && <p style={{ color: "green" }}>Producto creado exitosamente</p>}
    </form>
  );
}


function App() {

  return (
    <div style={{ maxWidth: "1000px", margin: "2 rem auto", padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestión de Productos</h1>
      <ProductForm />
      <hr />
      <h2>Lista de Productos</h2>
      <ProductList />
    </div>
  )
}

export default App
