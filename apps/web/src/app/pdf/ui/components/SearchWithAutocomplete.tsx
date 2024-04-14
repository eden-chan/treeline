'use client'
import { useRouter } from 'next/navigation'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function SearchWithAutocomplete({ items }) {
    const router = useRouter()

    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.

    }

    const handleOnHover = (result) => {
        // the item hovered

    }

    const handleOnSelect = (item) => {
        // the item selected
        router.push(`/${item.handle}`)
    }

    const handleOnFocus = () => {

    }

    const formatResult = (item) => {
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
