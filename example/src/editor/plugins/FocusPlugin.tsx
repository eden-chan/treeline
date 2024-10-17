import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
export const FocusPlugin = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const rootElement = editor.getRootElement();
		if (rootElement) {
			rootElement.focus(); // Focus the root element
		}
	}, [editor]);

	return null;
};
