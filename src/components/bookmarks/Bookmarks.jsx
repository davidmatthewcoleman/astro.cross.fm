import { useState, useEffect } from "react";
import { Tweet } from "react-tweet";
import Picture from "../Picture.jsx";
import Favicon from "../Favicon.jsx";
import Parse from "html-react-parser";
import { format } from "date-fns";

export default function Bookmarks() {
    const [collection, setCollection] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/bookmarks/listItems?id=${window.location.hash.slice(1)}`, {
                    method: "GET",
                });
                const data = await response.json();

                setBookmarks(data.items); // Mark as initialized
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        window.addEventListener("collectionChanged", fetchData);
    }, []);

    if (!bookmarks && !bookmarks.length) {
        return null;
    }

    return (
        <div id={'tw-app'}>
            <div className="grid grid-cols-2 gap-4 mt-8">
                {bookmarks.map((item) => {
                    if ( item.link.includes("twitter.com") || item.link.includes("x.com") ) {
                        const id = item.link.match(/status\/(\d+)/);
                        return (
                            <div className="w-full col-span-2 [&_a]:text-blue-500 hover:[&_a]:text-blue-400 hover:[&_a]:no-underline">
                                <Tweet id={id[1]} />
                            </div>
                        );
                    } else {
                        return (
                            <div className="w-full">
                                <a href={item.link} target={'_blank'} className={`w-full h-full flex flex-col gap-2.5 text-base w-full bg-[#1D1F2E] !text-white hover:!text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3`}>
                                    {item.cover && (
                                        <Picture
                                            remote={true}
                                            alt={Parse(item.title)}
                                            className="w-full rounded-[4px] aspect-video object-cover mb-2"
                                            source={
                                                {
                                                    null: {
                                                        media: {
                                                            filename: new URL(item.cover).pathname,
                                                            source: item.cover,
                                                            dominantColor: null,
                                                            dimensions: {
                                                                width: 256,
                                                                height: 256
                                                            },
                                                            focalPoint: {
                                                                x: 0.5,
                                                                y: 0.5
                                                            }
                                                        },
                                                        params: {
                                                            'width': 256,
                                                            'fit': 'cover'
                                                        }
                                                    }
                                                }
                                            }
                                        />
                                    )}
                                    <strong className={'line-clamp-2'}>{Parse(item.title)}</strong>
                                    <div className={'!text-white line-clamp-3'}>
                                        {Parse(item.excerpt)}
                                    </div>
                                    <div className="!text-white/50 text-xs flex items-center justify-between gap-2 mt-auto">
                                        <span>Added {format(new Date(item.created), 'MMM. d, yyyy')}</span>
                                        <span className={`flex flex-row gap-1.5 items-center`}>
                                            {Parse(new URL(item.link).hostname)}
                                            <Favicon url={item.link} className="block w-[14px] h-[14px] rounded" />
                                        </span>
                                    </div>
                                </a>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}