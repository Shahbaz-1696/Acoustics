// import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";

const creatorId = "91cf1cf2-9da3-4f28-b9c5-cb22ccd88aaf";

export default async function Component() {
  // const session = await getServerSession();
  return <StreamView creatorId={creatorId} playVideo={true} />;
}
