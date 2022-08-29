// import React, { PropsWithChildren, useContext, useState } from 'react';
import { useState, useContext } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths }  from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { CartContext } from '../../context/cart/';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { dbProducts } from '../../database';
import { IProduct, ICartProduct, ISize } from '../../interfaces';

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({product}) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  const selectedSize = (size: ISize) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }));
  }
  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }));
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    // TODO: llamar la accion del context para agregar al carrito
    addProductToCart( tempCartProduct );
    router.push('/cart');
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={ product.images } />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* title */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>
            {/* amount */}
            <Box sx={{ marginY: 2 }}>
              <Typography variant='subtitle2'>Amount</Typography>
              <ItemCounter 
                currentValue={ tempCartProduct.quantity }
                updateQuantity={ onUpdateQuantity }
                maxValue={ product.inStock > 10 ? 10 : product.inStock }
                />
              <SizeSelector 
                selectedSize={tempCartProduct.size} 
                sizes={product.sizes}  
                onSelectedSize={ (size) => selectedSize(size)}
              />
            </Box>
            {/* Add to Cart*/}
            {
              (product.inStock > 0)
              ? (
                <Button color="secondary" className='circular-btn' onClick={ onAddProduct }>
                  {
                    tempCartProduct.size
                    ? 'Add to Cart'
                    : 'Select a size'
                  }                  
                </Button>
               )
              : (
                <Chip label='not available' color='error' variant='outlined' />
              )
            }
            {/* Description */}
            <Box sx={{ marginTop:3 }}>
              <Typography variant='subtitle2'>Description</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}


export const getStaticPaths: GetStaticPaths = async(ctx) => {
  const slugs = await dbProducts.getAllProductSlug();
  
    return {
      paths: slugs.map( ({ slug }) => ({
        params: { slug }
      })),
      // fallback: false
      fallback: 'blocking'
    } 
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);
  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      product
    },
    revalidate: 86400, //60*60*24 
  }
}

// export const getServerSideProps: GetServerSideProps = async({ params }) => {
//   const { slug } = params as { slug: string }
//   const product = await dbProducts.getProductBySlug(slug);
//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }
//   return {
//     props: {
//       product
//     }
//   }
  
// }

export default ProductPage;
