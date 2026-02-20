import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { 
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug');

    if (data) {
      setCategories(data);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">PIXATO</h2>
            <p className="text-gray-400 text-sm">
              High Quality Digital Assets
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <a
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">More Categories</h3>
            <ul className="space-y-2">
              {categories.slice(3).map((category) => (
                <li key={category.id}>
                  <a
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="hover:text-white transition-colors">
                License Summary
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Copyright 2025. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
