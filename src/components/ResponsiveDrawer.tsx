import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { type FC, type PropsWithChildren } from 'react';

import browser from 'scripts/browser';

export const DRAWER_WIDTH = 240;

/** GStream look of the drawer paper and its navigation items. */
const DRAWER_PAPER_SX = {
    backgroundColor: 'background.default',
    backgroundImage: 'none',
    borderRight: '1px solid #1f1f27',
    '& .MuiListItemButton-root': {
        margin: '2px 12px',
        padding: '10px 12px',
        borderRadius: '8px',
        color: '#d4d4d8',
        '&:hover': {
            backgroundColor: '#1f1f27'
        },
        '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: 'rgba(229, 9, 20, 0.14)',
            color: '#fff',
            '& .MuiListItemIcon-root': {
                color: 'primary.main'
            }
        }
    },
    '& .MuiListItemIcon-root': {
        color: '#a1a1aa'
    },
    '& .MuiListItemText-primary': {
        fontWeight: 500
    },
    '& .MuiListSubheader-root': {
        padding: '16px 24px 6px',
        lineHeight: 1.5,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#71717a'
    },
    '& .MuiDivider-root': {
        margin: '8px 24px',
        borderColor: '#1f1f27'
    }
};

export interface ResponsiveDrawerProps {
    open: boolean
    onClose: () => void
    onOpen: () => void
}

const ResponsiveDrawer: FC<PropsWithChildren<ResponsiveDrawerProps>> = ({
    children,
    open = false,
    onClose,
    onOpen
}) => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    return ( isMediumScreen ? (
        /* DESKTOP DRAWER */
        <Drawer
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    paddingBottom: '4.2rem', // Padding for now playing bar
                    boxSizing: 'border-box',
                    ...DRAWER_PAPER_SX
                }
            }}
            variant='permanent'
            anchor='left'
        >
            {children}
        </Drawer>
    ) : (
        /* MOBILE DRAWER */
        <SwipeableDrawer
            anchor='left'
            open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    paddingBottom: '4.2rem', // Padding for now playing bar
                    boxSizing: 'border-box',
                    ...DRAWER_PAPER_SX
                }
            }}
            onClose={onClose}
            onOpen={onOpen}
            // Disable swipe to open on iOS since it interferes with back navigation
            disableDiscovery={browser.iOS}
            ModalProps={{
                keepMounted: true // Better open performance on mobile.
            }}
        >
            <Box
                role='presentation'
                // Close the drawer when the content is clicked
                onClick={onClose}
                onKeyDown={onClose}
            >
                {children}
            </Box>
        </SwipeableDrawer>
    ));
};

export default ResponsiveDrawer;
