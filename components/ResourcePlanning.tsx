import React, { useMemo, useState } from 'react';
import { useStore } from '../store';

// --- Helpers & Types ---

const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

interface Allocation {
    project: string;
    complexity: string;
    start: string;
    end: string;
    duration: number;
}

interface Resource {
    developer: string;
    role: string;
    avatar: string;
    allocations: Allocation[];
}

// Mock Data Enhanced
const RESOURCES: Resource[] = [
    {
        developer: 'Giuseppe Dangelis',
        role: 'Full Stack Engineer',
        avatar: 'https://i.pravatar.cc/150?u=giuseppe',
        allocations: [
            { project: 'Máquina de Vendas', complexity: 'High', start: '05/01/2026', end: '14/01/2026', duration: 10 },
            { project: 'Artti Capital', complexity: 'Medium', start: '14/01/2026', end: '19/01/2026', duration: 6 },
            { project: 'CriaHub', complexity: 'High', start: '16/01/2026', end: '29/01/2026', duration: 14 },
            { project: 'Daniel Augusto', complexity: 'Low', start: '29/01/2026', end: '13/02/2026', duration: 16 },
            { project: 'Allyra', complexity: 'High', start: '13/02/2026', end: '09/03/2026', duration: 25 },
        ]
    },
    {
        developer: 'Jane Smith',
        role: 'Frontend Architect',
        avatar: 'https://i.pravatar.cc/150?u=jane',
        allocations: [
            { project: 'Design System', complexity: 'High', start: '05/01/2026', end: '26/01/2026', duration: 21 },
            { project: 'Dashboard UI', complexity: 'Medium', start: '27/01/2026', end: '10/02/2026', duration: 14 },
            { project: 'Interactions', complexity: 'Low', start: '15/02/2026', end: '01/03/2026', duration: 14 },
        ]
    },
    {
        developer: 'Bob Wilson',
        role: 'Backend Lead',
        avatar: 'https://i.pravatar.cc/150?u=bob',
        allocations: [
            { project: 'API Gateway', complexity: 'High', start: '12/01/2026', end: '12/02/2026', duration: 31 },
            { project: 'Auth Service', complexity: 'Critical', start: '15/02/2026', end: '10/03/2026', duration: 23 },
        ]
    }
];

// Configuration
const START_DATE = parseDate('05/01/2026');
const TOTAL_WEEKS = 12;
const DAY_WIDTH = 40; // Pixels per day
const WEEK_WIDTH = DAY_WIDTH * 7;
const ROW_HEIGHT = 44; // px per lane
const GAP = 8; // vertical gap between stacked bars

// --- Components ---

interface ProjectBarProps {
    allocation: Allocation;
    style: React.CSSProperties;
}

