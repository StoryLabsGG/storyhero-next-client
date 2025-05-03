'use client';

import { useDebounce } from '@uidotdev/usehooks';
import {
  CloudUploadIcon,
  FilterIcon,
  LinkIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UploadIcon,
  VideoIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import VideoUploader, { VideoData } from '@/components/dashboard/VideoUploader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface GenerateShortsJob {
  id: string;
  userId: string;
  sourceUrl: string;
  createdAt: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<GenerateShortsJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [videoUrl, setVideoUrl] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter a YouTube URL link');
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

  // Set up dynamic placeholder text
  useEffect(() => {
    const placeholders = [
      'Enter a YouTube URL link',
      'Or upload your own video',
      'Paste video link here',
    ] as const;
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index] as string);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (session?.user?.id) {
      fetchJobs();
    }
  }, [session]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Extract domain from URL for display
  const getSourceName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch (e) {
      return 'Unknown Source';
    }
  };

  const handleGenerateClips = () => {
    // Logic to handle generating clips
    window.location.href = '/generate-shorts';
  };

  return (
    <div className="bg-storyhero-bg-base text-storyhero-text-primary overflow-hidden">
      {/* Main content - adjusted padding */}
      <main className="w-full px-4 py-6">
        <div className="mx-auto mt-12 mb-16 flex max-w-6xl justify-center">
          <div className="bg-background relative w-full space-y-8 lg:w-[70%]">
            <VideoUploader
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onSubmit={handleVideoSubmit}
            />
          </div>
        </div>

        {/* Projects section - Lighter gray and more transparent background */}
        <div className="mx-auto max-w-6xl rounded-xl border border-gray-200/30 bg-gray-50/30 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700/15 dark:bg-gray-800/10">
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

          {/* Projects grid */}
          {isLoading && jobs.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="bg-storyhero-bg-elevated animate-pulse overflow-hidden border-0"
                >
                  <div className="bg-storyhero-bg-higher h-32 rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="bg-storyhero-bg-highest mb-2 h-4 w-3/4 rounded"></div>
                    <div className="bg-storyhero-bg-highest h-3 w-1/2 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {jobs.map((job) => (
                <Link href={`/shorts/${job.id}`} key={job.id} className="group">
                  <Card className="bg-storyhero-bg-elevated hover:border-storyhero-accent-indigo/50 cursor-pointer overflow-hidden border-0 transition-all group-hover:-translate-y-1 group-hover:shadow-md hover:border">
                    <div className="from-storyhero-bg-higher to-storyhero-bg-base relative h-32 overflow-hidden bg-gradient-to-br">
                      {job.sourceUrl ? (
                        <div className="relative h-full w-full">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <VideoIcon className="text-storyhero-text-primary/60 h-10 w-10" />
                          </div>
                          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                            <p className="text-storyhero-text-primary truncate text-xs font-medium">
                              {getSourceName(job.sourceUrl)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <VideoIcon className="text-storyhero-text-muted h-10 w-10" />
                        </div>
                      )}
                      <div className="text-storyhero-text-secondary absolute top-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-xs">
                        18 days left
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-storyhero-text-primary mb-1 truncate text-sm font-medium">
                        Project {job.id.substring(0, 8)}
                      </h3>
                      <p className="text-storyhero-text-secondary text-xs">
                        Created {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-storyhero-bg-elevated rounded-lg py-12 text-center">
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
