import React, { PropsWithChildren, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../apiAxios';


interface Props {
    order: IOrder;
}

export type OrderResponseBody = {
    id: string;
    status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'COMPLETED'
    | 'PAYER_ACTION_REQUIRED'
};

const OrderPage: React.FC<PropsWithChildren<Props>> = ({ order }) => {
    const currency = "USD";
    const style={
        color: 'blue',
        shape: 'pill',
        label: 'pay',
        tagline: false,
        layout: 'vertical',
      };
    const router = useRouter();
    const { shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);
    const onOrderCompleted = async( details: OrderResponseBody ) => {
        console.log('details-status: ' + details.status);
        if (details.status !== 'COMPLETED') { return alert('There is no payment in Paypal')}
        setIsPaying(true);
        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id,
            });
            router.reload();
        } catch (error) {
            setIsPaying(false);
            alert('Error')
        }
    }
    
  return (
    <ShopLayout title={'Order summary'} pageDescription={'Order Summary'}>
        <Typography variant='h1' component='h1' >Order: { order._id }</Typography>
        {
            order.isPaid
            ? (
                <Chip 
                    sx={{ marginY: 2 }} 
                    label='order paid'
                    variant='outlined'
                    color='success'
                    icon={ <CreditScoreOutlined />  }
                />
            )
            :
            (                
                <Chip 
                    sx={{ marginY: 2 }} 
                    label='Outstanding'
                    variant='outlined'
                    color='error'
                    icon={ <CreditCardOffOutlined />  }
                />
            )
        }
        
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7}>
                <CartList products={ order.orderItems }/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card' >
                    <CardContent>
                        <Typography variant='h2'>Sumary ({ order.numberOfItems} { order.numberOfItems > 1 ? 'items' : 'item' }  items)</Typography>
                        <Divider sx={{ marginY: 1}}/>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery address</Typography>                            
                        </Box>
                        <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                        <Typography>{shippingAddress.address} {shippingAddress.address2 ? `,${shippingAddress.address2}`: '' }</Typography>                    
                        <Typography>{shippingAddress.city} {shippingAddress.zip}</Typography>
                        <Typography>{shippingAddress.country}</Typography>
                        <Typography>{shippingAddress.phone}</Typography>
                        <Divider sx={{ marginY: 1}}/>            
                        <OrderSummary orderValues={{
                              numberOfItems: order.numberOfItems,
                              subTotal: order.subTotal,
                              total: order.total,
                              tax: order.tax
                          }} />
                        <Box sx={{ marginTop: 3}} display='flex' flexDirection='column'>
                            {/* TODO */}
                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none'}}
                                    >
                                    <CircularProgress />
                                </Box>
                                <Box sx={{ display:  isPaying ? 'none' : 'flex', flex: 1}} flexDirection='column'>
                                {
                                     order.isPaid
                                    ? (
                                        <Chip 
                                            sx={{ marginY: 2 }} 
                                            label='order paid'
                                            variant='outlined'
                                            color='success'
                                            icon={ <CreditScoreOutlined />  }
                                        />
                                    )
                                    : (                                  
                                         <PayPalButtons
                                            disabled={false}
                                            style={{"layout":"vertical"}}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${order.total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted( details );
                                                });
                                            }}
                                         />
                                    )
                                } 
                                </Box>                           
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async({req, query}) => {
    const { id = '' } = query;
    const session: any = await getSession({req});
    if (!session) { 
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }
    const order = await dbOrders.getOrderById(id.toString());
    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }
    if (order.user !== session.user._id){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }
    return {
        props: {
            order
        }
    }
}

export default OrderPage;