'use client'
import React, { useEffect, useState } from 'react';
import { addItemToCollection, deleteCollection, deleteItemsFromCollection, getAllParsedPaperAction, getExistingCollection, getItemsFromCollection, getParsedPaperAction, handleGetItemsFromCollection, listAllCollections, loadEmbeddings, makeNewCollection, queryItemsInCollection, search, upsertItemInCollection } from '@src/app/actions';
import { TitleSourcePair } from '@src/server/api/routers/parsed-pdf';
import { Button } from '@/components/ui/button';

const DocumentForm = () => {

    const [collections, setCollections] = useState<string[]>([])
    const [parsedPaperSources, setParsedPapers] = useState<TitleSourcePair[]>([])
    useEffect(() => {
        const fetchCollections = async () => {
            const result = await listAllCollections();
            const parsedPapers = (await getAllParsedPaperAction())
            const collectionList = result.map((collection) => collection.name)


            setCollections(collectionList);
            setParsedPapers(parsedPapers)
        };
        fetchCollections();
    }, []);

    return (

        <form action={loadEmbeddings}>
            <label htmlFor="query">query:</label>
            <textarea name="query" rows={4} cols={40} />
            <select name="collection" id="collection">

                {collections.map((collection) => (
                    <option key={collection} value={collection}>{collection}</option>
                ))}
            </select>
            <select name="source" id="source">
                {parsedPaperSources.map(({ source, title }) => (
                    <option key={source} value={source}>{title}</option>
                ))}
            </select>
            <Button type="submit" name="button" value="submit">Embed Paper</Button>
            <Button formAction={search}>Query Paper</Button>
            {/* <Button formAction={handleDeleteCollection}>Delete Collection</Button> */}
            {/* <Button formAction={handleMakeNewCollection}>Create Collection</Button> */}
            <Button formAction={handleGetItemsFromCollection}>Get Items from Collection</Button>

        </form>
    );

}
export default DocumentForm;

