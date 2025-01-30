import {Select, SelectItem} from "@heroui/react";

export const options = [
    {
        key: 'about',
        label: 'About Me'
    },
    {
        key: 'about/interests',
        label: 'My Interests'
    },
    {
        key: 'about/bookmarks',
        label: 'Bookmarks'
    },
    {
        key: 'about/bookshelf',
        label: 'Bookshelf'
    },
    {
        key: 'about/uses',
        label: 'Uses'
    }
];

export default function AboutSelectorButton() {
    return (
        <div className="select-wrapper tw-app">
            <Select
                className="max-w-max"
                classNames={{
                    innerWrapper: 'btn min-h-0 h-auto',
                    listboxWrapper: 'text-lg leading-5 text-[#A5B457] bg-black rounded-sm border border-solid border-[#e08c48] hover:[&_li]:text-[#c7ba00] [&_svg]:hidden [&_li[aria-disabled="true"]]:hidden',
                    popoverContent: 'w-48 -translate-x-1',
                    selectorIcon: 'hidden'
                }}
                placeholder="About Me"
                onSelectionChange={function ({currentKey}) {
                    currentKey ? window.location.href = `/${currentKey}` : null;
                }}
                defaultSelectedKeys={['about']}
                disabledKeys={['about']}
            >
                {options.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
            </Select>
        </div>
    );
}
