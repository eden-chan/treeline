import { UploadDocumentForm } from "./components/UploadDocumentForm";
import { Modal } from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
  onUpload: () => void;
}

export const UploadDocumentModal = ({ isOpen, onClose, onSuccess, onError, onUpload }: Props) => {
  return <Modal isOpen={isOpen} onClose={onClose} title="Create Document">
    <UploadDocumentForm onClose={onClose} onSuccess={onSuccess} onError={onError} onUpload={onUpload} />
  </Modal>
}