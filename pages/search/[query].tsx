import React, { PropsWithChildren } from 'react';
import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material'; 
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { IProduct } from '../../interfaces';
import { dbProducts } from '../../database';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: React.FC<PropsWithChildren<Props>> = ({ products, foundProducts, query }) => {
  
  return (
    <ShopLayout title={'Teslo Search'} pageDescription={'Search the best products'}>
      <Typography variant='h1' component='h1'>Search product</Typography>
      {
        foundProducts
        ? <Typography variant='h2' sx={{ marginBottom: 1 }} textTransform='capitalize'>Term: {query}</Typography> 
        : (
            <Box display='flex'>
                <Typography variant='h2' sx={{ marginBottom: 1 }}>No found product select</Typography>
                <Typography variant='h2' sx={{ marginLeft: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
            </Box>
        )
      }
      <ProductList products={ products }/>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async({params}) => {
    const { query = '' } = params as { query: string};
    if ( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts: boolean = products.length > 0; 

    if (!foundProducts) {
        // products = await dbProducts.getAllProducts();
        products = await dbProducts.getProductsByTerm('shirt');
    }

    return {
        props: {
            products,
            foundProducts,
            query,
        }
    }
}

export default SearchPage
