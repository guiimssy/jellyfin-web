import AccountCircle from '@mui/icons-material/AccountCircle';
import AppSettingsAlt from '@mui/icons-material/AppSettingsAlt';
import Close from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Download from '@mui/icons-material/Download';
import Edit from '@mui/icons-material/Edit';
import Logout from '@mui/icons-material/Logout';
import PhonelinkLock from '@mui/icons-material/PhonelinkLock';
import Settings from '@mui/icons-material/Settings';
import Storage from '@mui/icons-material/Storage';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { FC, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { appHost } from 'components/apphost';
import UserAvatar from 'components/UserAvatar';
import { AppFeature } from 'constants/appFeature';
import { useApi } from 'hooks/useApi';
import { useQuickConnectEnabled } from 'hooks/useQuickConnect';
import globalize from 'lib/globalize';
import shell from 'scripts/shell';
import Dashboard from 'utils/dashboard';

export const ID = 'app-user-menu';

/** GStream look of the menu paper and its items (matches the side drawer). */
const MENU_PAPER_SX = {
    marginTop: 1,
    minWidth: 248,
    backgroundColor: 'background.paper',
    backgroundImage: 'none',
    border: '1px solid var(--gs-surface, #1f1f27)',
    borderRadius: '12px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
    '& .MuiList-root': {
        padding: '6px'
    },
    '& .MuiMenuItem-root': {
        borderRadius: 'var(--jf-control-borderRadius, 8px)',
        padding: '9px 12px',
        color: '#d4d4d8',
        '&:hover, &.Mui-focusVisible': {
            backgroundColor: 'var(--gs-surface, #1f1f27)',
            color: '#fff'
        }
    },
    '& .MuiListItemIcon-root': {
        color: 'var(--gs-text-muted, #a1a1aa)'
    },
    '& .MuiListItemText-primary': {
        fontWeight: 500
    },
    '& .MuiDivider-root': {
        margin: '6px 8px',
        borderColor: 'var(--gs-surface, #1f1f27)'
    }
};

interface AppUserMenuProps extends MenuProps {
    onMenuClose: () => void
}

const AppUserMenu: FC<AppUserMenuProps> = ({
    anchorEl,
    open,
    onMenuClose
}) => {
    const { user } = useApi();
    const { data: isQuickConnectEnabled } = useQuickConnectEnabled();

    const onDownloadManagerClick = useCallback(() => {
        shell.openDownloadManager();
        onMenuClose();
    }, [ onMenuClose ]);

    const onClientSettingsClick = useCallback(() => {
        shell.openClientSettings();
        onMenuClose();
    }, [ onMenuClose ]);

    const onExitAppClick = useCallback(() => {
        appHost.exit();
        onMenuClose();
    }, [ onMenuClose ]);

    const onLogoutClick = useCallback(() => {
        Dashboard.logout();
        onMenuClose();
    }, [ onMenuClose ]);

    const onSelectServerClick = useCallback(() => {
        Dashboard.selectServer();
        onMenuClose();
    }, [ onMenuClose ]);

    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            id={ID}
            keepMounted
            open={open}
            onClose={onMenuClose}
            slotProps={{ paper: { sx: MENU_PAPER_SX } }}
        >
            {/* Header card: who is signed in (ListSubheader is skipped by keyboard navigation) */}
            <ListSubheader
                component='div'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    padding: '10px 12px 12px',
                    backgroundColor: 'transparent',
                    lineHeight: 1.3
                }}
            >
                <UserAvatar user={user} size={40} />
                <Box sx={{ minWidth: 0 }}>
                    <Box
                        sx={{
                            fontFamily: 'var(--gs-heading-font)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: '#fff',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {user?.Name}
                    </Box>
                    {user?.Policy?.IsAdministrator && (
                        <Box sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main' }}>
                            {globalize.translate('LabelAdministrator')}
                        </Box>
                    )}
                </Box>
            </ListSubheader>
            <Divider />
            <MenuItem
                component={Link}
                to={`/userprofile?userId=${user?.Id}`}
                onClick={onMenuClose}
            >
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                <ListItemText>
                    {globalize.translate('Profile')}
                </ListItemText>
            </MenuItem>
            <MenuItem
                component={Link}
                to='/mypreferencesmenu'
                onClick={onMenuClose}
            >
                <ListItemIcon>
                    <Settings />
                </ListItemIcon>
                <ListItemText>
                    {globalize.translate('Settings')}
                </ListItemText>
            </MenuItem>

            {(appHost.supports(AppFeature.DownloadManagement) || appHost.supports(AppFeature.ClientSettings)) && (
                <Divider />
            )}

            {appHost.supports(AppFeature.DownloadManagement) && (
                <MenuItem
                    onClick={onDownloadManagerClick}
                >
                    <ListItemIcon>
                        <Download />
                    </ListItemIcon>
                    <ListItemText>
                        {globalize.translate('DownloadManager')}
                    </ListItemText>
                </MenuItem>
            )}

            {appHost.supports(AppFeature.ClientSettings) && (
                <MenuItem
                    onClick={onClientSettingsClick}
                >
                    <ListItemIcon>
                        <AppSettingsAlt />
                    </ListItemIcon>
                    <ListItemText>
                        {globalize.translate('ClientSettings')}
                    </ListItemText>
                </MenuItem>
            )}

            {/* ADMIN LINKS */}
            {user?.Policy?.IsAdministrator && ([
                <Divider key='admin-links-divider' />,
                <MenuItem
                    key='admin-dashboard-link'
                    component={Link}
                    to='/dashboard'
                    onClick={onMenuClose}
                >

                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={globalize.translate('TabDashboard')} />
                </MenuItem>,
                <MenuItem
                    key='admin-metadata-link'
                    component={Link}
                    to='/metadata'
                    onClick={onMenuClose}
                >
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    <ListItemText primary={globalize.translate('MetadataManager')} />
                </MenuItem>
            ])}

            <Divider />
            {isQuickConnectEnabled && (
                <MenuItem
                    component={Link}
                    to='/quickconnect'
                    onClick={onMenuClose}
                >
                    <ListItemIcon>
                        <PhonelinkLock />
                    </ListItemIcon>
                    <ListItemText>
                        {globalize.translate('QuickConnect')}
                    </ListItemText>
                </MenuItem>
            )}

            {appHost.supports(AppFeature.MultiServer) && (
                <MenuItem
                    onClick={onSelectServerClick}
                >
                    <ListItemIcon>
                        <Storage />
                    </ListItemIcon>
                    <ListItemText>
                        {globalize.translate('SelectServer')}
                    </ListItemText>
                </MenuItem>
            )}

            <MenuItem
                onClick={onLogoutClick}
                sx={{
                    '&&': { color: 'primary.main' },
                    '&& .MuiListItemIcon-root': { color: 'primary.main' }
                }}
            >
                <ListItemIcon>
                    <Logout />
                </ListItemIcon>
                <ListItemText>
                    {globalize.translate('ButtonSignOut')}
                </ListItemText>
            </MenuItem>

            {appHost.supports(AppFeature.ExitMenu) && ([
                <Divider key='exit-menu-divider' />,
                <MenuItem
                    key='exit-menu-button'
                    onClick={onExitAppClick}
                >
                    <ListItemIcon>
                        <Close />
                    </ListItemIcon>
                    <ListItemText>
                        {globalize.translate('ButtonExitApp')}
                    </ListItemText>
                </MenuItem>
            ])}
        </Menu>
    );
};

export default AppUserMenu;
