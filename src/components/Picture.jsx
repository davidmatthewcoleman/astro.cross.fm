import { fetchPicture } from "../lib/picture.js";

export default function Picture( { remote = false, source, alt, className, style } ) {
    const picture = fetchPicture(source, remote);

    return (
        <picture>
            {Object.entries(picture).map(([mediaQuery, {img, srcset}]) => (
                mediaQuery !== 'null' ? (
                    <>
                        <source media={mediaQuery} type="image/avif"
                                srcSet={`${srcset.avif["1x"]} 1x, ${srcset.avif["2x"]} 2x, ${srcset.avif["3x"]} 3x`}/>
                        <source media={mediaQuery} type="image/webp"
                                srcSet={`${srcset.webp["1x"]} 1x, ${srcset.webp["2x"]} 2x, ${srcset.webp["3x"]} 3x`}/>
                    </>
                ) : (
                    <>
                        <source type="image/avif"
                                srcSet={`${srcset.avif["1x"]} 1x, ${srcset.avif["2x"]} 2x, ${srcset.avif["3x"]} 3x`}/>
                        <source type="image/webp"
                                srcSet={`${srcset.webp["1x"]} 1x, ${srcset.webp["2x"]} 2x, ${srcset.webp["3x"]} 3x`}/>
                    </>
                )
            ))}
            <img src={Object.values(picture)[0]?.img} alt={alt} className={className} loading={`lazy`} style={style}/>
        </picture>
    );
}