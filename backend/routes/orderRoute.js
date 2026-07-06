import express from 'express';
import {
    placeOrder,
    placeOrderCod,
    listOrders,
    userOrders,
    updateStatus,
    verifyOrder
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/placecod', authMiddleware, placeOrderCod);
orderRouter.get('/list', listOrders);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.post('/status', updateStatus);
orderRouter.post('/verify', verifyOrder);

export default orderRouter;
