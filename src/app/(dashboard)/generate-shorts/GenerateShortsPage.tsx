'use client';

import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  LayoutIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  SparklesIcon,
  TextIcon,
  UploadIcon,
  VideoIcon,
  YoutubeIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GenerateShortsPageProps {
  initialPresets?: Preset[];
  initialUrl?: string;
}

type CaptionStyle = 'minimal' | 'subtitles' | 'captions' | 'none';
type BackgroundStyle = 'blur' | 'solid' | 'gradient' | 'none';
type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
type VideoSourceType = 'url' | 'upload';

interface Preset {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
  captionStyle?: string;
  backgroundColor?: string;
  backgroundStyle?: string;
  aspectRatio?: string;
  captionColor?: string;
  captionSize?: string;
  captionPosition?: string;
}

export default function GenerateShortsPage({
  initialPresets = [],
  initialUrl = '',
}: GenerateShortsPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Video source state
  const [videoSourceType, setVideoSourceType] =
    useState<VideoSourceType>('url');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customization options
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('subtitles');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [backgroundStyle, setBackgroundStyle] =
    useState<BackgroundStyle>('blur');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  const [captionSize, setCaptionSize] = useState('medium');
  const [captionPosition, setCaptionPosition] = useState('bottom');
  const [clipDuration, setClipDuration] = useState(60);
  const [maxShorts, setMaxShorts] = useState(3);

  // 1. Add a state to track if a file has been successfully uploaded to S3
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // Add state for YouTube cookies file
  const [cookiesFile, setCookiesFile] = useState<File | null>(null);
  const [cookiesFileKey, setCookieFileKey] = useState<string | null>(null);
  const [isCookiesFileUploaded, setIsCookiesFileUploaded] = useState(false);
  const [isCookiesUploading, setIsCookiesUploading] = useState(false);
  const [cookiesUploadProgress, setCookiesUploadProgress] = useState(0);
  const cookiesFileInputRef = useRef<HTMLInputElement>(null);

  const toggleVideoPlay = (presetId: string) => {
    const videoElement = videoRefs.current[presetId];

    if (!videoElement) return;

    if (playingVideo === presetId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Pause any currently playing video
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }

      videoElement.play();
      setPlayingVideo(presetId);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId === selectedPreset ? null : presetId);

    // Find the preset and apply its settings
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      // Apply preset settings
      if (preset.captionStyle)
        setCaptionStyle(preset.captionStyle as CaptionStyle);
      if (preset.backgroundColor) setBackgroundColor(preset.backgroundColor);
      if (preset.backgroundStyle)
        setBackgroundStyle(preset.backgroundStyle as BackgroundStyle);
      if (preset.aspectRatio) setAspectRatio(preset.aspectRatio as AspectRatio);
      if (preset.captionColor) setCaptionColor(preset.captionColor);
      if (preset.captionSize) setCaptionSize(preset.captionSize);
      if (preset.captionPosition) setCaptionPosition(preset.captionPosition);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);

        // Create a local preview URL (this is a blob URL)
        const objectUrl = URL.createObjectURL(file);
        setUploadedFileUrl(objectUrl);

        // Reset the upload status
        setIsFileUploaded(false);
      } else {
        alert('Please select a video file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);

        // Create a local preview URL
        const objectUrl = URL.createObjectURL(file);
        setUploadedFileUrl(objectUrl);

        // Reset the upload status
        setIsFileUploaded(false);
      } else {
        alert('Please drop a video file');
      }
    }
  };

  const handleUploadVideo = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get a pre-signed URL for the upload
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-video-upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: uploadedFile.name,
            contentType: uploadedFile.type,
            keyOverride: `user-uploads/${session?.user?.id}/${Date.now()}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, key } = await response.json();

      // Upload the file to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', uploadedFile.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const s3Url = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${key}`;
          setUploadedFileUrl(s3Url);
          setIsUploading(false);
          setIsFileUploaded(true); // Mark as successfully uploaded
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(uploadedFile);
    } catch (error) {
      console.error('Failed to upload video:', error);
      alert('Failed to upload video. Please try again.');
      setIsUploading(false);
    }
  };

  // Handle cookies file selection
  const handleCookiesFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.txt')) {
        setCookiesFile(file);

        // Reset the upload status
        setIsCookiesFileUploaded(false);
      } else {
        alert('Please select a .txt file for YouTube cookies');
      }
    }
  };

  // Handle cookies file upload
  const handleUploadCookiesFile = async () => {
    if (!cookiesFile) return;

    setIsCookiesUploading(true);
    setCookiesUploadProgress(0);

    try {
      // Get a pre-signed URL for the upload
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-video-upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: cookiesFile.name,
            contentType: 'text/plain',
            keyOverride: `user-uploads/${session?.user?.id}/cookies/${Date.now()}.txt`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, key } = await response.json();

      // Upload the file to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', 'text/plain');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setCookiesUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setCookieFileKey(key);
          setIsCookiesUploading(false);
          setIsCookiesFileUploaded(true); // Mark as successfully uploaded
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(cookiesFile);
    } catch (error) {
      console.error('Failed to upload cookies file:', error);
      alert('Failed to upload cookies file. Please try again.');
      setIsCookiesUploading(false);
    }
  };

  const handleCreateProject = async () => {
    if (videoSourceType === 'url') {
      if (!videoUrl.trim()) {
        alert('Please enter a video URL');
        return;
      }

      if (!cookiesFile) {
        alert('Please upload a YouTube cookies file');
        return;
      }

      if (!isCookiesFileUploaded) {
        alert(
          'Please complete the cookies file upload process before creating your project'
        );
        return;
      }
    } else if (videoSourceType === 'upload') {
      if (!uploadedFileUrl) {
        alert('Please upload a video file');
        return;
      }

      if (!isFileUploaded) {
        alert(
          'Please complete the upload process before creating your project'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create the project in the database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-shorts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: videoSourceType === 'url' ? videoUrl : uploadedFileUrl,
            cookiesKey: videoSourceType === 'url' ? cookiesFileKey : null,
            compositionId: 'DefaultShort',
            maxShorts: maxShorts,
            settings: {
              captionStyle,
              backgroundColor,
              backgroundStyle,
              aspectRatio,
              captionColor,
              captionSize,
              captionPosition,
              clipDuration,
              presetId: selectedPreset,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      router.push(`/dashboard`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPresetCard = (preset: Preset) => {
    return (
      <Card
        key={preset.id}
        className={`bg-storyhero-bg-elevated cursor-pointer overflow-hidden border-0 transition-all ${
          selectedPreset === preset.id
            ? 'ring-storyhero-accent-indigo shadow-md ring-4'
            : 'hover:shadow-md'
        }`}
        onClick={() => handlePresetSelect(preset.id)}
      >
        <div className="bg-storyhero-bg-higher relative h-[300px] overflow-hidden">
          {selectedPreset === preset.id && (
            <div className="bg-storyhero-accent-indigo text-storyhero-text-primary absolute top-2 right-2 z-10 rounded-full px-2 py-1 text-xs">
              Selected
            </div>
          )}
          {preset.previewUrl ? (
            <>
              <video
                ref={(el) => {
                  videoRefs.current[preset.id] = el;
                }}
                src={preset.previewUrl}
                className="absolute inset-0 h-full w-full object-cover"
                loop
                playsInline
              />
              <div
                className="bg-opacity-30 hover:bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideoPlay(preset.id);
                }}
              >
                <div className="bg-storyhero-bg-elevated bg-opacity-80 rounded-full p-2 shadow-lg">
                  {playingVideo === preset.id ? (
                    <PauseIcon className="text-storyhero-text-primary h-6 w-6" />
                  ) : (
                    <PlayIcon className="text-storyhero-text-primary h-6 w-6" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <SparklesIcon className="text-storyhero-text-muted h-16 w-16" />
            </div>
          )}

          {/* Preset info overlay at the bottom */}
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-3 text-white">
            <h3 className="text-storyhero-text-primary text-base font-semibold">
              {preset.name}
            </h3>
            <p className="text-storyhero-text-secondary text-xs opacity-90">
              {preset.description || 'Custom preset'}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Main content - adjust padding to compensate for removed header */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-storyhero-text-primary text-2xl font-bold">
            Long to Shorts
          </h1>
          <p className="text-storyhero-text-secondary mt-2">
            Generate engaging short-form content from your long videos
          </p>
        </div>

        {/* Video Source Selection Tabs */}
        <div className="mb-8">
          <Card className="bg-storyhero-bg-elevated border-0 p-6">
            <div className="mb-4 flex items-center">
              <VideoIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
              <h3 className="text-storyhero-text-primary text-lg font-semibold">
                Video Source
              </h3>
            </div>

            <Tabs
              value={videoSourceType}
              onValueChange={(value) =>
                setVideoSourceType(value as VideoSourceType)
              }
              className="w-full"
            >
              <TabsList className="bg-storyhero-bg-higher mb-4 grid grid-cols-2">
                <TabsTrigger
                  value="url"
                  className="data-[state=active]:bg-storyhero-bg-highest text-storyhero-text-primary flex items-center"
                >
                  <YoutubeIcon className="mr-2 h-4 w-4" />
                  YouTube URL
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-storyhero-bg-highest text-storyhero-text-primary flex items-center"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label
                    htmlFor="video-url"
                    className="text-storyhero-text-primary"
                  >
                    Enter YouTube or Video URL
                  </Label>
                  <Input
                    id="video-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-storyhero-bg-highest border-storyhero-bg-higher text-storyhero-text-primary mt-1"
                  />
                  <p className="text-storyhero-text-secondary mt-1 text-sm">
                    Paste a YouTube, Vimeo, or direct video URL
                  </p>
                </div>

                {/* YouTube Cookies File Upload Section */}
                <div className="border-storyhero-bg-higher mt-6 border-t pt-4">
                  <Label
                    htmlFor="cookies-file"
                    className="text-storyhero-text-primary flex items-center"
                  >
                    <FileTextIcon className="text-storyhero-accent-blue mr-1 h-4 w-4" />
                    YouTube Cookies File (Required)
                  </Label>
                  <p className="text-storyhero-text-secondary mt-1 mb-3 text-sm">
                    Upload a cookies.txt file to access age-restricted or
                    private YouTube videos
                  </p>

                  {!cookiesFile ? (
                    <div
                      className="border-storyhero-bg-higher hover:bg-storyhero-bg-higher cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                      onClick={() => cookiesFileInputRef.current?.click()}
                    >
                      <FileTextIcon className="text-storyhero-text-muted mx-auto mb-3 h-10 w-10" />
                      <h4 className="text-storyhero-text-primary text-base font-medium">
                        Click to upload cookies file
                      </h4>
                      <p className="text-storyhero-text-secondary mt-1 text-xs">
                        Only .txt files are supported
                      </p>
                      <input
                        type="file"
                        ref={cookiesFileInputRef}
                        className="hidden"
                        accept=".txt"
                        onChange={handleCookiesFileSelect}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-storyhero-bg-higher flex items-center rounded-lg p-4">
                        <div className="mr-4">
                          <FileTextIcon className="text-storyhero-accent-blue h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-storyhero-text-primary truncate font-medium">
                            {cookiesFile.name}
                          </h4>
                          <p className="text-storyhero-text-secondary text-sm">
                            {(cookiesFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-storyhero-bg-highest text-storyhero-text-secondary ml-2 bg-transparent"
                          onClick={() => {
                            setCookiesFile(null);
                            setCookieFileKey(null);
                            setCookiesUploadProgress(0);
                            setIsCookiesFileUploaded(false);
                          }}
                        >
                          Remove
                        </Button>
                      </div>

                      {isCookiesUploading ? (
                        <div className="space-y-2">
                          <div className="bg-storyhero-bg-higher h-2.5 w-full rounded-full">
                            <div
                              className="bg-storyhero-accent-blue h-2.5 rounded-full"
                              style={{ width: `${cookiesUploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-storyhero-text-secondary text-center text-sm">
                            Uploading... {cookiesUploadProgress}%
                          </p>
                        </div>
                      ) : isCookiesFileUploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="text-storyhero-accent-green flex items-center text-sm">
                            <CheckIcon className="mr-1 h-5 w-5" />
                            Upload complete
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-storyhero-bg-highest text-storyhero-text-secondary bg-transparent"
                            onClick={() => {
                              setCookiesFile(null);
                              setCookieFileKey(null);
                              setCookiesUploadProgress(0);
                              setIsCookiesFileUploaded(false);
                            }}
                          >
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover w-full text-white"
                          onClick={handleUploadCookiesFile}
                          disabled={!cookiesFile}
                        >
                          Upload Cookies File
                        </Button>
                      )}

                      <div className="bg-storyhero-bg-higher text-storyhero-text-primary flex items-center rounded-lg p-3 text-sm">
                        <AlertCircleIcon className="text-storyhero-accent-blue mr-2 h-5 w-5 flex-shrink-0" />
                        <p>
                          Your cookies file will be processed securely and will
                          only be used for this video.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                {!uploadedFile ? (
                  <div
                    className="border-storyhero-bg-higher hover:bg-storyhero-bg-higher cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon className="text-storyhero-text-muted mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-storyhero-text-primary text-lg font-medium">
                      Drag and drop your video here
                    </h3>
                    <p className="text-storyhero-text-secondary mt-1 text-sm">
                      Or click to browse from your computer
                    </p>
                    <p className="text-storyhero-text-secondary mt-4 text-xs">
                      Supported formats: MP4, MOV, AVI, WMV (max 500MB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-storyhero-bg-higher flex items-center rounded-lg p-4">
                      <div className="mr-4">
                        {uploadedFileUrl && (
                          <video
                            className="h-20 w-32 rounded object-cover"
                            src={uploadedFileUrl}
                            muted
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-storyhero-text-primary truncate font-medium">
                          {uploadedFile.name}
                        </h3>
                        <p className="text-storyhero-text-secondary text-sm">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-storyhero-bg-highest text-storyhero-text-secondary ml-2 bg-transparent"
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadedFileUrl(null);
                          setUploadProgress(0);
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="bg-storyhero-bg-higher h-2.5 w-full rounded-full">
                          <div
                            className="bg-storyhero-accent-blue h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-storyhero-text-secondary text-center text-sm">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    ) : isFileUploaded ? (
                      <div className="flex items-center justify-between">
                        <div className="text-storyhero-accent-green flex items-center text-sm">
                          <CheckIcon className="mr-1 h-5 w-5" />
                          Upload complete
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-storyhero-bg-highest text-storyhero-text-secondary bg-transparent"
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadedFileUrl(null);
                            setUploadProgress(0);
                            setIsFileUploaded(false);
                          }}
                        >
                          Change Video
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover w-full text-white"
                        onClick={handleUploadVideo}
                        disabled={!uploadedFile}
                      >
                        Upload Video
                      </Button>
                    )}

                    <div className="bg-storyhero-bg-higher text-storyhero-text-primary flex items-center rounded-lg p-3 text-sm">
                      <AlertCircleIcon className="text-storyhero-accent-blue mr-2 h-5 w-5 flex-shrink-0" />
                      <p>
                        Your video will be processed securely and will only be
                        accessible to you.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-storyhero-bg-higher mb-6">
            <TabsTrigger
              value="presets"
              className="data-[state=active]:bg-storyhero-bg-highest data-[state=active]:text-storyhero-text-primary text-storyhero-text-secondary"
            >
              Presets
            </TabsTrigger>
            <TabsTrigger
              value="customize"
              className="data-[state=active]:bg-storyhero-bg-highest data-[state=active]:text-storyhero-text-primary text-storyhero-text-secondary"
            >
              Customize
            </TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <div className="mb-4 flex items-center">
              <SparklesIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
              <h2 className="text-storyhero-text-primary text-xl font-semibold">
                Choose a Preset
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="bg-storyhero-bg-elevated animate-pulse border-0"
                  >
                    <div className="bg-storyhero-bg-higher h-[300px] rounded-t-lg"></div>
                    <div className="p-3">
                      <div className="bg-storyhero-bg-highest h-5 w-3/4 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : presets.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {presets.map(renderPresetCard)}
              </div>
            ) : (
              <div className="bg-storyhero-bg-elevated rounded-lg border-0 py-12 text-center">
                <SparklesIcon className="text-storyhero-text-muted mx-auto h-12 w-12" />
                <h3 className="text-storyhero-text-primary mt-2 text-lg font-medium">
                  No presets available
                </h3>
                <p className="text-storyhero-text-secondary mt-1 text-sm">
                  You can customize your shorts in the Customize tab.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Caption Style */}
              <Card className="bg-storyhero-bg-elevated border-0 p-6">
                <div className="mb-4 flex items-center">
                  <TextIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
                  <h3 className="text-storyhero-text-primary text-lg font-semibold">
                    Caption Style
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        captionStyle === 'subtitles'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setCaptionStyle('subtitles')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Subtitles</span>
                        {captionStyle === 'subtitles' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="bg-storyhero-bg-higher flex h-16 items-end justify-center rounded p-2">
                        <div className="bg-opacity-70 rounded bg-black px-2 py-1 text-xs text-white">
                          Simple text subtitles
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        captionStyle === 'captions'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setCaptionStyle('captions')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Captions</span>
                        {captionStyle === 'captions' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="bg-storyhero-bg-higher flex h-16 items-center justify-center rounded">
                        <div className="text-storyhero-text-primary rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-bold">
                          BOLD CAPTIONS
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        captionStyle === 'minimal'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setCaptionStyle('minimal')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Minimal</span>
                        {captionStyle === 'minimal' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="bg-storyhero-bg-higher flex h-16 items-center justify-center rounded">
                        <div className="text-storyhero-text-primary text-xs">
                          Clean minimal text
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        captionStyle === 'none'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setCaptionStyle('none')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">No Captions</span>
                        {captionStyle === 'none' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="bg-storyhero-bg-higher flex h-16 items-center justify-center rounded">
                        <VideoIcon className="text-storyhero-text-muted h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {captionStyle !== 'none' && (
                    <>
                      <div>
                        <Label
                          htmlFor="caption-color"
                          className="text-storyhero-text-primary"
                        >
                          Caption Color
                        </Label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="color"
                            id="caption-color"
                            value={captionColor}
                            onChange={(e) => setCaptionColor(e.target.value)}
                            className="h-10 w-10 cursor-pointer rounded"
                          />
                          <Input
                            value={captionColor}
                            onChange={(e) => setCaptionColor(e.target.value)}
                            className="w-28"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-storyhero-text-primary">
                          Caption Size
                        </Label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={
                              captionSize === 'small' ? 'default' : 'outline'
                            }
                            onClick={() => setCaptionSize('small')}
                            className={`text-xs ${
                              captionSize === 'small'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }`}
                          >
                            Small
                          </Button>
                          <Button
                            type="button"
                            variant={
                              captionSize === 'medium' ? 'default' : 'outline'
                            }
                            onClick={() => setCaptionSize('medium')}
                            className={`text-sm ${
                              captionSize === 'medium'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }`}
                          >
                            Medium
                          </Button>
                          <Button
                            type="button"
                            variant={
                              captionSize === 'large' ? 'default' : 'outline'
                            }
                            onClick={() => setCaptionSize('large')}
                            className={`text-base ${
                              captionSize === 'large'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }`}
                          >
                            Large
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-storyhero-text-primary">
                          Caption Position
                        </Label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={
                              captionPosition === 'top' ? 'default' : 'outline'
                            }
                            onClick={() => setCaptionPosition('top')}
                            className={
                              captionPosition === 'top'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }
                          >
                            Top
                          </Button>
                          <Button
                            type="button"
                            variant={
                              captionPosition === 'middle'
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => setCaptionPosition('middle')}
                            className={
                              captionPosition === 'middle'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }
                          >
                            Middle
                          </Button>
                          <Button
                            type="button"
                            variant={
                              captionPosition === 'bottom'
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => setCaptionPosition('bottom')}
                            className={
                              captionPosition === 'bottom'
                                ? 'bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 text-storyhero-text-primary'
                                : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary hover:bg-storyhero-bg-higher bg-transparent'
                            }
                          >
                            Bottom
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Background Settings */}
              <Card className="bg-storyhero-bg-elevated border-0 p-6">
                <div className="mb-4 flex items-center">
                  <PaletteIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
                  <h3 className="text-storyhero-text-primary text-lg font-semibold">
                    Background Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        backgroundStyle === 'blur'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setBackgroundStyle('blur')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Blurred</span>
                        {backgroundStyle === 'blur' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="bg-storyhero-bg-higher h-16 overflow-hidden rounded">
                        <div className="bg-storyhero-bg-highest flex h-full w-full items-center justify-center backdrop-blur-md">
                          <div className="bg-storyhero-bg-elevated h-3/4 w-1/2 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        backgroundStyle === 'solid'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setBackgroundStyle('solid')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Solid Color</span>
                        {backgroundStyle === 'solid' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="flex h-16 items-center justify-center rounded bg-gray-800">
                        <div className="h-3/4 w-1/2 rounded bg-gray-100"></div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        backgroundStyle === 'gradient'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setBackgroundStyle('gradient')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Gradient</span>
                        {backgroundStyle === 'gradient' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="flex h-16 items-center justify-center rounded bg-gradient-to-r from-blue-400 to-purple-500">
                        <div className="bg-opacity-90 h-3/4 w-1/2 rounded bg-white"></div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-md border p-4 ${
                        backgroundStyle === 'none'
                          ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                          : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                      }`}
                      onClick={() => setBackgroundStyle('none')}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Original</span>
                        {backgroundStyle === 'none' && (
                          <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                        )}
                      </div>
                      <div className="flex h-16 items-center justify-center rounded bg-gray-100">
                        <VideoIcon className="text-storyhero-text-muted h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {backgroundStyle === 'solid' && (
                    <div>
                      <Label
                        htmlFor="background-color"
                        className="text-storyhero-text-primary"
                      >
                        Background Color
                      </Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          type="color"
                          id="background-color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-28"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Aspect Ratio */}
              <Card className="bg-storyhero-bg-elevated border-0 p-6">
                <div className="mb-4 flex items-center">
                  <LayoutIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
                  <h3 className="text-storyhero-text-primary text-lg font-semibold">
                    Aspect Ratio
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      aspectRatio === '9:16'
                        ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                        : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                    }`}
                    onClick={() => setAspectRatio('9:16')}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">9:16</span>
                      {aspectRatio === '9:16' && (
                        <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-storyhero-bg-highest h-14 w-8 rounded"></div>
                    </div>
                    <p className="text-storyhero-text-muted mt-2 text-center text-xs">
                      TikTok, Reels
                    </p>
                  </div>

                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      aspectRatio === '16:9'
                        ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                        : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                    }`}
                    onClick={() => setAspectRatio('16:9')}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">16:9</span>
                      {aspectRatio === '16:9' && (
                        <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-storyhero-bg-highest h-8 w-14 rounded"></div>
                    </div>
                    <p className="text-storyhero-text-muted mt-2 text-center text-xs">
                      YouTube
                    </p>
                  </div>

                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      aspectRatio === '1:1'
                        ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                        : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                    }`}
                    onClick={() => setAspectRatio('1:1')}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">1:1</span>
                      {aspectRatio === '1:1' && (
                        <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-storyhero-bg-highest h-10 w-10 rounded"></div>
                    </div>
                    <p className="text-storyhero-text-muted mt-2 text-center text-xs">
                      Instagram
                    </p>
                  </div>

                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      aspectRatio === '4:5'
                        ? 'border-storyhero-accent-indigo bg-storyhero-accent-indigo/10 text-storyhero-text-primary'
                        : 'border-storyhero-bg-higher text-storyhero-text-secondary hover:border-storyhero-bg-highest'
                    }`}
                    onClick={() => setAspectRatio('4:5')}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">4:5</span>
                      {aspectRatio === '4:5' && (
                        <CheckIcon className="text-storyhero-accent-indigo h-4 w-4" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-storyhero-bg-highest h-10 w-8 rounded"></div>
                    </div>
                    <p className="text-storyhero-text-muted mt-2 text-center text-xs">
                      Instagram Post
                    </p>
                  </div>
                </div>
              </Card>

              {/* Clip Settings */}
              <Card className="bg-storyhero-bg-elevated border-0 p-6">
                <div className="mb-4 flex items-center">
                  <SettingsIcon className="text-storyhero-accent-blue mr-2 h-5 w-5" />
                  <h3 className="text-storyhero-text-primary text-lg font-semibold">
                    Clip Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="clip-duration"
                      className="text-storyhero-text-primary"
                    >
                      Maximum Clip Duration
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        id="clip-duration"
                        type="number"
                        min="15"
                        max="180"
                        value={clipDuration}
                        onChange={(e) =>
                          setClipDuration(parseInt(e.target.value))
                        }
                        className="bg-storyhero-bg-highest border-storyhero-bg-higher text-storyhero-text-primary w-24"
                      />
                      <span className="text-storyhero-text-secondary">
                        seconds
                      </span>
                    </div>
                    <p className="text-storyhero-text-muted mt-1 text-xs">
                      Recommended: 30-60 seconds for TikTok and Reels
                    </p>
                  </div>

                  <div className="mt-4">
                    <Label
                      htmlFor="max-shorts"
                      className="text-storyhero-text-primary"
                    >
                      Maximum Number of Shorts
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        id="max-shorts"
                        type="number"
                        min="1"
                        max="10"
                        value={maxShorts || ''}
                        onChange={(e) => {
                          const value =
                            e.target.value === ''
                              ? 0
                              : parseInt(e.target.value);
                          setMaxShorts(
                            isNaN(value) ? 3 : Math.min(10, Math.max(1, value))
                          );
                        }}
                        className="bg-storyhero-bg-highest border-storyhero-bg-higher text-storyhero-text-primary w-24"
                      />
                      <span className="text-storyhero-text-secondary">
                        shorts
                      </span>
                    </div>
                    <p className="text-storyhero-text-muted mt-1 text-xs">
                      Limit: 1-10 shorts per video
                    </p>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-storyhero-text-primary mb-2 text-sm font-medium">
                      Clip Generation
                    </h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto-generate"
                        className="text-storyhero-accent-indigo rounded"
                        defaultChecked
                      />
                      <Label
                        htmlFor="auto-generate"
                        className="text-storyhero-text-primary text-sm"
                      >
                        Automatically generate clips from video
                      </Label>
                    </div>
                    <p className="text-storyhero-text-muted mt-1 text-xs">
                      Our AI will identify the most engaging segments of your
                      video
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Project Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleCreateProject}
            disabled={
              isSubmitting ||
              (videoSourceType === 'url' &&
                (!videoUrl.trim() || !isCookiesFileUploaded)) ||
              (videoSourceType === 'upload' &&
                (!uploadedFileUrl || isUploading))
            }
            className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary px-6"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processing...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              'Create Shorts'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
