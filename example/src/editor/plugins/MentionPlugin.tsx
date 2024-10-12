/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import styles from './MentionPlugin.module.css';

import { $createMentionNode } from '../nodes/MentionNode';
import { useBundleContext } from '../../context/BundleContext';
import type { Document } from '../../utils/dbUtils';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;

const DocumentMentionsRegex = {
    NAME,
    PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = `[^${TRIGGERS}${PUNC}\\s]`;

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS = `(?:\\.[ |$]| |[${PUNC}]|)` // E.g. "r. " in "Mr. Smith"
')';

const LENGTH_LIMIT = 75;
const AtSignMentionsRegex = new RegExp(
    `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}}))$`
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
    `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}${VALID_JOINS}){0,${ALIAS_LENGTH_LIMIT}}))$`,
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map<string, Array<LookupServiceResult>>();



const searchService = {
    search(string: string, data: Array<LookupServiceResult>, callback: (results: Array<LookupServiceResult>) => void): void {

        const results = data.filter((mention: LookupServiceResult) =>
            mention.name.toLowerCase().includes(string.toLowerCase()),
        );
        callback(results);

    },
};


type LookupServiceResult = {
    id: string;
    name: string;
};

function useMentionLookupService(mentionString: string | null, candidateTexts: Array<LookupServiceResult>): Array<LookupServiceResult> {
    const [results, setResults] = useState<Array<LookupServiceResult>>([]);

    useEffect(() => {
        const cachedResults = mentionsCache.get(mentionString ?? '');

        if (mentionString == null) {
            setResults([]);
            return;
        }

        if (cachedResults === null) {
            return;
        }

        if (cachedResults !== undefined) {
            setResults(cachedResults);
            return;
        }

        mentionsCache.set(mentionString ?? '', []);
        searchService.search(mentionString, candidateTexts, (newResults) => {
            mentionsCache.set(mentionString ?? '', newResults);
            setResults(newResults);
        });
    }, [mentionString, candidateTexts]);

    return results;
}

function checkForAtSignMentions(
    text: string,
    minMatchLength: number,
): MenuTextMatch | null {
    let match = AtSignMentionsRegex.exec(text);

    if (match === null) {
        match = AtSignMentionsRegexAliasRegex.exec(text);
    }
    if (match !== null) {
        // The strategy ignores leading whitespace but we need to know it's
        // length to add it to the leadOffset
        const maybeLeadingWhitespace = match[1];

        const matchingString = match[3];
        if (matchingString.length >= minMatchLength) {
            return {
                leadOffset: match.index + maybeLeadingWhitespace.length,
                matchingString,
                replaceableString: match[2],
            };
        }
    }
    return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
    return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
    name: string;
    id: string;


    constructor(name: string, id: string) {
        super(id);
        this.name = name;
        this.id = id;

    }
}

function MentionsTypeaheadMenuItem({
    isSelected,
    onClick,
    onMouseEnter,
    option,
}: {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: MentionTypeaheadOption;
}) {
    let className = styles.item;
    if (isSelected) {
        className += ` ${styles.selected}`;
    }
    return (
        <li
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // onClick();
                }
            }}
            key={option.id}
            tabIndex={-1}
            className={className}
            ref={option.setRefElement}
            aria-selected={isSelected}
            id={`typeahead-item-${option.id}`}
            onMouseEnter={onMouseEnter}
            onClick={onClick}>
            <i className={`${styles.icon} icon user`} />
            <span className={styles.text}>{option.name}</span>
        </li>
    );
}

export default function MentionPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const { bundlesWithDocuments } = useBundleContext();
    const [queryString, setQueryString] = useState<string | null>(null);

    const candidateTexts: Array<LookupServiceResult> = useMemo(() => {
        return bundlesWithDocuments.flatMap(bundle =>
            bundle.documents.map((doc: Document) => ({ id: doc.id, name: doc.name }))
        );
    }, [bundlesWithDocuments]);

    const results: Array<LookupServiceResult> = useMentionLookupService(queryString, candidateTexts);

    const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });

    const options: Array<MentionTypeaheadOption> = useMemo(
        () =>
            results
                .map(
                    (result) =>
                        new MentionTypeaheadOption(result.name, result.id),
                )
                .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
        [results],
    );

    const onSelectOption = useCallback(
        (
            selectedOption: MentionTypeaheadOption,
            nodeToReplace: TextNode | null,
            closeMenu: () => void,
        ) => {
            editor.update(() => {
                const mentionNode = $createMentionNode(selectedOption.name);
                if (nodeToReplace) {
                    nodeToReplace.replace(mentionNode);
                }
                mentionNode.select();
                closeMenu();
            });
        },
        [editor],
    );

    const checkForMentionMatch = useCallback(
        (text: string) => {
            const slashMatch = checkForSlashTriggerMatch(text, editor);
            if (slashMatch !== null) {
                return null;
            }
            return getPossibleQueryMatch(text);
        },
        [checkForSlashTriggerMatch, editor],
    );

    return (
        <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForMentionMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
            ) =>
                anchorElementRef.current && results.length
                    ? ReactDOM.createPortal(
                        <div className={`${styles.typeaheadPopover} ${styles.mentionsMenu}`}>
                            <ul>
                                {options.map((option, i: number) => (
                                    <MentionsTypeaheadMenuItem
                                        index={i}
                                        isSelected={selectedIndex === i}
                                        onClick={() => {
                                            setHighlightedIndex(i);
                                            selectOptionAndCleanUp(option);
                                        }}
                                        onMouseEnter={() => {
                                            setHighlightedIndex(i);
                                        }}
                                        key={option.id}
                                        option={option}
                                    />
                                ))}
                            </ul>
                        </div>,
                        anchorElementRef.current,
                    )
                    : null
            }
        />
    );
}
