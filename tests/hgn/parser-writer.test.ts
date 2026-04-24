import { type HGN, HGNParser, HGNWriter } from 'src/hgn';
import { describe, expect, it } from 'vitest';

const sampleHgn = `[name "Hexagon Idk"]
[player1 "Grey Fox"]
[player2 "Orange Whale"]
[utcdatetime "2026-04-23 11:23:14"]
[timecontrol "5+2"]
[result "1/2-1/2"]
[endreason "agreed-draw"]

 0. (0,0)
 1. (-1,0)(0,1)
 2. (-1,1)(-2,2)
 3. (1,-1)(-5,5)
 4. (-1,2)(1,0)
 5. (5,0)(-3,2)
`;

describe('HGN parser and writer', () => {
    it('parses metadata and turns', () => {
        const parsed = new HGNParser(sampleHgn).parse();

        expect(parsed.metadata.matchName).toBe('Hexagon Idk');
        expect(parsed.metadata.timeControl).toEqual({
            mode: 'match',
            initialTime: 5,
            increment: 2,
        });
        expect(parsed.turns).toHaveLength(6);
        expect(parsed.turns[0]).toEqual({ turnNumber: 0, first: { x: 0, y: 0 } });
        expect(parsed.turns[1]).toEqual({
            turnNumber: 1,
            first: { x: -1, y: 0 },
            second: { x: 0, y: 1 },
        });
    });

    it('roundtrips HGN through writer and parser', () => {
        const parsed = new HGNParser(sampleHgn).parse();
        const output = new HGNWriter(parsed).write();
        const reparsed = new HGNParser(output).parse();

        expect(reparsed).toEqual(parsed);
    });

    it('writes a minimal HGN correctly', () => {
        const hgn: HGN = {
            metadata: { matchName: 'Mini' },
            turns: [{ turnNumber: 0, first: { x: 0, y: 0 } }],
        };

        const output = new HGNWriter(hgn).write();

        expect(output).toContain('[name "Mini"]');
        expect(output).toContain(' 0. (0, 0)');
    });
});
