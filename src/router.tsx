import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 pt-32">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">Please refresh the page or head back home.</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.18em] text-background">Go home</a>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};

