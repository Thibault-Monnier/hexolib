import { Builder, Parser } from 'src/hgn';
import { Analyser, HGNAnalysisError } from 'src/hgn/Analyser';
import { describe, expect, it } from 'vitest';

describe('Analyser Error', () => {
    it('finds invalid first turn', () => {
        const hgn = new Builder().addTurn({ turnNumber: 0, first: { x: 1, y: 0 } }).build(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/turn 0.*\(0,\s*0\)/i);
    });

    it('finds invalid first turn', () => {
        const hgn = new Builder()
            .addTurn({ turnNumber: 0, first: { x: 0, y: 0 }, second: { x: 0, y: 1 } })
            .build(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/turn 0.* one placement/i);
    });

    it('finds missing second placement', () => {
        const hgn = new Builder()
            .addTurn({ turnNumber: 0, first: { x: 0, y: 0 } })
            .addTurn({ turnNumber: 1, first: { x: 1, y: 0 } })
            .addTurn({ turnNumber: 2, first: { x: -1, y: 1 }, second: { x: 1, y: -1 } })
            .build(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/turn 1.*missing.*second placement/i);
    });

    it('finds invalid turn number', () => {
        const hgn = new Builder()
            .addTurn({ turnNumber: 0, first: { x: 0, y: 0 } })
            .addTurn({
                turnNumber: 2,
                first: { x: 1, y: 0 },
                second: { x: 0, y: 1 },
            })
            .build(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/turn number mismatch.*expected 1/i);
    });

    it('finds duplicate cell', () => {
        const hgnString = `
            0. (0,0)
            1. (1,0)(0,1)
            2. (-1,1)(1,-1)
            3. (-1,2)(0,1)
            4. (-2,2)(2,-1)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(
            /turn 3.*invalid.*\(0,\s*1\).*already occupied/i,
        );
    });

    it('finds a win before end', () => {
        const hgnString = `
            0. (0,0)
            1. (1,0)(0,1)
            2. (-1,1)(1,-1)
            3. (-1,2)(2,-1)
            4. (-2,2)(2,-2)
            5. (-2,3)(3,-2)
            6. (-3,3)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/turn 6.*invalid.*already ended/i);
    });

    it('finds incompatible result', () => {
        const hgnString = `
            [result "0-1"]
            0. (0, 0)
            1. (1, 0)(0, 1)
            2. (-1, 1)(1, -1)
            3. (-1, 2)(2, -1)
            4. (-2, 2)(2, -2)
            5. (-2, 3)(3, -2)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/win for player 2/i);
    });

    it('finds incompatible result with draw', () => {
        const hgnString = `
            [result "1/2-1/2"]
            0. (0, 0)
            1. (1, 0)(0, 1)
            2. (-1, 1)(1, -1)
            3. (-1, 2)(2, -1)
            4. (-2, 2)(2, -2)
            5. (-2, 3)(3, -2)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/win for player 2/i);
    });

    it('finds incompatible end reason', () => {
        const hgnString = `
            [endreason "agreed-draw"]
            0. (0, 0)
            1. (1, 0)(0, 1)
            2. (-1, 1)(1, -1)
            3. (-1, 2)(2, -1)
            4. (-2, 2)(2, -2)
            5. (-2, 3)(3, -2)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/win for player 2/i);
    });

    it('finds incompatible end reason with draw', () => {
        const hgnString = `
            [result "1/2-1/2"]
            [endreason "timeout"]
            0. (0, 0)
        `;
        const hgn = new Parser(hgnString).parse(false);
        expect(() => new Analyser(hgn).analyse()).toThrow(HGNAnalysisError);
        expect(() => new Analyser(hgn).analyse()).toThrow(/incompatible.*timeout/i);
    });
});
