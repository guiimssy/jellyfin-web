import type { UserDto } from '@jellyfin/sdk/lib/generated-client/models/user-dto';
import React, { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import { appHost } from 'components/apphost';
import layoutManager from 'components/layoutManager';
import Loading from 'components/loading/LoadingComponent';
import Page from 'components/Page';
import UserAvatar from 'components/UserAvatar';
import { AppFeature } from 'constants/appFeature';
import LinkButton from 'elements/emby-button/LinkButton';
import { useApi } from 'hooks/useApi';
import { useQuickConnectEnabled } from 'hooks/useQuickConnect';
import { useUsers } from 'hooks/useUsers';
import globalize from 'lib/globalize';
import browser from 'scripts/browser';
import Dashboard from 'utils/dashboard';
import shell from 'scripts/shell';
import keyboardNavigation from 'scripts/keyboardNavigation';

interface SettingsTileProps {
    /** Extra class names; some are used by AppOverrides.scss to hide tiles in the modern layout */
    className?: string
    href?: string
    onClick?: () => void
    /** Material icon name */
    icon: string
    title: string
    description?: string
    isDanger?: boolean
}

const SettingsTile: FC<SettingsTileProps> = ({ className, href, onClick, icon, title, description, isDanger }) => (
    <LinkButton
        href={href}
        onClick={onClick}
        className={`gsSettings-tile ${isDanger ? 'gsSettings-tile-danger' : ''} ${className ?? ''}`}
    >
        <span className={`material-icons gsSettings-tileIcon ${icon}`} aria-hidden='true' />
        <span className='gsSettings-tileText'>
            <span className='gsSettings-tileTitle'>{title}</span>
            {description && <span className='gsSettings-tileDescription'>{description}</span>}
        </span>
        <span className='material-icons gsSettings-tileChevron chevron_right' aria-hidden='true' />
    </LinkButton>
);

const SettingsSection: FC<{ className?: string, title: string, children: ReactNode }> = ({ className, title, children }) => (
    <section className={`gsSettings-section ${className ?? ''}`}>
        <h2 className='gsSettings-sectionTitle'>{title}</h2>
        <div className='gsSettings-grid'>
            {children}
        </div>
    </section>
);

const UserSettingsPage: FC = () => {
    const { user: currentUser } = useApi();
    const [ searchParams ] = useSearchParams();
    const {
        data: isQuickConnectEnabled,
        isPending: isQuickConnectEnabledPending
    } = useQuickConnectEnabled();
    const { data: users } = useUsers();
    const [ user, setUser ] = useState<UserDto>();

    const userId = useMemo(() => (
        searchParams.get('userId') || currentUser?.Id
    ), [ currentUser, searchParams ]);
    const isLoggedInUser = useMemo(() => (
        userId && userId === currentUser?.Id
    ), [ currentUser, userId ]);

    useEffect(() => {
        if (userId) {
            if (userId === currentUser?.Id) setUser(currentUser);
            else setUser(users?.find(({ Id }) => userId === Id));
        }
    }, [ currentUser, userId, users ]);

    if (!userId || !user || isQuickConnectEnabledPending) {
        return (
            <Loading />
        );
    }

    // gamepad toggle unavailable on EdgeUWP, and smoothscroll unavailable on non-TV layout
    const isControlsPageEmpty = !keyboardNavigation.canEnableGamepad() && !layoutManager.tv;

    return (
        <Page
            id='myPreferencesMenuPage'
            className='libraryPage userPreferencesPage noSecondaryNavPage mainAnimatedPage'
            title={globalize.translate('Settings')}
            shouldAutoFocus
        >
            <div className='gsSettings padded-left padded-right padded-bottom-page padded-top'>
                <header className='gsSettings-header'>
                    <UserAvatar user={user} size={72} />
                    <div className='gsSettings-headerText'>
                        <h1 className='gsSettings-userName headerUsername'>{user.Name}</h1>
                        {user.Policy?.IsAdministrator && (
                            <span className='gsSettings-role'>{globalize.translate('LabelAdministrator')}</span>
                        )}
                    </div>
                </header>

                <SettingsSection title={globalize.translate('HeaderPreferences')}>
                    <SettingsTile
                        className='lnkUserProfile'
                        href={`#/userprofile?userId=${userId}`}
                        icon='person'
                        title={globalize.translate('Profile')}
                        description={globalize.translate('SettingsProfileHelp')}
                    />
                    {isQuickConnectEnabled && (
                        <SettingsTile
                            className='lnkQuickConnectPreferences'
                            href={`#/quickconnect?userId=${userId}`}
                            icon='phonelink_lock'
                            title={globalize.translate('QuickConnect')}
                            description={globalize.translate('SettingsQuickConnectHelp')}
                        />
                    )}
                    <SettingsTile
                        className='lnkDisplayPreferences'
                        href={`#/mypreferencesdisplay?userId=${userId}`}
                        icon='tv'
                        title={globalize.translate('Display')}
                        description={globalize.translate('SettingsDisplayHelp')}
                    />
                    <SettingsTile
                        className='lnkHomePreferences'
                        href={`#/mypreferenceshome?userId=${userId}`}
                        icon='home'
                        title={globalize.translate('Home')}
                        description={globalize.translate('SettingsHomeHelp')}
                    />
                    <SettingsTile
                        className='lnkPlaybackPreferences'
                        href={`#/mypreferencesplayback?userId=${userId}`}
                        icon='play_circle_filled'
                        title={globalize.translate('TitlePlayback')}
                        description={globalize.translate('SettingsPlaybackHelp')}
                    />
                    <SettingsTile
                        className='lnkSubtitlePreferences'
                        href={`#/mypreferencessubtitles?userId=${userId}`}
                        icon='closed_caption'
                        title={globalize.translate('Subtitles')}
                        description={globalize.translate('SettingsSubtitlesHelp')}
                    />
                    {appHost.supports(AppFeature.DownloadManagement) && (
                        <SettingsTile
                            className='downloadManager'
                            onClick={shell.openDownloadManager}
                            icon='download'
                            title={globalize.translate('DownloadManager')}
                        />
                    )}
                    {appHost.supports(AppFeature.ClientSettings) && (
                        <SettingsTile
                            className='clientSettings'
                            onClick={shell.openClientSettings}
                            icon='devices_other'
                            title={globalize.translate('ClientSettings')}
                        />
                    )}
                    {isLoggedInUser && !browser.mobile && !isControlsPageEmpty && (
                        <SettingsTile
                            className='lnkControlsPreferences'
                            href={`#/mypreferencescontrols?userId=${userId}`}
                            icon='keyboard'
                            title={globalize.translate('Controls')}
                            description={globalize.translate('SettingsControlsHelp')}
                        />
                    )}
                </SettingsSection>

                {isLoggedInUser && user.Policy?.IsAdministrator && !layoutManager.tv && (
                    <SettingsSection className='adminSection' title={globalize.translate('HeaderAdmin')}>
                        <SettingsTile
                            href='#/dashboard'
                            icon='dashboard'
                            title={globalize.translate('TabDashboard')}
                            description={globalize.translate('SettingsDashboardHelp')}
                        />
                        <SettingsTile
                            href='#/metadata'
                            icon='mode_edit'
                            title={globalize.translate('MetadataManager')}
                            description={globalize.translate('SettingsMetadataHelp')}
                        />
                    </SettingsSection>
                )}

                {isLoggedInUser && (
                    <SettingsSection className='userSection' title={globalize.translate('HeaderUser')}>
                        {appHost.supports(AppFeature.MultiServer) && (
                            <SettingsTile
                                className='selectServer'
                                onClick={Dashboard.selectServer}
                                icon='storage'
                                title={globalize.translate('SelectServer')}
                            />
                        )}
                        <SettingsTile
                            className='btnLogout'
                            onClick={Dashboard.logout}
                            icon='exit_to_app'
                            title={globalize.translate('ButtonSignOut')}
                            isDanger
                        />
                        {appHost.supports(AppFeature.ExitMenu) && (
                            <SettingsTile
                                className='exitApp'
                                onClick={appHost.exit}
                                icon='close'
                                title={globalize.translate('ButtonExitApp')}
                            />
                        )}
                    </SettingsSection>
                )}
            </div>
        </Page>
    );
};

export default UserSettingsPage;
