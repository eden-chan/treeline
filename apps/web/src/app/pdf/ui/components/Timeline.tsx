import Link from 'next/link';

import { highlights } from '@prisma/client';
import { Suspense } from 'react';

import { useMemo } from 'react';

import { memo } from 'react';


const Timeline = memo(({ articles }: { articles: highlights[] }) => {
    const memoizedArticles = useMemo(() => articles.map((article) => {
        const timeAgoCalculation = (() => {
            const timeAgo = (new Date().getTime() - new Date(article.highlights[0]?.timestamp || new Date()).getTime()) / 1000;
            if (timeAgo < 3600) {
                return `${Math.round(timeAgo / 60)} minutes ago`;
            } else if (timeAgo < 86400) {
                return `${Math.round(timeAgo / 3600)} hours ago`;
            } else {
                return `${Math.round(timeAgo / 86400)} days ago`;
            }
        })();
        return { ...article, timeAgoCalculation };
    }), [articles]);

    return (
        <main>
            <Suspense fallback={<h1>🌀 Loading...</h1>}>
                {memoizedArticles.map((article, index) => (
                    <article key={index} className="mb-6">
                        <Link href={`/pdf?url=${article.source}`}>

                            <h2 className="text-xl font-semibold mb-1">{article.highlights[0]?.content?.text.slice(0, 200)} </h2>
                            <p className="text-gray-600 mb-2">{article.source}</p>
                            <p className="text-gray-600 mb-2">{article.highlights.length} highlights</p>
                            <p className="text-gray-500">{article.highlights[0]?.content?.text}</p>
                            <p className="text-gray-400 text-sm mt-2">
                                — {article.userId} / {article.timeAgoCalculation}
                            </p>

                        </Link>
                    </article>
                ))}
            </Suspense>
        </main>
    )
})
export default Timeline