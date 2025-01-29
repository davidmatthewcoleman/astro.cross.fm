import {Accordion, AccordionItem, Avatar} from "@heroui/react";
import Parse from "html-react-parser";
import Picture from "./picture/Remote.jsx";

export default function Interests() {
    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css" />
            <style dangerouslySetInnerHTML={{ __html: `
                a {
                    color: #e08c48;
                    text-decoration: underline;
                }
                a:hover {
                    color: #c7ba00;
                    text-decoration: underline;
                }
                .mask-squircle {
                    aspect-ratio: 1 / 1;
                    -webkit-mask-image: url(/assets/images/squircle.svg);
                    mask-image: url(/assets/images/squircle.svg);
                }
            `}} />
            <div className="tw-app">
                <Accordion selectionMode="multiple">
                    {interests.map(({label, abbr, subLabel, thumbnail, content}, index) => (
                        <AccordionItem
                            key={index}
                            aria-label={label}
                            startContent={
                                <div className={'bg-white p-0.5 mask-squircle'}>
                                    <Picture
                                        source={[
                                            {
                                                url: thumbnail,
                                                params: {
                                                    cover: [48, 48]
                                                }
                                            }
                                        ]}
                                        alt={label}
                                        className={'mask-squircle'}
                                    />
                                </div>
                            }
                            subtitle={(
                                <>
                                    {abbr && (<span>Abbr: {abbr.join(', ')}</span>)}
                                    {abbr && (<span className="opacity-65">{Parse("&nbsp;&bull;&nbsp;")}</span>)}
                                    {subLabel}
                                </>
                            )}
                            title={label}
                            classNames={{
                                title: "text-white text-xl leading-5",
                                subtitle: "text-white/50 text-sm leading-4"
                            }}
                        >
                            {content}
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    );
}

const interests = [
    {
        label: "Avenged Sevenfold",
        abbr: [
            "A7X"
        ],
        subLabel: "My favorite music artist",
        thumbnail: "https://static.crossrambles.com/images/avenged-sevenfold.png",
        content: (
            <>
                <p>I first discovered them while listening to the radio in Corpus Christi, circa 2010. The song was "<a href="https://www.youtube.com/watch?v=iJ-WsnaYDCg" target="_blank">Welcome to the Family</a>" and I was hooked. A later rediscovered Need for Speed: Most Wanted (2005) and realized I'd heard them before, as the song "<a href="https://www.youtube.com/watch?v=TYgxM_suaUw" target="_blank">Blinded in Chains</a>" is on the soundtrack.</p>
            </>
        )
    },
    {
        label: "Nightwish",
        subLabel: "My second favorite music artist",
        thumbnail: "https://static.crossrambles.com/images/nightwish.jpg",
        content: (
            <>
                <p>I discovered them in a strange way. I had never heard of symphonic metal and wasn't sure it even existed, so I decided to search on YouTube for "Symphonic Metal Instrumental Playlist" and the first track was the promo disc instrumental version of "<a href="https://www.youtube.com/watch?v=4fjhQkJfcOQ" target="_blank">Dark Chest of Wonders</a>". This was maybe 2017.</p>
                <p>My favorite song by them is "<a href="https://www.youtube.com/watch?v=BMbPFqkTEfQ" target="_blank">The Greatest Show on Earth</a>" and by extension, the entire "<a href="https://www.youtube.com/playlist?list=OLAK5uy_nH3q5oTMDlwERj-5lm5QcGz8EJhScjxSU" target="_blank">Endless Forms Most Beautiful</a>" album.</p>
            </>
        )
    },
    {
        label: "Almanac",
        subLabel: "Another of my favorite music artists",
        thumbnail: "https://static.crossrambles.com/images/almanac.jpg",
        content: (
            <>
                <p>I found these guys back in 2018 while perusing the metal archives. They{"'"}re classified as "Neoclassical Metal", and I actually quite enjoy their music. The first two albums had a whopping three singers, neither of which played an instrument.</p>
                <p>Definitely check out "<a href="https://www.youtube.com/watch?v=MkH2FdVOg-Y" target="_blank">Losing My Mind</a>" and "<a href="https://www.youtube.com/watch?v=5IN61Rdfsos&pp=ygUcYWxtYW5hYyBraW5nZG9tIG9mIHRoZSBibGluZA%3D%3D" target="_blank">Kingdom of the Blind</a>". Great songs.</p>
            </>
        )
    },
    {
        label: "My Little Pony: Friendship is Magic",
        abbr: [
            "MLP:FiM"
        ],
        subLabel: "The show that changed my life",
        thumbnail: "https://static.crossrambles.com/images/mlp.png",
        content: (
            <>
                <p>I "joined the herd" back in October, 2014 and haven{"'"}t look back.</p>
            </>
        )
    },
    {
        label: "Helluva Boss",
        subLabel: "Just a casual fan",
        thumbnail: "https://static.crossrambles.com/images/helluva-boss.png",
        content: (
            <>
                <p>I{"'"}m a casual fan. I also watched Hazbin Hotel, and while it was alright, I am more interested in Helluva.</p>
            </>
        )
    },
    {
        label: "The Lord of the Rings",
        subLabel: "I make sure to binge the entire 12 hours at least once a year",
        thumbnail: "https://static.crossrambles.com/images/lotr.jpg",
        content: (
            <>
                <p>Yeah, I said it right. Twelve hours. That{"'"}s the runtime of the entire extended edition.</p>
            </>
        )
    },
    {
        label: "The Elder Scrolls",
        subLabel: "I've really only played Skyrim",
        thumbnail: "https://cdn2.steamgriddb.com/icon/4b04a686b0ad13dce35fa99fa4161c65.png",
        content: (
            <>
                <p>I adore Skyrim, but I{"'"}m very worried about The Elder Scrolls VI.</p>
            </>
        )
    },
    {
        label: "FALLOUT",
        subLabel: "I've really only played FO3 & FO4",
        thumbnail: "https://static.crossrambles.com/images/fallout.png",
        content: (
            <>
                <p>I like FALLOUT. Pretty fun. The TV show is amazing.</p>
            </>
        )
    }
];