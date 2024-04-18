import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description: string;
        timeAgoCalculation: string;
        highlightCount: number;
        isHighlighted: boolean;
        category?: string;
        onClick: () => void;
        onDoubleClick: () => void;
    }[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <div
                    key={`paper-card-${idx}`}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={item.onClick}
                    onDoubleClick={item.onDoubleClick}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card className={`${item.isHighlighted ? "outline outline-2 outline-primary" : ""}`}>
                        <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 space-y-0 relative flex-shrink-0 group-hover:cursor-pointer">
                            <div className="space-y-1">
                                <CardTitle>{item.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow py-4 group-hover:cursor-pointer">
                            <p className="line-clamp-4">{item.description}</p>
                        </CardContent>
                        <div className="flex space-x-4 text-sm text-muted-foreground px-4 pb-4 group-hover:cursor-pointer">
                            <div className="flex items-center">
                                <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                                {item.category}
                            </div>
                            <div className="flex items-center">
                                <StarIcon className="mr-1 h-3 w-3" />
                                {item.highlightCount}
                            </div>
                            <div>Updated {item.timeAgoCalculation}</div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};