/**
 * 할 일 목록(TodoList) 컴포넌트
 * - PRD의 3대 상태(로딩/빈/오류)를 기본 제공하여 UX를 안정적으로 유지합니다.
 */

import type * as React from "react"
import { AlertCircleIcon } from "lucide-react"

import { TodoCard } from "@/components/todo/TodoCard"
import type { TodoRow } from "@/components/todo/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type TodoListProps = {
  todos?: TodoRow[]
  isLoading?: boolean
  errorMessage?: string | null
  onRetry?: () => void
  /** 각 카드 액션(편집/삭제 등)을 외부에서 주입 */
  renderActions?: (todo: TodoRow) => React.ReactNode
  /** 빈 상태 CTA */
  emptyCta?: React.ReactNode
  className?: string
}

export const TodoList = ({
  todos,
  isLoading = false,
  errorMessage = null,
  onRetry,
  renderActions,
  emptyCta,
  className,
}: TodoListProps) => {
  if (isLoading) {
    return (
      <div className={cn("grid gap-3", className)} aria-busy="true" aria-live="polite">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  if (errorMessage) {
    return (
      <Alert variant="destructive" className={cn(className)}>
        <AlertCircleIcon />
        <AlertTitle>목록을 불러오지 못했어요</AlertTitle>
        <AlertDescription className="gap-3">
          <p>{errorMessage}</p>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              다시 시도
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    )
  }

  const safeTodos = todos ?? []

  if (safeTodos.length === 0) {
    return (
      <Empty className={cn("border", className)}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon className="size-5" />
          </EmptyMedia>
          <EmptyTitle>할 일이 아직 없어요</EmptyTitle>
          <EmptyDescription>
            자연어로 입력해도 되고, 폼으로 직접 추가해도 돼요.
          </EmptyDescription>
        </EmptyHeader>
        {emptyCta ? <EmptyContent>{emptyCta}</EmptyContent> : null}
      </Empty>
    )
  }

  return (
    <div className={cn("grid gap-3", className)}>
      {safeTodos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          actions={renderActions ? renderActions(todo) : undefined}
        />
      ))}
    </div>
  )
}

