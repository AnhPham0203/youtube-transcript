"use client";

import { useState } from "react";

interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

interface TranscriptDisplayProps {
  transcript: {
    success: boolean;
    data?: TranscriptItem[];
    error?: string;
  };
  videoTitle: string;
}

export default function TranscriptDisplay({
  transcript,
  videoTitle,
}: TranscriptDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!transcript.success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <span className="text-2xl">❌</span>
          <h2 className="text-xl font-semibold">Lỗi</h2>
        </div>
        <p className="text-gray-700">
          {transcript.error ||
            "Video này không có phụ đề hoặc không thể truy cập được."}
        </p>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Gợi ý:</strong> Video có thể cần phải:
          </p>
          <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
            <li>Có phụ đề được tải lên (Closed Captions)</li>
            <li>Không bị khóa bởi tác giả</li>
            <li>URL phải hợp lệ</li>
          </ul>
        </div>
      </div>
    );
  }

  const transcriptText = transcript.data
    ?.map((item) => item.text)
    .join(" ")
    .trim();

  const handleCopy = async () => {
    if (transcriptText) {
      try {
        await navigator.clipboard.writeText(transcriptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleDownload = () => {
    if (transcriptText) {
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(transcriptText)
      );
      element.setAttribute("download", `transcript-${videoTitle}.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transcript</h2>
            <p className="text-sm text-gray-500">{videoTitle}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {transcript.data?.length || 0} dòng
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {copied ? "✓ Đã sao chép!" : "📋 Sao chép"}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          💾 Tải xuống
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          {transcriptText}
        </p>
      </div>

      {transcript.data && transcript.data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Chi tiết thời gian (Timeline)
          </h3>
          <div className="max-h-48 overflow-y-auto bg-gray-50 rounded p-4">
            <div className="space-y-2 text-sm">
              {transcript.data.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 pb-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="font-mono text-gray-500 flex-shrink-0">
                    {formatTime(item.offset)}
                  </span>
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const displayHours = hours > 0 ? `${hours}:` : "";
  const displayMinutes = `${String(minutes % 60).padStart(2, "0")}:`;
  const displaySeconds = String(seconds % 60).padStart(2, "0");

  return `${displayHours}${displayMinutes}${displaySeconds}`;
}
