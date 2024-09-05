"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, Share2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
//@ts-ignore
import YouTubePlayer from "youtube-player";

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function Component() {
  const [inputLink, setInputLink] = useState("");
  const [previewId, setPreviewId] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>();
  const { toast } = useToast();

  async function refreshStreams() {
    const res = await fetch(`/api/streams/myStreams`, {
      credentials: "include",
    });
    const json = await res.json();
    console.log(json);
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (!videoPlayerRef.current) {
      return;
    }
    let player = YouTubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo?.extractedId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: any) {
      console.log(event);
      console.log(event.data);
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/streams/", {
      method: "POST",
      body: JSON.stringify({
        creatorId,
        url: inputLink,
      }),
    });
    setQueue([...queue, await res.json()]);
    setLoading(false);
    setInputLink("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(e.target.value);
    const videoId = extractVideoId(e.target.value);
    setPreviewId(videoId || "");
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );
  };

  const playNext = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "The page URL has been copied to your clipboard.",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy the link. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-fuchsia-900">
      <div className="flex flex-col min-h-screen bg-gray-900 bg-opacity-50 text-gray-100">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center text-fuchsia-300">
              Song Voting Queue
            </h1>
            <Button
              onClick={handleShare}
              className="bg-gray-800 text-purple-300 hover:bg-gray-700 hover:text-purple-200"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">
                Add a Song
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  value={inputLink}
                  onChange={handleInputChange}
                  placeholder="Paste YouTube video link"
                  className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add to Queue
                </Button>
              </form>
              {previewId && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-purple-300">
                    Preview
                  </h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${previewId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-9">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Now Playing
            </h2>
            <div className="aspect-w-16 aspect-h-30">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-40 rounded-lg"
              ></iframe>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-10 mb-5">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Upcoming Songs
            </h2>
            <div className="space-y-4">
              {queue.map((video) => (
                <Card key={video.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="flex items-center space-x-4 p-4">
                    <Image
                      src={video.smallImageUrl}
                      alt={`Thumbnail for ${video.title}`}
                      width={120}
                      height={90}
                      className="rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-fuchsia-300">
                        {video.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(video.id, true)}
                          className="bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-500"
                        >
                          <ThumbsUp className="h-4 w-4 text-purple-300" />
                        </Button>
                        <span className="text-sm font-semibold text-purple-300">
                          {video.upvotes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
