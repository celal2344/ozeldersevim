import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";
import { teacherListingSchema } from "@/features/teacher-listings/constants";
import {
  getTeacherListingResource,
  saveTeacherListing,
  TeacherListingError,
} from "@/features/teacher-listings/service";

function accountErrorResponse() {
  return NextResponse.json({ message: "İlan yönetimi için öğretmen hesabıyla giriş yapmalısın." }, { status: 401 });
}

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return accountErrorResponse();
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "İlan yönetimini sadece öğretmen hesapları kullanabilir." }, { status: 403 });
  }

  try {
    const resource = await getTeacherListingResource(account.id);
    return NextResponse.json(resource);
  } catch (error) {
    const status = error instanceof TeacherListingError ? error.status : 500;
    const message = error instanceof Error ? error.message : "İlan bilgileri getirilemedi.";

    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(request: Request) {
  const account = await getCurrentAccount();

  if (!account) {
    return accountErrorResponse();
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "İlan yönetimini sadece öğretmen hesapları kullanabilir." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = teacherListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "İlan bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const resource = await saveTeacherListing(account.id, parsed.data);
    return NextResponse.json(resource);
  } catch (error) {
    const status = error instanceof TeacherListingError ? error.status : 500;
    const message = error instanceof Error ? error.message : "İlan kaydedilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
