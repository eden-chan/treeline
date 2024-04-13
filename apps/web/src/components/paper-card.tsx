"use client";

import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export function PaperCard({
  description,
  title,
  timeAgoCalculation,
  highlightCount,
  link,
  isHighlighted,
  onClick,
  onDoubleClick,
}) {
  const router = useRouter();

  return (
    <Card
      className={`flex flex-col min-h-[300px] ${isHighlighted ? "outline outline-2 outline-primary" : ""
        } group group-hover:cursor-pointer`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 space-y-0 relative flex-shrink-0 group-hover:cursor-pointer">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-4 group-hover:cursor-pointer">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <div className="flex space-x-4 text-sm text-muted-foreground px-4 pb-4 group-hover:cursor-pointer">
        <div className="flex items-center">
          <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
          Machine Learning
        </div>
        <div className="flex items-center">
          <StarIcon className="mr-1 h-3 w-3" />
          {highlightCount}
        </div>
        <div>Updated {timeAgoCalculation}</div>
      </div>
    </Card>
  );
}
