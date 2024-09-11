import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/dist/server/api-utils";

const creatorId = "91cf1cf2-9da3-4f28-b9c5-cb22ccd88aaf";

export default async function Component() {
  const session = await getServerSession(authOptions);
  
  return <StreamView creatorId={creatorId} playVideo={true} />;
}
