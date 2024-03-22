/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XDRzC3xKQnY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 space-y-4">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <Link className="flex space-x-2 font-bold" href="#">
            <span>My</span>
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 via-red-500 bg-clip-text text-transparent">
              /Space
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <UserButton />
            <Link
              className="inline-block text-sm font-semibold rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:text-white"
              href="#"
            >
              Sign in
            </Link>
            <Link
              className="inline-block text-sm font-semibold rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:text-white"
              href="#"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="container flex flex-col items-center justify-center gap-4 px-4 mx-auto text-center lg:px-6 lg:gap-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your PDF. Your Space.
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Annotate, highlight, and collaborate with your team in a secure
              and interactive PDF viewer.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm gap-2 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:text-white"
              href="#"
            >
              Get started with My/Space
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <img
            alt="Hero"
            className="inset-x-0 top-0 mx-auto rounded-t-xl object-cover aspect-[16/9] overflow-hidden"
            height="200"
            src="/placeholder.svg"
            width="375"
          />
        </section>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Annotate and Collaborate
              </h2>
              <p className="mx-auto max-w-3xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Add comments, highlight text, and draw shapes on your PDFs.
                Share feedback with your team.
              </p>
            </div>
            <img
              alt="Annotate and Collaborate"
              className="inset-x-0 top-0 mx-auto rounded-xl object-cover aspect-[16/9] overflow-hidden"
              height="450"
              src="/placeholder.svg"
              width="800"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
