import { Avatar, AvatarGroup } from "@nextui-org/react";
import Picture from "./picture/Remote.jsx";

export default function Avatars({data: authors, max, prefix = null, suffix = null}) {
    const displayCount = Math.min(authors.length, max);
    const hiddenCount = authors.length - displayCount;

    if ( !authors || !authors.length ) return null;

    return (
        <AvatarGroup
            className={'avatar-list w-full h-max my-6 justify-start'}
            renderCount={(count) => null}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .avatar-list {
                    margin: 1.5rem 0;
                }
                .avatar-list * {
                    margin: 0;
                }
                .avatar-list a {
                    width: 36px;
                    height: 36px;
                    border-radius: 9999px;
                    box-shadow: 0 0 0 4px #151715;
                    overflow: hidden;
                    z-index: 10;
                }
                .avatar-list a:not(:first-of-type) {
                    margin-right: -0.25rem;
                }
                .avatar-list p {
                    font-size: 0.9rem;
                    color: #fff;
                    margin-right: 1rem;
                }
                .avatar-list p:first-of-type {
                    margin-right: 0.5rem;
                }
                .avatar-list p:last-of-type {
                    margin-left: 0.5rem;
                }
                .avatar-list > span > span > span {
                    display: block;
                    width: 100%;
                    height: 100%;
                    transform: none !important;
                    background-color: #1b1c1b;
                }
            ` }} />
            {prefix && <p>{prefix}</p>}
            {authors.slice(0, displayCount).map((author, index) => (
                <a href={author.url} target="_blank" rel="noopener noreferrer"
                   title={removeEncodedEmojis(author.name)}
                >
                    <Picture
                        className={'block w-[36px] h-[36px] m-0 !transform-none bg-[#1b1c1b]'}
                        source={[
                            {
                                url: `${author.photo.length > 0 ? `https://images.cross.fm/format=webp,width=108,height=108,fit=crop/${author.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=1b1c1b&color=fff`}`,
                                params: {
                                    cover: [36, 36]
                                }
                            }
                        ]}
                    />
                </a>
            ))}
            {hiddenCount > 0 && (
                <span>
                    <Avatar
                        text={`+${hiddenCount}`}
                        className={'block w-[36px] h-[36px] m-0 !transform-none text-sm text-white'}
                    />
                </span>
            )}
            {suffix && <p>{suffix}</p>}
        </AvatarGroup>
    );
}

function removeEncodedEmojis(str) {
    // Remove encoded emojis like :smile:
    const withoutEmojis = str.replace(/:\w+:/g, '');

    // Trim all excess whitespace (including between words)
    const trimmed = withoutEmojis.replace(/\s+/g, ' ').trim();

    return trimmed;
}