import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';

export default function LifecycleTimeline({ status, created_at, updated_at }) {

    // Define steps
    const steps = [
        { id: 'OPEN', label: 'Drafted' },
        { id: 'ASSIGNED', label: 'Queued' }, // Mapped from logic
        { id: 'IN_PROGRESS', label: 'Working' },
        { id: 'RESOLVED', label: 'Solved' }
    ];

    // Determine current step index
    let activeIndex = 0;
    if (status === 'IN_PROGRESS') activeIndex = 2;
    if (status === 'RESOLVED' || status === 'CLOSED') activeIndex = 3;

    // Status color logic
    const getStepStatus = (index) => {
        if (index < activeIndex) return 'complete'; // Past
        if (index === activeIndex) return 'current'; // Present
        return 'future'; // Future
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 z-0"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 z-0 transition-all duration-500"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const stepStatus = getStepStatus(idx);

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                ${stepStatus === 'complete' ? 'bg-indigo-600 border-indigo-600' : ''}
                                ${stepStatus === 'current' ? 'bg-white border-indigo-600 dark:bg-slate-900 scale-110' : ''}
                                ${stepStatus === 'future' ? 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700' : ''}
                            `}>
                                {stepStatus === 'complete' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                {stepStatus === 'current' && <Clock className="w-4 h-4 text-indigo-600" />}
                                {stepStatus === 'future' && <Circle className="w-4 h-4 text-slate-300" />}
                            </div>
                            <span className={`
                                absolute top-10 text-[10px] font-bold uppercase tracking-wider
                                ${stepStatus === 'current' ? 'text-indigo-600' : 'text-slate-400'}
                            `}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Meta Info */}
            <div className="flex justify-between mt-8 text-xs text-slate-400 font-mono">
                <span>Opened: {new Date(created_at).toLocaleDateString()}</span>
                {status === 'RESOLVED' && <span>Resolved: {new Date(updated_at).toLocaleDateString()}</span>}
            </div>
        </div>
    );
}
