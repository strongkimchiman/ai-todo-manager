/**
 * 할 일(Todo) UI 표시용 유틸
 * - "지연" 상태 계산, 우선순위 라벨/배지 스타일 등을 담당합니다.
 */

import { format } from "date-fns"

import type { TodoPriority, TodoRow } from "@/components/todo/types"

export const getPriorityLabel = (priority: TodoPriority) => {
  switch (priority) {
    case "high":
      return "높음"
    case "medium":
      return "중간"
    case "low":
      return "낮음"
    default:
      return "중간"
  }
}

export const getPriorityBadgeVariant = (priority: TodoPriority) => {
  switch (priority) {
    case "high":
      return "destructive" as const
    case "medium":
      return "secondary" as const
    case "low":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

export const isDelayedTodo = (todo: Pick<TodoRow, "due_date" | "is_completed">) => {
  if (todo.is_completed) return false
  if (!todo.due_date) return false
  return new Date(todo.due_date).getTime() < Date.now()
}

export const formatDueDateKorean = (dueDateUtcIso: string) => {
  const d = new Date(dueDateUtcIso)
  if (Number.isNaN(d.getTime())) return "마감일 없음"
  return format(d, "yyyy.MM.dd HH:mm")
}

/**
 * `datetime-local` 입력값(로컬)을 UTC ISO 문자열로 변환합니다.
 * - 예) "2026-02-06T10:00" -> "2026-02-06T01:00:00.000Z" (KST 기준)
 */
export const toUtcIsoFromDatetimeLocal = (localValue: string) => {
  const d = new Date(localValue)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

/**
 * UTC ISO 문자열을 `datetime-local` 입력값(로컬) 형태로 변환합니다.
 * - 예) "2026-02-06T01:00:00.000Z" -> "2026-02-06T10:00" (KST 기준)
 */
export const toDatetimeLocalFromUtcIso = (utcIso: string) => {
  const d = new Date(utcIso)
  if (Number.isNaN(d.getTime())) return ""
  const pad2 = (n: number) => String(n).padStart(2, "0")
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const min = pad2(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

