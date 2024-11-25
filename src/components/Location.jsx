import { useEffect, useState } from "react";
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Skeleton from "react-loading-skeleton";

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

        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!data || typeof data !== "object") {
        return (
            <>
                <div className="bio__info">
                    <div className="bio__info--icon">
                        <svg className="icon" width="20" height="20" role="img">
                            <use href={`#icon-marker`}/>
                        </svg>
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

    const location = `${data.city}${data.state ? `, ${data.state}` : ''}${data.country === 'US' ? '' : `, ${data.country}`}`;

    return (
        <>
            <Tippy
                content={"Where am I?"}
                arrow={false}
                placement="left"
                offset={[0, 3]}
                theme={'wolfhead'}
            >
                <div className="bio__info">
                    <div className="bio__info--icon">
                        <svg class="icon" width="20" height="20" role="img">
                            <use href={`#icon-marker`}/>
                        </svg>
                    </div>
                    <a href={`https://www.google.com/maps/place/${encodeURIComponent(location)}`}
                       rel={'noindex nofollower'} target={'_blank'}>{location}</a>
                </div>
            </Tippy>
            <style dangerouslySetInnerHTML={{
                __html: `
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
