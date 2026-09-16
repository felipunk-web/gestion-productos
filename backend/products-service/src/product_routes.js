import express from "express";
import { getProductsRepo, getProductByIdRepo, createProductRepo, updatedProductRepo, deleteProductRepo } from './product_repository.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './product_service.js';
import {requireAuth} from "./remote_auth.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getProducts(getProductsRepo);

    if (result.ok === false) {
        return res.status(500).json({ error: result.error });
    } else {
        return res.json(result.data);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getProductById(id, getProductByIdRepo);

    if (result.ok === false) {
        if (result.type === 'not-found') {
            return res.status(404).json({ error: result.error });
        } else {
            return res.status(500).json({ error: result.error });
        }
    } else {
        return res.json(result.data);
    }
});

router.post('/', requireAuth, async (req, res) => {
    const result = await createProduct(req.body, createProductRepo);

    if (result.ok === false) {
        if (result.type === 'validation') {
            return res.status(400).json({ error: result.error });
        } else {
            return res.status(500).json({ error: result.error });
        }
    } else {
        return res.status(201).json(result.data);
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await updateProduct(id, req.body, updatedProductRepo);

    if (result.ok === false) {
        if (result.type === 'validation') {
            return res.status(400).json({ error: result.error });
        } else if (result.type === 'not-found') {
            return res.status(404).json({ error: result.error });
        } else {
            return res.status(500).json({ error: result.error });
        }
    } else {
        return res.json(result.data);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await deleteProduct(id, deleteProductRepo);

       if (result.ok === false) {
        if (result.type === 'not-found') {
            return res.status(404).json({ error: result.error });
        } else {
            return res.status(500).json({ error: result.error });
        }
    } else {
        return res.status(204).send();
    }
});

export default router;