"use client";

import { useState } from "react";
import TranscriptForm from "@/components/TranscriptForm";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import Header from "@/components/Header";

interface TranscriptResult {
  success: boolean;
  data?: Array<{
    text: string;
    offset: number;
    duration: number;
  }>;
  error?: string;
}

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string>("");

  const handleFetchTranscript = async (url: string) => {
    setLoading(true);
    setTranscript(null);
    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data: TranscriptResult = await response.json();
      setTranscript(data);

      if (data.success && data.data) {
        const videoId = extractVideoId(url);
        setVideoTitle(`Video: ${videoId}`);
      }
    } catch (error) {
      setTranscript({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lấy transcript",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url: string): string => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : "Unknown";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <TranscriptForm
              onSubmit={handleFetchTranscript}
              loading={loading}
            />
          </div>

          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">
                Đang lấy transcript...
              </p>
            </div>
          )}

          {transcript && !loading && (
            <TranscriptDisplay
              transcript={transcript}
              videoTitle={videoTitle}
            />
          )}
        </div>
      </div>
    </main>
  );
}
