import React, { useState } from "react";
import { addDocument } from "../utils/dbUtils";
import FileDropzone from "./FileDropzone";
import { FileList } from "./FileList";
import type { CreateDocumentDraft } from "../react-pdf-highlighter";
import styles from "./UploadDocumentForm.module.css";
import { useToast } from "../context/ToastContext";

interface Props {
  onClose: () => void;
}

// Move these functions outside the component
export const fetchPDF = async (link: CreateDocumentDraft) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/get-hosted-pdf-url?url=${encodeURIComponent(link.sourceUrl)}`,
    );
    const data = await response.json();
    if (data.url) {
      const hostedUrl = new URL(data.url);
      const url = `${hostedUrl.origin}${hostedUrl.pathname}`;
      return addDocument({
        name: link.name,
        sourceUrl: url,
      });
    } else {
      console.error("Error getting hosted URL:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error processing link:", link.sourceUrl, error);
    return null;
  }
};

export const uploadFileByLink = async (file: { name: string; url: string }) => {
  try {
    const hostedUrl = new URL(file.url);
    const url = `${hostedUrl.origin}${hostedUrl.pathname}`;
    return addDocument({
      name: file.name,
      sourceUrl: url,
    });
  } catch (error) {
    console.error("Error uploading file:", file.name, error);
    return null;
  }
};

export const uploadLocalFiles = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/upload-files`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Promise.all(data.files.map(uploadFileByLink));
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  }
};

export const UploadDocumentForm: React.FC<Props> = ({ onClose }) => {
  const { addToast } = useToast();

  const onUpload = () => {
    console.log("onUpload");
    addToast({
      message: "Uploading documents...",
      type: "info",
      duration: 2000,
    });
  };

  const onError = () => {
    addToast({
      message: "Unable to upload document",
      type: "error",
      duration: 2000,
    });
  };

  const onSuccess = () => {
    addToast({
      message: "Document successfully added!",
      type: "success",
      duration: 2000,
    });
  };

  const [name, setName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<CreateDocumentDraft[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();

    onUpload();
    const fetchPDFPromises = resourceLinks.map(fetchPDF);
    const uploadFilesPromise = uploadLocalFiles(files);

    try {
      const results = await Promise.all([
        ...fetchPDFPromises,
        uploadFilesPromise,
      ]);
      const resultingUploads = results.flat().filter(Boolean);

      if (resultingUploads.length > 0) {
        onSuccess();
      } else {
        onError();
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      onError();
    }

    // Reset form state
    setName("");
    setUrlInput("");
    setResourceLinks([]);
    setFiles([]);
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

  return (
    <form onSubmit={handleSubmit} className={styles.uploadForm}>
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
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};
