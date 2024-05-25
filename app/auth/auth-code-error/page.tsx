import GetError from "./get-error";

export default function ErrorPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center"></div>
      {/* // Create client component that calls useSearchParams to get error code/description from the URL (since useSearchParams can only be used on client components) */}
      <GetError></GetError>
    </div>
  );
}
