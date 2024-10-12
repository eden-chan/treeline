import { InitialConfigType } from '@lexical/react/LexicalComposer';

export const createConfig = ({
  namespace,
  editable = true,
}: {
  namespace: string;
  editable?: boolean;
}): InitialConfigType => {
  return {
    namespace,
    theme: {},
    onError: (e: Error) => console.error(e),
    nodes: [LinkNode, MentionNode],
    editorState: () => {
      const paragraph = $createParagraphNode();
      const text = $createTextNode(treeNode.object.text);
      paragraph.append(text);
      $getRoot().append(paragraph);
    },
    editable,
  };
};
