import { useEffect, useState } from "react";

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
                <span
                    className="online-status"
                    data-status={status}
                >
                    {label}
                </span>
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
            ` }} />
        </>
    );
}
