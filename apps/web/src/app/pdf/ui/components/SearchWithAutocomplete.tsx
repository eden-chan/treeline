'use client'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function SearchWithAutocomplete({ items }: { items: User[] }) {
    const router = useRouter()

    const handleOnSearch = (string: string, results: User[]) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
    }

    const handleOnHover = (result: User) => {
        // the item hovered
        console.log(result)
    }

    const handleOnSelect = (item: User) => {
        // the item selected
        console.log(item)

        router.push(`/profile?user=${item.handle}`)
    }

    const handleOnFocus = () => {
        console.log('Focused')
    }

    const formatResult = (item: User) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.first_name} {item.last_name}</span>
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
