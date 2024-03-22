import Tree from "../components/tree";
import PDFViewer from "../components/pdf-viewer";

export default function Page(): JSX.Element {
  return (
    <main className="h-screen w-screen grid grid-cols-2 gap-0">
      <PDFViewer />
      <Tree />
    </main>
  );
}
