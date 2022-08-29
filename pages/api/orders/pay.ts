import { NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';

type Data = {
   message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return payOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}
const getPaypalBearerToken = async():Promise<{ hasError: boolean; message: string; }> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const base64Token   = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');
     try {
        const config = {
            method: 'post',
            url: process.env.PAYPAL_OAUTH_URL,
            headers: { 
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : body
            };
        // console.log({config});
        const { data } = await axios(config) ;
        console.log({data});
        return {
            hasError: false,
            message: data.access_token
        }   

     } catch (error) {
         if (axios.isAxiosError(error)) {
             return {
                 hasError: true,
                message: error.message!,
            }
        }else {
            return {
                hasError: true,
                message: 'An unexpected error occurred'
            } 
          }
    }

}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    // TODO: Validar session de cliente
    const paypalBearesToken = await getPaypalBearerToken();
    console.log('paypalBearesToken: ' + paypalBearesToken.message);
    if ( !paypalBearesToken ) { return res.status(400).json({ message: 'Paypal Token could not be confirmed' }) }
    const { transactionId = '', orderId = '' } = req.body;
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearesToken.message }`
        }
    }); 
    if ( data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'unrecognized order' });
    }
    await db.connect();
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {  
        await db.disconnect(); 
        return res.status(400).json({ message: 'unrecognized order in database' }); 
    }
    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect(); 
        return res.status(400).json({ message: 'Paypal and order amounts are not the same' }); 
    }
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();

    return res.status(200).json({ message: paypalBearesToken.message });
}
