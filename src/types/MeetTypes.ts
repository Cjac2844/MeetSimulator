export interface TeamSetup {
  name: string;
  abbreviation: string;
  type: 'Home' | 'Away';
}

export interface LaneEntry {
  lane: number;
  name: string;
  teamAbbr: string;
  time: string; // e.g. "32.95", "1:01.66", or "DQ"
}

export interface EventResult {
  place: number;
  name: string;
  teamAbbr: string;
  time: string;
  points: number;
  lane: number;
  isDQ?: boolean;
}

export interface EventData {
  eventNumber: number;
  title: string;
  isRelay: boolean;
  entries: LaneEntry[];
  results?: EventResult[];
}

export interface MeetState {
  homeTeam: TeamSetup;
  awayTeam: TeamSetup;
  events: EventData[];
  currentEventIndex: number;
  homeScore: number;
  awayScore: number;
}