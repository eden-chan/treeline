import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  type EditorState,
} from "lexical";

export const AutosavePlugin = ({
  onBlur,
}: { onBlur: (editorState: EditorState) => void }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        console.log("AutosavePlugin BLUR_COMMAND");
        onBlur(editor.getEditorState());
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor, onBlur]);

  return null;
};
