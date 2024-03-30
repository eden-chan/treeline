import Link from "next/link";

import { AnnotatedPdf } from "@prisma/client";
import { Suspense } from "react";

import { useMemo } from "react";

import { memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";

const Timeline = memo(({ articles }: { articles: AnnotatedPdf[] }) => {
  const memoizedArticles = useMemo(
    () =>
      articles.map((article) => {
        const timeAgoCalculation = calculateTimeAgo(
          article.highlights[0]?.timestamp,
        );
        return { ...article, timeAgoCalculation };
      }),
    [articles],
  );

  return (
    <main>
      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {memoizedArticles.map((article, index) => (
          <article key={index} className="mb-6">
            <Link href={`/pdf?url=${article.source}`}>
              {/* TODO: add LLM parsed data of the pdf */}
              <h2 className="text-xl font-semibold mb-1">
                {article.highlights[0]?.content?.text.slice(0, 50)}{" "}
              </h2>
              <p className="text-gray-600 mb-2">
                {" "}
                {article.timeAgoCalculation} {article.highlights.length}{" "}
                highlights
              </p>
              <p className="text-gray-500">
                {article.highlights[0]?.content?.text}
              </p>
              <p className="text-gray-400 text-sm mt-2">{article.userId}</p>
            </Link>
          </article>
        ))}
      </Suspense>
    </main>
  );
});
export default Timeline;

