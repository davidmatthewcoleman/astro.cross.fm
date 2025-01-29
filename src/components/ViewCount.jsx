import {useEffect, useState} from "react";
import CountUp from "react-countup";

export default function ViewCount({slug}) {
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getViewData = await fetch(`/api/postViews?slug=${slug}`, {
                    method: 'GET'
                });
                const viewResponse = await getViewData.json();
                setViewData(viewResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        return () => fetchData();
    }, []);

    if (!viewData || viewData.length === 0) {
        return '0 views';
    }

    return (
        <CountUp
            start={0}
            end={viewData.value}
            duration={1.5}
            separator=","
            decimals={0}
            decimal="."
            prefix=""
            suffix={viewData.value === 1 ? ' view' : ' views'}
        />
    );
}