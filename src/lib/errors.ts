/**
 * שכבת שגיאות אפליקציה — הודעות בעברית למשתמש.
 * אין לרשום סודות או פרטים רגישים ל-console בפרודקשן.
 */

export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "RATE_LIMIT"
  | "CONFLICT"
  | "INTERNAL"
  | "SERVICE_UNAVAILABLE";

const DEFAULT_MESSAGES: Record<AppErrorCode, string> = {
  UNAUTHORIZED: "יש להתחבר כדי להמשיך.",
  FORBIDDEN: "אין לך הרשאה לבצע פעולה זו.",
  NOT_FOUND: "הפריט המבוקש לא נמצא.",
  VALIDATION: "חלק מהפרטים אינם תקינים. אנא בדקו ונסחו מחדש.",
  RATE_LIMIT: "בוצעו יותר מדי ניסיונות. אנא נסו שוב בעוד מספר דקות.",
  CONFLICT: "הפעולה מתנגשת עם מצב קיים. רעננו את העמוד ונסו שוב.",
  INTERNAL: "אירעה שגיאה בלתי צפויה. אנא נסו שוב מאוחר יותר.",
  SERVICE_UNAVAILABLE: "השירות אינו זמין כרגע. אנא נסו שוב מאוחר יותר.",
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly details?: unknown;
  readonly userMessage: string;

  constructor(
    code: AppErrorCode,
    options?: {
      message?: string;
      userMessage?: string;
      status?: number;
      details?: unknown;
      cause?: unknown;
    },
  ) {
    super(options?.message ?? options?.userMessage ?? DEFAULT_MESSAGES[code]);
    this.name = "AppError";
    this.code = code;
    this.userMessage = options?.userMessage ?? DEFAULT_MESSAGES[code];
    this.status = options?.status ?? statusForCode(code);
    this.details = options?.details;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

function statusForCode(code: AppErrorCode): number {
  switch (code) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "VALIDATION":
      return 400;
    case "RATE_LIMIT":
      return 429;
    case "CONFLICT":
      return 409;
    case "SERVICE_UNAVAILABLE":
      return 503;
    default:
      return 500;
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  if (error instanceof Error && error.message) {
    // אל תחשפו הודעות טכניות גולמיות למשתמש
    return DEFAULT_MESSAGES.INTERNAL;
  }
  return DEFAULT_MESSAGES.INTERNAL;
}

/** לוג שרת בטוח — ללא סיסמאות / מפתחות */
export function logServerError(context: string, error: unknown): void {
  const safe =
    error instanceof AppError
      ? { code: error.code, message: error.message, details: error.details }
      : error instanceof Error
        ? { name: error.name, message: error.message }
        : typeof error === "object" && error !== null && "message" in error
          ? {
              code: (error as { code?: unknown }).code,
              message: String((error as { message?: unknown }).message),
            }
          : { error: "unknown" };

  console.error(`[${context}]`, safe);
}
