"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Appbar = () => {
  const session = useSession();
  return (
    <div>
      <div className="flex justify-between">
        <div>Acoustics</div>
        <div>
          {session.data?.user && (
            <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>
              Logout
            </button>
          )}
          {!session.data?.user && (
            <button onClick={() => signIn()} className="m-2 p-2 bg-blue-400">
              Signin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appbar;
