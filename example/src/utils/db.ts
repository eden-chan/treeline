import { init, tx, id } from '@instantdb/react';
import type { IHighlight, NewHighlight, ScaledPosition, Content } from "../react-pdf-highlighter";

type Schema = {
    highlights: IHighlight
}

export const db = init<Schema>({ appId: import.meta.env.VITE_INSTANTDB_APP_ID ?? '' });

export const addHighlight = (highlight: NewHighlight) => {
    db.transact(
        tx.highlights[id()].update({
            ...highlight,
        })
    )
};

export const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
) => {
    db.transact(tx.highlights[highlightId].update({ position, content }))
};