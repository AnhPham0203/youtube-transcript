"use client";

import { useState } from "react";

interface TranscriptFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function TranscriptForm({
  onSubmit,
  loading,
}: TranscriptFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateYoutubeUrl = (url: string): boolean => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Vui lòng nhập URL YouTube");
      return;
    }

    if (!validateYoutubeUrl(url)) {
      setError("URL không hợp lệ. Vui lòng nhập link YouTube hợp lệ");
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="youtube-url"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          YouTube Video URL
        </label>
        <div className="flex gap-3">
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Đang xử lý..." : "Lấy Transcript"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Bạn có thể sử dụng:
        </p>
        <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
          <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
          <li>https://youtu.be/VIDEO_ID</li>
          <li>https://m.youtube.com/watch?v=VIDEO_ID</li>
        </ul>
      </div>
    </form>
  );
}
