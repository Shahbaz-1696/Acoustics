"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Play, Share2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Image from "next/image";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YT_REGEX } from "../lib/utils";
import Appbar from "../components/Appbar";

interface Video {
  id: string;
  type: string;
  url: string;
  title: string;
  smallImageUrl: string;
  bigImageUrl: string;
  extractedId: string;
  active: boolean;
  userId: string;
  upvotes: number;
  downvotes: number;
  haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [playNextLoader, setPlayNextLoader] = useState(false);

  const refreshStreams = async () => {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
      credentials: "include",
    });
    const json = await res.json();
    setQueue(
      json.streams.sort((a: any, b: any) => (a.upvotes < b.upvotes ? 1 : -1))
    );
    setCurrentVideo(json.activeStream.stream);
  };

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);

  useEffect(() => {
    setQueue(
      [...queue].sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      )
    );
  }, [queue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
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
  };

  const playNext = async () => {
    if (queue.length > 0) {
      try {
        setPlayNextLoader(true);
        const data = await fetch(`/api/streams/nextAudio`, {
          method: "GET",
        });
        const json = await data.json();
        setCurrentVideo(json.activeStream);
      } catch (error) {
        console.log(error);
      }
      setPlayNextLoader(false);
    }
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );

    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast.success("Link copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-fuchsia-900">
      <Appbar />
      <div className="flex flex-col min-h-screen bg-gray-900 bg-opacity-50 text-gray-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-fuchsia-300">
              Song Voting Queue
            </h1>
            <Button
              onClick={handleShare}
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-fuchsia-500 text-fuchsia-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1">
            <div className="flex flex-col gap-8 mb-8 mr-8">
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
                </form>
                {inputLink && inputLink.match(YT_REGEX) && !loading && (
                  <Card className="bg-gray-900 border-gray800 space-y-4 mt-5">
                    <CardContent className="p-4">
                      <LiteYouTubeEmbed
                        title=""
                        id={inputLink.split("?v=")[1]}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Add to Queue"}
              </Button>

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">
                  Now Playing
                </h2>
                <Card className="aspect-w-16 aspect-h-9 bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    {currentVideo ? (
                      <div>
                        {playVideo ? (
                          <>
                            <iframe
                              width={"100%"}
                              height={300}
                              allow="autoplay"
                              src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                            ></iframe>
                          </>
                        ) : (
                          <>
                            <img
                              src={currentVideo.bigImageUrl}
                              className="w-full h-72 rounded object-cover"
                            />
                            <p className="mt-2 text-center text-white font-semibold">
                              {currentVideo.title}
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-400">
                        No video playing
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              {playVideo && (
                <Button
                  onClick={playNext}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  <Play className="mr-2 h-4 w-4" />{" "}
                  {playNextLoader ? "Loading..." : "Play Next"}
                </Button>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">
                Upcoming Songs
              </h2>
              <div className="space-y-4">
                {queue.map((video) => (
                  <Card key={video.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="flex items-center space-x-4 p-4">
                      <Image
                        src={video.smallImageUrl}
                        alt={video.title}
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
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              handleVote(
                                video.id,
                                video.haveUpvoted ? false : true
                              )
                            }
                            className="bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-500"
                          >
                            {video.haveUpvoted ? (
                              <ChevronDown className="h-4 w-4 text-purple-300" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-purple-300" />
                            )}
                            <span className="text-sm font-semibold text-purple-300">
                              {video.upvotes}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </section>
  );
}
