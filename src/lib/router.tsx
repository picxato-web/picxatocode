import { useEffect, useState } from 'react';
import HomePage from '../pages/HomePage';
import CategoryPage from '../pages/CategoryPage';
import AssetDetailPage from '../pages/AssetDetailPage';
import SearchPage from '../pages/SearchPage';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/') {
    return <HomePage />;
  }

  if (currentPath.startsWith('/category/')) {
    const slug = currentPath.split('/category/')[1];
    return <CategoryPage slug={slug} />;
  }

  if (currentPath.startsWith('/asset/')) {
    const assetId = currentPath.split('/asset/')[1];
    return <AssetDetailPage assetId={assetId} />;
  }

  if (currentPath === '/search') {
    const query = searchParams.get('q') || '';
    return <SearchPage query={query} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <a
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
