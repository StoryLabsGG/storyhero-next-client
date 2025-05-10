'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { PlusIcon, RefreshCwIcon, SearchIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ProjectCard from '@/components/dashboard/ProjectCard';
import ProjectCardSkeleton from '@/components/dashboard/ProjectCardSkeleton';
import VideoUploader, { VideoData } from '@/components/dashboard/VideoUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GenerateShortsJob {
  id: string;
  userId: string;
  sourceUrl: string;
  videoTitle: string;
  thumbnailUrl: string;
  createdAt: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<GenerateShortsJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const debouncedUrl = useDebounce(videoUrl, 1000);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm({
    defaultValues: {
      url: '',
      file: null as unknown as File | null,
    },
  });

  // Handle video uploader submissions
  const handleVideoSubmit = (videoData: VideoData) => {
    console.log('Submitted video data:', videoData);

    // If we have a URL, redirect to generate-shorts with URL as query param
    if (videoData.url && videoData.url.trim() !== '') {
      router.push(`/generate-shorts?url=${encodeURIComponent(videoData.url)}`);
      return;
    }

    // Handle file upload if needed
    if (videoData.file) {
      console.log('File upload handling would go here');
      // You could either upload the file here or redirect to generate-shorts
      // with some identifier for the uploaded file
    }
  };

  // Set up file input for upload
  useEffect(() => {
    if (!fileInput) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        // Handle file upload logic here
        console.log('File selected:', target.files?.[0]?.name);
      };
      setFileInput(input);
    }
  }, []);

  // Simulate processing when URL changes
  useEffect(() => {
    if (debouncedUrl) {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  }, [debouncedUrl]);

  const fetchJobs = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/list-generate-shorts-jobs?userId=${session.user.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const backfillVideoMetadata = async (jobId: string) => {
    await fetch(`/api/backfill-video-metadata`, {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchJobs();
    }
  }, [session]);

  useEffect(() => {
    for (const job of jobs) {
      if (!job.thumbnailUrl || !job.videoTitle) {
        backfillVideoMetadata(job.id);
      }
    }
  }, [jobs]);

  return (
    <div className="bg-storyhero-bg-base text-storyhero-text-primary w-full overflow-hidden">
      {/* Main content - adjusted padding */}
      <main className="w-full px-4 py-6">
        <div className="mx-auto mt-12 mb-16 flex max-w-6xl justify-center">
          <div className="bg-background relative w-[50%] w-full max-w-[50%] space-y-8">
            <VideoUploader
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onSubmit={handleVideoSubmit}
            />
          </div>
        </div>

        {/* Projects section - Added min-width */}
        <div className="mx-auto max-w-6xl rounded-xl border border-gray-200/30 bg-gray-50/30 p-6 shadow-sm backdrop-blur-sm lg:max-w-7xl xl:max-w-[85rem] 2xl:max-w-[90rem] dark:border-gray-700/15 dark:bg-gray-800/10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                className={`px-3 py-1 text-sm ${activeTab === 'all' ? 'bg-white' : 'bg-transparent text-gray-500'}`}
                onClick={() => setActiveTab('all')}
              >
                All projects ({jobs.length})
              </Button>
              <Button
                variant={activeTab === 'saved' ? 'default' : 'ghost'}
                className={`px-3 py-1 text-sm ${activeTab === 'saved' ? 'bg-white' : 'bg-transparent text-gray-500'}`}
                onClick={() => setActiveTab('saved')}
              >
                Saved projects (0)
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={fetchJobs}
                disabled={isLoading}
                size="sm"
                className="text-storyhero-text-secondary hover:text-storyhero-text-primary"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="bg-storyhero-bg-highest focus:ring-storyhero-accent-indigo w-48 rounded-md border-none px-3 py-1.5 pl-8 text-sm focus:ring-1 focus:outline-none"
                />
                <SearchIcon className="text-storyhero-text-muted absolute top-2 left-2.5 h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <div className="text-storyhero-text-secondary mt-4 mb-2 flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-1">
              <span>{jobs.length} projects</span>
              <span>•</span>
              <span>0 GB / 0 GB</span>
            </div>
          </div>

          {/* Projects grid - Adjusted for wider cards */}
          {isLoading && jobs.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              {jobs.map((job, index) => (
                <ProjectCard
                  key={job.id}
                  id={job.id}
                  videoTitle={job.videoTitle}
                  thumbnailUrl={job.thumbnailUrl}
                  sourceUrl={job.sourceUrl}
                  createdAt={job.createdAt}
                  daysLeft={18}
                />
              ))}
            </div>
          ) : (
            <div
              className="bg-storyhero-bg-elevated rounded-lg py-12 text-center"
              key={0}
            >
              <div className="bg-storyhero-bg-highest mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <VideoIcon className="text-storyhero-text-muted h-8 w-8" />
              </div>
              <h3 className="text-storyhero-text-primary mb-2 text-lg font-medium">
                No projects yet
              </h3>
              <p className="text-storyhero-text-secondary mx-auto mb-6 max-w-md text-sm">
                Get started by creating your first project to generate video
                shorts.
              </p>
              <Link href="/generate-shorts">
                <Button className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
