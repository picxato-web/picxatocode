import { useState } from 'react';
import AssetCard from './AssetCard';

interface Asset {
  id: string;
  title: string;
  thumbnail_url: string;
  downloads_count: number;
  views_count: number;
  description?: string; // Added this in case your prompt text differs from the title
}

interface CategorySectionProps {
  title: string;
  description: string;
  slug: string;
  assets: Asset[];
  onAssetClick: (assetId: string) => void;
}

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

export default function CategorySection({
  title,
  description,
  slug,
  assets,
  onAssetClick,
}: CategorySectionProps) {
  debugger
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');

  // Check if the current section is Aiprompt
  const isAiprompt = title.toLowerCase().replace(/\s+/g, '') === 'aiprompts';

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

        {/* Conditionally Render List OR Image Grid */}
        {isAiprompt ? (
          <div className="flex flex-col gap-3 mb-6">
            {assets.slice(0, 10).map((asset) => (
              <PromptListItem
                key={asset.id}
                asset={asset}
                onClick={() => onAssetClick(asset.id)}
              />
            ))}
          </div>
        ) : (
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
        )}

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