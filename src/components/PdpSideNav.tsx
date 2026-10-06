import React from 'react';
import { GraduationCap, LayoutGrid } from 'lucide-react';

interface PdpSideNavProps {
  activeTab?: 'my_pdp' | 'pdp';
  onSelectTab?: (tab: 'my_pdp' | 'pdp') => void;
}

export const PdpSideNav: React.FC<PdpSideNavProps> = ({
  activeTab = 'my_pdp',
  onSelectTab,
}) => {
  return (
    <aside className="w-44 lg:w-48 shrink-0 bg-white border-r border-slate-200 py-3.5 px-2 min-h-[calc(100vh-50px)] select-none hidden md:block">
      <div className="space-y-0.5">
        {/* Top Item: PDP (Matches LNA in reference image: smaller, sleek) */}
        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('pdp')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] transition-colors cursor-pointer text-left font-medium ${
            activeTab === 'pdp'
              ? 'text-[#0d5a7d] font-semibold'
              : 'text-[#0d5a7d] hover:bg-[#f0f6fa]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#0d5a7d] shrink-0" strokeWidth={2} />
          <span>PDP</span>
        </button>

        {/* Thin Divider Line (Matches reference image) */}
        <div className="border-t border-slate-200 my-1 mx-1" />

        {/* Sub Item: My PDP (Matches My LNA in reference image: smaller, sleek) */}
        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('my_pdp')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] transition-colors cursor-pointer text-left font-medium ${
            activeTab === 'my_pdp'
              ? 'text-[#0d5a7d] font-semibold'
              : 'text-[#0d5a7d] hover:bg-[#f0f6fa]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#0d5a7d] shrink-0" strokeWidth={2} />
          <span>My PDP</span>
        </button>
      </div>
    </aside>
  );
};
