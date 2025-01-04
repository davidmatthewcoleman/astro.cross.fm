import Avatars from "./Avatars.jsx";
import { useState, useEffect } from "react";

export default function Mentions({ path }) {
    const [likes, setLikes] = useState([]);
    const [boosts, setBoosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/mentions?path=${encodeURIComponent(path)}`, {
                method: "GET"
            });
            const mentions = await response.json();
            const likes = mentions.filter((wm) =>
                ['like-of'].includes(wm["wm-property"])
            ).map((mention) => {
                return mention.author;
            });
            setLikes(likes);
            const boosts = mentions.filter((wm) =>
                ['repost-of'].includes(wm["wm-property"])
            ).map((mention) => {
                return mention.author;
            });
            setBoosts(boosts);
        }
        fetchData();
    }, [path])

    if ( likes || boosts ) {
        return (
            <aside className="tw-app">
                <div className="2xl:flex 2xl:flex-row 2xl:justify-between 2xl:align-middle">
                    <Avatars data={likes} max={8} prefix="Likes:" />
                    <Avatars data={boosts} max={8} suffix="Boosts" />
                </div>
            </aside>
        )
    } else {
        return null
    }
}