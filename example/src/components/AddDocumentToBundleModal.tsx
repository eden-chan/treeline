import { useState } from "react";
import { Modal } from "../Modal";
import type { Document } from "../utils/dbUtils";
import styles from "./BundleSection.module.css";
import { fetchPDF, uploadLocalFiles } from "./UploadDocumentForm";
import type { CreateDocumentDraft } from "../react-pdf-highlighter";
import FileDropzone from "./FileDropzone";
import { FileList } from "./FileList";
import { useToast } from "../context/ToastContext";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddExistingDocument: (documentId: string | string[]) => void;

  documents: Document[];
};

export function AddDocumentToBundleModal({
  isOpen,
  onClose,
  onAddExistingDocument,
  documents,
}: Props) {
  const { addToast } = useToast();

  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // File Upload Stato
  const [name, setName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<CreateDocumentDraft[]>([]);

  const onError = (error: string) => {
    addToast({
      message: `Unable to add documents due to error ${error}`,
      type: "error",
      duration: 2000,
    });
  };

  const onSuccess = () => {
    addToast({
      message: "Documents added to bundle successfully!",
      type: "success",
      duration: 2000,
    });
  };

  const addLocalFileToBatch = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.name === newFile.name && prevFile.size === newFile.size,
          ),
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const addUrlToBatch = () => {
    if (urlInput) {
      setResourceLinks([...resourceLinks, { name, sourceUrl: urlInput }]);
      setUrlInput("");
      setName("");
    }
  };

  // get the ids from the state ?
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const fetchPDFPromises = resourceLinks.map(fetchPDF);
    const uploadFilesPromise = uploadLocalFiles(files);

    let resultingUploadedIds: string[] = [];
    let allIds: string[] = [];
    try {
      const results = await Promise.all([
        ...fetchPDFPromises,
        uploadFilesPromise,
      ]);
      resultingUploadedIds = results
        .flat()
        .filter(Boolean)
        .map((result) => result.documentId);
      allIds = [...selectedDocumentIds, ...resultingUploadedIds];
      onAddExistingDocument(allIds);
      console.log("addDocumentToBundleModal allIds", allIds);
    } catch (error) {
      console.error("Error in upload process:", error);
    }

    // Reset form state
    setName("");
    setUrlInput("");
    setResourceLinks([]);
    setFiles([]);

    if (allIds.length > 0) {
      onSuccess();
    } else {
      onError("No documents added");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Document to Bundle">
      <h3>Choose Existing Document</h3>
      <form onSubmit={handleSubmit}>
        <ul className={styles.documentList}>
          {documents.map((doc) => (
            <li key={doc.id} className={styles.documentItem}>
              <label className={styles.documentLabel}>
                <input
                  type="checkbox"
                  checked={selectedDocumentIds.includes(doc.id)}
                  onChange={() => {
                    if (selectedDocumentIds.includes(doc.id)) {
                      setSelectedDocumentIds(
                        selectedDocumentIds.filter((id) => id !== doc.id),
                      );
                    } else {
                      setSelectedDocumentIds([...selectedDocumentIds, doc.id]);
                    }
                  }}
                  className={styles.documentCheckbox}
                />
                <span className={styles.documentName}>{doc.name}</span>
              </label>
            </li>
          ))}
        </ul>
        <h3>Or Create New Document</h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Document Name"
          className={styles.inputField}
        />
        <div className={styles.urlInputContainer}>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL"
            className={styles.inputField}
          />
          <button
            type="button"
            onClick={addUrlToBatch}
            className={styles.addUrlButton}
          >
            Add URL
          </button>
        </div>
        <FileDropzone onFilesAdded={addLocalFileToBatch} setFiles={setFiles} />

        {(files.length > 0 || resourceLinks.length > 0) && (
          <div className={styles.fileListContainer}>
            <h3 className={styles.fileListTitle}>Selected Files:</h3>
            <FileList
              localFiles={files}
              resourceLinks={resourceLinks}
              setLocalFiles={setFiles}
              setResourceLinks={setResourceLinks}
            />
          </div>
        )}

        <div className={styles.modalButtons}>
          <button type="submit" className={styles.submitButton}>
            Add Documents to Bundle
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
