import { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from './hooks/useProducts';
import { useCreateProduct } from './hooks/useCreateProduct';
import { useLogin } from './hooks/useLogin';
import './App.css'

const zodProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.coerce.number().positive("El precio debe ser un número positivo"),
  stock: z.coerce.number().min(0, "El stock debe ser un número no positivo")
});


function ProductList() {
  const { data, isLoading, isError, error } = useProducts();

  if (isLoading) return <p className="state-msg">Cargando inventario…</p>
  if (isError) return <p className="state-msg state-msg--error">{error.message}</p>
  if (!data || data.length === 0) return <p className="state-msg">Todavía no hay productos cargados.</p>

  return (
    <table className="ledger">
      <thead>
        <tr>
          <th className="ledger__col-name">Producto</th>
          <th className="ledger__col-num">Precio</th>
          <th className="ledger__col-num">Stock</th>
        </tr>
      </thead>
      <tbody>
        {data.map(product => (
          <tr key={product._id ?? product.id}>
            <td className="ledger__col-name">{product.name}</td>
            <td className="ledger__col-num">${Number(product.price).toFixed(2)}</td>
            <td className="ledger__col-num">
              <span className={product.stock === 0 ? "stock-tag stock-tag--empty" : "stock-tag"}>
                {product.stock}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function LoginForm({ onLoggedIn }) {
  const login = useLogin();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    login.mutate(data, {
      onSuccess: (result) => onLoggedIn(result.token),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel">
      <p className="panel__label">Acceso requerido para cargar stock</p>
      <div className="field field--row">
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input id="username" {...register("username")} placeholder="Nombre de usuario" />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" {...register("password")} placeholder="Contraseña" />
        </div>
      </div>
      <button type="submit" className="btn btn--primary" disabled={login.isPending}>
        {login.isPending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
      {login.isError && <p className="field-error">{login.error.message}</p>}
    </form>
  );
}

function ProductForm({ token }) {
  const createProduct = useCreateProduct(token);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(zodProductSchema)
  });

  const onSubmit = (data) => {
    createProduct.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel">
      <p className="panel__label">Nueva entrada de inventario</p>

      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" {...register("name")} placeholder="Nombre del producto" />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field field--row">
        <div className="field">
          <label htmlFor="price">Precio</label>
          <input id="price" type="number" step="0.01" {...register("price")} placeholder="0.00" />
          {errors.price && <p className="field-error">{errors.price.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input id="stock" type="number" {...register("stock")} placeholder="0" />
          {errors.stock && <p className="field-error">{errors.stock.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn btn--primary" disabled={createProduct.isPending}>
        {createProduct.isPending ? "Guardando…" : "Agregar al inventario"}
      </button>
      {createProduct.isError && <p className="field-error">{createProduct.error.message}</p>}
      {createProduct.isSuccess && <p className="field-success">Producto agregado.</p>}
    </form>
  );
}

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="page">
      <header className="page__header"> 
        <h1 className="page__tagline">Registro de Inventario</h1>
      </header>

      {!token ? (
        <LoginForm onLoggedIn={setToken} />
      ) : (
        <>
          <div className="session-bar">
            <span className="session-bar__status">
              <span className="dot" /> Sesión activa
            </span>
            <button onClick={() => setToken(null)} className="btn btn--ghost">
              Cerrar sesión
            </button>
          </div>
          <ProductForm token={token} />
        </>
      )}

      <section>
        <h2 className="section-title">Inventario</h2>
        <ProductList />
      </section>
    </div>
  )
}

export default App
