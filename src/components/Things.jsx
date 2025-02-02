import Parse from "html-react-parser";
import Picture from "./picture/Storage.jsx";
import React from "react";
import CountUp from "react-countup";
import { listToString } from "../lib/utils.js";
import {format} from "date-fns";


const AppCard = (props) => {
    const { label, summary, link, icon, description, platforms } = props
    const sortedPlatforms = platforms.sort((b, a) => a.localeCompare(b))

    return (
        <>
            <a href={link} target={`_blank`}
               className={`block bg-[#1D1F2E] !text-white hover:!text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3 min-w-full`}>
                <div className={`grid grid-cols-[1fr_auto] auto-rows-min gap-4 max-h-min items-stretch mb-auto after:hidden`}>
                    <div className={`flex flex-col gap-1.5 flex-grow w-full max-h-min`}>
                        <strong
                            className={`text-inherit line-clamp-2 md:line-clamp-1 text-sm md:text-base -mb-1`}>{Parse(label)}</strong>
                        <div
                            className={`text-white/75 text-sm line-clamp-4 md:text-base md:line-clamp-3`}>{Parse(description)}</div>
                        <div className={`flex flex-row gap-0.5 text-white/50 text-xxs md:text-xs items-center mt-auto`}>
                            <span>Using on</span>
                            <span
                                className="flex flex-row items-center"
                                title={
                                    sortedPlatforms.length > 4 ? listToString(sortedPlatforms) : null
                                }>
                                {sortedPlatforms.length > 4 ? (
                                    <>
                                        {sortedPlatforms.slice(0, 4).join(", ")}
                                        <small
                                            className="ml-[0.25rem] rounded-full bg-white/10 px-1 leading-3">
                                            +{sortedPlatforms.slice(4).length}
                                        </small>
                                    </>
                                ) : (
                                    <>
                                        {listToString(sortedPlatforms)}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <Picture
                        alt={Parse(label)}
                        className="absolute inset-0 w-full max-h-full object-cover rounded-[6px] m-auto"
                        classNamePicture="thumb relative min-w-[72px] w-[72px] break:min-w-[72px] break:w-[72px] -ml-1 -mr-2 max-h-full rounded-[6px] overflow-hidden"
                        source={[
                            {
                                url: `https://static.cross-cdn.com/content/things/apps/icons/${icon}`,
                                params: {
                                    resize: [72, 72]
                                }
                            }
                        ]}
                    />
                </div>
            </a>
        </>
    )
}

const GameCard = (props) => {
    const [steamData, setSteamData] = React.useState(null);
    const {id, label, genre, link, cover, publisher} = props

    React.useEffect(async () => {
        const response = await fetch(`/api/steamGames?id=${id}`, {
            method: "GET"
        });
        const data = await response.json();
        setSteamData(data);
    }, []);

    console.log('DATA?:', JSON.stringify(steamData, null, 2));

    const convertMinutesToHours = (minutes) => {
        if (minutes > 59) {
            return {
                number: Math.round(minutes / 60),
                suffix: " Hours"
            };
        } else {
            return {
                number: minutes,
                suffix: " Minutes"
            };
        }
    };

    const playTime = !steamData ? 0 : steamData?.playtime_forever
    const stats = convertMinutesToHours(playTime)

    return (
        <>
            <a href={link} target={`_blank`}
               className={`block bg-[#1D1F2E] !text-white hover:!text-[#D2C100] rounded-[6px] !no-underline overflow-hidden px-5 py-3 min-w-full`}>
                <div
                    className={`grid grid-cols-[auto_1fr] auto-rows-min gap-4 max-h-min items-stretch mb-auto after:hidden`}>
                    <Picture
                        alt={Parse(label)}
                        className="absolute inset-0 w-full max-h-full object-cover rounded-[6px] m-auto"
                        classNamePicture="thumb relative min-w-[72px] w-[72px] break:min-w-[72px] break:w-[72px] -ml-2 -mr-1 max-h-full rounded-[6px] overflow-hidden"
                        source={[
                            {
                                url: `https://static.cross-cdn.com/content/things/games/covers/${cover}`,
                                params: {
                                    resize: [72]
                                }
                            }
                        ]}
                    />
                    <div className={`flex flex-col gap-1.5 flex-grow w-full max-h-min`}>
                        <strong
                            className={`text-inherit line-clamp-2 md:line-clamp-1 text-sm md:text-base -mb-1`}>{Parse(label)}</strong>
                        <div
                            className={`text-white/75 text-sm line-clamp-4 md:text-base md:line-clamp-3`}>{Parse(publisher)}</div>
                        <div className={`flex flex-row gap-0.5 text-white/50 text-xxs md:text-xs items-center mt-auto`}>
                            <span>Playtime</span>
                            <span className="flex flex-row items-center">
                                <span
                                    className={`-mb-0.5 flex items-center tracking-wide ${
                                        !steamData && "animate-pulse"
                                    }`}>
                                    <span>
                                        {steamData ? <CountUp end={stats.number} suffix={stats.suffix} duration={4} enableScrollSpy={true} scrollSpyOnce={true}/> : "– – –"}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </>
    )
}

const DeviceCard = (props) => {
    const {label, category, colors, specs, thumb} = props
    const sortedColors = colors?.sort((a, b) => a.localeCompare(b))
    const sortedSpecs = specs?.sort((a, b) => a.localeCompare(b))

    return (
        <>
            <div className="w-full h-full flex flex-col gap-2.5 text-base w-full bg-[#1D1F2E] !text-white rounded-[6px] !no-underline overflow-hidden px-5 py-3">
                {thumb && (
                    <Picture
                        alt={Parse(label)}
                        className="w-full rounded-[4px] aspect-video object-contain mb-2 bg-white"
                        source={[
                            {
                                url: `https://static.cross-cdn.com/content/things/devices/${thumb}`,
                                params: {
                                    resize: ['auto', 192],
                                },
                            },
                        ]}
                    />
                )}
                <strong className="line-clamp-2">{Parse(label)}</strong>
                <div className="text-white/75 line-clamp-3">
                    {listToString(specs)}
                </div>
                <div className="text-white/50 text-xs flex items-center justify-between gap-2 mt-auto">
                    <span>
                        {category}
                    </span>
                    <span className="flex gap-1 items-center">
                        {colors && (
                            <>
                                {/*<span>{sortedColors.length === 1 ? "Color" : "Colors"}:</span>*/}
                                <span title={sortedColors.length > 3 ? listToString(sortedColors) : ""}>
                                    {sortedColors.length > 3 ? (
                                        <>
                                            {sortedColors.slice(0, 3).join(", ")}
                                            <small
                                                className="ml-[0.25rem] rounded-full bg-gray-100 px-1 leading-3 dark:bg-gray-600/70 dark:text-inherit">
                                                +{sortedColors.slice(3).length}
                                            </small>
                                        </>
                                    ) : (
                                        <>{listToString(sortedColors)}</>
                                    )}
                                </span>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </>
    )
}

const AccessoryCard = (props) => {
    const {label, category, colors, thumb} = props
    const sortedColors = colors?.sort((a, b) => a.localeCompare(b))

    return (
        <>
            <div
                className="w-full h-full flex flex-col gap-2.5 text-base w-full bg-[#1D1F2E] !text-white rounded-[6px] !no-underline overflow-hidden px-5 py-3">
                {thumb && (
                    <Picture
                        alt={Parse(label)}
                        className="w-full rounded-[4px] aspect-video object-contain mb-2 bg-white"
                        source={[
                            {
                                url: `https://static.cross-cdn.com/content/things/accessories/${thumb}`,
                                params: {
                                    resize: ['auto', 192],
                                },
                            },
                        ]}
                    />
                )}
                <strong className="line-clamp-2">{Parse(label)}</strong>
                <div className="text-white/50 text-xs flex items-center justify-between gap-2 mt-auto">
                    <span>
                        {category}
                    </span>
                    <span className="flex gap-1 items-center">
                        {colors && (
                            <>
                                {/*<span>{sortedColors.length === 1 ? "Color" : "Colors"}:</span>*/}
                                <span title={sortedColors.length > 3 ? listToString(sortedColors) : ""}>
                                    {sortedColors.length > 3 ? (
                                        <>
                                            {sortedColors.slice(0, 3).join(", ")}
                                            <small
                                                className="ml-[0.25rem] rounded-full bg-gray-100 px-1 leading-3 dark:bg-gray-600/70 dark:text-inherit">
                                                +{sortedColors.slice(3).length}
                                            </small>
                                        </>
                                    ) : (
                                        <>{listToString(sortedColors)}</>
                                    )}
                                </span>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </>
    )
}

export {AppCard, GameCard, DeviceCard, AccessoryCard}
