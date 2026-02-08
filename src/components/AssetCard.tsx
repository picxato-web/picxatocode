import { Download, Eye } from 'lucide-react';

interface AssetCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  downloadsCount: number;
  viewsCount: number;
  onClick: () => void;
}

export default function AssetCard({
  id,
  title,
  thumbnailUrl,
  downloadsCount,
  viewsCount,
  onClick,
}: AssetCardProps) {
  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-medium mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Download size={14} />
              <span>{downloadsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
