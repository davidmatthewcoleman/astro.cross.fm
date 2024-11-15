import { useEffect, useState } from "react";
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function Status() {
    const [discordData, setDiscordData] = useState(null);
    const [twitchData, setTwitchData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getDiscordData = await fetch(`/api/discord?id=198169754215645185`, {
                    method: 'GET'
                });
                const discordResponse = await getDiscordData.json();
                setDiscordData(discordResponse);

                const getTwitchData = await fetch(`/api/twitch?channel=crossrambles`, {
                    method: 'GET'
                });
                const twitchResponse = await getTwitchData.json();
                setTwitchData(twitchResponse[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!discordData || typeof discordData !== "object") {
        return null; // Or a loading spinner
    }

    let label, status, link, show = false;
    const discordStatus = ( twitchData && twitchData.type === "live" ) ? "live" : discordData.discord_status;

    switch (discordStatus) {
        case "online":
            show = true;
            label = "Online";
            status = "online";
            break;
        case "dnd":
            show = true;
            label = "Unavailable";
            status = "unavailable";
            break;
        case "live":
            show = true;
            label = "LIVE";
            status = "live";
            link = `https://twitch.tv/${twitchData.user_login || "crossrambles"}`;
            break;
        default:
            show = true;
            label = "Away";
            status = "away";
            break;
    }

    return (
        <>
            {show && !link && (
                <Tippy
                    content={discordData.activities[0].state}
                    arrow={false}
                    placement="left"
                    offset={[-1,3]}
                    theme={'wolfhead'}
                >
                    <span
                        className="online-status"
                        data-status={status}
                    >
                        {label}
                    </span>
                </Tippy>
            )}
            {show && link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer noindex"
                    className="online-status"
                    data-status={status}
                >
                    {label}
                </a>
            )}
            <style dangerouslySetInnerHTML={{ __html: `
                .online-status {
                    color: #fff !important;
                    font-family: sans-serif;
                    font-size: 12px;
                    text-decoration: none !important;
                    display: inline-flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 3px;
                    padding: 3px 5px;
                    border-radius: 25px;
                    border: 1px solid var(--color, #fff);
                    background-color: #1b1c1b;
                    
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    user-select: none;
                }
                .online-status::before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 25px;
                    background-color: var(--color, #fff);
                }
                .online-status[data-status="online"] {
                    --color: #059c00;
                }
                .online-status[data-status="unavailable"] {
                    --color: #db0000;
                }
                .online-status[data-status="away"] {
                    --color: #ffbb00;
                }
                .online-status[data-status="live"] {
                    --color: #aa00ff;
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
            ` }} />
        </>
    );
}
