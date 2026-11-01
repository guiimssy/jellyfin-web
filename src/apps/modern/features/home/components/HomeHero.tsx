import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import React, { type FC, useCallback, useMemo } from 'react';

import { playbackManager } from 'components/playback/playbackmanager';
import { appRouter } from 'components/router/appRouter';
import { useGetItems } from 'hooks/useFetchItems';
import globalize from 'lib/globalize';
import { ServerConnections } from 'lib/jellyfin-apiclient';
import type { ItemDto } from 'types/base/models/item-dto';
import dom from 'utils/dom';

const TICKS_PER_MINUTE = 600000000;

const getImageUrl = (item: ItemDto, type: ImageType, maxWidth: number) => {
    const tag = type === ImageType.Backdrop ? item.BackdropImageTags?.[0] : item.ImageTags?.[type];
    if (!tag || !item.Id || !item.ServerId) return undefined;

    return ServerConnections.getApiClient(item.ServerId)?.getScaledImageUrl(item.Id, { type, tag, maxWidth });
};

const formatRuntime = (ticks: number | null | undefined) => {
    if (!ticks) return undefined;
    const minutes = Math.round(ticks / TICKS_PER_MINUTE);
    const hours = Math.floor(minutes / 60);
    return hours ? `${hours} h ${String(minutes % 60).padStart(2, '0')}` : `${minutes} min`;
};

/** The large "Featured" banner shown at the top of the home page. */
const HomeHero: FC = () => {
    // isLoading (not isPending) so a disabled query never leaves the placeholder stuck
    const { data, isLoading } = useGetItems({
        includeItemTypes: [BaseItemKind.Movie, BaseItemKind.Series],
        recursive: true,
        sortBy: [ItemSortBy.Random],
        imageTypes: [ImageType.Backdrop],
        fields: [ItemFields.Overview, ItemFields.Genres],
        enableImageTypes: [ImageType.Backdrop, ImageType.Logo],
        limit: 1
    });
    const item = data?.Items?.[0];

    // Request the backdrop at the screen size (a standard width, so it stays cacheable)
    const backdropUrl = useMemo(() => item && getImageUrl(item, ImageType.Backdrop, dom.getScreenWidth()), [item]);
    const logoUrl = useMemo(() => item && getImageUrl(item, ImageType.Logo, 600), [item]);

    const play = useCallback(() => {
        if (!item) return;
        playbackManager.play({ items: [item] }).catch(err => {
            console.error('[HomeHero] failed to play', err);
        });
    }, [item]);

    // Reserve the banner's space while loading so the home sections don't jump down
    if (isLoading) return <section className='gsHero gsHero-loading' aria-hidden='true' />;
    if (!item) return null;

    const meta = [
        item.ProductionYear,
        formatRuntime(item.RunTimeTicks),
        item.Genres?.slice(0, 3).join(', ')
    ].filter(Boolean);

    return (
        <section
            className='gsHero'
            style={backdropUrl ? { backgroundImage: `url("${backdropUrl}")` } : undefined}
        >
            <div className='gsHero-content'>
                <span className='gsHero-badge'>{globalize.translate('HeaderFeatured')}</span>
                {logoUrl ? (
                    <img className='gsHero-logo' src={logoUrl} alt={item.Name ?? ''} />
                ) : (
                    <h1 className='gsHero-title'>{item.Name}</h1>
                )}
                {(meta.length > 0 || item.OfficialRating) && (
                    <p className='gsHero-meta'>
                        {meta.join(' · ')}
                        {item.OfficialRating && <span className='gsHero-rating'>{item.OfficialRating}</span>}
                    </p>
                )}
                {item.Overview && <p className='gsHero-overview'>{item.Overview}</p>}
                <div className='gsHero-actions'>
                    <button type='button' className='gsHero-button gsHero-button-primary' onClick={play}>
                        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                            <path d='M7.5 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8a1 1 0 0 0-1.5.86z' />
                        </svg>
                        {globalize.translate('Play')}
                    </button>
                    <a className='gsHero-button' href={appRouter.getRouteUrl(item)}>
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
                            <circle cx='12' cy='12' r='9' />
                            <path d='M12 11v6M12 7.5v.01' />
                        </svg>
                        {globalize.translate('ButtonInfo')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
