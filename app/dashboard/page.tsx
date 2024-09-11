import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";


export default async function Component() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) redirect("/");
  return <StreamView creatorId={session?.user.id} playVideo={true} />;
}
