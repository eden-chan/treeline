'use client'
import React, { useEffect, useState } from 'react';
import { addItemToCollection, deleteCollection, deleteItemsFromCollection, getAllParsedPaperAction, getExistingCollection, getItemsFromCollection, getParsedPaperAction, listAllCollections, makeNewCollection, queryItemsInCollection, upsertItemInCollection } from '@src/app/actions';
import { SubmitButton } from '@src/components/submit-button';
import { ParsedPapers, ParsedPapersFacts } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const DocumentForm = () => {

    const handleDeleteCollection = async (formData: FormData) => {
        const collectionName = formData.get("collection")?.toString();
        const response = await deleteCollection(collectionName || 'ParsedPapers');
        console.log(`Deleted Collection ${collectionName}:`, { response });
    };



    const handleMakeNewCollection = async (formData: FormData) => {
        try {
            const collectionName = formData.get("query")?.toString();
            const response = await makeNewCollection(collectionName || 'ParsedPapers');
            console.log('New Collection Created:', { response });
        } catch (error) {
            // console.error('Error creating new collection:', error);
        }
    };

    const loadEmbeddings = async (formData: FormData) => {
        const pdfUrl = formData.get("source")!.toString();
        const collectionName = formData.get("collection")!.toString();
        const paper = await getParsedPaperAction(pdfUrl);

        console.log('loadEmbeddings on paper', paper)
        if (paper) {
            const { abstract, title, facts, sections } = paper
            const metadata = facts.map(({ fact, relevance }: ParsedPapersFacts) => ({
                fact,
                relevance,
                source: pdfUrl
            }));
            const documents = facts.map(({ expectedInfo, nextSource }: ParsedPapersFacts) => `${expectedInfo} ${nextSource}`);
            // We can embed the descriptors, and use them to search the document for new chunks of information that were missed by the previous round of retrieval.

            const item = {
                ids: Array(metadata.length).fill(null).map(() => crypto.randomUUID()),
                metadatas: metadata,
                documents,
            }
            console.log('upserting...')
            const startTime = performance.now();
            await upsertItemInCollection(collectionName, item);
            const endTime = performance.now();
            console.log(`Time taken to upsert item in collection: ${endTime - startTime} milliseconds`);
        }
        // alert(`'${content}' was published with the '${button}' button`);
    }

    const search = async (formData: FormData) => {
        const query = formData.get("query")!.toString();
        const collectionName = formData.get("collection")!.toString();
        const source = formData.get('source')!.toString();


        if (collectionName && source) {
            // const results = await queryItemsInCollection(collectionName, source, query)
            const results = await queryItemsInCollection(collectionName, source, query)
            console.log('query: ', results)
            const { documents, metadatas, ids } = results

            console.log('items: ', documents, metadatas)
        }
    }

    const handleGetItemsFromCollection = async (formData: FormData) => {
        const collectionName = formData.get("collection")!.toString();
        const source = formData.get('source')!.toString();

        const response = await getItemsFromCollection(collectionName, source);
        console.log(`getItemsFromCollection ${collectionName} by ${source}:`, { response });
    }

    const [collections, setCollections] = useState<string[]>([])
    const [parsedPaperSources, setParsedPapers] = useState<string[]>([])
    useEffect(() => {
        const fetchCollections = async () => {
            const result = await listAllCollections();
            const result2 = await getAllParsedPaperAction()

            const collectionList = result.map((collection) => collection.name)

            setCollections(collectionList);
            setParsedPapers(result2)
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
                {parsedPaperSources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                ))}
            </select>
            <Button type="submit" name="button" value="submit">Embed</Button>
            <Button formAction={search}>Search</Button>
            <Button formAction={handleDeleteCollection}>Delete Collection</Button>
            <Button formAction={handleMakeNewCollection}>Create Collection</Button>
            <Button formAction={handleGetItemsFromCollection}>Get Collection</Button>

        </form>
    );

}
export default DocumentForm;

