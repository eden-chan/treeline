import type { BundleWithDocuments } from '../utils/dbUtils';

type BundleListProps = {
    bundlesWithDocuments: BundleWithDocuments[];
};

export function BundleList({ bundlesWithDocuments: bundles }: BundleListProps) {
    return (
        <ul>
            {bundles.map((bundle) => (
                <li key={bundle.id}>
                    <span>{bundle.name}</span>
                    {bundle.description && <span> - {bundle.description}</span>}
                    {bundle.documents && bundle.documents.length > 0 && (
                        <div>
                            <span>Linked documents:</span>
                            <ul>
                                {bundle.documents.map((doc) => {
                                    return doc ? (
                                        <li key={doc.id}>{doc.name}</li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}