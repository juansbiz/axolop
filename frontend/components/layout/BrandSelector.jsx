import { useState, useRef, useEffect } from "react";
import { ChevronDown, Store, Plus, Settings, Trash2, UserPlus } from "lucide-react";
import { useBrand } from "@/hooks/useBrand";

const MOCK_BRANDS = [
  { id: 1, name: "My Store", slug: "my-store", logo_url: null },
];

export default function BrandSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { brand, brands, setBrand } = useBrand();

  const currentBrand = brand || MOCK_BRANDS[0];
  const brandList = brands?.length > 0 ? brands : MOCK_BRANDS;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBrandSelect = (selectedBrand) => {
    setBrand(selectedBrand);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E92C92] to-[#C81E78] flex items-center justify-center">
          <Store className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-900">{currentBrand?.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase">Your Brands</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {brandList.map((b) => (
              <button
                key={b.id}
                onClick={() => handleBrandSelect(b)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left
                  ${b.id === currentBrand?.id ? "bg-purple-50" : ""}
                `}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Store className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.name}</p>
                  <p className="text-xs text-gray-500 truncate">{b.slug}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 p-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left rounded-lg">
              <Plus className="h-4 w-4 text-[#E92C92]" />
              <span className="text-sm text-[#E92C92] font-medium">Add New Brand</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
