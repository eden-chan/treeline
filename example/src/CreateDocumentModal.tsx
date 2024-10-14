// CreateDocumentModal.tsx
import { useState } from "react";
import styles from "./CreateDocumentModal.module.css";
import { addDocument } from "./utils/dbUtils";
import FileDropzone from "./components/FileDropzone";
import { FileList } from "./components/FileList";
import type { CreateDocumentDraft } from "./react-pdf-highlighter";
import { Modal } from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
  onUpload: () => void;
}

export const CreateDocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  onUpload,
}) => {
  const [name, setName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<CreateDocumentDraft[]>([]);

  const submitBatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fetchPDFs = async () => {
      for (const link of resourceLinks) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_SERVER_URL
            }/get-hosted-pdf-url?url=${encodeURIComponent(link.sourceUrl)}`
          );
          const data = await response.json();
          console.log(data);
          if (data.url) {
            console.log("hosted url", data.url);
            const hostedUrl = new URL(data.url);
            const url = `${hostedUrl.origin}${hostedUrl.pathname}`;
            addDocument({
              name: link.name,
              sourceUrl: url,
            });
          } else {
            console.error("Error getting hosted URL:", data.error);
          }
        } catch (error) {
          console.error("Error processing link:", link.sourceUrl, error);
        }
      }
    };

    const uploadFiles = async () => {
      onUpload();
      try {
        const formData = new FormData();
        files.forEach((file, _) => {
          console.log("uploading file", file);
          formData.append("files", file);
        });

        console.log("uploading files", formData);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/upload-files`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("upload files", data);

        if (data.files) {
          for (const file of data.files) {
            try {
              const hostedUrl = new URL(file.url);
              const url = `${hostedUrl.origin}${hostedUrl.pathname}`;
              console.log("hosted url", url);
              addDocument({
                name: file.name,
                sourceUrl: url,
              });
              onClose();
            } catch (error) {
              console.error("Error uploading file:", file.name, error);
              onError();
            }
          }
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        onError();
      }
    };

    onClose();
    await fetchPDFs();
    await uploadFiles();

    // Upload succeeded, now reset
    setName("");
    setUrlInput("");
    setResourceLinks([]);
    setFiles([]);
    onSuccess();
  };

  const addLocalFileToBatch = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.name === newFile.name && prevFile.size === newFile.size
          )
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const addUrlToBatch = () => {
    if (urlInput) {
      // Create a new File object from the URL
      setResourceLinks([...resourceLinks, { name, sourceUrl: urlInput }]);
      setUrlInput("");
      setName("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Document">
      <form onSubmit={submitBatch} className={styles.createDocumentForm}>
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
            Upload
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
};
