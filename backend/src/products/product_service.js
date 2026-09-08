import * as z from 'zod';

const zodProductSchema = z.object({
    name: z.string().min(2),
    price: z.number().positive(),
    stock: z.number().gte(0)
});

export async function getProducts(getAllFn) {
    try {
        const products = await getAllFn();
        return { ok: true, data: products };
    } catch (error) {
        return { ok: false, type: 'internal-error', error: error.message };
    }
};

export async function getProductById(id, getByIdFn) {
    try {
        const product = await getByIdFn(id);
        if (!product) {
            return { ok: false, type: 'not-found', error: 'Producto no encontrado' }
        } else {
            return { ok: true, data: product }
        }
    } catch (error) {
        return { ok: false, type: 'internal-error', error: error.message };
    }
};

export async function createProduct(data, createProductFn) {
    const result = zodProductSchema.safeParse(data);

    if (!result.success) {
        return { ok: false, type: 'validation', error: result.error.flatten() }
    };

    try {
        const createdProduct = await createProductFn(result.data);
        return { ok: true, data: createdProduct };
    } catch (error) {
        return { ok: false, type: 'internal-error', error: error.message };
    }
};

export async function updateProduct(id, data, updateProductFn) {
    const result = zodProductSchema.safeParse(data);

    if (!result.success) {
        return { ok: false, type: 'validation', error: result.error.flatten() }
    };

    try {
        const updatedProduct = await updateProductFn(id, result.data);

        if (!updatedProduct) {
            return { ok: false, type: 'not-found', error: 'Producto no encontrado' }
        } else {
            return { ok: true, data: updatedProduct }
        }
    } catch (error) {
        return { ok: false, type: 'internal-error', error: error.message };
    }
};

export async function deleteProduct(id, deleteProductFn) {
    try {
        const deletedProduct = await deleteProductFn(id);
        if (!deletedProduct) {
            return { ok: false, type: 'not-found', error: 'Producto no encontrado' }
        } else {
            return { ok: true, data: deletedProduct }
        }
    } catch (error) {
        return { ok: false, type: 'internal-error', error: error.message };
    }
};

