import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';
import { AuthLayout } from "../../components/layouts";
import { validations } from '../../utils';


type FormData = {
    name    : string;
    email   : string;
    password: string;
}


const RegisterPage = () => {
    const router = useRouter();
    const { registerUser } = useContext( AuthContext );
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const onRegisterForm = async( { name, email, password }: FormData ) => {
        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);
        if ( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        // router.replace('/');
        // const destination = router.query.p?.toString() || '/';      
        // router.replace(destination);
        await signIn('credentials', { email, password });

    }
    
  return (
    <AuthLayout title={'Register'}>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20 px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Register</Typography>
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
                            label='fullname'                            
                            variant='filled' 
                            fullWidth 
                            { ...register('name', {
                                required: 'This field is required',
                                minLength: { value: 3, message: 'Min 3 characters' }
                            }) 
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
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
                            fullWidth
                        >
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href= { router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login'}  passHref>
                            <Link underline='always'>You have an account?</Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
        

    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async({ req, query }) => {
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

export default RegisterPage;