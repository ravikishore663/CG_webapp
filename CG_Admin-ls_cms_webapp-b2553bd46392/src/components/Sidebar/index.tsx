import React, { FC } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import AppBar from '../AppBar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

/** ICON */
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import People from '@mui/icons-material/People';

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const drawerProperties = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
}

interface Props {
    // any props that come into the component
}

const MiniDrawer: FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const [open] = React.useState(true);
    const [selectedMenu, setMenu] = React.useState<string>("dashboard")

    const applicationName = 'Creative Galileo - CMS'
    const menu = [
        {
            name: 'Dashboard',
            icon: <DashboardIcon />,
            href: '/',
            key: 'dashboard'
        },
        {
            name: 'Game',
            icon: <VideogameAssetIcon />,
            href: '/games',
            key: 'games'

        },
        {
            name: 'Videos',
            icon: <OndemandVideoIcon />,
            href: '/videos',
            key: 'videos'
        },
        {
            name: 'Library Zone',
            icon: <LibraryBooksIcon />,
            href: '/libraries',
            key: 'libraries'
        },
        {
            name: 'Theme',
            icon: <ColorLensIcon />,
            href: '/themes',
            key: 'themes'
        },
        {
            name: 'Partner',
            icon: <People />,
            href: '/partner',
            key: 'partner'
        }
    ]

    const handleListItemClick = (event: any, item: any) => {
        setMenu(item.key);
        navigate(item.href);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {applicationName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer sx={drawerProperties}
                variant="permanent"
                anchor="left">
                <DrawerHeader />
                <Divider />
                <List>
                    {menu.map((item, index) => (
                        <ListItemButton
                            key={item.name}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            // onClick={() => navigate(item)}
                            selected={item.key === selectedMenu}
                            onClick={(event) => handleListItemClick(event, item)} // ini gabisa pake 'item'dah ada diatas 
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <main>{children}</main>
            </Box>
        </Box>
    );
}

export default MiniDrawer