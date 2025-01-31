import { useEffect, useState } from "react";
import React from 'react';

export default function Uptime() {
    const [uptimeData, setUptimeData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/uptime`, {
                    method: 'GET'
                });
                const data = await response.json();
                setUptimeData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!uptimeData) {
        return;
    }

    const status = uptimeData.some(obj => obj.attributes.status !== 'up');

    return (
        <span className={'tw-app'}>
            <a href={"https://status.crossrambles.com"} target={"_blank"} className={'absolute top-0 left-0 text-sm max-w-max !bg-black border !border-white/25 rounded-full px-2.5 py-1 my-[0.825rem] flex flex-row gap-x-1 items-center !text-white !no-underline'}>
                <i className={`inline-flex items-center justify-center ${status ? '!text-amber-500' : '!text-green-500'} -ml-0.5 scale-75`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} className={'overflow-visible'} viewBox="0 0 256 256">
                        <circle className={`duo-back animate-subtlePulse origin-center ${status ? '!fill-amber-200' : '!fill-green-200'}`} cx="128" cy="128" r="104"/>
                        <circle className="duo-front" fill="currentColor" cx="128" cy="128" r="104"/>
                    </svg>
                </i>
                <span>{status ? "Something's wrong" : "Everything's optimal"}</span>
            </a>
        </span>
    );
}
