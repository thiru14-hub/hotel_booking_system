import React, { useState } from 'react';
import { CameraPreset, MaterialTheme, TimeOfDay } from '../../types/hotel';
import {
  ChevronDown,
  ChevronUp,
  Camera,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  Layers,
  Palette,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface ThreeViewportDockProps {
  activeModelType: 'resort' | 'ocean_suite' | 'pool_villa' | 'penthouse';
  onSelectModelType: (type: 'resort' | 'ocean_suite' | 'pool_villa' | 'penthouse') => void;
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  timeOfDay: TimeOfDay;
  onSelectTimeOfDay: (time: TimeOfDay) => void;
  materialTheme: MaterialTheme;
  onSelectMaterialTheme: (theme: MaterialTheme) => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
}

export const ThreeViewportDock: React.FC<ThreeViewportDockProps> = ({
  activeModelType,
  onSelectModelType,
  cameraPreset,
  onSelectCameraPreset,
  timeOfDay,
  onSelectTimeOfDay,
  materialTheme,
  onSelectMaterialTheme,
  showHotspots,
  onToggleHotspots,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'model' | 'camera' | 'ambiance' | 'materials'>('model');

  const modelOptions = [
    { id: 'resort', label: 'Resort Complex', desc: 'Pavilion & Lagoons' },
    { id: 'ocean_suite', label: 'Ocean Suite', desc: 'Sunken Tub & Terrace' },
    { id: 'pool_villa', label: 'Pool Villa', desc: 'Canopy & Plunge Pool' },
    { id: 'penthouse', label: 'Sky Penthouse', desc: 'Duplex & Rooftop Spa' },
  ] as const;

  const cameraOptions = [
    { id: 'overview', label: 'Architectural Angle' },
    { id: 'bed', label: 'Master Bedroom' },
    { id: 'balcony', label: 'Balcony & Vista' },
    { id: 'lounge', label: 'Salon Lounge' },
    { id: 'topdown', label: 'Top Floorplan' },
  ] as const;

  const timeOptions: { id: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { id: 'morning', label: 'Morning Glow', icon: <Sunrise className="w-3.5 h-3.5" /> },
    { id: 'daylight', label: 'Natural Daylight', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'golden', label: 'Golden Sunset', icon: <Sunset className="w-3.5 h-3.5" /> },
    { id: 'dusk', label: 'Twilight Dusk', icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  const materialThemes: { id: MaterialTheme; label: string; previewColor: string; desc: string }[] = [
    { id: 'santorini', label: 'Santorini Travertine', previewColor: '#F4EFE6', desc: 'Bleached oak & Rapolano marble' },
    { id: 'kyoto', label: 'Kyoto Wabi-Sabi', previewColor: '#D2C0A5', desc: 'Warm walnut & washi textures' },
    { id: 'nordic', label: 'Nordic Cashmere', previewColor: '#EFEBE4', desc: 'Pale ash & natural linen' },
  ];

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[920px] transition-all duration-300">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="bg-white/95 border border-stone-200 border-b-0 px-4 py-1.5 rounded-t-xl text-xs font-medium text-stone-700 hover:text-stone-900 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
              <span>Show 3D Studio Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              <span>Hide Controls (Cinema View)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Control Glassmorphic Bar */}
      {!isCollapsed && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-3 sm:p-4 text-stone-800 transition-all">
          {/* Top category tabs */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100 flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('model')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'model'
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Architectural View</span>
              </button>

              <button
                onClick={() => setActiveTab('camera')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'camera'
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Presets</span>
              </button>

              <button
                onClick={() => setActiveTab('ambiance')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'ambiance'
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Sun & Lighting</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Material Palettes</span>
              </button>
            </div>

            {/* Hotspot Toggle */}
            <button
              onClick={onToggleHotspots}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                showHotspots
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Hotspots {showHotspots ? 'Visible' : 'Hidden'}</span>
            </button>
          </div>

          {/* Sub-Panel Content */}
          <div className="pt-1">
            {/* Tab 1: 3D Models */}
            {activeTab === 'model' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modelOptions.map((opt) => {
                  const isActive = activeModelType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectModelType(opt.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-amber-600 bg-amber-50/80 ring-1 ring-amber-600/30'
                          : 'border-stone-200/90 bg-stone-50/50 hover:bg-stone-100/70 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isActive ? 'text-amber-950' : 'text-stone-800'}`}>
                          {opt.label}
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Camera Presets */}
            {activeTab === 'camera' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {cameraOptions.map((cam) => {
                  const isActive = cameraPreset === cam.id;
                  return (
                    <button
                      key={cam.id}
                      onClick={() => onSelectCameraPreset(cam.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Time Of Day / Lighting */}
            {activeTab === 'ambiance' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeOptions.map((t) => {
                  const isActive = timeOfDay === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectTimeOfDay(t.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className={isActive ? 'text-amber-700' : 'text-stone-500'}>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 4: Material Themes */}
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {materialThemes.map((mat) => {
                  const isActive = materialTheme === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => onSelectMaterialTheme(mat.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600/30'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: mat.previewColor }}
                      />
                      <div>
                        <div className={`text-xs font-semibold ${isActive ? 'text-amber-950' : 'text-stone-800'}`}>
                          {mat.label}
                        </div>
                        <div className="text-[10px] text-stone-500">{mat.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
