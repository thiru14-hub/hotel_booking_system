import React from 'react';
import {
  Utensils,
  Sparkles,
  Compass,
  Waves,
  Wine,
  Sun,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';

interface ResortAmenitiesModalProps {
  onClose: () => void;
  onBookNow: () => void;
}

export const ResortAmenitiesModal: React.FC<ResortAmenitiesModalProps> = ({
  onClose,
  onBookNow,
}) => {
  const experiences = [
    {
      title: 'Michelin-Starred Ocean Dining',
      tag: 'Gastronomy',
      desc: 'Savor seasonal Mediterranean tasting menus conceived by Executive Chef Matteo Rossi, paired with rare vintage wines.',
      icon: <Utensils className="w-5 h-5 text-amber-800" />,
    },
    {
      title: 'Rapolano Travertine Thermal Spa',
      tag: 'Holistic Wellness',
      desc: 'Mineral-rich subterranean thermal grottos, singing bowl sound immersion, and customized botanical body rituals.',
      icon: <Sparkles className="w-5 h-5 text-amber-800" />,
    },
    {
      title: 'Private 42ft Sunseeker Catamaran',
      tag: 'Maritime',
      desc: 'Glide through secluded sea caves, coral reefs, and private coves with personal sommelier and private captain.',
      icon: <Compass className="w-5 h-5 text-amber-800" />,
    },
    {
      title: 'Olympic Cantilevered Infinity Lagoon',
      tag: 'Hydrotherapy',
      desc: 'Heated saltwater pool seemingly suspended over the sea cliffs with submerged daybeds and sunset cocktail service.',
      icon: <Waves className="w-5 h-5 text-amber-800" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-[#FAF8F5] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 block mb-1">
            Resort Facilities & Gastronomy
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light">
            The Sanctuary Experience
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-lg">
            Every encounter at AURA is designed to restore balance through restorative architecture, organic culinary artistry, and ocean stillness.
          </p>
        </div>

        {/* List of Experiences */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                    {exp.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {exp.tag}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-semibold text-stone-900">
                  {exp.title}
                </h4>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Architectural Philosophy Note */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex items-start gap-3">
            <Sun className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-900 block font-serif text-sm mb-0.5">Biophilic Architecture</strong>
              Designed by award-winning coastal architects utilizing natural daylight angles, passive cooling ocean ventilation, native Rapolano travertine, and 100% renewable solar micro-grids.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-stone-200/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookNow();
            }}
            className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book A Stay</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
