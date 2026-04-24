import { HGN, Writer } from 'src/hgn';
import { describe, expect, it } from 'vitest';

describe('Writer', () => {
    it('writes a minimal HGN correctly', () => {
        const hgn: HGN = {
            metadata: { matchName: 'Mini' },
            turns: [{ turnNumber: 0, first: { x: 0, y: 0 } }],
        };

        const output = new Writer(hgn).write();

        expect(output).toContain('[name "Mini"]');
        expect(output).toContain(' 0. (0, 0)');
    });
});
