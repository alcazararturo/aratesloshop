import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { IOrder } from '../interfaces';
import { Order } from '../models'; 

export const getOrderById = async(id: string): Promise<IOrder | null> => {
    // console.log('getOrderById: ' + id);
    if (!isValidObjectId(id)) { return null; }
    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();
    // console.log({order});
    if (!order) { return null; }
    return JSON.parse(JSON.stringify(order));
}

export const getOrderByUserId = async(id: string): Promise<IOrder[]> => {
    // console.log('getOrderByUserId:', id);
    if (!isValidObjectId(id)) { return []; }
    await db.connect();
    const orders = await Order.find({ user: id}).lean();
    await db.disconnect();
    // console.log({orders});
    return JSON.parse(JSON.stringify(orders));
}