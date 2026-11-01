import { getDisplayVersion } from '@jellyfin/sdk/lib/utils/versioning';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import { useSystemInfo } from 'hooks/useSystemInfo';
import ListItemLink from 'components/ListItemLink';

const HEADING_FONT = '"Montserrat", "Inter", sans-serif';

const DrawerHeaderLink = () => {
    const { data: systemInfo } = useSystemInfo();

    return (
        <ListItemLink
            to='/'
            sx={{
                // Override the drawer item style: the logo sits flush at the top
                margin: '0 !important',
                padding: '20px 24px 16px !important',
                borderRadius: '0 !important',
                '&:hover': { backgroundColor: 'transparent !important' }
            }}
        >
            <ListItemIcon sx={{ minWidth: 52 }}>
                {/* GS monogram tile: the S passes in front of the G and cuts into it */}
                <Box
                    aria-hidden='true'
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        bgcolor: 'primary.main',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: HEADING_FONT,
                        fontWeight: 800,
                        fontSize: 19,
                        letterSpacing: '-0.02em'
                    }}
                >
                    G
                    <Box
                        component='span'
                        sx={{
                            marginLeft: '-0.1em',
                            WebkitTextStroke: '3px #e50914',
                            paintOrder: 'stroke fill'
                        }}
                    >
                        S
                    </Box>
                </Box>
            </ListItemIcon>
            <ListItemText
                primary={systemInfo?.ServerName || 'GStream'}
                secondary={getDisplayVersion(systemInfo?.Version)}
                slotProps={{
                    primary: {
                        sx: {
                            fontFamily: HEADING_FONT,
                            fontWeight: 800,
                            fontSize: '1.3rem',
                            letterSpacing: '-0.035em',
                            color: '#fff',
                            lineHeight: 1.1
                        }
                    },
                    secondary: {
                        sx: { fontSize: '0.75rem', color: '#71717a' }
                    }
                }}
            />
        </ListItemLink>);
};

export default DrawerHeaderLink;
