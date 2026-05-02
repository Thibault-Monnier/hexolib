import { Builder } from 'src/hgn/Builder';
import { Parser } from 'src/hgn/Parser';
import { describe, expect, it } from 'vitest';

export const sampleHgn = `[name "Hexagon Idk"]
[player1 "Grey Fox"]
[player2 "Orange Whale"]
[utcdatetime "2026-04-23 11:23:14"]
[timecontrol "0"]
[result "1-0"]
[endreason "timeout"]

 0. (0,0)
 1. (-1,0)(0,1)
 2. (-1,1)(-2,2)
 3. (1,-1)(-5,5)
 4. (-1,2)(1,0)
`;

describe('Builder', () => {
    it('builds correctly', () => {
        const builder = new Builder();
        const hgn = builder
            .setMetadata({
                matchName: 'Hexagon Idk',
                player1Name: 'Grey Fox',
                player2Name: 'Orange Whale',
                unixTimestampMs: 1776943394000,
                timeControl: { mode: 'unlimited' },
                result: '1-0',
            })
            .addMetadataAttribute('endReason', 'timeout')
            .addTurn({ turnNumber: 0, first: { x: 0, y: 0 } })
            .addTurn({
                turnNumber: 1,
                first: { x: -1, y: 0 },
                second: { x: 0, y: 1 },
            })
            .addTurn({
                turnNumber: 2,
                first: { x: -1, y: 1 },
                second: { x: -2, y: 2 },
            })
            .addTurn({
                turnNumber: 3,
                first: { x: 1, y: -1 },
                second: { x: -5, y: 5 },
            })
            .addTurn({
                turnNumber: 4,
                first: { x: -1, y: 2 },
                second: { x: 1, y: 0 },
            })
            .build();

        const parsedHgn = new Parser(sampleHgn).parse();

        expect(hgn).toEqual(parsedHgn);
    });
});
