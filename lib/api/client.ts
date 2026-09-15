export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function simulateRequest<T>(
  value: T,
  options?: { fail?: boolean }
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 420))
  if (options?.fail)
    throw new ApiError("We couldn’t complete that request. Please try again.")
  return structuredClone(value)
}

export async function simulateSave<T>(value: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 550))
  return structuredClone(value)
}
