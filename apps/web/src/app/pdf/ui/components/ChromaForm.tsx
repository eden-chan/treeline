'use client'
import React, { useEffect, useState } from 'react';
import { addItemToCollection, createDocsAction, deleteCollection, deleteItemsFromCollection, getAllParsedPaperAction, getExistingCollection, getItemsFromCollection, getParsedPaperAction, listAllCollections, makeNewCollection, queryItemsInCollection, upsertItemInCollection } from '@src/app/actions';
import { SubmitButton } from '@src/components/submit-button';
import { Button } from '@/components/ui/button';
import { ParsedPapers, ParsedPapersFacts } from '@prisma/client';

const DocumentForm = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const handleSubmit = async () => {
        // event.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('title', title);

        const response = await createDocsAction(formData);
        console.log(response);

        const addResponse = await addItemToCollection('ParsedPapers', JSON.stringify({
            ids: ["uri9", "uri10"],
            // embeddings: [[1.5, 2.9, 3.4], [9.8, 2.3, 2.9]],
            metadatas: [{ "style": "style1" }, { "style": "style2" }],
            documents: ["This is a document", 'that is a document']
        }))

        const items = await getItemsFromCollection('ParsedPapers');
        console.log({ items });
        const query = await queryItemsInCollection('ParsedPapers', {
            queryEmbeddings: [
                [1.1, 2.3, 3.2],
                [5.1, 4.3, 2.2],
            ],
            nResults: 2,
            where: { style: "style2" },
        })
        console.log({ query })
    };

    const handleDeleteCollection = async () => {
        const response = await deleteCollection('ParsedPapers');
        console.log('Deleted Collection:', { response });
    };

    const handleListAllCollections = async () => {
        const response = await listAllCollections();
        console.log('All Collections:', { response });
    };

    const handleMakeNewCollection = async () => {
        try {
            const response = await makeNewCollection();
            console.log('New Collection Created:', { response });
        } catch (error) {
            // console.error('Error creating new collection:', error);
        }
    };

    const handleGetExistingCollection = async () => {
        const response = await getExistingCollection('ParsedPapers');
        console.log('Existing Collection:', { response });
    };

    const handlePaper = async () => {
        const pdfUrl = "https://arxiv.org/pdf/1706.03762.pdf";
        const paper = await getParsedPaperAction(pdfUrl);
        console.log(paper);
    }


    const publish = async (formData: FormData) => {
        const content = formData.get("content");
        const button = formData.get("button");

        const pdfUrl = "https://arxiv.org/pdf/1706.03762.pdf";
        const collectionName = 'ParsedPapers'

        const collection = await makeNewCollection(collectionName)

        const paper: ParsedPapers | null = await getParsedPaperAction(pdfUrl);
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
                ids: crypto.randomUUID(),
                metadatas: metadata,
                documents,
            }
            await upsertItemInCollection(collectionName, item)
        }

        // alert(`'${content}' was published with the '${button}' button`);
    }

    const search = async (formData: FormData) => {
        const query = formData.get("query")?.toString();
        const collectionName = formData.get("collection")?.toString();
        const source = formData.get('source')?.toString();

        if (collectionName && source) {
            const results = await queryItemsInCollection(collectionName, { queryTexts: [query], nResults: 5, where: { source: source } })
            alert(`Your draft of '${results}' has been saved!`);
            console.log('query: ', results)
        }
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
        <>
            <form action={publish}>
                <textarea name="query" rows={4} cols={40} />
                <label htmlFor="pdfUrl">PDF URL:</label>
                {/* <input type="text" id="source" name="source" required /> */}
                <br />
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

                <br />
                <button type="submit" name="button" value="submit">Embed</button>
                <button formAction={search}>Search</button>
            </form>


            <form action={handleDeleteCollection}>
                <SubmitButton title="Delete Collection" />
            </form>
            <form action={handleListAllCollections}>
                <SubmitButton title="List All Collections" />
            </form>
            <form action={handleMakeNewCollection}>
                <SubmitButton title="Create New Collection" />
            </form>
            <form action={handleGetExistingCollection}>
                <SubmitButton title="Get Existing Collection" />
            </form>
            <form action={handlePaper}>
                <SubmitButton title="Get Paper" />
            </form>
        </>
    );

}
export default DocumentForm;

