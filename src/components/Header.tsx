import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('display_order');

    if (data) {
      setCategories(data);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold text-gray-900">
              PIXATO
            </a>

            <nav className="hidden md:flex items-center gap-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Login
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {category.name}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="bg-gray-50 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you Looking for?"
                className="w-full px-6 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
