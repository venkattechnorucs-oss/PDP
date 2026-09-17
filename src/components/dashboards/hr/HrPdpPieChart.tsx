import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartSlice {
  name: string;
  value: number;
  color: string;
  filterKey: string;
}

interface HrPdpPieChartProps {
  workflowData: ChartSlice[];
  executionData: ChartSlice[];
  activeFilter: string;
  onSelectFilter: (filterKey: string) => void;
  workflowTotal: number;
  executionTotal: number;
}

export const HrPdpPieChart: React.FC<HrPdpPieChartProps> = ({
  workflowData,
  executionData,
  activeFilter,
  onSelectFilter,
  workflowTotal,
  executionTotal,
}) => {
  const activeWorkflowSlices = workflowData.filter((d) => d.value > 0);
  const activeExecutionSlices = executionData.filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Chart 1: Workflow Pipeline Stages */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div>
            <h3 className="text-xs font-bold text-[#153f5e] uppercase tracking-wider">
              Workflow Pipeline Stages
            </h3>
            <p className="text-[11px] text-slate-500">
              Pending & submitted phases
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {workflowTotal} Staff
          </span>
        </div>

        <div className="h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ChartSlice;
                    const pct =
                      workflowTotal > 0
                        ? Math.round((item.value / workflowTotal) * 100)
                        : 0;
                    return (
                      <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-lg border border-slate-700">
                        <div className="font-bold flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </div>
                        <div className="text-slate-300 mt-0.5">
                          {item.value} Staff ({pct}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={activeWorkflowSlices}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                cursor="pointer"
                onClick={(entry: any) => {
                  const key = entry?.filterKey || entry?.payload?.filterKey;
                  if (key) {
                    onSelectFilter(activeFilter === key ? 'ALL' : key);
                  }
                }}
              >
                {activeWorkflowSlices.map((entry) => (
                  <Cell
                    key={`wf-cell-${entry.filterKey}`}
                    fill={entry.color}
                    stroke={activeFilter === entry.filterKey ? '#0f2e46' : '#ffffff'}
                    strokeWidth={activeFilter === entry.filterKey ? 2.5 : 1.5}
                    opacity={
                      activeFilter === 'ALL' || activeFilter === entry.filterKey
                        ? 1
                        : 0.4
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-black text-slate-800 leading-none">
              {workflowTotal}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Pipeline</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
          {workflowData.map((item) => (
            <button
              key={item.filterKey}
              type="button"
              onClick={() =>
                onSelectFilter(activeFilter === item.filterKey ? 'ALL' : item.filterKey)
              }
              className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                activeFilter === item.filterKey
                  ? 'bg-slate-100 font-bold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-slate-800 ml-1">
                {item.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart 2: Active PDP & PDP Completed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div>
            <h3 className="text-xs font-bold text-[#153f5e] uppercase tracking-wider">
              Execution & Achievement
            </h3>
            <p className="text-[11px] text-slate-500">
              Active PDP & completed cycles
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            {executionTotal} Staff
          </span>
        </div>

        <div className="h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ChartSlice;
                    const pct =
                      executionTotal > 0
                        ? Math.round((item.value / executionTotal) * 100)
                        : 0;
                    return (
                      <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-lg border border-slate-700">
                        <div className="font-bold flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </div>
                        <div className="text-slate-300 mt-0.5">
                          {item.value} Staff ({pct}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={activeExecutionSlices}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
                cursor="pointer"
                onClick={(entry: any) => {
                  const key = entry?.filterKey || entry?.payload?.filterKey;
                  if (key) {
                    onSelectFilter(activeFilter === key ? 'ALL' : key);
                  }
                }}
              >
                {activeExecutionSlices.map((entry) => (
                  <Cell
                    key={`ex-cell-${entry.filterKey}`}
                    fill={entry.color}
                    stroke={activeFilter === entry.filterKey ? '#0f2e46' : '#ffffff'}
                    strokeWidth={activeFilter === entry.filterKey ? 2.5 : 1.5}
                    opacity={
                      activeFilter === 'ALL' || activeFilter === entry.filterKey
                        ? 1
                        : 0.4
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-black text-emerald-800 leading-none">
              {executionTotal}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Active/Done</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
          {executionData.map((item) => (
            <button
              key={item.filterKey}
              type="button"
              onClick={() =>
                onSelectFilter(activeFilter === item.filterKey ? 'ALL' : item.filterKey)
              }
              className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                activeFilter === item.filterKey
                  ? 'bg-slate-100 font-bold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-slate-800 ml-1">
                {item.value}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
