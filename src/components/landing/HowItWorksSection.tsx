import { Share2, Sparkles, Wand2, Youtube } from 'lucide-react';

export default function HowItWorksSection() {
  return (
    <div className="relative pt-4">
      {/* Connection Line */}
      <div className="from-storyhero to-storyhero/0 absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b md:hidden" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Step 1 */}
        <div className="relative flex flex-col items-center text-center">
          <div className="bg-storyhero/10 ring-storyhero mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
            <Youtube className="text-storyhero h-8 w-8" />
          </div>
          <div className="bg-storyhero absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold">
            Step 1
          </div>
          <h3 className="mb-2 text-xl font-bold">Upload Video</h3>
          <p className="text-gray-400">
            Paste a YouTube URL or upload your video file.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative flex flex-col items-center text-center">
          <div className="bg-storyhero/10 ring-storyhero mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
            <Sparkles className="text-storyhero h-8 w-8" />
          </div>
          <div className="bg-storyhero absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold">
            Step 2
          </div>
          <h3 className="mb-2 text-xl font-bold">AI Analysis</h3>
          <p className="text-gray-400">
            Our AI identifies the most engaging moments for clips.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative flex flex-col items-center text-center">
          <div className="bg-storyhero/10 ring-storyhero mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
            <Wand2 className="text-storyhero h-8 w-8" />
          </div>
          <div className="bg-storyhero absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold">
            Step 3
          </div>
          <h3 className="mb-2 text-xl font-bold">Generate Clips</h3>
          <p className="text-gray-400">
            Get high-quality clips with captions, backgrounds, and text hooks.
          </p>
        </div>

        {/* Step 4 */}
        <div className="relative flex flex-col items-center text-center">
          <div className="bg-storyhero/10 ring-storyhero mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
            <Share2 className="text-storyhero h-8 w-8" />
          </div>
          <div className="bg-storyhero absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold">
            Step 4
          </div>
          <h3 className="mb-2 text-xl font-bold">Schedule & Share</h3>
          <p className="text-gray-400">
            Connect accounts and schedule posts directly to TikTok.
          </p>
        </div>
      </div>
    </div>
  );
}
