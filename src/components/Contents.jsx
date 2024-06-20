import Parse from "html-react-parser"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible"

export default function Contents({toc}) {
    return (
        <>
            <link rel={`stylesheet`} href={`/assets/css/app.css`}/>
            <Collapsible>
                <CollapsibleTrigger className={`w-full`}>
                    <div className={`grid grid-cols-[auto_1fr] gap-2.5 items-center w-full`}>
                        <span className={`text-white/75 hover:text-white text-base font-mono`}>Table of Contents</span>
                        <hr style={{ color: '#6b6b6b', backgroundImage: 'linear-gradient(-45deg, transparent, transparent 25%, currentColor 25%, currentColor 50%, transparent 50%, transparent 75%, currentColor 75%)', backgroundSize: '10px 10px', height: '7px', border: 'none', borderRadius: '0.5rem' }} />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className={`text-white text-base [&_ul_ul]:pl-3 pt-0.5`}>
                        {Parse(toc)}
                    </div>
                    <CollapsibleTrigger className={`w-full`}>
                        <div className={`grid grid-cols-[auto_1fr] gap-2.5 items-center w-full`}>
                            <span className={`text-white/75 hover:text-white text-base font-mono`}>Collapse</span>
                            <hr style={{ color: '#6b6b6b', backgroundImage: 'linear-gradient(-45deg, transparent, transparent 25%, currentColor 25%, currentColor 50%, transparent 50%, transparent 75%, currentColor 75%)', backgroundSize: '10px 10px', height: '7px', border: 'none', borderRadius: '0.5rem' }} />
                        </div>
                    </CollapsibleTrigger>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}
