import { useEffect, useState } from "react";
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Skeleton from "react-loading-skeleton";
import Icon, { Flag } from "./Icon.jsx";
import { format } from "date-fns";

export default function Location() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/location`, {
                    method: 'GET'
                });
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    if (!data || typeof data !== "object") {
        return (
            <>
                <div className="bio__info">
                    <div className="bio__info--icon">
                        <Icon name={'spinner'} size={16}/>
                    </div>
                    <span
                        className={'bio__info--skeleton'}
                    >
                        <Skeleton borderRadius={'3px'} width={'100%'} height={'100%'} baseColor={'transparent'}
                              highlightColor={'rgba(255,255,255,0.25)'} inline={true}/>
                    </span>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .bio__info--skeleton {
                            display: inline-block;
                            width: 5rem;
                            height: 100%;
                            border-radius: 3px;
                            background-color: rgba(255,255,255,0.1);
                        }
                        .bio__info--skeleton span {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    `
                }} />
            </>
        );
    }

    const countries = [
        "United States",
        "United Kingdom"
    ];

    const country = countries.includes(data.country.name) ? data.country.code : `, ${data.country}`;
    const location = `${data.city}${data.state ? `, ${data.state}` : ''}${country === 'US' ? '' : country}`;

    return (
        <>
            <Tippy
                content={`My location as of ${format(new Date(data.timestamp), 'MMM. d, yyyy')}`}
                arrow={false}
                placement="left"
                offset={[0, 3]}
                theme={'wolfhead'}
                allowHTML={true}
            >
                <div className="bio__info">
                    <div className="bio__info--icon">
                        {/*{data.country.code === 'US' ? (
                            <Icon name="marker" size={16} />
                        ) : (
                            <Flag region={data.country.code} size={16}>
                                <Icon name="spinner" size={16}/>
                            </Flag>
                        )}*/}
                        <i>
                            <Icon name="marker" size={16}/>
                        </i>
                        <i>
                            <Flag region={data.country.code} size={16}/>
                        </i>
                    </div>
                    <a href={`https://www.google.com/maps/place/${encodeURIComponent(location)}`}
                       rel={'noindex nofollower'} target={'_blank'}>{location}</a>
                </div>
            </Tippy>
            <style dangerouslySetInnerHTML={{
                __html: `
                .bio__info .bio__info--icon {
                    position: relative;
                    width: 16px;
                    height: 16px;
                }
                .bio__info .bio__info--icon > i {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                .bio__info .bio__info--icon > i:last-of-type {
                    transform: translateY(-1px);
                }
                .bio__info .bio__info--icon > i:first-of-type,
                .bio__info:hover .bio__info--icon > i:last-of-type {
                    opacity: 100;
                }
                .bio__info:hover .bio__info--icon > i:first-of-type,
                .bio__info .bio__info--icon > i:last-of-type {
                    opacity: 0;
                }
                .tippy-box[data-theme~="wolfhead"] {
                    font-size: 0.85rem;
                    color: #bdbdbd;
                    background-color: #252526;
                    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.25));
                }
                .tippy-box[data-theme~="wolfhead"] .tippy-content {
                    padding: 0 0.5em;
                    font-size: 0.8rem;
                    line-height: 2;
                }
                .tippy-box[data-theme~="wolfhead"] .tippy-content:has(inline-flag) > div {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 0.375rem;
                }
                .tippy-box[data-theme~="license"] .tippy-content {
                    padding: 0.25em 0.5em;
                    line-height: 1.5;
                }
                .tippy-box[data-theme~="wolfhead"] .tippy-arrow {
                    transform: scale(0.75);
                }
                
                .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    bottom: -5px;
                    border-top-color: #252526;
                }
                .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    top: -5px;
                    border-bottom-color: #252526;
                }
                .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    right: -5px;
                    border-left-color: #252526;
                }
                .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    left: -5px;
                    border-right-color: #252526;
                }
                
                .theme__dark .tippy-box[data-theme~="wolfhead"] {
                    color: #bdbdbd;
                    background-color: #212121;
                }
                .theme__light .tippy-box[data-theme~="wolfhead"] {
                    color: #aaa;
                    background-color: #eee;
                }
                .theme__hacker .tippy-box[data-theme~="wolfhead"] {
                    color: #bdbdbd;
                    background-color: #252526;
                }
                .theme__solarized .tippy-box[data-theme~="wolfhead"] {
                    color: #aaa;
                    background-color: #fbf1d1;
                }
                .theme__kimbie .tippy-box[data-theme~="wolfhead"] {
                    color: #aaa;
                    background-color: #362712;
                }
                
                .theme__dark .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    border-top-color: #212121;
                }
                .theme__light .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    border-top-color: #eee;
                }
                .theme__hacker .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    border-top-color: #252526;
                }
                .theme__solarized .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    border-top-color: #fbf1d1;
                }
                .theme__kimbie .tippy-box[data-theme~="wolfhead"][data-placement~="top"] .tippy-arrow:before {
                    border-top-color: #362712;
                }
                
                .theme__dark .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    border-bottom-color: #212121;
                }
                .theme__light .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    border-bottom-color: #eee;
                }
                .theme__hacker .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    border-bottom-color: #252526;
                }
                .theme__solarized .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    border-bottom-color: #fbf1d1;
                }
                .theme__kimbie .tippy-box[data-theme~="wolfhead"][data-placement~="bottom"] .tippy-arrow:before {
                    border-bottom-color: #362712;
                }
                
                .theme__dark .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    border-left-color: #212121;
                }
                .theme__light .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    border-left-color: #eee;
                }
                .theme__hacker .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    border-left-color: #252526;
                }
                .theme__solarized .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    border-left-color: #fbf1d1;
                }
                .theme__kimbie .tippy-box[data-theme~="wolfhead"][data-placement~="left"] .tippy-arrow:before {
                    border-left-color: #362712;
                }
                
                .theme__dark .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    border-right-color: #212121;
                }
                .theme__light .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    border-right-color: #eee;
                }
                .theme__hacker .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    border-right-color: #252526;
                }
                .theme__solarized .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    border-right-color: #fbf1d1;
                }
                .theme__kimbie .tippy-box[data-theme~="wolfhead"][data-placement~="right"] .tippy-arrow:before {
                    border-right-color: #362712;
                }
            `
            }}/>
        </>
    );
}
