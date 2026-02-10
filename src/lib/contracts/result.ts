export type DataSource = "supabase" | "directus" | "none";

export type AppErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NOT_CONFIGURED"
  | "INTERNAL";

type SuccessResult<T> = {
  ok: true;
  data: T;
  meta: {
    source: DataSource;
    at: string;
  };
};

type ErrorResult = {
  ok: false;
  error: {
    code: AppErrorCode;
    message: string;
    detail?: string;
  };
};

export type AppResult<T> = SuccessResult<T> | ErrorResult;

export function resultOk<T>(data: T, source: DataSource): AppResult<T> {
  return {
    ok: true,
    data,
    meta: {
      source,
      at: new Date().toISOString(),
    },
  };
}

export function resultErr(code: AppErrorCode, message: string, detail?: string): AppResult<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(detail ? { detail } : {}),
    },
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}
