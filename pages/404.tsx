import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";


const Custom404 = () => {
  return (
    <ShopLayout title='Page not found' pageDescription='No data to display'>
        <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
            <Typography variant='h1' component='h1' fontSize={60} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={2}>Products no found</Typography>
        </Box>

    </ShopLayout>
  )
}

export default Custom404;