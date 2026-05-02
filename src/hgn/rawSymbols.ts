import { type Metadata } from './types';

export const HGNKeysMap = {
    matchName: 'name',
    player1Name: 'player1',
    player2Name: 'player2',
    unixTimestampMs: 'utcdatetime',
    timeControl: 'timecontrol',
    result: 'result',
    endingCondition: 'endreason',
} as const satisfies Record<keyof Metadata, string>;

export type HGNAllowedKeys = (typeof HGNKeysMap)[keyof typeof HGNKeysMap];

export const RESULTS = ['1-0', '0-1', '1/2-1/2'] as const;

export const ENDING_CONDITIONS = ['win', 'timeout', 'resignation', 'agreed-draw'] as const;
