"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenIcon, GraduationCapIcon } from "lucide-react";

import { RegisterForm } from "@/features/auth/register-form";
import type { RegisterRole } from "@/features/auth/types";

export default function KayitPage() {
  const [role, setRole] = useState<RegisterRole | null>(null);

  if (!role) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-brand-navy">Kayıt Ol</h1>
        <p className="mt-2 text-sm text-muted-foreground">Nasıl devam etmek istiyorsunuz?</p>
        <div className="mt-8 grid gap-4">
          <button
            onClick={() => setRole("student")}
            className="flex items-start gap-4 rounded-xl border-2 border-slate-200 p-5 text-left transition-colors hover:border-brand-orange hover:bg-orange-50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <BookOpenIcon aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-brand-navy">Öğrenci olarak kayıt ol</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Öğretmen bul, ders talebi oluştur ve öğrenmeye başla.
              </p>
            </div>
          </button>
          <button
            onClick={() => setRole("teacher")}
            className="flex items-start gap-4 rounded-xl border-2 border-slate-200 p-5 text-left transition-colors hover:border-brand-orange hover:bg-orange-50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-brand-orange">
              <GraduationCapIcon aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-brand-navy">Öğretmen olarak kayıt ol</p>
              <p className="mt-1 text-sm text-muted-foreground">
                İlan oluştur, ders talebi al ve öğrencilere ulaş.
              </p>
            </div>
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="font-medium text-brand-orange hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <button
        onClick={() => setRole(null)}
        className="mb-6 text-sm text-muted-foreground hover:text-brand-navy"
      >
        ← Geri dön
      </button>
      <h1 className="text-2xl font-bold text-brand-navy">
        {role === "teacher" ? "Öğretmen Hesabı Oluştur" : "Öğrenci Hesabı Oluştur"}
      </h1>
      {role === "teacher" ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Kayıt sonrası öğretmenlik uygunluk testini geçmen gerekiyor.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Bilgilerinizi girerek hesabınızı oluşturun.</p>
      )}
      <div className="mt-8">
        <RegisterForm role={role} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-medium text-brand-orange hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
