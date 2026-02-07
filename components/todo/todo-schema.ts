/**
 * 할 일(Todo) 폼 입력값 스키마
 * - UI 폼에서는 `datetime-local` 값을 다루기 때문에 로컬 문자열을 받고,
 *   제출 시 UTC ISO로 변환해 서버로 전달합니다.
 */

import { z } from "zod"

export const TodoPrioritySchema = z.enum(["high", "medium", "low"], {
  message: "우선순위를 선택해주세요.",
})

export const TodoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요.")
    .max(120, "제목은 120자 이내로 입력해주세요."),
  description: z
    .string()
    .trim()
    .max(2000, "설명은 2000자 이내로 입력해주세요.")
    .optional(),
  priority: TodoPrioritySchema,
  category: z
    .string()
    .trim()
    .max(50, "카테고리는 50자 이내로 입력해주세요.")
    .optional(),
  /**
   * 브라우저 `datetime-local` 문자열 (예: 2026-02-06T10:00)
   * - 비어있으면 미입력으로 처리
   */
  due_date_local: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(new Date(v).getTime()),
      "마감일 형식이 올바르지 않습니다."
    ),
  is_completed: z.boolean().optional(),
})

export type TodoFormValues = z.infer<typeof TodoFormSchema>

