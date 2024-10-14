import { useState } from "react";
import { addBundle, type Document } from "../utils/dbUtils";

type AddBundleProps = {
  documents: Document[];
};

export function AddBundle({ documents }: AddBundleProps) {
  const [newBundleName, setNewBundleName] = useState("");
  const [newBundleDescription, setNewBundleDescription] = useState("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBundleName.trim()) {
      await addBundle({
        name: newBundleName.trim(),
        description: newBundleDescription.trim(),
        documentIds: selectedDocumentIds,
      });
      setNewBundleName("");
      setNewBundleDescription("");
      setSelectedDocumentIds([]);
    }
  };

  const handleDocumentSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedDocumentIds(selectedOptions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newBundleName}
        onChange={(e) => setNewBundleName(e.target.value)}
        placeholder="Bundle name"
        required
      />
      <input
        type="text"
        value={newBundleDescription}
        onChange={(e) => setNewBundleDescription(e.target.value)}
        placeholder="Bundle description"
      />
      <select
        multiple
        value={selectedDocumentIds}
        onChange={handleDocumentSelection}
      >
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>
      <button type="submit">Add Bundle</button>
    </form>
  );
}
