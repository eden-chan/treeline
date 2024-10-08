import { useRef, useCallback } from 'react';
import { deleteTag, unlinkDocumentFromTag, updateTag, type TagWithDocuments } from '../utils/dbUtils';
// @ts-ignore
import debounce from '../utils/debounce';

type TagListProps = {
    tagsWithDocuments: TagWithDocuments[];
};

const DEBOUNCE_TIME = 1000;// ms
export function TagList({ tagsWithDocuments }: TagListProps) {
    const nameRefs = useRef<{ [key: string]: HTMLInputElement }>({});
    const descriptionRefs = useRef<{ [key: string]: HTMLInputElement }>({});

    const debouncedUpdateTag = useCallback(
        debounce((tagId: string, name: string, description: string) => {
            console.log("debounced Updating tag", tagId, { name, description });
            updateTag(tagId, { name, description });
        }, DEBOUNCE_TIME),
        []
    );

    const handleTagChange = (tagId: string) => {
        const name = nameRefs.current[tagId]?.value ?? '';
        const description = descriptionRefs.current[tagId]?.value ?? '';
        debouncedUpdateTag(tagId, name, description);
    };

    return (
        <ul>
            {tagsWithDocuments.map((tag) => (
                <li key={tag.id}>
                    <input
                        type="text"
                        defaultValue={tag.name}
                        ref={(el) => {
                            if (el) {
                                nameRefs.current[tag.id] = el;
                            }
                        }}
                        onChange={() => handleTagChange(tag.id)}
                        placeholder="Tag name"
                    />
                    <input
                        type="text"
                        defaultValue={tag.description}
                        ref={(el) => {
                            if (el) {
                                descriptionRefs.current[tag.id] = el;
                            }
                        }}
                        onChange={() => handleTagChange(tag.id)}
                        placeholder="Tag description"
                    />
                    {tag.documents && tag.documents.length > 0 && (
                        <div>
                            <span>Linked documents:</span>
                            <ul>
                                {tag.documents.map((doc) => (
                                    doc ? (
                                        <li key={doc.id}>
                                            {doc.name}
                                            <button type="button" onClick={() => unlinkDocumentFromTag(tag.id, doc.id)}>Unlink</button>
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        </div>
                    )}
                    <button type="button" onClick={() => deleteTag(tag.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}