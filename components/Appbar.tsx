"use client";
import { Music } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

const Appbar = () => {
  const session = useSession();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 bg-gray-900/50 w-full">
      <Link className="flex items-center justify-center" href="/">
        <Music className="h-6 w-6 mr-2 text-fuchsia-400" />
        <span className="font-bold text-fuchsia-400">Acoustics</span>
      </Link>
      <nav className="flex gap-4 sm:gap-6 mt-2 ml-auto p-2">
        <Link
          className="text-sm font-medium hover:text-fuchsia-400 transition-colors mt-2"
          href="#"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:text-fuchsia-400 transition-colors mt-2"
          href="#"
        >
          Pricing
        </Link>
        {session.data?.user && (
          <Button className="bg-blue-400" onClick={() => signOut()}>
            Logout
          </Button>
        )}
        {!session.data?.user && (
          <Button onClick={() => signIn()} className="bg-blue-400">
            Signin
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Appbar;
