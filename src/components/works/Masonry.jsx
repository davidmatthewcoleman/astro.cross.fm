import Picture from "../Picture.astro";
import React from "react";

export default function Masonry({ data }) {
    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css"/>
            <div className="initial-hide hidden columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5" style={{ columnGap: `0.5rem`, display: `none` }}>
                {data.map((work, index) => (
                    <Picture
                        key={index}
                        alt={``}
                        className="work__image mb-2 rounded-lg"
                        source={
                            {
                                null: {
                                    media: work,
                                    params: {
                                        'width': 1024,
                                        'height': 1024,
                                        'fit': 'clip'
                                    }
                                }
                            }
                        }
                        style={{aspectRatio: `${work.mediaDetails.width}/${work.mediaDetails.height}`}}
                    />
                ))}
            </div>
        </>
    );
}