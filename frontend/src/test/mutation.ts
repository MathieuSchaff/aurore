import type {
  UseMutateAsyncFunction,
  UseMutateFunction,
  UseMutationResult,
} from '@tanstack/react-query'
import { vi } from 'vitest'

export function makeIdleMutationResult<TData, TError, TVariables, TContext = unknown>(
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>,
  reset: () => void = vi.fn()
): UseMutationResult<TData, TError, TVariables, TContext> {
  return {
    context: undefined,
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    isError: false,
    isIdle: true,
    isPaused: false,
    isPending: false,
    isSuccess: false,
    mutate,
    mutateAsync: vi.fn<UseMutateAsyncFunction<TData, TError, TVariables, TContext>>(),
    reset,
    status: 'idle',
    submittedAt: 0,
    variables: undefined,
  }
}

export function makePendingMutationResult<TData, TError, TVariables, TContext = unknown>(
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>,
  variables: TVariables,
  reset: () => void = vi.fn()
): UseMutationResult<TData, TError, TVariables, TContext> {
  return {
    context: undefined,
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    isError: false,
    isIdle: false,
    isPaused: false,
    isPending: true,
    isSuccess: false,
    mutate,
    mutateAsync: vi.fn<UseMutateAsyncFunction<TData, TError, TVariables, TContext>>(),
    reset,
    status: 'pending',
    submittedAt: 1,
    variables,
  }
}

export function makeErrorMutationResult<TData, TError, TVariables, TContext = unknown>(
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>,
  error: TError,
  variables: TVariables,
  reset: () => void = vi.fn()
): UseMutationResult<TData, TError, TVariables, TContext> {
  return {
    context: undefined,
    data: undefined,
    error,
    failureCount: 1,
    failureReason: error,
    isError: true,
    isIdle: false,
    isPaused: false,
    isPending: false,
    isSuccess: false,
    mutate,
    mutateAsync: vi.fn<UseMutateAsyncFunction<TData, TError, TVariables, TContext>>(),
    reset,
    status: 'error',
    submittedAt: 0,
    variables,
  }
}
