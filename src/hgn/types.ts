import type { END_REASONS, RESULTS } from 'src/hgn/rawSymbols';

export type Coordinate = {
    x: number;
    y: number;
};

export type Turn = {
    turnNumber: number;
    first: Coordinate;
    second?: Coordinate;
};

export type TimeControl =
    | {
          mode: 'match';
          initialTime: number;
          increment: number;
      }
    | {
          mode: 'turn';
          timePerTurn: number;
      }
    | {
          mode: 'unlimited';
      };

export type Result = (typeof RESULTS)[number];
export type EndReason = (typeof END_REASONS)[number];

export type Metadata = {
    matchName?: string;
    player1Name?: string;
    player2Name?: string;
    unixTimestampMs?: number;
    timeControl?: TimeControl;
    result?: Result;
    endReason?: EndReason;
};

export type HGN = {
    metadata: Metadata;
    turns: Turn[];
};
