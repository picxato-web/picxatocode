import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssetCard from '../components/AssetCard';
import Pagination from '../components/Pagination';

interface Asset {
  id: string;
  title: string;
  thumbnail_url: string;
  downloads_count: number;
  views_count: number;
}

interface SearchPageProps {
  query: string;
}

const ITEMS_PER_PAGE = 20;

export default function SearchPage({ query }: SearchPageProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchAssets();
    }
  }, [query, currentPage]);

  const searchAssets = async () => {
    setLoading(true);

    const searchTerm = `%${query.toLowerCase()}%`;

    const { count } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true })
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);

    setTotalCount(count || 0);

    const { data: assetsData } = await supabase
      .from('assets')
      .select('*')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order('created_at', { ascending: false })
      .range(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE - 1
      );

    if (assetsData) {
      setAssets(assetsData);
    }

    setLoading(false);
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(newQuery)}`;
    }
  };

  const handleAssetClick = (assetId: string) => {
    window.location.href = `/asset/${assetId}`;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">{totalCount} assets found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : assets.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    id={asset.id}
                    title={asset.title}
                    thumbnailUrl={asset.thumbnail_url}
                    downloadsCount={asset.downloads_count || 0}
                    viewsCount={asset.views_count || 0}
                    onClick={() => handleAssetClick(asset.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No assets found matching your search.
              </p>
              <p className="text-gray-500 mt-2">Try different keywords</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
