import { useContext, useState } from 'react'; 
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { CartContext, UiContext } from '../../context';


export const Navbar = () => {
    const { asPath, push } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext( CartContext );
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0 ) return;
        push(`/search/${ searchTerm }`);
    }
    
   return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
              <Link display='flex' alignItems='center'>
                <Typography variant='h6'>Teslo |</Typography>
                <Typography sx={{ marginLeft: 0.5 }} >Shop</Typography>
              </Link>              
            </NextLink> 
            <Box flex={ 1 }/>
            <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} >
                <NextLink href='/category/men' passHref>
                    <Link>
                        <Button color={ asPath === '/category/men' ? 'primary' : 'info'  } >Men</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/women' passHref>
                    <Link>
                        <Button color={ asPath === '/category/women' ? 'primary' : 'info'  }>Women</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/kid' passHref>
                    <Link>
                        <Button color={ asPath === '/category/kid' ? 'primary' : 'info'  }>Kids</Button>
                    </Link>
                </NextLink>
            </Box>                
            <Box flex={ 1 }/>
            {
                isSearchVisible
                ? (
                    <Input
                        className='fadeIn'
                        sx={{ display: { xs: 'none', sm:'flex' } }}
                        autoFocus
                        value={ searchTerm }
                        onChange={ (e) => setSearchTerm(e.target.value) }
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Search..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ () => setIsSearchVisible(false) }
                                >
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )
                :
                (
                    <IconButton className='fadeIn' sx={{ display: { xs: 'none', sm:'flex' } }} onClick={ () => setIsSearchVisible(true) }>
                        <SearchOutlined />
                    </IconButton>
                )
            }
            
            <IconButton
                sx={{display: { xs:'flex', sm:'none' }}}
                onClick={ toggleSideMenu }
            >
                <SearchOutlined />
            </IconButton>
            <NextLink href='/cart' passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems > 9 ? '+9': numberOfItems } color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>
            <Button onClick={toggleSideMenu}>
                Menu
            </Button>
        </Toolbar>

    </AppBar>
  )
}
