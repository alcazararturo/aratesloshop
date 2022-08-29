import React, { PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';
import { SideMenu } from '../ui';
import { AdminNavbar } from '../admin';

interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: React.FC<PropsWithChildren<Props>> = ({title='Dashboard', subTitle, icon, children}) => {
    
  return (
    <>        
        <nav>
            <AdminNavbar />
        </nav>
        <SideMenu/>
        <main style={{ 
            margin: '80px auto', 
            maxWidth: '1440px', 
            padding: '0px 30px'}}>
            <Box display='flex' flexDirection='column'>
                <Typography variant='h1' component='h1'>
                    { icon }
                    {'  '} { title }
                </Typography>
                <Typography variant='h2' sx={{marginBottom: 1}} >{subTitle}</Typography>
            </Box>
            <Box className='fadeIn'>
                { children }
            </Box>            
        </main>
        
    </>
  )
}
