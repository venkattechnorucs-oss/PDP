import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import {
  ArrowLeft,
  User,
  Target,
  MessageSquare,
  Clock,
  RotateCcw,
  Send,
  GraduationCap,
} from 'lucide-react';

interface LnaPdpInitiationReviewViewProps {
  onBack: () => void;
}

// Fallback high-fidelity objectives matching the user screenshot if employee hasn't set custom ones
const DEFAULT_OBJECTIVES: Record<number, { name: string; category: 'BEHAVIOURAL' | 'FUNCTIONAL'; objective: string }> = {
  1: {
    name: 'Adaptability',
    category: 'BEHAVIOURAL',
    objective: 'Enhance executive technical presentation skills for board-level risk reviews and statutory audits.',
  },
  2: {
    name: 'Result Orientation',
    category: 'BEHAVIOURAL',
    objective: 'Strengthen structured decision-making protocols during emergency plant shutdowns and operational turnarounds.',
  },
  3: {
    name: 'Technical Asset Integrity & Risk Assessment',
    category: 'FUNCTIONAL',
    objective: 'Develop independent capability to perform high-criticality asset degradation assessments without vendor oversight.',
  },
  4: {
    name: 'Predictive Maintenance & Vibration Diagnostics',
    category: 'FUNCTIONAL',
    objective: 'Master spectral vibration diagnostics on high-speed turbo-expanders to prevent unplanned plant trips.',
  },
  5: {
    name: 'Root Cause Failure Analysis (RCFA) & Incident Investigation',
    category: 'FUNCTIONAL',
    objective: 'Lead complex multi-disciplinary Root Cause Failure Analyses (RCFA) for upstream gas compression facilities.',
  },
};

