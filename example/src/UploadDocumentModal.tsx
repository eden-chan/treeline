import { UploadDocumentForm } from "./components/UploadDocumentForm";
import { Modal } from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocumentModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Document">
      <UploadDocumentForm onClose={onClose} />
    </Modal>
  );
};
