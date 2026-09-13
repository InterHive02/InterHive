import { toast, ToastOptions } from 'react-hot-toast';

export const useToast = () => {
  const showToast = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: 4000,
      ...options,
    });
  };

  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: 3000,
      ...options,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: 4000,
      ...options,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: 3000,
      icon: '⚠️',
      ...options,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      ...options,
    });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      duration: Infinity,
      ...options,
    });
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, options);
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    promise,
  };
};
