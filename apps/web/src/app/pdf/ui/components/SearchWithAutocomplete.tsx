'use client'
import { UserSearchResult } from '@src/lib/types'
import { useRouter } from 'next/navigation'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function SearchWithAutocomplete({ items }: { items: UserSearchResult[] }) {
    const router = useRouter()

    const handleOnSearch = (string: string, results: UserSearchResult[]) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.

    }

    const handleOnHover = (result: UserSearchResult) => {
        // the item hovered

    }

    const handleOnSelect = (item: UserSearchResult) => {
        // the item selected
        router.push(`/user/${item.handle}`)
    }

    const handleOnFocus = () => {

    }

    const formatResult = (item: UserSearchResult) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }

    return (

        <ReactSearchAutocomplete
            showIcon={false}
            placeholder='Search People'
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
        />
    )
}
