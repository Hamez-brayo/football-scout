// The fixture bundle uses only this stable React DOM API; the native app has no React DOM types.
declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: import('react').ReactNode): void;
    unmount(): void;
  };
}
