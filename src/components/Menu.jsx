"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "./ui/navigation-menu.jsx"
import Parse from "html-react-parser";
import Picture from "./Picture.jsx";

export default function Menu({ posts, stories, sidebar }) {
    const allSeries = sidebar.allSeries.nodes;
    const categories = sidebar.categories.nodes;

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href={`/`} className={`navbar__menu-item navbar__slide-down`}>
                        Home
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger asChild>
                        <NavigationMenuLink href={`/blog`} className={`navbar__menu-item navbar__slide-down data-[state=open]:!text-[#f3ff6e]`}>
                            Blog
                        </NavigationMenuLink>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 grid-cols-[3fr_1fr] !mb-0 after:!hidden">
                            <div className={`grid grid-cols-[repeat(3,_1fr)] gap-3 !mb-0`}>
                                {
                                    posts.map(({ node: post }) => (
                                        <ListItem href={`/blog/${post.series}/${post.slug}`} title={Parse(post.title)}>
                                            {Parse(post.excerpt)}
                                        </ListItem>
                                    ))
                                }
                            </div>
                            <li>
                                {
                                    allSeries.length > 0 && (
                                        <div className="taxo" style={{margin: 0}}>
                                            <section>
                                                    <span className="title p2"><a href="/blog/archive/series"
                                                                                  className="taxo__title">Series</a></span>
                                                {
                                                    allSeries.map(series => {
                                                        return (
                                                            <span className="tag"><a href={`/blog/${series.slug}`}
                                                                                     className="is-series taxo__link"
                                                                                     data-dir="ltr"><span
                                                                className="taxo__text">{series.name}</span>&nbsp;<span
                                                                className="taxo__num"
                                                                dir="auto">{series.count}</span></a></span>
                                                        )
                                                    })
                                                }
                                            </section>
                                        </div>
                                    )
                                }
                                {
                                    categories.length > 0 && (
                                        <>
                                            <hr className={`w-full my-2`} />
                                            <div className="taxo" style={{margin: 0}}>
                                                <section>
                                                    <span className="title p2"><a href="/blog/archive/topics"
                                                                                  className="taxo__title">Topics</a></span>
                                                    {
                                                        categories.map(category => {
                                                            return (
                                                                <span className="tag"><a href={`/blog/archive/topics/${category.slug}`}
                                                                                         className="is-categories taxo__link"
                                                                                         data-dir="ltr"><span
                                                                    className="taxo__text">{category.name}</span>&nbsp;<span
                                                                    className="taxo__num"
                                                                    dir="auto">{category.count}</span></a></span>
                                                            )
                                                        })
                                                    }
                                                </section>
                                            </div>
                                        </>
                                    )
                                }
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger asChild>
                        <NavigationMenuLink href={`/stories`} className={`navbar__menu-item navbar__slide-down data-[state=open]:!text-[#f3ff6e]`}>
                            Stories
                        </NavigationMenuLink>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 grid-cols-[3fr_1fr] !mb-0 after:!hidden">
                            <div className={`grid grid-cols-[repeat(3,_1fr)] gap-3 !mb-0`}>
                                {
                                    stories.map(({node: story}) => (
                                        <ListItem href={`/stories/${story.slug}`} title={Parse(story.name)}>
                                            {Parse(story.description)}
                                        </ListItem>
                                    ))
                                }
                            </div>
                            <li className={`relative`}>
                                <Picture
                                    alt={stories[0]?.node.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    source={
                                        {
                                            '': {
                                                media: stories[0]?.node.images[0].cover,
                                                params: {
                                                    'width': 256,
                                                    'height': 384
                                                }
                                            }
                                        }
                                    }
                                />
                                <div
                                    className="absolute inset-x-0 bottom-0 px-4 pt-12 pb-2.5 bg-gradient-to-b from-transparent to-black">
                                    <div className="gradient-blur">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <h2 className={`relative text-white text-lg leading-5 mb-1.5`}>{Parse(stories[0]?.node.name)}</h2>
                                    <div className={`relative text-white/60 text-sm line-clamp-4 leading-4`}>
                                        {Parse(stories[0]?.node.description)}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href={`/works`} className={`navbar__menu-item navbar__slide-down`}>
                        Works
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href={`/blog/archive`} className={`navbar__menu-item navbar__slide-down`}>
                        Archive
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href={`/about`} className={`navbar__menu-item navbar__slide-down`}>
                        About Me
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-lg font-medium leading-none">{title}</div>
                    <p className="line-clamp-3 no-underline text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
