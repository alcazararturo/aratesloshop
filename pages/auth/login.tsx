import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
    email   : string,
    password: string,
}

const LoginPage = () => {
    const router = useRouter();
    // const { loginUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});
    useEffect(() => {
        getProviders().then( prov => {
            setProviders(prov)
        })
    }, [])
    const onLoginUser = async( { email, password }: FormData ) => {
        setShowError(false);
        console.log(`email: ${email}`);
        await signIn( 'credentials', { email, password} );
        // const isValidLogin = await loginUser( email, password );
        // if ( !isValidLogin ) {
        //     setShowError(true);
        //     setTimeout(() => setShowError(false), 3000);
        //     return;
        // }
        //      // Todo: navegar a la pantalla que el usuario estaba
        // const destination = router.query.p?.toString() || '/';      
        // router.replace(destination);
    }
    return (
        <AuthLayout title={'Login'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20 px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Log in</Typography>
                            <Chip 
                                label='We do not recognize that username / password'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type='email'
                                label='email' 
                                variant='filled' 
                                fullWidth
                                { 
                                    ...register('email', {
                                        required: 'This field is required',
                                        validate: validations.isEmail
                                    })
                                }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='password' 
                                type='password' 
                                variant='filled' 
                                fullWidth 
                                { ...register('password', {
                                    required: 'This field is required',
                                    minLength: { value:6, message: 'Min 6 characters' }
                                }) 
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth>
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href= { router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register'}  passHref>
                                <Link underline='always'>You don&apos;t have an account?</Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', marginBottom: 2 }}/>
                            {
                                Object.values( providers ).map((provider:any) => {
                                    if ( provider.id === 'credentials') return ( <div key='credentials'></div>);
                                    return (
                                        <Button
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ marginBottom: 1 }}
                                            onClick={ () => signIn( provider.id ) }
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async({ req, query }) => {
    console.log('entrando al getServerSideProviders de login');
    const session = await getSession({ req });
    const { p = '/'} = query;
    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false,
            }
        }
    }
    return {
        props: { }
    }
}

export default LoginPage;