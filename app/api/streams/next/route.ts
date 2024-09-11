import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  // TODO: you can get rid of db call here
  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  const user = await db.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  const mostUpvotedStream = await db.stream.findFirst({
    where: {
      userId: user.id,
      played: false,
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  await Promise.all([
    db.currentStream.upsert({
      where: {
        userId: user.id,
      },
      update: {
        userId: user.id,
        streamId: mostUpvotedStream?.id,
      },
      create: {
        userId: user.id,
        streamId: mostUpvotedStream?.id,
      },
    }),
    db.stream.update({
      where: {
        id: mostUpvotedStream?.id ?? "",
      },
      data: {
        played: true,
        playedTimeStamp: new Date(),
      },
    }),
  ]);

  return NextResponse.json({
    stream: mostUpvotedStream,
  });
}
