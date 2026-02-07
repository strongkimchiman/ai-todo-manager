/**
 * 할 일 추가/편집 폼(TodoForm) 컴포넌트
 * - Zod + react-hook-form 기반 검증
 * - 중복 제출 방지(버튼 disabled + 로딩 스피너)
 * - `datetime-local` 입력값을 UTC ISO로 변환하여 서버 저장 규칙(UTC 저장)을 기본 준수
 */

"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SaveIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import type { TodoRow, TodoUpsertInput } from "@/components/todo/types"
import { TodoFormSchema, type TodoFormValues } from "@/components/todo/todo-schema"
import {
  toDatetimeLocalFromUtcIso,
  toUtcIsoFromDatetimeLocal,
} from "@/components/todo/todo-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type TodoFormProps = {
  /** 편집 모드일 경우 초기값으로 채울 Todo */
  initialTodo?: TodoRow
  onSubmit: (input: TodoUpsertInput) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  className?: string
}

export const TodoForm = ({
  initialTodo,
  onSubmit,
  onCancel,
  submitLabel,
  className,
}: TodoFormProps) => {
  const [isPending, startTransition] = React.useTransition()
  const [submitErrorMessage, setSubmitErrorMessage] = React.useState<string | null>(null)

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      title: initialTodo?.title ?? "",
      description: initialTodo?.description ?? "",
      priority: initialTodo?.priority ?? "medium",
      category: initialTodo?.category ?? "",
      due_date_local: initialTodo?.due_date
        ? toDatetimeLocalFromUtcIso(initialTodo.due_date)
        : "",
      is_completed: initialTodo?.is_completed ?? false,
    },
    mode: "onBlur",
  })

  const resolvedSubmitLabel = submitLabel ?? (initialTodo ? "수정 저장" : "할 일 추가")

  const handleSubmit = form.handleSubmit((values) => {
    setSubmitErrorMessage(null)

    const dueDateUtcIso =
      values.due_date_local && values.due_date_local.trim().length > 0
        ? toUtcIsoFromDatetimeLocal(values.due_date_local)
        : null

    if (values.due_date_local && !dueDateUtcIso) {
      setSubmitErrorMessage("마감일 형식이 올바르지 않습니다. 다시 선택해주세요.")
      return
    }

    const payload: TodoUpsertInput = {
      title: values.title.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      priority: values.priority,
      category: values.category?.trim() ? values.category.trim() : null,
      due_date: dueDateUtcIso,
      is_completed: Boolean(values.is_completed),
    }

    startTransition(async () => {
      try {
        await onSubmit(payload)
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "요청 처리 중 오류가 발생했습니다."
        setSubmitErrorMessage(message)
      }
    })
  })

  return (
    <div className={cn("w-full", className)}>
      {submitErrorMessage ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>저장에 실패했어요</AlertTitle>
          <AlertDescription>{submitErrorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input placeholder="예: 내일 아침 10시 팀 회의" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="필요한 메모가 있다면 적어주세요 (선택)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>우선순위</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="우선순위를 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="medium">중간</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 업무 / 개인 / 학습" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="due_date_local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>마감일</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    선택한 시간은 저장 시 UTC로 변환되어 저장됩니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_completed"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                      aria-label="완료 여부"
                    />
                  </FormControl>
                  <div className="grid gap-1 leading-none">
                    <FormLabel className="m-0">완료</FormLabel>
                    <FormDescription>완료된 할 일로 표시합니다.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                <XIcon />
                취소
              </Button>
            ) : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner className="mr-1" /> : <SaveIcon />}
              {resolvedSubmitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

