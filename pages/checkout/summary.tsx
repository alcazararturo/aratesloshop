import {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";import Cookies from 'js-cookie';
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from '../../context';
import { seedCountries } from '../../utils';
import Cookie from 'js-cookie';

const SummaryPage = () => {
    const router = useRouter();
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
    useEffect(() => {
        if (!Cookie.get('firstName')){
            router.push('/checkout/address');
        }
    }, [router])
    const onCreateOrder = async() => {
        setIsPosting(true);
        const { hasError, message } = await createOrder();
        if (hasError) { setIsPosting(false); setErrorMessage(message); return; }
        router.replace(`/orders/${message}`);
    }
    if (!shippingAddress) { return (<></>); }

    const { firstName, lastName, address, address2 = '', zip, city, country, phone } = shippingAddress;

  return (
    <ShopLayout title={'Purchase summary'} pageDescription={'Order Summary'}>
        <Typography variant='h1' component='h1' >Order Summary</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card' >
                    <CardContent>
                        <Typography variant='h2'>Sumary ( {numberOfItems} { numberOfItems === 1 ? 'item' : 'items' })</Typography>
                        <Divider sx={{ marginY: 1}}/>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery address</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>Edit</Link>
                            </NextLink>
                        </Box>
                        <Typography>{firstName} { lastName }</Typography>
                        <Typography>{address}{address2 ? `, ${address2}` : ''}</Typography>
                        <Typography>{city}, {zip}</Typography>
                        <Typography>{ seedCountries.initialData.countries.find(c => c.code === country)?.name}</Typography>
                        <Typography>{ phone }</Typography>
                        <Divider sx={{ marginY: 1}}/>
                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>Edit</Link>
                            </NextLink>
                        </Box>
                        <OrderSummary />
                        <Box sx={{ marginTop: 3}} flexDirection='column' display='flex'>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth
                                onClick={ onCreateOrder }
                                disabled={ isPosting }
                            >
                                Checkout
                            </Button>
                            <Chip 
                                color='error'
                                label={ errorMessage }
                                sx={{ display: errorMessage ? 'flex' : 'none', marginTop: 2 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


export default SummaryPage;