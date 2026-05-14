import { ServiceResult } from "@/lib/types/service-result";

export async function executeService<T>(
  fn: () => Promise<T>,
  errorMessage: string,
): Promise<ServiceResult<T>> {
  try {
    const data = await fn();

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: errorMessage,
    };
  }
}
