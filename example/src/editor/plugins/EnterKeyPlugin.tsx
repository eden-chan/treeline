import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_NORMAL,
  type EditorState,
  KEY_ENTER_COMMAND,
} from "lexical";

import { useEffect } from "react";

/**
 * Plugin to split nodes when enter is pressed. Also handles exiting temporary edit mode.
 */
export const EnterKeyPlugin = ({
  onEnter,
}: { onEnter: (editorState: EditorState) => void }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event) return false;
        if (event.shiftKey) return false;

        event.preventDefault();
        event.stopPropagation();
        onEnter(editor.getEditorState());

        // return true;
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor, onEnter]);

  return null;
};
