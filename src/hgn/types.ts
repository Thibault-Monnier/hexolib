import type { ENDING_CONDITIONS, RESULTS } from 'src/hgn/rawSymbols';

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
export type EndingCondition = (typeof ENDING_CONDITIONS)[number];

export type Metadata = {
    matchName?: string;
    player1Name?: string;
    player2Name?: string;
    unixTimestampMs?: number;
    timeControl?: TimeControl;
    result?: Result;
    endingCondition?: EndingCondition;
};

export type HGN = {
    metadata: Metadata;
    turns: Turn[];
};
