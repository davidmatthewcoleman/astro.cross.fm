import Picture from "../Picture.jsx";
import Parse from "html-react-parser";
import { Check, Bookmark, BookmarkSimple, Star } from "@phosphor-icons/react/dist/ssr";

export function BookGrid({ book }) {
    const { title, description, url, author, published, status, site, cover } = book;

    const width = cover.mediaDetails.width;
    const height = cover.mediaDetails.height;
    const ratio = width / height;

    const imageWidth = 192;
    const imageHeight = Math.round(imageWidth / ratio);

    const readStatus = (text = true) => {
        switch (status) {
            case 'reading':
                return (
                    <>
                        <Bookmark size={16} className={`${text && 'mr-0.5'}`} />
                        {text && `Reading`}
                    </>
                );
            case 'read':
                return (
                    <>
                        <Check size={16} className={`relative bottom-px ${text && 'mr-0.5'}`} />
                        {text && `Read`}
                    </>
                );
            case 'reviewed':
                return (
                    <>
                        <Star size={16} className={`${text && 'mr-0.5'}`} />
                        {text && `Reviewed`}
                    </>
                );
            default:
                return ( text ? false : <BookmarkSimple size={16} /> );
        }
    };

    return (
        <>
            <a href={url} target={`_blank`} className={`pointer-events-none min-w-full group`}
               style={{width: `${imageWidth}px`, display: 'inline flow-root', marginBottom: '0.75rem' }}>
                <div className={`book-cover min-w-full`} width={imageWidth} height={imageHeight}
                     transitionDuration={0.25} style={{'--accent': cover.mediaDetails.color}}>
                    <Picture
                        remote={true}
                        alt={title}
                        className="cover__img block !w-full !max-w-max pointer-events-auto"
                        source={
                            {
                                '(min-width: 960px)': {
                                    media: cover,
                                    params: {
                                        'width': 196,
                                        'fit': 'scale-down'
                                    }
                                },
                                '(max-width: 959px) and (min-width: 768px)': {
                                    media: cover,
                                    params: {
                                        'width': 298,
                                        'fit': 'scale-down'
                                    }
                                },
                                '(max-width: 767px) and (min-width: 640px)': {
                                    media: cover,
                                    params: {
                                        'width': 350,
                                        'fit': 'scale-down'
                                    }
                                },
                                '(max-width: 639px)': {
                                    media: cover,
                                    params: {
                                        'width': 600,
                                        'fit': 'scale-down'
                                    }
                                }
                            }
                        }
                    />
                    <div className={`absolute inset-0 w-full h-full ${description && 'group-hover:opacity-0'} transition-opacity`}>
                        <div
                            className={`absolute inset-x-0 bottom-0 flex flex-row items-center justify-between pt-8 pb-1.5 px-2 gap-2 bg-gradient-cover z-10 pointer-events-none`}>
                            <span
                                className={`flex flex-row items-center gap-1.5 py-0.5 px-1 scale-75 origin-bottom-left drop-shadow-md`}>
                                <span className={`text-xs text-white uppercase flex flex-row items-center`}>
                                    {published}
                                </span>
                            </span>
                        <span
                            className={`flex flex-row items-center gap-1.5 py-0.5 px-1 scale-75 origin-bottom-right drop-shadow-md`}>
                            <span
                                className={`text-xs text-white uppercase flex flex-row items-center`}>{Parse(site.domain)}</span>
                                <Picture
                                    remote={true}
                                    alt={Parse(site.domain)}
                                    className="w-[18px] h-[18px] rounded"
                                    source={
                                        {
                                            null: {
                                                media: site.icon,
                                                params: {
                                                    'width': 18,
                                                    'height': 18
                                                }
                                            }
                                        }
                                    }
                                />
                            </span>
                        </div>
                        {readStatus() && <span
                            className={`absolute top-0 right-0 my-1.5 mx-2 py-0.5 px-1 text-xs uppercase flex flex-row items-center backdrop-blur rounded pointer-events-none ${status === 'reviewed' ? 'text-black bg-yellow-500' : 'text-white bg-[rgba(37,37,38,0.85)]'}`}>{readStatus()}</span>}
                    </div>
                    {
                        description && (
                            <div
                                className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur`}>
                                <div
                                    className={`absolute inset-x-0 top-0 flex flex-row items-center pb-8 pt-1.5 pl-3.5 pr-2 ml-3 gap-2 z-10 pointer-events-none`}>
                            <span
                                className={`py-0.5 px-1 text-xs uppercase flex flex-row items-center backdrop-blur rounded pointer-events-none ${status === 'reviewed' ? 'text-black bg-yellow-500' : 'text-white bg-[rgba(37,37,38,0.85)]'}`}>{readStatus(false)}</span>
                                    <span
                                        className={`flex flex-row items-center gap-1.5 py-0.5 px-1 ml-auto scale-75 origin-right drop-shadow-md`}>
                            <span
                                className={`text-xs text-white uppercase flex flex-row items-center`}>{Parse(site.domain)}</span>
                                <Picture
                                    remote={true}
                                    alt={Parse(site.domain)}
                                    className="w-[18px] h-[18px] rounded"
                                    source={
                                        {
                                            null: {
                                                media: site.icon,
                                                params: {
                                                    'width': 18,
                                                    'height': 18
                                                }
                                            }
                                        }
                                    }
                                />
                            </span>
                                </div>
                                <div className={`absolute inset-0 w-full h-full pt-10 px-4 pb-3 ml-3 summary-mask`}>
                                    <p className={`text-white text-xs`}>
                                        {Parse(description)}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </a>
        </>
    );
}


export function BookCard({book}) {
    const { title, description, url, author, published, status, site, cover } = book;

    const width = cover.mediaDetails.width;
    const height = cover.mediaDetails.height;
    const ratio = width / height;

    const imageWidth = 196;
    const imageHeight = Math.round(imageWidth / ratio);

    const readStatus = () => {
        switch (status) {
            case 'reading':
                return (
                    <>
                        <Bookmark size={16} className={`mr-0.5`}/>
                        {`Reading`}
                    </>
                );
            case 'read':
                return (
                    <>
                        <Check size={16} className={`relative bottom-px mr-0.5`}/>
                        {`Read`}
                    </>
                );
            case 'reviewed':
                return (
                    <>
                        <Star size={16} className={`mr-0.5`}/>
                        {`Reviewed`}
                    </>
                );
            default:
                return false;
        }
    };

    return (
        <>
            <a href={url} target={`_blank`}
               className={`block bg-[#1D1F2E] text-white hover:text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3`}>
                <div className={`flex flex-row gap-4`}>
                    <div
                        className="thumb flex items-center justify-center min-w-[100px] w-[100px] min-h-[100px] rounded-[6px] overflow-hidden">
                            <Picture
                                remote={true}
                                alt={title}
                                className="m-auto !max-w-full !max-h-full rounded-[6px]"
                                source={
                                    {
                                        null: {
                                            media: cover,
                                            params: {
                                                'width': 196,
                                                'fit': 'scale-down'
                                            }
                                        }
                                    }
                                }
                            />
                    </div>
                    <div className={`flex flex-col gap-2 flex-grow`}>
                        <div className="flex flex-row items-center gap-2">
                        <strong className={`text-inherit text-sm md:text-base`}>{Parse(title)}</strong>
                            {readStatus() && <span
                                className={`py-0.5 px-1 text-xs uppercase flex flex-row items-center backdrop-blur rounded pointer-events-none ${status === 'reviewed' ? 'text-black bg-yellow-500' : 'text-black bg-white'}`}>{readStatus()}</span>}
                        </div>
                        <div className={`text-white text-sm line-clamp-4 md:text-base md:line-clamp-3`}>{Parse(description)}</div>
                        <div className={`flex flex-row gap-2.5 text-white/50 text-xxs md:text-xs items-center mt-auto`}>
                            <span>{published}</span>
                            <span className={`ml-auto`}>{author}</span>
                            <span className={`flex flex-row gap-1.5 items-center`}>
                                    {site.domain}
                                    <Picture
                                        remote={true}
                                        alt={Parse(site.domain)}
                                        className="w-[18px] h-[18px] rounded"
                                        source={
                                            {
                                                null: {
                                                    media: site.icon,
                                                    params: {
                                                        'width': 18,
                                                        'height': 18
                                                    }
                                                }
                                            }
                                        }
                                    />
                                </span>
                        </div>
                    </div>
                </div>
            </a>
        </>
    );
}