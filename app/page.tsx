import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Zap, Radio } from "lucide-react";
import Appbar from "@/components/Appbar";
import Redirect from "@/components/Redirect";


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Appbar />
      <Redirect />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-gray-900 via-purple-900 to-fuchsia-900">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 animate-pulse">
                Let Fans Choose Your Music
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                FanTune: Interactive music streaming where your audience
                controls the playlist.
              </p>
              <div className="space-x-4">
                <Button className="bg-fuchsia-500 text-white hover:bg-fuchsia-600 transition-colors">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10 transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg transition-transform hover:scale-105">
                <Users className="h-12 w-12 mb-4 text-fuchsia-400" />
                <h3 className="text-xl font-bold mb-2 text-fuchsia-300">
                  Fan Interaction
                </h3>
                <p className="text-gray-300">
                  Fans choose your stream&apos;s music
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg transition-transform hover:scale-105">
                <Zap className="h-12 w-12 mb-4 text-cyan-400" />
                <h3 className="text-xl font-bold mb-2 text-cyan-300">
                  Real-time Updates
                </h3>
                <p className="text-gray-300">
                  Instant song requests and changes
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg transition-transform hover:scale-105">
                <Radio className="h-12 w-12 mb-4 text-fuchsia-400" />
                <h3 className="text-xl font-bold mb-2 text-fuchsia-300">
                  Easy Integration
                </h3>
                <p className="text-gray-300">Works with your streaming setup</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-fuchsia-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold mb-4 animate-bounce">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-fuchsia-300">
                  Sign Up
                </h3>
                <p className="text-gray-300">Create account, connect library</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold mb-4 animate-bounce">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-cyan-300">
                  Share Link
                </h3>
                <p className="text-gray-300">Give fans your FanTune link</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold mb-4 animate-bounce">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-fuchsia-300">
                  Fan Control
                </h3>
                <p className="text-gray-300">Fans request and vote on songs</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                Ready to Revolutionize Your Streams?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join FanTune and create interactive music experiences.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-800 border-gray-700 focus:border-fuchsia-400 focus:ring-fuchsia-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-colors"
                  >
                    Sign Up
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2023 FanTune. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs text-gray-400 hover:text-fuchsia-400 transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs text-gray-400 hover:text-fuchsia-400 transition-colors"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
