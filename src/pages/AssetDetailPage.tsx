import { useEffect, useState } from 'react';
import { Download, Eye, Tag, Calendar, HardDrive } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssetCard from '../components/AssetCard';

interface Asset {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  file_url: string;
  file_type: string;
  file_size: number;
  width: number;
  height: number;
  downloads_count: number;
  views_count: number;
  tags: string[];
  created_at: string;
  category_id: string;
}

interface RelatedAsset {
  id: string;
  title: string;
  thumbnail_url: string;
  downloads_count: number;
  views_count: number;
}

interface AssetDetailPageProps {
  assetId: string;
}

export default function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssetDetails();
    incrementViewCount();
  }, [assetId]);

  const fetchAssetDetails = async () => {
    setLoading(true);

    const { data: assetData } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .maybeSingle();

    if (assetData) {
      setAsset(assetData);

      const { data: relatedData } = await supabase
        .from('assets')
        .select('id, title, thumbnail_url, downloads_count, views_count')
        .eq('category_id', assetData.category_id)
        .neq('id', assetId)
        .limit(5);

      if (relatedData) {
        setRelatedAssets(relatedData);
      }
    }

    setLoading(false);
  };

  const incrementViewCount = async () => {
    await supabase.rpc('increment', {
      row_id: assetId,
      x: 1,
    });
  };

  const handleDownload = async () => {
    if (!asset) return;

    await supabase.from('downloads').insert({
      asset_id: assetId,
      ip_address: 'unknown',
    });

    await supabase
      .from('assets')
      .update({ downloads_count: (asset.downloads_count || 0) + 1 })
      .eq('id', assetId);

    window.open(asset.file_url, '_blank');
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Asset not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <img
                src={asset.thumbnail_url}
                alt={asset.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {asset.title}
              </h1>

              {asset.description && (
                <p className="text-gray-600 mb-6">{asset.description}</p>
              )}

              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download size={16} />
                    <span>{asset.downloads_count} downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye size={16} />
                    <span>{asset.views_count} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      {new Date(asset.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HardDrive size={16} />
                    <span>{formatFileSize(asset.file_size || 0)}</span>
                  </div>
                </div>

                {asset.width && asset.height && (
                  <div className="mb-6 text-sm text-gray-600">
                    <span className="font-medium">Dimensions:</span> {asset.width} x{' '}
                    {asset.height}
                  </div>
                )}

                {asset.tags && asset.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <Tag size={16} />
                      <span className="font-medium">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Free
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-1">Free License</p>
                <p className="text-blue-700">
                  Free for personal and commercial use. Attribution appreciated but
                  not required.
                </p>
              </div>
            </div>
          </div>

          {relatedAssets.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Assets
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedAssets.map((relatedAsset) => (
                  <AssetCard
                    key={relatedAsset.id}
                    id={relatedAsset.id}
                    title={relatedAsset.title}
                    thumbnailUrl={relatedAsset.thumbnail_url}
                    downloadsCount={relatedAsset.downloads_count || 0}
                    viewsCount={relatedAsset.views_count || 0}
                    onClick={() =>
                      (window.location.href = `/asset/${relatedAsset.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
