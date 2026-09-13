import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface UseAuthFormOptions<T> {
  schema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
}

export const useAuthForm = <T extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
}: UseAuthFormOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const handleFormSubmit = async (data: T) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    isLoading,
    setError,
    watch,
    reset,
  };
};
