import type { NextPage } from 'next';
import { Typography } from '@mui/material'; 
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';


const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=women');
  return (
    <ShopLayout title={'Teslo Shop Women'} pageDescription={'Only the best products for women'}>
      <Typography variant='h1' component='h1'>Women</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>All the products for women</Typography>
      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products }/>
      }
    </ShopLayout>
  )
}

export default WomenPage
