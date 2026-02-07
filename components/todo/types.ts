/**
 * 할 일(Todo) 도메인 타입 정의
 * - PRD의 `todos` 테이블 컬럼을 기준으로 UI에서 사용하는 타입을 정리합니다.
 */

export type TodoPriority = "high" | "medium" | "low"

export type TodoRow = {
  id: string
  user_id?: string
  title: string
  description?: string | null
  priority: TodoPriority
  category?: string | null
  /** UTC ISO 문자열 (DB 저장 기준) */
  due_date?: string | null
  is_completed: boolean
  /** UTC ISO 문자열 */
  created_at?: string
}

/**
 * 할 일 생성/수정(Upsert) 입력값
 * - 서버 액션에서 Zod로 재검증하는 것을 전제로, UI 단에서 전달하는 형태를 통일합니다.
 */
export type TodoUpsertInput = {
  title: string
  description: string | null
  priority: TodoPriority
  category: string | null
  /** UTC ISO 문자열 (없으면 null) */
  due_date: string | null
  is_completed: boolean
}

