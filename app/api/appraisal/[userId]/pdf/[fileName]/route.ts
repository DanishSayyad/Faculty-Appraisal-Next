import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const sanitizeFilename = (value: string): string => {
  const withoutExtension = value.replace(/\.pdf$/i, "");
  const normalized = withoutExtension
    .replace(/[<>:"/\\|?*]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || "appraisal";
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; fileName: string }> }
) {
  try {
    const { userId, fileName } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, message: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const bearerToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
      || req.cookies.get("access_token")?.value;

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const authHeader = { Authorization: `Bearer ${bearerToken}` };
    const requestedFilename = sanitizeFilename(fileName || `appraisal-${userId}`);
    const shouldDownload = req.nextUrl.searchParams.get("download") === "1";

    let pdfUrl: string | undefined;

    const appraisalRes = await axios.get(`${backendUrl}/appraisal/${userId}`, {
      headers: authHeader,
      validateStatus: () => true,
    });

    if (appraisalRes.status === 200) {
      pdfUrl = appraisalRes.data?.data?.pdfUrl;
    }

    if (!pdfUrl) {
      const generateRes = await axios.get(`${backendUrl}/appraisal/${userId}/pdf`, {
        headers: authHeader,
        validateStatus: () => true,
      });

      if (generateRes.status !== 200) {
        return NextResponse.json(
          { success: false, message: generateRes.data?.message || "Failed to generate appraisal PDF" },
          { status: generateRes.status || 500 }
        );
      }

      pdfUrl = generateRes.data?.data?.pdfUrl;
    }

    if (!pdfUrl) {
      return NextResponse.json(
        { success: false, message: "No PDF URL available" },
        { status: 404 }
      );
    }

    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch PDF bytes" },
        { status: pdfRes.status || 502 }
      );
    }

    return new NextResponse(pdfRes.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${requestedFilename}.pdf"`,
        "Cache-Control": "no-store",
        ...(pdfRes.headers.get("content-length")
          ? { "Content-Length": pdfRes.headers.get("content-length") as string }
          : {}),
      },
    });
  } catch (error) {
    console.error("[/api/appraisal/[userId]/pdf/[fileName]] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to open appraisal PDF" },
      { status: 500 }
    );
  }
}