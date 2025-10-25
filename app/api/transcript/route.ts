import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

// Hàm để extract video ID từ YouTube URL
function extractVideoId(url: string): string | null {
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Hàm để lấy transcript từ YouTube bằng YouTubei.js
async function getTranscript(videoId: string): Promise<TranscriptItem[]> {
  try {
    console.log("Đang khởi tạo YouTube client...");
    const youtube = await Innertube.create({
      cache: undefined, // Disable cache để tránh warning
    });

    console.log("Đang lấy video info cho:", videoId);
    const info = await youtube.getInfo(videoId);

    // Lấy transcript/captions
    const transcriptData = await info.getTranscript();

    if (!transcriptData) {
      throw new Error("Video này không có phụ đề");
    }

    console.log("Đã tìm thấy transcript");

    // Chuyển đổi sang format chuẩn
    const segments = transcriptData.transcript?.content?.body?.initial_segments;

    if (!segments || !Array.isArray(segments)) {
      throw new Error("Không có nội dung transcript");
    }

    const captions: TranscriptItem[] = segments.map((segment: any) => {
      // Lấy text từ snippet
      const text = segment.snippet?.text || "";
      const startMs = segment.start_ms || 0;
      const endMs = segment.end_ms || 0;
      const duration = endMs - startMs;

      return {
        text: text.trim(),
        offset: startMs,
        duration: duration > 0 ? duration : 0,
      };
    });

    if (captions.length === 0) {
      throw new Error("Không có nội dung transcript");
    }

    console.log(`Đã lấy được ${captions.length} dòng transcript`);
    return captions;
  } catch (error) {
    console.error("Error fetching transcript:", error);

    // Xử lý các lỗi cụ thể
    if (error instanceof Error) {
      if (error.message.includes("Transcript is disabled")) {
        throw new Error("Video này đã tắt phụ đề");
      }
      if (error.message.includes("not available")) {
        throw new Error("Video không khả dụng hoặc bị giới hạn");
      }
    }

    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    console.log("Nhận request với URL:", url);

    // Validate input
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "URL là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(url.trim());

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "URL YouTube không hợp lệ. Vui lòng kiểm tra lại URL.",
        },
        { status: 400 }
      );
    }

    console.log("Video ID:", videoId);

    // Fetch transcript
    const transcript = await getTranscript(videoId);

    return NextResponse.json({
      success: true,
      data: transcript,
    });
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Có lỗi không xác định";

    console.error("Error message:", errorMessage);

    // Determine appropriate error message for user
    let userMessage = errorMessage;

    if (
      errorMessage.includes("age-gated") ||
      errorMessage.includes("video is not available") ||
      errorMessage.includes("unavailable") ||
      errorMessage.includes("Video removed")
    ) {
      userMessage = "Video bị hạn chế hoặc không khả dụng";
    } else if (
      errorMessage.includes("No transcripts found") ||
      errorMessage.includes("Không tìm thấy") ||
      errorMessage.includes("không có phụ đề") ||
      errorMessage.includes("Không có caption")
    ) {
      userMessage =
        "Video này không có phụ đề. Vui lòng chọn video khác có phụ đề.";
    } else if (errorMessage.includes("Invalid video ID")) {
      userMessage = "ID video không hợp lệ";
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "YouTube Transcript API",
      instructions: "Sử dụng POST request với YouTube URL",
    },
    { status: 200 }
  );
}
