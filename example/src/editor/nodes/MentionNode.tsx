/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
    $applyNodeReplacement,
    $createRangeSelection,
    $setSelection,
    type DOMConversionMap,
    type DOMConversionOutput,
    type DOMExportOutput,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedTextNode,
    type Spread,
    TextNode,
} from 'lexical';

export type SerializedMentionNode = Spread<
    {
        mentionName: string;
        mentionId: string;
    },
    SerializedTextNode
>;

function $convertMentionElement(
    domNode: HTMLElement,
): DOMConversionOutput | null {
    const textContent = domNode.textContent;
    console.log('%cconvert mention element', 'color: red', domNode.getAttribute('data-lexical-mention-id'));
    if (textContent !== null) {
        console.log('%cconvert mention element', 'color: red', textContent);
        const node = $createMentionNode(textContent, domNode.getAttribute('data-lexical-mention-id') ?? '');
        return {
            node,
        };
    }

    return null;
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';
export class MentionNode extends TextNode {
    __mention: string;
    __mentionId: string;

    static getType(): string {
        return 'mention';
    }

    static clone(node: MentionNode): MentionNode {
        return new MentionNode(node.__mention, node.__mentionId, node.__text, node.__key);
    }
    static importJSON(serializedNode: SerializedMentionNode): MentionNode {
        const node = $createMentionNode(serializedNode.mentionName, serializedNode.mentionId);
        node.setTextContent(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }

    constructor(mentionName: string, mentionId: string, text?: string, key?: NodeKey) {
        super(text ?? mentionName, key);
        this.__mention = mentionName;
        this.__mentionId = mentionId;
    }

    exportJSON(): SerializedMentionNode {
        return {
            ...super.exportJSON(),
            mentionName: this.__mention,
            mentionId: this.__mentionId,
            type: 'mention',
            version: 1,
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.style.cssText = mentionStyle;
        dom.className = 'mention';
        return dom;
    }

    exportDOM(): DOMExportOutput {

        console.log('%cexport dom', 'color: red', this.__text);
        const element = document.createElement('span');
        element.setAttribute('data-lexical-mention', 'true');
        element.setAttribute('data-lexical-mention-id', this.__mentionId);
        element.textContent = this.__text;
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            span: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-mention')) {
                    return null;
                }
                return {
                    conversion: $convertMentionElement,
                    priority: 1,
                };
            },
        };
    }

    isTextEntity(): true {
        return true;
    }

    canInsertTextBefore(): boolean {
        return false;
    }

    canInsertTextAfter(): boolean {
        return false;
    }

    getTextContent(): string {
        // console.log('%cgetTextContent', 'color: green', this.__mention, 'mentionId:', this.__mentionId);
        return `@[${this.__mention}]<<${this.__mentionId}>>`;
    }
}

export function $createMentionNode(mentionName: string, mentionId: string): MentionNode {
    const mentionNode = new MentionNode(mentionName, mentionId);
    mentionNode.setMode('segmented').toggleDirectionless();
    // Set selection to the end of the new node
    const selection = $createRangeSelection();
    const nodeText = mentionNode.getTextContent();
    selection.focus.set(mentionNode.getKey(), nodeText.length, 'text');
    $setSelection(selection);
    console.log('%c set focus to end $createMentionNode', 'color: red', nodeText.length, nodeText);



    return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
    node: LexicalNode | null | undefined,
): node is MentionNode {
    return node instanceof MentionNode;
}
