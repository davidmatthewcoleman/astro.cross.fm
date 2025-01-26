export default function Embed({data: block}) {
    const url = new URL(block.attributes.url)
    let domain = url.hostname

    // Remove "www" subdomain if it exists
    domain = domain.replace(/^www\./, '')

    const classString = block.attributes.className || ''
    const className = 'wp-embed-aspect'
    const regex = new RegExp(`${className}-(\\d+)-(\\d+)`)
    const match = classString.match(regex)

    let aspectRatio = [16, 9]
    if (match) {
        aspectRatio = [parseInt(match[1], 10), parseInt(match[2], 10)]
    }

    let videoResult = '' // Declare a variable outside the switch statement
    let videoUrl = null
    let videoRegex = null
    let videoMatch = null
    let videoId = null

    switch (domain) {
        case 'youtube.com':
            videoResult = ''
            break
        case 'vimeo.com':
            videoUrl = block.attributes.url
            videoRegex =
                /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/(?:channels\/[\w]+\/)?|player\.vimeo\.com\/video\/)?(\d+)(?:\S+)?/
            videoMatch = videoUrl.match(regex)
            videoId = match ? match[1] : null

            videoResult = (
                <figure
                    key={block.uuid}
                    className={`relative`}
                    style={{ aspectRatio: `${aspectRatio[0]}/${aspectRatio[1]}` }}
                >
                    <iframe
                        src={`https://player.vimeo.com/video/${videoId}?title=0&portrait=0&byline=0`}
                        allow="fullscreen; picture-in-picture"
                        allowFullScreen
                        className={`absolute inset-0 h-full w-full border-none`}
                    ></iframe>
                </figure>
            )
            break
        case 'twitter': {
            const regex = /(?<=status\/)\d+/;
            const match = url.match(regex);
            return (
                <>
                    <Tweet id={match[0]} />
                </>
            );
        }
        default:
            videoResult = ''
            break
    }

    return videoResult
}