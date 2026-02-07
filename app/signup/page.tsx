/**
 * 회원가입 페이지 컴포넌트
 * - 이메일/비밀번호 입력 폼과 서비스 소개를 제공하는 회원가입 화면입니다.
 * - 이후 Supabase Auth + 서버 액션과 연동될 수 있도록 기본적인 마크업 구조만 구성합니다.
 */

import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "회원가입 | AI Todo Manager",
  description: "AI 기반 할 일 관리 웹 서비스 회원가입 페이지입니다.",
}

export default function SignupPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4">
      <main className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full font-semibold">
                AI
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  AI Todo Manager
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  자연어 한 줄로 할 일을 추가하고, Gemini AI가 업무를 구조화해주는 스마트 할 일
                  관리 서비스
                </p>
              </div>
            </div>

            <CardDescription className="text-sm">
              이메일로 간단히 가입하고, AI가 정리해주는 할 일 관리를 시작해보세요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="grid gap-4" method="post">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="8자 이상 비밀번호를 입력하세요"
                  required
                />
              </div>

              <Button type="submit" className="mt-2 w-full">
                회원가입
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t pt-4 text-sm">
            <p className="text-muted-foreground text-xs">
              이미 계정을 가지고 계신가요?
            </p>
            <div className="flex items-center justify-between gap-2">
              <span>로그인하고 AI Todo Manager를 바로 사용해보세요.</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

