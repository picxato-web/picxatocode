import { useState } from 'react';
import AssetCard from './AssetCard';

interface Asset {
  id: string;
  title: string;
  thumbnail_url: string;
  downloads_count: number;
  views_count: number;
}

interface CategorySectionProps {
  title: string;
  description: string;
  slug: string;
  assets: Asset[];
  onAssetClick: (assetId: string) => void;
}

export default function CategorySection({
  title,
  description,
  slug,
  assets,
  onAssetClick,
}: CategorySectionProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setActiveTab('latest')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'latest'
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Latest Uploads
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'trending'
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Trending
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {assets.slice(0, 10).map((asset) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              title={asset.title}
              thumbnailUrl={asset.thumbnail_url}
              downloadsCount={asset.downloads_count || 0}
              viewsCount={asset.views_count || 0}
              onClick={() => onAssetClick(asset.id)}
            />
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <a
          href={`/category/${slug}`}
          className="inline-block px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          More +
        </a>
      </div>
    </section>
  );
}
