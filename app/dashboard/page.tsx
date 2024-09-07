"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Image from "next/image";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YT_REGEX } from "../lib/utils";
import Appbar from "../components/Appbar";
import StreamView from "../components/StreamView";

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

const creatorId = "8f8a60be-3bbf-431b-b191-21a226c3208b";

export default function Component() {
  return <StreamView creatorId={creatorId} />;
}
