import { ClerkSignedInComponent } from './ClerkSignedInComponent';
import { ClerkSignedOutComponent } from './ClerkSignedOutComponent';
import treeline from './treeline.png';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import styles from './Sidebar.module.css';
import { HighlightType } from "./utils/highlightTypes";
import { addDocument, ANONYMOUS_USER_ID, MAIN_ROOM_ID } from './utils/dbUtils';
import type { Document, DocumentWithHighlightsAndComments, HighlightResponseType, HighlightResponseTypeWithComments } from './utils/dbUtils';
import Chat from './TypingIndicator';
import type { User } from '@instantdb/react';



interface Props {
  documents: Document[];
  resetHighlights: () => void;
  toggleDocument: (newDocument: Document) => void;
  selectedHighlightTypes: HighlightType[];
  setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
  currentUser: User | null;
  currentUserColor: string;
  currentDocument?: DocumentWithHighlightsAndComments;
}

const updateHash = (highlight: HighlightResponseType) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const CreateDocumentForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    addDocument({ name, sourceUrl });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Document Name" />
      <input type="url" name="sourceUrl" placeholder="PDF URL" />
      <button type="submit">Create Document</button>
    </form>
  )
}

const DocumentList = ({ documents, toggleDocument }: { documents: Document[], toggleDocument: (doc: Document) => void }) => {
  if (!documents || documents.length === 0) return <div>No documents found</div>;

  return (
    <ul className={styles.documentList}>
      {documents.map((doc: Document) => (
        <li key={doc.id} className={styles.documentItem}>
          <button
            type="button"
            onClick={() => toggleDocument(doc)}
            className={styles.documentButton}
          >
            {doc.name}
          </button>
          <a
            href={doc.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.documentLink}
          >
            View PDF
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar({
  documents,
  toggleDocument,
  resetHighlights,
  selectedHighlightTypes,
  setSelectedHighlightTypes,
  currentUser,
  currentUserColor,
  currentDocument,
}: Props) {

  const highlights: HighlightResponseTypeWithComments[] | undefined = currentDocument?.highlights

  const handleFilterChange = (type: HighlightType) => {
    setSelectedHighlightTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };


  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            Treeline
            <img src={treeline} alt="Treeline" className={styles.logo} />
          </div>
          <div style={{ fontSize: "0.7rem" }}>
            <a href="https://github.com/eden-chan/treeline">
              Open in GitHub
            </a>
          </div>
          <DocumentList documents={documents} toggleDocument={toggleDocument} />
          <CreateDocumentForm />


          <div>
            <small>
              To create area highlight hold ⌥ Option key (Alt), then click and
              drag. Try opening this in another tab, or ask a friend to join you!
            </small>

            <div className={styles.legend}>
              <h3>Highlight Legend</h3>
              {Object.values(HighlightType).map(type => (
                <div key={type} className={styles.legendItem}>
                  <input
                    type="checkbox"
                    id={`filter-${type}`}
                    checked={selectedHighlightTypes.includes(type)}
                    onChange={() => handleFilterChange(type)}
                  />
                  <div className={`${styles.legendColor} ${styles[type]}`} />
                  <label htmlFor={`filter-${type}`} className={styles.legendText}>
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SignedOut>
          <ClerkSignedOutComponent />
        </SignedOut>
        <SignedIn>
          <ClerkSignedInComponent />
        </SignedIn>

        <ul className={styles.highlightsList}>
          {highlights?.map((highlight) => (
            <li
              key={highlight.id}
              className={styles.highlightItem}
              onClick={() => {
                updateHash(highlight);
              }}
            >

              <div>
                {/* <strong>{highlight.comments?.[0]?.text} </strong> */}
                {highlight.content.text ? (
                  <blockquote className={styles.highlightQuote}>
                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                  </blockquote>
                ) : null}
                {highlight.content.image ? (
                  <div className={styles.highlightImage}>
                    <img src={highlight.content.image} alt={"Screenshot"} />
                  </div>
                ) : null}
                <div>

                  {highlight.comments?.map((comment) => (
                    <div key={comment.id}>
                      {comment.text}
                    </div>
                  ))}

                </div>


              </div>
              <div className={styles.highlightInfo}>
                Author: {highlight.userName} | Page: {highlight.position.pageNumber}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.buttonContainer}>
          {highlights && highlights.length > 0 && (
            <button type="button" onClick={resetHighlights}>
              Reset highlights
            </button>
          )}
        </div>
      </div>
      <div className={styles.chatContainer}>
        <Chat
          roomId={MAIN_ROOM_ID}
          username={currentUser?.email ?? ANONYMOUS_USER_ID}
          color={currentUserColor}


        />
      </div>
    </div>
  );
}