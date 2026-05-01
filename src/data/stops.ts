export type AccentColor = 'coral' | 'turquoise' | 'yellow' | 'pink';
export type StopIcon =
  | 'gate'
  | 'camera'
  | 'mic'
  | 'doc'
  | 'game'
  | 'check'
  | 'plane';

export interface Stop {
  id: string;
  name: string;
  sub: string;
  copy: string;
  icon: StopIcon;
  accent: AccentColor;
}

export interface AccentTokens {
  bg: string;
  dark: string;
  soft: string;
}

export const ACCENT: Record<AccentColor, AccentTokens> = {
  coral: { bg: '#FF6B4A', dark: '#E84A2A', soft: 'rgba(255,107,74,0.12)' },
  turquoise: { bg: '#0DB5A6', dark: '#008B7E', soft: 'rgba(13,181,166,0.12)' },
  yellow: { bg: '#FFC93C', dark: '#E5A800', soft: 'rgba(255,201,60,0.18)' },
  pink: { bg: '#FF3D7F', dark: '#D6225E', soft: 'rgba(255,61,127,0.12)' }
};

export const STOPS: Stop[] = [
  {
    id: '01',
    name: 'The Gateway Port',
    sub: 'Office Entrance / Guard Station',
    copy:
      'Check in with the guard, get your visitor badge, and find your way to the main hall. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'gate',
    accent: 'coral'
  },
  {
    id: '02',
    name: 'The Grand Hall',
    sub: 'Events Hall — Waiting Lounge · Photobooth',
    copy:
      'Settle in, grab a coffee, and snap a quick photo at the booth. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'camera',
    accent: 'turquoise'
  },
  {
    id: '03',
    name: 'The Grand Hall',
    sub: 'Opening Program',
    copy:
      'Leadership welcomes the cohort and walks through the day. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'mic',
    accent: 'yellow'
  },
  {
    id: '04',
    name: "The Explorer's Agreement",
    sub: 'NDA & Training Agreement',
    copy:
      'Read, sign, and submit the day-one paperwork. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'doc',
    accent: 'pink'
  },
  {
    id: '05',
    name: 'Mini-Games',
    sub: 'Activity Block',
    copy:
      'Quick team activities to break the ice with your cohort. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'game',
    accent: 'coral'
  },
  {
    id: '06',
    name: "Explorer's Assessment",
    sub: 'Training Area',
    copy:
      'Short skills check at the training area. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'check',
    accent: 'turquoise'
  },
  {
    id: '07',
    name: 'The Departure Gate',
    sub: 'Exit Area',
    copy:
      'Wrap up day one and check out at the exit. Lorem ipsum placeholder copy — final wording from the people team.',
    icon: 'plane',
    accent: 'yellow'
  }
];

export type SpecialTabId = 'attendance' | 'workout';

export interface SpecialTab {
  id: SpecialTabId;
  label: string;
  accent: AccentColor;
}

export const SPECIAL_TABS: SpecialTab[] = [
  { id: 'attendance', label: 'Attendance', accent: 'turquoise' },
  { id: 'workout', label: 'Math Workout', accent: 'pink' }
];

export const TOTAL_PAGES = STOPS.length + SPECIAL_TABS.length;
