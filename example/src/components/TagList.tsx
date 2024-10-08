import type { TagWithDocuments } from '../utils/dbUtils';

type TagListProps = {
    tagsWithDocuments: TagWithDocuments[];
};

export function TagList({ tagsWithDocuments }: TagListProps) {
    return (
        <ul>
            {tagsWithDocuments.map((tag) => (
                <li key={tag.id}>
                    <span>{tag.name}</span>
                    {tag.description && <span> - {tag.description}</span>}
                    {tag.documents && tag.documents.length > 0 && (
                        <div>
                            <span>Linked documents:</span>
                            <ul>
                                {tag.documents.map((doc) => {
                                    return doc ? (
                                        <li key={doc.id}>{doc.name}</li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}