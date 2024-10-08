import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
// @ts-ignore
import youtubeSearchApi from "youtube-search-api";
import { YT_REGEX } from "@/lib/utils";
import { getServerSession } from "next-auth";

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(), // make it more stricter
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYoutube = data.url.match(YT_REGEX);

    if (!isYoutube) {
      return NextResponse.json(
        {
          message: "Wrong URL format",
        },
        {
          status: 411,
        }
      );
    }

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

    const extractedId = data.url.split("?v=")[1];

    const res = await youtubeSearchApi.GetVideoDetails(extractedId);
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await db.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "Can't find video",
        smallImageUrl:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZGXRdeQ1LRwqAOxE-PJSbCN4KjGBpxUiZ9w&s",
        bigImageUrl:
          thumbnails[thumbnails.length - 1].url ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZGXRdeQ1LRwqAOxE-PJSbCN4KjGBpxUiZ9w&s",
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const creatorId = searchParams.get("creatorId");
  const session = await getServerSession();

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

  if (!creatorId) {
    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 411,
      }
    );
  }
  const [streams, activeStream] = await Promise.all([
    db.stream.findMany({
      where: {
        userId: creatorId,
        played: false,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: user.id,
          },
        },
      },
    }),
    db.currentStream.findFirst({
      where: {
        userId: creatorId,
      },
      include: {
        stream: true,
      },
    }),
  ]);

  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
    activeStream,
  });
}
