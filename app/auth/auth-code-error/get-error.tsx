"use client";
import { useEffect, useState } from "react";

export default function GetError() {
  // const [error, setError] = useState<null | string>(null)
  const [errorCode, setErrorCode] = useState<null | string>(null);
  const [errorDescription, setErrorDescription] = useState<null | string>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.substring(1));

    // Extract the individual parameters
    // setError(searchParams.get("error"));
    setErrorCode(searchParams.get("error_code"));
    setErrorDescription(searchParams.get("error_description"));
  }, []);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        {/* <p className="text-sm text-muted-foreground">Error: {error}</p> */}
        <h1 className="text-2xl font-semibold tracking-tight">
          Error {errorCode}: {errorDescription}
        </h1>
        <h1 className="text-sm text-muted-foreground">
          A common cause of log-in errors is that your email is not whitelisted to sign into the site. Contact an HSHS
          Admin and ensure your email is on the whitelist.
        </h1>
      </div>
    </div>
  );
}
