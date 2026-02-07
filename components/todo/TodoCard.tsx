/**
 * 개별 할 일(Todo)을 표시하는 카드 컴포넌트
 * - 서버/클라이언트 어디서나 사용 가능하도록(훅/클라이언트 전용 의존성 없이) 설계합니다.
 */

import type * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { TodoRow } from "@/components/todo/types"
import {
  formatDueDateKorean,
  getPriorityBadgeVariant,
  getPriorityLabel,
  isDelayedTodo,
} from "@/components/todo/todo-utils"

type TodoCardProps = {
  todo: TodoRow
  /** 카드 우측 상단/하단 액션 영역(편집/삭제 버튼 등)을 외부에서 주입 */
  actions?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const TodoCard = ({ todo, actions, footer, className }: TodoCardProps) => {
  const isDelayed = isDelayedTodo(todo)

  return (
    <Card className={cn("py-0", className)}>
      <CardHeader className="py-5">
        <CardTitle className="flex min-w-0 items-center gap-2">
          <span className={cn("min-w-0 truncate", todo.is_completed && "opacity-70 line-through")}>
            {todo.title}
          </span>
        </CardTitle>

        <CardDescription className="flex flex-wrap items-center gap-2">
          <Badge variant={getPriorityBadgeVariant(todo.priority)}>
            우선순위: {getPriorityLabel(todo.priority)}
          </Badge>

          {todo.category ? <Badge variant="outline">카테고리: {todo.category}</Badge> : null}

          {todo.is_completed ? (
            <Badge>완료</Badge>
          ) : isDelayed ? (
            <Badge variant="destructive">지연</Badge>
          ) : (
            <Badge variant="secondary">진행 중</Badge>
          )}

          {todo.due_date ? (
            <Badge variant="outline">마감: {formatDueDateKorean(todo.due_date)}</Badge>
          ) : (
            <Badge variant="outline">마감일 없음</Badge>
          )}
        </CardDescription>

        {actions ? <CardAction className="flex items-center gap-2">{actions}</CardAction> : null}
      </CardHeader>

      {todo.description ? (
        <CardContent className="pb-5">
          <p className={cn("text-sm leading-relaxed", todo.is_completed && "opacity-70")}>
            {todo.description}
          </p>
        </CardContent>
      ) : null}

      {footer ? <CardFooter className="border-t py-4">{footer}</CardFooter> : null}
    </Card>
  )
}

