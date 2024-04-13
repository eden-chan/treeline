"use client";

import { AnnotatedPdf } from "@prisma/client";
import { Suspense, useState } from "react";
import { useMemo, memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { PaperCard } from "@src/components/paper-card";
import { useRouter } from "next/navigation";

const Timeline = memo(({ articles }: { articles: AnnotatedPdf[] }) => {
  const [highlightedCardId, setHighlightedCardId] = useState(null);
  const router = useRouter();
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

  const handleClick = (cardId) => {
    setHighlightedCardId(cardId);
  };

  return (
    <main>
      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memoizedArticles.map((article, index) => (
            <article key={index} className="mb-6">
              <PaperCard
                link={`/pdf?url=${article.source}`}
                description={article.highlights[0]?.content?.text}
                timeAgoCalculation={article.timeAgoCalculation}
                title={article.highlights[0]?.content?.text.slice(0, 50)}
                highlightCount={article.highlights.length}
                isHighlighted={
                  highlightedCardId === article.highlights[0]?.content?.text
                }
                onClick={() =>
                  handleClick(article.highlights[0]?.content?.text)
                }
                onDoubleClick={() => {
                  router.push(`/pdf?url=${article.source}`);
                }}
              />
            </article>
          ))}
        </div>
      </Suspense>
    </main>
  );
});

export default Timeline;
