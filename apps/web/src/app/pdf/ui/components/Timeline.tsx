import Link from 'next/link';
import { PDFHighlights } from '../types';

export default function Timeline({ articles }: { articles: PDFHighlights[] }) {
    return (
        <main>
            {articles.map((article, index) => (
                <article key={index} className="mb-6">
                    <Link href={`/pdf?url=${article.source}`}>

                        <h2 className="text-xl font-semibold mb-1">{article.userId}</h2>
                        <p className="text-gray-600 mb-2">{article.source}</p>
                        <p className="text-gray-500">{article.highlights[0]?.content?.text || 'image'}</p>
                        <p className="text-gray-400 text-sm mt-2">
                            — {article.source} / {article.userId}
                        </p>

                    </Link>
                </article>
            ))}
        </main>
    )
}