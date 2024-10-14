import { useState, useRef, useEffect } from "react";
import styles from "./FileList.module.css";
import type { CreateDocumentDraft } from "../react-pdf-highlighter";

interface Props {
  localFiles: File[];
  resourceLinks: CreateDocumentDraft[];
  setLocalFiles: (files: File[]) => void;
  setResourceLinks: (links: CreateDocumentDraft[]) => void;
}

export const FileList: React.FC<Props> = ({
  localFiles,
  resourceLinks,
  setLocalFiles,
  setResourceLinks,
}) => {
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [editingFileName, setEditingFileName] = useState("");
  const [editingLinkName, setEditingLinkName] = useState("");
  const [editingLinkUrl, setEditingLinkUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFile !== null && fileInputRef.current) {
      fileInputRef.current.focus();
    }
    if (editingLink !== null && linkNameInputRef.current) {
      linkNameInputRef.current.focus();
    }
  }, [editingFile, editingLink]);

  const handleFileNameChange = (_: number, newName: string) => {
    setEditingFileName(newName);
  };

  const handleFileNameBlur = (index: number) => {
    if (editingFileName.trim() !== "") {
      const updatedFiles = localFiles.map((file, i) =>
        i === index
          ? new File([file], editingFileName.trim(), { type: file.type })
          : file,
      );
      setLocalFiles(updatedFiles);
    }
    setEditingFile(null);
  };

  const handleLinkNameChange = (newName: string) => {
    setEditingLinkName(newName);
  };

  const handleLinkUrlChange = (newUrl: string) => {
    setEditingLinkUrl(newUrl);
  };

  const handleLinkBlur = (index: number) => {
    if (editingLinkName.trim() !== "" && editingLinkUrl.trim() !== "") {
      const updatedLinks = resourceLinks.map((link, i) =>
        i === index
          ? {
              ...link,
              name: editingLinkName.trim(),
              sourceUrl: editingLinkUrl.trim(),
            }
          : link,
      );
      setResourceLinks(updatedLinks);
    }
    setEditingLink(null);
  };

  return (
    <ul className={styles.fileList}>
      {localFiles.map((file, index) => (
        <li key={file.name} className={styles.fileItem}>
          {editingFile === index ? (
            <input
              ref={fileInputRef}
              type="text"
              value={editingFileName}
              onChange={(e) => handleFileNameChange(index, e.target.value)}
              onBlur={() => handleFileNameBlur(index)}
            />
          ) : (
            <span
              className={styles.fileName}
              onClick={() => {
                setEditingFile(index);
                setEditingFileName(file.name);
              }}
            >
              {file.name}
            </span>
          )}
          <span className={styles.fileSize}>
            ({(file.size / 1024).toFixed(2)} KB)
          </span>
          <button
            type="button"
            onClick={() =>
              setLocalFiles(localFiles.filter((_, i) => i !== index))
            }
            className={styles.removeButton}
          >
            Remove
          </button>
        </li>
      ))}
      {resourceLinks.map((link, index) => (
        <li key={link.sourceUrl} className={styles.fileItem}>
          {editingLink === index ? (
            <>
              <input
                ref={linkNameInputRef}
                type="text"
                value={editingLinkName}
                onChange={(e) => handleLinkNameChange(e.target.value)}
                onBlur={() => handleLinkBlur(index)}
              />
              <input
                type="text"
                value={editingLinkUrl}
                onChange={(e) => handleLinkUrlChange(e.target.value)}
                onBlur={() => handleLinkBlur(index)}
              />
            </>
          ) : (
            <>
              <span
                className={styles.fileName}
                onClick={() => {
                  setEditingLink(index);
                  setEditingLinkName(link.name);
                  setEditingLinkUrl(link.sourceUrl);
                }}
              >
                {link.name}
              </span>
              <span
                className={styles.fileUrl}
                onClick={() => {
                  setEditingLink(index);
                  setEditingLinkName(link.name);
                  setEditingLinkUrl(link.sourceUrl);
                }}
              >
                {link.sourceUrl}
              </span>
            </>
          )}
          <button
            type="button"
            onClick={() =>
              setResourceLinks(resourceLinks.filter((_, i) => i !== index))
            }
            className={styles.removeButton}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};
