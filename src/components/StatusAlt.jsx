import { useEffect, useState } from "react";
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Skeleton from "react-loading-skeleton";
import Icon from "./Icon.jsx";

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

        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!discordData || typeof discordData !== "object") {
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

    let label, icon = {}, link, show = false;
    const discordStatus = ( twitchData && twitchData.type === "live" ) ? "live" : discordData.discord_status;
    const discordState = discordData.activities.length && discordData.activities[0].state || false;

    switch (discordStatus) {
        case "online":
            show = true;
            label = "Online";
            icon = {
                name: "circle",
                color: "#88af82",
            };
            break;
        case "dnd":
            show = true;
            label = "Unavailable";
            icon = {
                name: "prohibit",
                color: "#af8282",
            };
            break;
        case "live":
            show = true;
            label = "LIVE";
            icon = {
                name: "circle",
                color: "#9a82af",
            };
            link = `https://twitch.tv/${twitchData.user_login || "crossrambles"}`;
            break;
        default:
            show = true;
            label = "Away";
            icon = {
                name: "moon",
                color: "#afa882",
            };
            break;
    }

    return (
        <>
            {show && !link && (
                <Tippy
                    content={discordState ? discordState : "What's my status?"}
                    arrow={false}
                    placement="left"
                    offset={[0,3]}
                    theme={'wolfhead'}
                >
                    <div className="bio__info">
                        <div className="bio__info--icon">
                            <Icon name={icon.name} size={16}/>
                        </div>
                        {label}
                    </div>
                </Tippy>
            )}
            {show && link && (
                <Tippy
                    content={twitchData.game_name}
                    arrow={false}
                    placement="left"
                    offset={[0,3]}
                    theme={'wolfhead'}
                >
                    <div className="bio__info">
                        <div className="bio__info--icon">
                            <Icon name={icon.name} size={16}/>
                        </div>
                        <a href={link} target={'_blank'}>{label}</a>
                    </div>
                </Tippy>
            )}
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
            ` }} />
        </>
    );
}
