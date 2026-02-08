import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Asset {
  id: string;
  title: string;
  thumbnail_url: string;
  downloads_count: number;
  views_count: number;
  category_id: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [assetsByCategory, setAssetsByCategory] = useState<Record<string, Asset[]>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');

    if (categoriesData) {
      setCategories(categoriesData);

      const assetsMap: Record<string, Asset[]> = {};
      for (const category of categoriesData) {
        const { data: assetsData } = await supabase
          .from('assets')
          .select('*')
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (assetsData) {
          assetsMap[category.id] = assetsData;
        }
      }
      setAssetsByCategory(assetsMap);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleAssetClick = (assetId: string) => {
    window.location.href = `/asset/${assetId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main>
        <div className="bg-white py-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Download Stunning PNG's & Background Images
            </h1>
            <p className="text-lg text-gray-600">
              High Quality Free Assets
            </p>
          </div>
        </div>

        {categories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.name}
            description={category.description || ''}
            slug={category.slug}
            assets={assetsByCategory[category.id] || []}
            onAssetClick={handleAssetClick}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}
