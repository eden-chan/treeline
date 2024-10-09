import { useState } from 'react';
import { addTag, type Document } from '../utils/dbUtils';

type AddTagProps = {

    documents: Document[];
};

export function AddTag({ documents }: AddTagProps) {
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTagName.trim()) {
            await addTag({
                name: newTagName.trim(),
                description: newTagDescription.trim(),
                documentIds: selectedDocumentIds || [],
            });
            setNewTagName('');
            setNewTagDescription('');
            setSelectedDocumentIds([]);
            ;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                required
            />
            <input
                type="text"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                placeholder="Tag description"
            />
            <select
                multiple
                value={selectedDocumentIds}
                onChange={(e) => setSelectedDocumentIds(Array.from(e.target.selectedOptions, option => option.value))}
            >
                <option value="">Select a document (optional)</option>
                {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                        {doc.name}
                    </option>
                ))}
            </select>
            <button type="submit">Add Tag</button>
        </form>
    );
}