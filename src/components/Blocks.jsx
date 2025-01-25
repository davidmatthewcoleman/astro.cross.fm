import React from 'react';
import Parse from "html-react-parser";
import Picture from "./picture/Storage.jsx";
import {Tweet} from "react-tweet";

function renderBlock(block, index) {
    if (block.name === 'core/image') {
        let blockClass = 'image-block ', blockImgClass, blockWidth
        if (block.attributes.align) {
            switch (block.attributes.align) {
                case 'left':
                    blockClass += 'float-left !my-2 !mr-4 w-full md:w-auto'
                    blockImgClass = 'mx-auto 2xl:!m-0 w-full'
                    blockWidth = block.attributes.width ? block.attributes.width : 256
                    break
                case 'center':
                    blockClass += 'float-none !my-2 w-full md:w-auto'
                    blockImgClass = '!m-0 w-full'
                    blockWidth = block.attributes.width ? block.attributes.width : 1200
                    break
                case 'wide':
                    blockClass += 'float-none !my-2 max-w-5xl mx-auto md:w-auto'
                    blockImgClass = '!m-0 w-full'
                    blockWidth = 1200
                    break
                case 'full':
                    blockClass += 'float-none !my-2 max-w-full mx-auto md:w-auto'
                    blockImgClass = '!m-0 w-full'
                    blockWidth = 1920
                    break
                case 'right':
                    blockClass += 'float-right !my-2 !ml-4 w-full md:w-auto'
                    blockImgClass = 'mx-auto 2xl:!m-0 w-full'
                    blockWidth = block.attributes.width ? block.attributes.width : 256
                    break
                default:
                    blockClass += 'float-none !my-2 max-w-5xl mx-auto md:w-auto'
                    blockImgClass = '!m-0 w-full'
                    blockWidth = block.attributes.width ? block.attributes.width : 1200
                    break
            }
        } else {
            blockWidth = block.attributes.width ? block.attributes.width : 736
        }
        let blockCaption
        if (block.attributes.align === 'left') {
            blockCaption = block.attributes.caption
                ? <figcaption className="text-black/50 text-sm mt-2">{Parse(block.attributes.caption)}</figcaption>
                : null
        } else if (block.attributes.align === 'right') {
            blockCaption = block.attributes.caption
                ? <figcaption className="text-black/50 text-sm mt-2 text-right">{Parse(block.attributes.caption)}</figcaption>
                : null
        } else {
            blockCaption = block.attributes.caption
                ? <figcaption className="text-black/50 text-sm mt-2 text-center">{Parse(block.attributes.caption)}</figcaption>
                : null
        }

        return (
            <figure key={block.clientId} className={blockClass}>
                <Picture
                    source={[
                        {
                            url: block.attributes.src,
                            params: {
                                cover: [block.attributes.width || 646, block.attributes.height || 'auto'],
                            }
                        }
                    ]}
                    alt={block.attributes.title}
                    className={blockImgClass}
                />
                {blockCaption}
            </figure>
        )
    } else if (block.name === 'core/quote') {
        return (
            <blockquote
                className="quote prose-quoteless relative my-4 border-none pl-4"
                style={{
                    '--border-color': block.attributes.borderColor,
                }}
                key={block.clientId}
            >
                {Parse(block.attributes.value)}
                {block.attributes.citation && block.attributes.citation.length > 0 && (
                    <cite>{Parse(block.attributes.citation)}</cite>
                )}
            </blockquote>
        )
    } else if (block.name === 'core/separator') {
        return <hr className={''} key={block.clientId} />
    } else if (block.name === 'acf/alert') {
        const { alert } = JSON.parse(block.attributes.data);
        return (
            <div
                key={block.clientId}
                className="alert"
                style={{
                    '--color': alert.color,
                }}
            >
                {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) => renderBlock(innerBlock, innerIndex + 1))}
            </div>
        )
    } else if (block.name === 'acf/citation') {
        let align
        if (block.attributes.align === 'left') {
            align =
                '2xl:py-3 2xl:px-5 2xl:float-left mb-4 text-sm 2xl:w-80 2xl:ml-[-22rem] w-full ml-auto 2xl:border-none   py-4 border-dashed border-y border-gray-400'
        } else if (block.attributes.align === 'right') {
            align =
                '2xl:py-3 2xl:px-5 2xl:float-right mb-4 text-sm 2xl:w-80 2xl:mr-[-22rem] w-full mr-auto 2xl:border-none   py-4 border-dashed border-y border-gray-400'
        } else if (block.attributes.align === 'full') {
            align = 'mb-4 -mx-8 float-none mb-4 py-4 text-sm border-dashed border-y border-gray-400'
        } else {
            align = 'float-none mb-4 py-4 text-sm border-dashed border-y border-gray-400'
        }

        return (
            <aside key={block.clientId} className={`citation ${align}`}>
                {/* Add a return statement here */}
                {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) => renderBlock(innerBlock, innerIndex + 1))}
            </aside>
        )
    } else if (block.name === 'core/paragraph') {
        return (
            <React.Fragment key={block.clientId}>
                {block.attributes?.content.length > 0 ? (
                    <p>
                        {Parse(block.attributes.content)}
                    </p>
                ) : Parse(block.renderedHtml)}
            </React.Fragment>
        )
    } else if (block.name === 'core/embed') {
        // Extract the hostname from the URL
        const url = new URL(block.attributes.url)
        let domain = url.hostname

        // Remove "www" subdomain if it exists
        domain = domain.replace(/^www\./, '')

        const classString = block.attributes.className || ''
        const className = 'wp-embed-aspect'
        const regex = new RegExp(`${className}-(\\d+)-(\\d+)`)
        const match = classString.match(regex)

        let aspectRatio = [16, 9]
        if (match) {
            aspectRatio = [parseInt(match[1], 10), parseInt(match[2], 10)]
        }

        let videoResult = '' // Declare a variable outside the switch statement
        let videoUrl = null
        let videoRegex = null
        let videoMatch = null
        let videoId = null

        switch (domain) {
            case 'youtube.com':
                videoResult = ''
                break
            case 'vimeo.com':
                videoUrl = block.attributes.url
                videoRegex =
                    /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/(?:channels\/[\w]+\/)?|player\.vimeo\.com\/video\/)?(\d+)(?:\S+)?/
                videoMatch = videoUrl.match(regex)
                videoId = match ? match[1] : null

                videoResult = (
                    <figure
                        key={block.uuid}
                        className={`relative`}
                        style={{ aspectRatio: `${aspectRatio[0]}/${aspectRatio[1]}` }}
                    >
                        <iframe
                            src={`https://player.vimeo.com/video/${videoId}?title=0&portrait=0&byline=0`}
                            allow="fullscreen; picture-in-picture"
                            allowFullScreen
                            className={`absolute inset-0 h-full w-full border-none`}
                        ></iframe>
                    </figure>
                )
                break
            case 'twitter': {
                const regex = /(?<=status\/)\d+/;
                const match = url.match(regex);
                return (
                    <>
                        <Tweet id={match[0]} />
                    </>
                );
            }
            default:
                videoResult = ''
                break
        }

        return videoResult
    } else if (block.name === 'acf/bookmark') {
        const { data: bookmark } = JSON.parse(block.renderedHtml.replace(/\\/g, ""));
        return <figure className={'bookmark tw-app'} key={block.clientId}>
            <a href={bookmark.source} target={`_blank`}
               className={`block bg-[#1D1F2E] !text-white hover:!text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3 my-2.5`}>
                <div
                    className={`grid grid-cols-[auto_1fr] auto-rows-min gap-4 max-h-min items-stretch mb-auto after:hidden`}>
                    <Picture
                        alt={Parse(bookmark.title)}
                        className="absolute inset-0 w-full max-h-full object-cover rounded-[6px] !m-auto"
                        classNamePicture="thumb relative min-w-[72px] w-[72px] break:min-w-[100px] break:w-[100px] max-h-full rounded-[6px] overflow-hidden"
                        source={[
                            {
                                url: bookmark.thumbnail,
                                params: {
                                    resize: [196]
                                }
                            }
                        ]}
                    />
                    <div className={`flex flex-col gap-2 flex-grow`}>
                        <div className="flex flex-row items-center gap-2">
                            <strong
                                className={`text-inherit line-clamp-2 md:line-clamp-1 text-sm md:text-base`}>{Parse(bookmark.title)}</strong>
                        </div>
                        <div
                            className={`text-white text-sm line-clamp-4 md:text-base md:line-clamp-3`}>{Parse(bookmark.excerpt)}</div>
                        <div
                            className={`flex flex-row gap-1.5 text-white/50 text-xxs md:text-xs items-center justify-between mt-auto`}>
                            <span>{Parse(bookmark.author)}</span>
                            <span className={`flex flex-row gap-1.5 items-center max-md:hidden`}>
                                {bookmark.site}
                                <Picture
                                    alt={Parse(bookmark.site)}
                                    className="block w-[14px] h-[14px] rounded"
                                    source={[
                                        {
                                            url: bookmark.icon,
                                            params: {
                                                cover: [14, 14]
                                            }
                                        }
                                    ]}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </figure>
    } else if (block.name === null || block.name === 'core/more') {
        return;
    } else if (block.name === 'core/group') {
        return (
            <>
                {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) => renderBlock(innerBlock, innerIndex + 1))}
            </>
        );
    } else if (block.name === 'core/list') {
        return (
            <ul key={block.clientId} className={`list-disc`}>
                {block.values && block.values.map((innerBlock, innerIndex) => renderBlock(innerBlock, innerIndex + 1))}
            </ul>
        )
    } else {
        return (
            <React.Fragment key={block.clientId}>
                {Parse(block.renderedHtml)}
            </React.Fragment>
        )
    }
}

function Blocks({data}) {
    return (
        <>
            {data && data.map((block, index) =>
                // Add a return statement
                renderBlock(block, index + 1)
            )}
        </>
    )
}

export default Blocks
