import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context'; 


const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && cart.length === 0 ){
        router.replace('/cart/empty');
    }
  }, [isLoaded, cart, router]);
  if (!isLoaded || cart.length === 0) { return ( <></> ); }
  return (
    <ShopLayout title={'Cart - 3'} pageDescription={'store shopping cart'}>
        <Typography variant='h1' component='h1' >Cart</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card' >
                    <CardContent>
                        <Typography variant='h2'>Order</Typography>
                        <Divider sx={{ marginY: 1}}/>
                        <OrderSummary />
                        <Box sx={{ marginTop: 3}}>
                            <Button 
                                href='/checkout/address' 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth>
                                Checkout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default CartPage;