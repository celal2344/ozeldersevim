import { NextResponse } from "next/server";
import { z } from "zod";

import { AdminActionError, updateReviewModerationStatus } from "@/features/admin/service";

const schema = z.object({
  status: z.enum(["published", "rejected"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Geçersiz durum değeri." }, { status: 400 });
  }

  try {
    const result = await updateReviewModerationStatus(id, parsed.data.status);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof AdminActionError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Yorum durumu güncellenemedi.";
    return NextResponse.json({ message }, { status });
  }
}
