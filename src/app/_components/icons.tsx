// Ícones em SVG embutido — evita depender de biblioteca externa no build.
import * as React from "react";

type P = { size?: number } & React.SVGProps<SVGSVGElement>;
const base = (size = 18): React.SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
});

export const Search = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>);
export const Calendar = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
export const CalendarPlus = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" /></svg>);
export const CalendarDays = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></svg>);
export const MapPin = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
export const Building2 = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" /></svg>);
export const Sparkles = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M9.9 4.6 11 8l3.4 1.1L11 10.2 9.9 13.6 8.8 10.2 5.4 9.1 8.8 8ZM18 3v4M20 5h-4M18 17v4M20 19h-4" /></svg>);
export const Rocket = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.7a1.9 1.9 0 0 0-3 0ZM12 15l-3-3a22 22 0 0 1 8-10c2 0 4 2 4 4a22 22 0 0 1-10 8ZM9 12H4s.5-2.8 2-4 5 0 5 0M12 15v5s2.8-.5 4-2 0-5 0-5" /></svg>);
export const ArrowRight = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 12h14M12 5l7 7-7 7" /></svg>);
export const ChevronLeft = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="m15 18-6-6 6-6" /></svg>);
export const ChevronRight = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="m9 18 6-6-6-6" /></svg>);
export const Menu = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>);
export const X = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const Lock = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
export const Info = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>);
export const CheckCircle = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></svg>);
export const Instagram = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>);
export const WhatsApp = ({ size = 22, ...p }: P) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2Zm5.8 14.18c-.24.68-1.42 1.32-1.95 1.36-.5.04-1.13.21-3.66-.79-3.08-1.21-5.04-4.36-5.19-4.56-.15-.2-1.24-1.65-1.24-3.15s.79-2.24 1.07-2.54c.28-.3.61-.38.81-.38l.59.01c.19.01.44-.07.69.53.24.6.83 2.06.9 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.18-.31.4-.45.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.5.22.57.34.07.13.07.74-.17 1.42Z" /></svg>);
