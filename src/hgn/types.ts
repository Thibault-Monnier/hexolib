import { type Metadata } from './hgnTypes';

export const HGNKeysMap = {
    matchName: 'name',
    player1Name: 'player1',
    player2Name: 'player2',
    unixTimestamp: 'utcdatetime',
    timeControl: 'timecontrol',
    result: 'result',
    endingCondition: 'endreason',
} as const satisfies Record<keyof Metadata, string>;

export type HGNAllowedKeys = (typeof HGNKeysMap)[keyof typeof HGNKeysMap];