export const LnaPdpInitiationReviewView: React.FC<LnaPdpInitiationReviewViewProps> = ({ onBack }) => {
  const {
    employee,
    competencies,
    commentHistory,
    addCommentMessage,
    returnToManager,
    initiatePdpByHr,
    addToast,
  } = usePdp();

  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract priorities 1 to 5 from competencies in context, or fallback to default
  const priorities = [1, 2, 3, 4, 5].map((rank) => {
    const comp = competencies.find((c) => c.priorityRank === rank);
    const fallback = DEFAULT_OBJECTIVES[rank];
    return {
      rank,
      name: comp?.name || fallback.name,
      category: comp?.category || fallback.category,
      objective: comp?.managerObjective?.trim() || fallback.objective,
      phase: comp?.phase || '6 Months',
    };
  });

  const handleReturn = () => {
    if (remarks.trim()) {
      addCommentMessage({
        sender: 'hr',
        senderName: 'LNA Reviewer',
        text: remarks.trim(),
      });
    }
    returnToManager(remarks.trim() || 'Returned by LNA Team during PDP Initiation review.');
    addToast('warning', 'Returned to Manager', `PDP for ${employee.name} returned to Line Manager for revision.`);
    onBack();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (remarks.trim()) {
      addCommentMessage({
        sender: 'hr',
        senderName: 'LNA Reviewer',
        text: remarks.trim(),
      });
    }
    initiatePdpByHr(remarks.trim());
    addToast('success', 'PDP Initiated', `PDP for ${employee.name} has been initiated and forwarded successfully.`);
    setIsSubmitting(false);
    onBack();
  };

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans pb-10">
      {/* Back Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Employee Submissions</span>
        </button>
      </div>

      {/* SECTION 1: EMPLOYEE DETAILS (Matches Screenshot 100%) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navy Header Banner */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center gap-2.5 text-white">
          <User className="w-4 h-4 text-[#C8A977]" />
          <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase">
            EMPLOYEE DETAILS
          </h2>
        </div>

        {/* 2-Column Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <tbody>
              {/* Row 1 */}
              <tr className="border-b border-slate-200/90">
                <td className="py-2.5 px-4 font-semibold text-slate-900 w-[18%] bg-slate-50/50 border-r border-slate-200/80">
                  Employee Name
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium w-[32%] border-r border-slate-200/80">
                  {employee.name || 'Ravi Kumar'}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900 w-[18%] bg-slate-50/50 border-r border-slate-200/80">
                  Division
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium w-[32%]">
                  {employee.division || 'Retail'}
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="border-b border-slate-200/90">
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Employee ID
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium border-r border-slate-200/80">
                  {employee.id || 'EMP00123'}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Department/Project
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium">
                  {employee.department || 'Operations'}
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="border-b border-slate-200/90">
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Position / Designation
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium border-r border-slate-200/80">
                  {employee.position || 'Store Manager'}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Function
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium">
                  {employee.functionDept || 'Retail Operations'}
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="border-b border-slate-200/90">
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Grade
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium border-r border-slate-200/80">
                  {employee.grade?.startsWith('Grade') ? employee.grade : `Grade ${employee.grade || '8'}`}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Manager
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium">
                  {employee.lineManager || 'Suresh Nair'}
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Date of Joining
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium border-r border-slate-200/80">
                  {employee.dateOfJoining || '12/May/2021'}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200/80">
                  Year
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium">
                  {employee.year || '2026'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: DEVELOPMENT OBJECTIVES (Table View matching Manager setup) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navy Header Banner */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Target className="w-4 h-4 text-[#C8A977]" />
            <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              DEVELOPMENT OBJECTIVES
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#C8A977]">
            {priorities.length} Priorities Configured
          </span>
        </div>

        {/* 4-Column Table matching Manager setup */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#211E4E]/90 text-white font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 select-none">
                <th className="py-2.5 px-3 text-center w-24 border-r border-white/20">
                  Priority
                </th>
                <th className="py-2.5 px-3.5 w-[28%] border-r border-white/20">
                  Competencies
                </th>
                <th className="py-2.5 px-3.5 border-r border-white/20">
                  Objectives
                </th>
                <th className="py-2.5 px-3 text-center w-36">
                  Phase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
              {priorities.map((item) => (
                <tr key={item.rank} className="hover:bg-slate-50/70 transition-colors">
                  {/* Column 1: Priority */}
                  <td className="py-3 px-3 text-center align-middle border-r border-slate-200/80">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-[#211E4E] text-white font-mono font-bold text-xs shadow-2xs whitespace-nowrap">
                      Priority {item.rank}
                    </span>
                  </td>

                  {/* Column 2: Competencies */}
                  <td className="py-3 px-3.5 align-middle border-r border-slate-200/80">
                    <div className="font-bold text-slate-900 text-xs leading-snug">
                      {item.name}
                    </div>
                    <span
                      className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        item.category === 'BEHAVIOURAL' || item.category === 'Behavioural'
                          ? 'bg-[#211E4E]/10 text-[#211E4E] border border-[#211E4E]/30'
                          : 'bg-[#C8A977]/25 text-[#211E4E] border border-[#C8A977]'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Column 3: Objectives */}
                  <td className="py-3 px-3.5 align-middle border-r border-slate-200/80">
                    <div className="text-xs text-slate-800 p-2.5 bg-slate-50/60 border border-slate-200 rounded-lg leading-relaxed font-normal">
                      {item.objective}
                    </div>
                  </td>

                  {/* Column 4: Phase (Only months or years, no dates) */}
                  <td className="py-3 px-3 text-center align-middle w-36">
                    <span className="inline-block px-3 py-1 rounded-md bg-[#211E4E]/10 text-[#211E4E] font-bold text-xs border border-[#211E4E]/20">
                      {item.phase || '6 Months'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: COMMENT HISTORY (Matching Screenshot) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navy Header Banner */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center gap-2.5 text-white">
          <MessageSquare className="w-4 h-4 text-[#C8A977]" />
          <h2 className="text-xs sm:text-sm font-bold tracking-wide">
            Comment History
          </h2>
        </div>

        {/* Comment Thread Canvas with subtle dot matrix pattern */}
        <div
          className="p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[140px] max-h-[300px]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(200, 169, 119, 0.15) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          {commentHistory && commentHistory.length > 0 ? (
            commentHistory.map((c) => (
              <div key={c.id} className="flex items-start gap-3 max-w-3xl">
                {/* Circular Avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#0F845C] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {c.senderName ? c.senderName.slice(0, 2).toUpperCase() : 'VI'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-2xs">
                    <GraduationCap className="w-2.5 h-2.5 text-[#0F845C]" />
                  </div>
                </div>

                {/* Bubble */}
                <div className="flex-1 bg-[#dff5e6]/75 border border-[#b2e7c3] rounded-2xl rounded-tl-sm p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-1 text-xs">
                    <span className="font-bold text-[#0F845C]">
                      {c.senderName || 'Vivekanandan'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {c.timestamp || '19/Aug/2026'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                    {c.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#0F845C] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  VI
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-2xs">
                  <GraduationCap className="w-2.5 h-2.5 text-[#0F845C]" />
                </div>
              </div>

              <div className="flex-1 bg-[#dff5e6]/75 border border-[#b2e7c3] rounded-2xl rounded-tl-sm p-3.5 shadow-2xs">
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="font-bold text-[#0F845C]">Vivekanandan</span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    19/Aug/2026
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  Focusing on driving enterprise performance KPIs and Kaizen operational excellence across corporate units.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Development Thoughts / Remarks Textarea */}
        <div className="p-4 sm:p-5 border-t border-slate-200/90 bg-white space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            DEVELOPMENT THOUGHTS / REMARKS
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter development thoughts, notes, or remarks..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#211E4E]/20 focus:border-[#211E4E] transition-all resize-none shadow-2xs"
          />
        </div>
      </section>

      {/* SECTION 4: BOTTOM ACTION BAR (Return and Submit buttons properly aligned) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* Return Button */}
        <button
          type="button"
          onClick={handleReturn}
          className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs border border-amber-600/40 text-amber-700 bg-amber-50 hover:bg-amber-100 active:scale-[0.99]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>RETURN</span>
        </button>

        {/* Initiate Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-7 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md bg-[#211E4E] hover:bg-[#2e2a6d] text-white border border-[#C8A977]/30 active:scale-[0.99] disabled:opacity-50 text-center"
        >
          <span>INITIATE</span>
        </button>
      </div>
    </div>
  );
};
