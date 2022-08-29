import React, { PropsWithChildren } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'; 
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName:'ID', width: 100 },
    { field: 'fullname', headerName:'Full Name', width: 300 },
    {   field: 'paid', 
        headerName: 'Paid', 
        description: 'Shows information if the order is paid',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                ? <Chip color='success' label='paid' variant='outlined'/>
                : <Chip color='error' label='no paid' variant='outlined'/>
            )
        }
    },
    {
        field: 'orderlink',
        headerName: 'order details',
        description: 'order details',
        width:200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return(
                <NextLink href={ `/orders/${params.row.orderId}` } passHref>
                    <Link underline='always'>Order</Link>
                </NextLink>
            )
        }
    }
];

interface Props {
    orders: IOrder[];
}

const HistoryPage: React.FC<PropsWithChildren<Props>> = ({ orders }) => {
    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${ order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }));
   // console.log('#### Rows ###')
   //  console.log({rows});
  return (
    <ShopLayout title={'Order history'} pageDescription={'Customer order history'}>
        <Typography variant='h1' component='h1'>Order history</Typography>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width:'100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize= { 10 }
                    rowsPerPageOptions={ [10] } />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async({req}) => {
    const session: any = await getSession({req});
   
    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    // console.log(session.user._id);
    const orders = await dbOrders.getOrderByUserId(session.user._id);

    return {
        props: {
            orders,
        }
    }
}

export default HistoryPage
