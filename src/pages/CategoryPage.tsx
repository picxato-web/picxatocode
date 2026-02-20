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
  prompt_text?: string; // Added for the copy functionality
  description?: string;
}

interface CategoryPageProps {
  slug: string;
}

const ITEMS_PER_PAGE = 20;

// Sub-component to handle individual prompt items and their copy state
function PromptListItem({
  asset,
  onClick,
}: {
  asset: Asset;
  onClick: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the onClick for the whole row
    const textToCopy = asset.description || asset.title;
    navigator.clipboard.writeText(textToCopy);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex-1 mr-4">
        <h3 className="font-medium text-gray-900">{asset.title}</h3>
        {asset.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {asset.description}
          </p>
        )}
      </div>
      <button
        onClick={handleCopy}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          copied
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

export default function CategoryPage({ slug }: CategoryPageProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndAssets();
  }, [slug, currentPage, sortBy]);

  const fetchCategoryAndAssets = async () => {
    setLoading(true);
debugger
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, name, description')
      .eq('slug', slug)
      .maybeSingle();

    if (categoryData) {
      setCategoryName(categoryData.name);
      setCategoryDescription(categoryData.description || '');

      const { count } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryData.id);

      setTotalCount(count || 0);

      const orderBy = sortBy === 'latest' ? 'created_at' : 'downloads_count';
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .eq('category_id', categoryData.id)
        .order(orderBy, { ascending: false })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE - 1
        );

      if (assetsData) {
        setAssets(assetsData);
      }
    }

    setLoading(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleAssetClick = (assetId: string) => {
    window.location.href = `/asset/${assetId}`;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Check if the current section is Aiprompt
  const isAiprompt = categoryName.toLowerCase().replace(/\s+/g, '') === 'aiprompts';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">{categoryDescription}</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {totalCount} assets available
            </p>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => {
                  setSortBy('latest');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Latest Uploads
              </button>
              <button
                onClick={() => {
                  setSortBy('trending');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'trending'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Trending
              </button>
            </div>
          </div>

          {loading ? (
            // Custom loading skeleton depending on type
            isAiprompt ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            )
          ) : (
            <>
              {/* Conditionally Render List OR Image Grid */}
              {isAiprompt ? (
                <div className="flex flex-col gap-3 mb-8">
                  {assets.map((asset) => (
                    <PromptListItem
                      key={asset.id}
                      asset={asset}
                      onClick={() => handleAssetClick(asset.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}