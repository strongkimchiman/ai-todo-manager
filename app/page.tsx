"use client"

import * as React from "react"
import {
  FilterIcon,
  LogOutIcon,
  SearchIcon,
  SortDescIcon,
} from "lucide-react"

import { TodoForm, TodoList, type TodoPriority, type TodoRow } from "@/components/todo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "completed" | "pending"
type SortBy = "priority" | "dueDate" | "createdAt"

const mockUser = {
  name: "홍길동",
  email: "user@example.com",
}

const mockTodos: TodoRow[] = [
  {
    id: "1",
    title: "내일 아침 10시 팀 회의",
    description: "회의 안건 정리 및 진행 현황 공유",
    priority: "high",
    category: "업무",
    due_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "주간 리포트 작성",
    description: "이번 주 완료 작업 및 다음 주 계획 정리",
    priority: "medium",
    category: "업무",
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "운동 30분 하기",
    description: "가벼운 러닝 또는 홈트레이닝",
    priority: "low",
    category: "개인",
    due_date: null,
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "AI Todo Manager PRD 검토",
    description: "요구사항 다시 읽고 구현 범위 정리",
    priority: "high",
    category: "학습",
    due_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "메일함 정리",
    description: "안 읽은 메일 정리 및 중요 메일 라벨링",
    priority: "low",
    category: "업무",
    due_date: null,
    is_completed: true,
    created_at: new Date().toISOString(),
  },
]

export default function HomePage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [priorityFilter, setPriorityFilter] = React.useState<"all" | TodoPriority>("all")
  const [sortBy, setSortBy] = React.useState<SortBy>("priority")

  const filteredTodos = React.useMemo(() => {
    let result = [...mockTodos]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(q) ||
          (todo.description ?? "").toLowerCase().includes(q)
      )
    }

    if (statusFilter === "completed") {
      result = result.filter((todo) => todo.is_completed)
    } else if (statusFilter === "pending") {
      result = result.filter((todo) => !todo.is_completed)
    }

    if (priorityFilter !== "all") {
      result = result.filter((todo) => todo.priority === priorityFilter)
    }

    result.sort((a, b) => {
      if (sortBy === "priority") {
        const order: Record<TodoPriority, number> = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }

      if (sortBy === "dueDate") {
        const aTime = a.due_date ? new Date(a.due_date).getTime() : Infinity
        const bTime = b.due_date ? new Date(b.due_date).getTime() : Infinity
        return aTime - bTime
      }

      // createdAt
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
      return bTime - aTime
    })

    return result
  }, [search, statusFilter, priorityFilter, sortBy])

  const handleMockSubmit = async () => {
    // 실제 서버 액션/ Supabase 연동 전까지는 UI 구조만 제공
    // eslint-disable-next-line no-console
    console.log("TodoForm submitted (mock). 데이터 연동은 아직 구현 전입니다.")
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-semibold shadow-sm">
              AI
            </div>
            <div className="space-y-0.5">
              <h1 className="text-base font-semibold leading-tight">
                AI Todo Manager
              </h1>
              <p className="text-muted-foreground text-xs">
                Gemini AI와 함께 하는 스마트 할 일 관리
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">
                {mockUser.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {mockUser.email}
              </p>
            </div>
            <Avatar size="sm">
              <AvatarFallback>
                {mockUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Separator orientation="vertical" className="h-6" />
            <Button type="button" variant="outline" size="sm">
              <LogOutIcon className="mr-1 size-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 툴바 */}
      <section className="border-b bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative flex min-w-[200px] flex-1 items-center">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4" />
            <Input
              placeholder="제목 또는 설명으로 검색"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <FilterIcon className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-xs">상태</span>
              <Select
                value={statusFilter}
                onValueChange={(v: StatusFilter) => setStatusFilter(v)}
              >
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">미완료</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">우선순위</span>
              <Select
                value={priorityFilter}
                onValueChange={(v: "all" | TodoPriority) => setPriorityFilter(v)}
              >
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <SortDescIcon className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-xs">정렬</span>
              <Select
                value={sortBy}
                onValueChange={(v: SortBy) => setSortBy(v)}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">우선순위(높음 우선)</SelectItem>
                  <SelectItem value="dueDate">마감일(임박 순)</SelectItem>
                  <SelectItem value="createdAt">생성일(최신 순)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 본문 레이아웃 */}
      <main className="flex-1 bg-muted/40">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row">
          {/* 좌측/상단: TodoForm */}
          <section className="lg:w-[36%]">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  새로운 할 일 추가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TodoForm onSubmit={handleMockSubmit} />
              </CardContent>
            </Card>
          </section>

          {/* 우측/하단: TodoList */}
          <section className={cn("flex-1", "lg:w-[64%]")}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">
                  내 할 일
                </CardTitle>
                <span className="text-muted-foreground text-xs">
                  총 {filteredTodos.length}개
                </span>
              </CardHeader>
              <CardContent>
                <TodoList todos={filteredTodos} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
