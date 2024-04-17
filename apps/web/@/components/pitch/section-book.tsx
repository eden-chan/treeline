import { CalEmbed } from "@/components/ui/cal-embed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SectionBook() {
  return (
    <div className="min-h-screen relative w-screen">
      <div className="absolute left-4 right-4 md:left-8 md:right-8 top-4 flex justify-between text-lg">
        <span>Book a meeting</span>
        <Link href="https://app.MySpace.ai">
          <Button variant="outline">Sign up</Button>
        </Link>
      </div>
      <div className="flex flex-col min-h-screen justify-center container">
        <div className="h-[400px] md:h-[600px] px-4 md:px-0 text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl">Contact us</h2>
          <a href="mailto:support@/components.ai">support@/components.ai</a>
        </div>

        <div className="flex justify-center mt-10 md:mt-0">
          <a href="https://git.new/MySpace" target="_blank" rel="noreferrer">
            <Button variant="outline" className="font-normal">
              Proudly Open Source
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
