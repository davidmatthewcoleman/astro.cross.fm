import React, { useState, useEffect } from "react";
import { Tweet } from "react-tweet";
import Picture from "../picture/Remote.jsx";
import Parse from "html-react-parser";
import { format } from "date-fns";
import useSWR from "swr";

const fetchBookmarks = async (url) => {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
    }
    return response.json();
};

export default function Bookmarks() {
    const [collection, setCollection] = useState(null);

    // Detect when the hash changes and update the collection
    useEffect(() => {
        const handleHashChange = () => {
            const newCollection = window.location.hash.slice(1);
            setCollection(newCollection); // Update state with new hash value
        };

        // Initial setup
        handleHashChange();

        // Add event listener to handle hash changes
        window.addEventListener("collectionChanged", handleHashChange);

        return () => {
            window.removeEventListener("collectionChanged", handleHashChange);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Use SWR to fetch data for the current collection
    const { data, error, isLoading } = useSWR(
        collection ? `/api/bookmarks/listItems?id=${collection}` : null,
        fetchBookmarks
    );

    // Handle loading and error states
    if (isLoading) {
        // return <p>Loading bookmarks...</p>;
        return;
    }

    if (error) {
        // return <p>Error loading bookmarks: {error.message}</p>;
        return;
    }

    if (!data || data.items.length === 0) {
        // return <p>No bookmarks available for this collection.</p>;
        return;
    }

    return (
        <div id="tw-app">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.items.map((item) => {
                    const isTwitterLink =
                        item.link.includes("twitter.com") || item.link.includes("x.com");
                    const tweetId = isTwitterLink ? item.link.match(/status\/(\d+)/)?.[1] : null;

                    return (
                        <div
                            key={item.link}
                            className={`w-full ${isTwitterLink ? "col-span-2" : ""} [&_a]:text-blue-500 hover:[&_a]:text-blue-400 hover:[&_a]:no-underline`}
                        >
                            {isTwitterLink && tweetId ? (
                                <Tweet id={tweetId} />
                            ) : (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-full flex flex-col gap-2.5 text-base w-full bg-[#1D1F2E] !text-white hover:!text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3"
                                >
                                    {item.cover && (
                                        <Picture
                                            alt={Parse(item.title)}
                                            className="w-full rounded-[4px] aspect-video object-cover mb-2"
                                            source={[
                                                {
                                                    url: item.cover,
                                                    params: {
                                                        resize: [256],
                                                    },
                                                },
                                            ]}
                                        />
                                    )}
                                    <strong className="line-clamp-2">{Parse(item.title)}</strong>
                                    <div className="text-white/75 line-clamp-3">
                                        {Parse(item.excerpt)}
                                    </div>
                                    <div className="text-white/50 text-xs flex items-center justify-between gap-2 mt-auto">
                                        <span>
                                            Added {format(new Date(item.created), "MMM. d, yyyy")}
                                        </span>
                                        <span className="flex gap-1.5 items-center">
                                            {Parse(getDomainAndTLD(item.link))}
                                            <Picture
                                                remote={true}
                                                alt={Parse(new URL(item.link).hostname)}
                                                className="block w-[14px] h-[14px] rounded"
                                                source={[
                                                    {
                                                        url: `https://s2.googleusercontent.com/s2/favicons?domain_url=${encodeURIComponent(
                                                            item.link
                                                        )}`,
                                                        params: {
                                                            cover: [32, 32],
                                                        },
                                                    },
                                                ]}
                                            />
                                        </span>
                                    </div>
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getDomainAndTLD(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        const parts = hostname.split(".");
        return parts.slice(-2).join(".");
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}
