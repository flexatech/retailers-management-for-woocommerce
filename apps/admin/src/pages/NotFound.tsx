import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="mx-auto mt-[84px] max-w-7xl space-y-6 px-6">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-muted text-primary mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <span className="text-5xl font-extrabold">404</span>
        </div>
        <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground mb-6 text-base">
          Sorry, we couldn’t find the page you were looking for.
        </p>
        <a
          href="/"
          className="bg-primary hover:bg-primary/90 inline-block rounded-md px-6 py-2 text-sm font-medium text-white transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