const ProjectBar: React.FC<ProjectBarProps> = ({ allocation, style }) => {
    const getColors = (complexity: string) => {
        switch (complexity.toLowerCase()) {
            case 'high': return 'bg-orange-500/20 border-orange-500 text-orange-400';
            case 'critical': return 'bg-red-500/20 border-red-500 text-red-400';
            case 'medium': return 'bg-blue-500/20 border-blue-500 text-blue-400';
            case 'low': return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
            default: return 'bg-purple-500/20 border-purple-500 text-purple-400';
        }
    };

    const colors = getColors(allocation.complexity);

    return (
        <div
            className={`absolute h-8 rounded border ${colors} flex items-center px-3 shadow-sm transition-transform hover:scale-[1.01] hover:z-10 group cursor-pointer text-xs font-medium backdrop-blur-sm`}
            style={style}
        >
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {allocation.project}
            </span>

            {/* Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 bg-app-surface border border-app-border-strong rounded-lg shadow-xl p-3 z-50 pointer-events-none w-48">
                <div className="text-xs font-bold text-content-primary mb-1">{allocation.project}</div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-content-secondary">
                        <span>Duration:</span>
                        <span className="font-mono text-content-primary">{allocation.duration} days</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-content-secondary">
                        <span>Start:</span>
                        <span className="font-mono text-content-primary">{allocation.start}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-content-secondary">
                        <span>End:</span>
                        <span className="font-mono text-content-primary">{allocation.end}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-content-secondary border-t border-app-border pt-1 mt-1">
                        <span>Complexity:</span>
                        <span className="font-medium text-brand-accent">{allocation.complexity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper: Calculate packing (lanes) for allocations
interface PackedAllocation extends Allocation {
    lane: number;
    left: number;
    width: number;
}

const packAllocations = (allocations: Allocation[]): { items: PackedAllocation[], maxLane: number } => {
    // 1. Sort by start date
    const sorted = [...allocations].sort((a, b) => parseDate(a.start).getTime() - parseDate(b.start).getTime());

    const packed: PackedAllocation[] = [];
    const lanes: number[] = []; // Stores the end pixel of the last item in each lane

    sorted.forEach(item => {
        const start = parseDate(item.start);
        const end = parseDate(item.end);

        const offsetDays = (start.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24);
        const durationDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        // Pixel coordinates
        const left = Math.max(0, offsetDays * DAY_WIDTH);
        const width = durationDays * DAY_WIDTH;
        const right = left + width;

        // Find first available lane
        let assignedLane = -1;
        for (let i = 0; i < lanes.length; i++) {
            if (lanes[i] < left) { // If this lane is free (last item ended before this one starts)
                assignedLane = i;
                lanes[i] = right; // Update end of lane
                break;
            }
        }

        if (assignedLane === -1) {
            // Create new lane
            assignedLane = lanes.length;
            lanes.push(right);
        }

        packed.push({ ...item, lane: assignedLane, left, width });
    });

    return { items: packed, maxLane: lanes.length - 1 }; // Return maxLane index (e.g., 0 if only 1 lane)
};

const ResourcePlanning: React.FC = () => {
    const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

    const timelineWeeks = useMemo(() => {
        return Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
            const date = addDays(START_DATE, i * 7);
            return {
                id: i,
                label: `Week ${i + 1}`,
                dateStr: formatDate(date),
                start: date
            };
        });
    }, []);

    return (
        <div className="flex flex-col h-full bg-app-bg text-content-primary overflow-hidden font-sans">

            {/* Header Section */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-app-border bg-app-bg/50 backdrop-blur-sm z-20 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Resource Planning
                    </h1>
                    <p className="text-xs text-content-secondary mt-0.5">Visualize team allocation and project timelines across the development pipeline.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] px-3 py-1.5 bg-app-surface rounded border border-app-border">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <span className="text-content-secondary">Development</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] px-3 py-1.5 bg-app-surface rounded border border-app-border">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-content-secondary">Design</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto relative custom-scrollbar">
                <div className="min-w-max">

                    {/* Timeline Header Row (Sticky Top) */}
                    <div className="sticky top-0 z-30 flex bg-app-surface border-b border-app-border shadow-sm">

                        {/* Fixed "Resource" Column Header */}
                        <div className="sticky left-0 w-[240px] bg-app-surface border-r border-app-border flex-shrink-0 p-3 h-14 flex flex-col justify-center z-40 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-content-secondary">Developer</span>
                        </div>

                        {/* Scrollable Timeline Header */}
                        <div className="flex relative">
                            {timelineWeeks.map((week, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 border-r border-app-border last:border-r-0 flex flex-col justify-center px-2 transition-colors hover:bg-app-bg/50"
                                    style={{ width: WEEK_WIDTH }}
                                >
                                    <span className="text-[10px] font-bold text-content-primary">{week.label}</span>
                                    <span className="text-[9px] text-content-secondary font-mono mt-0.5">{week.dateStr}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources Rows */}
                    <div className="bg-app-bg relative">
                        {RESOURCES.map((resource, rIdx) => {
                            // Calculate packing for this user's allocations
                            const { items, maxLane } = packAllocations(resource.allocations);

                            // Dynamic height based on lanes (min height 80px)
                            const rowHeight = Math.max(80, (maxLane + 1) * ROW_HEIGHT + 32);

                            return (
                                <div key={rIdx} className="flex group border-b border-app-border relative">

                                    {/* Sticky User Info Column */}
                                    <div
                                        className="sticky left-0 w-[240px] bg-app-bg group-hover:bg-app-surface/30 border-r border-app-border flex-shrink-0 p-4 z-20 transition-colors flex flex-col justify-center"
                                        style={{ height: rowHeight }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={resource.avatar} alt={resource.developer} className="w-8 h-8 rounded-full border border-app-border-strong grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                            <div>
                                                <div className="text-xs font-semibold text-content-primary">{resource.developer}</div>
                                                <div className="text-[10px] text-content-secondary">{resource.role}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Timeline Area for this User */}
                                    <div className="relative flex-1 group-hover:bg-app-surface/10 transition-colors" style={{ height: rowHeight }}>

                                        {/* Vertical Grid Lines (Background) */}
                                        <div className="absolute inset-0 flex pointer-events-none">
                                            {timelineWeeks.map((week, wIdx) => (
                                                <div
                                                    key={wIdx}
                                                    className={`flex-shrink-0 h-full border-r border-app-border/30 ${hoveredWeek === wIdx ? 'bg-app-surface/50' : ''}`}
                                                    style={{ width: WEEK_WIDTH }}
                                                ></div>
                                            ))}
                                        </div>

                                        {/* Allocation Bars */}
                                        {items.map((alloc, aIdx) => (
                                            <ProjectBar
                                                key={aIdx}
                                                allocation={alloc}
                                                style={{
                                                    left: `${alloc.left}px`,
                                                    width: `${alloc.width}px`,
                                                    top: `${16 + (alloc.lane * ROW_HEIGHT)}px`, // 16px top padding + stack offset
                                                    height: '32px' // Fixed height per bar
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Legend/Info */}
                    <div className="p-8 text-center text-content-secondary text-xs">
                        <p>Use Shift + Scroll to pan horizontally. Hover over bars for details.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcePlanning;
