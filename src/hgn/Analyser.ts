import type { Coordinate, EndingCondition, HGN, Result, Turn } from 'src/hgn/types';

export class HGNAnalysisError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = 'HGNAnalysisError';
    }
}

type Player = 'x' | 'o';

/** Checks if the HGN is valid. For example, it checks whether the turn numbers are correct, if the moves are valid, etc. */
export class Analyser {
    private hgn: HGN;

    private currentTurn: Turn | undefined;

    private cells = new Map<number, Player>();

    private isGameEnded = false;

    public constructor(hgn: HGN) {
        this.hgn = hgn;
    }

    public check(): void {
        this.checkTurnNumbers();

        for (const turn of this.hgn.turns) {
            this.currentTurn = turn;
            this.checkTurn();
        }

        this.checkGameEnding();
    }

    private packCoordinate(coord: Coordinate): number {
        return (coord.x << 16) | (coord.y & 0xffff);
    }

    private unpackCoordinate(packed: number): Coordinate {
        return {
            x: packed >> 16,
            y: packed & 0xffff,
        };
    }

    private coordinatesEqual(coord1: Coordinate, coord2: Coordinate): boolean {
        return coord1.x === coord2.x && coord1.y === coord2.y;
    }

    private placeCell(player: Player, coord: Coordinate): void {
        this.cells.set(this.packCoordinate(coord), player);
    }

    private getCell(coord: Coordinate): Player | undefined {
        return this.cells.get(this.packCoordinate(coord));
    }

    private getGameWinner(): Player | null {
        if (!this.isGameEnded) return null;

        const lastTurn = this.hgn.turns.at(-1);
        if (!lastTurn) return null;

        return lastTurn.turnNumber % 2 === 0 ? 'x' : 'o';
    }

    private checkTurnNumbers(): void {
        for (let i = 0; i < this.hgn.turns.length; i++) {
            const turnNumber = this.hgn.turns[i]?.turnNumber;
            if (turnNumber !== i) {
                throw new HGNAnalysisError(
                    `Invalid HGN: turn number mismatch. Expected ${i}, got ${turnNumber}`,
                );
            }
        }
    }

    /** Checks if the placements are valid (if they aren't on top of a previous piece), and if the game ended before the last placement. */
    private checkTurn(): void {
        const turn = this.currentTurn!;

        const player: Player = turn.turnNumber % 2 === 0 ? 'x' : 'o';

        if (turn.turnNumber === 0) {
            if (turn.second)
                throw new HGNAnalysisError('Invalid HGN: turn 0 should have only one placement.');
            if (!this.coordinatesEqual(turn.first, { x: 0, y: 0 }))
                throw new HGNAnalysisError(
                    'Invalid HGN: turn 0 should have the first placement at (0, 0).',
                );
        }

        const placements = [turn.first];
        if (turn.second) {
            placements.push(turn.second);
        } else if (turn.turnNumber !== 0 && turn.turnNumber !== this.hgn.turns.length - 1) {
            throw new HGNAnalysisError(
                `Invalid HGN: turn ${turn.turnNumber} is missing the second placement.`,
            );
        }

        for (const placement of placements) {
            if (this.isGameEnded)
                throw new HGNAnalysisError(
                    `Invalid HGN: turn ${turn.turnNumber} is invalid. The game has already ended.`,
                );
            if (this.getCell(placement))
                throw new HGNAnalysisError(
                    `Invalid HGN: turn ${turn.turnNumber} is invalid. Position (${placement.x}, ${placement.y}) is already occupied.}`,
                );

            this.placeCell(player, placement);

            if (this.findWinningAlignment(placement)) {
                this.isGameEnded = true;
            }
        }
    }

    /** Returns whether there exists a winning alignment passing through the base coordinate. */
    private findWinningAlignment(base: Coordinate): boolean {
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 1 },
        ];

        for (const { dx, dy } of directions) {
            const getAlignmentLength = (directionMultiplier: number): number => {
                let length = 0;

                let x = base.x;
                let y = base.y;

                while (this.getCell({ x, y }) === this.getCell(base)) {
                    length++;
                    x += dx * directionMultiplier;
                    y += dy * directionMultiplier;
                }

                return length - 1; // Don't count the base cell
            };

            let count = 1;
            count += getAlignmentLength(1);
            count += getAlignmentLength(-1);

            if (count >= 6) return true;
        }

        return false;
    }

    /** Checks if the game result is valid and if the ending condition is consistent. If none are provided, sets them as accurately as possible. */
    private checkGameEnding(): void {
        let result = this.hgn.metadata.result;
        const endingCondition = this.hgn.metadata.endingCondition;

        if (this.isGameEnded && !result) {
            result = this.getGameWinner() === 'x' ? '1-0' : '0-1';
        } else if (endingCondition === 'agreed-draw' && !result) {
            result = '1/2-1/2';
        }

        if (result === '1/2-1/2' && !endingCondition) {
            this.hgn.metadata.endingCondition = 'agreed-draw';
        }

        this.checkResultAndEndingConditionCompatibleWithGameEnded(result, endingCondition);
        this.checkCompatibleResultAndEndingCondition(result, endingCondition);

        if (this.hgn.metadata.result && this.hgn.metadata.result !== result) {
            throw new Error(
                `Assertion failure: expected result "${result}", got "${this.hgn.metadata.result}".`,
            );
        }
        if (
            this.hgn.metadata.endingCondition &&
            this.hgn.metadata.endingCondition !== endingCondition
        ) {
            throw new Error(
                `Assertion failure: expected ending condition "${endingCondition}", got "${this.hgn.metadata.endingCondition}".`,
            );
        }

        if (result) this.hgn.metadata.result = result;
        if (endingCondition) this.hgn.metadata.endingCondition = endingCondition;
    }

    private checkResultAndEndingConditionCompatibleWithGameEnded(
        result: Result | undefined,
        endingCondition: EndingCondition | undefined,
    ): void {
        if (this.isGameEnded) {
            const winner = this.getGameWinner()! === 'x' ? 'player 1' : 'player 2';

            if (
                result === '1/2-1/2' ||
                (result === '1-0' && winner === 'player 1') ||
                (result === '0-1' && winner === 'player 2')
            ) {
                throw new HGNAnalysisError(
                    `Invalid HGN: found game result "${result}", but the game ended with a win for ${winner}.`,
                );
            }
            if (endingCondition && endingCondition !== 'win') {
                throw new HGNAnalysisError(
                    `Invalid HGN: found ending condition "${endingCondition}", but the game ended with a win for ${winner}.`,
                );
            }
        } else {
            if (endingCondition === 'win') {
                throw new HGNAnalysisError(
                    `Invalid HGN: found ending condition "${endingCondition}", but the game did not end with a winner.`,
                );
            }
        }
    }

    private checkCompatibleResultAndEndingCondition(
        result: Result | undefined,
        endingCondition: EndingCondition | undefined,
    ): void {
        if (result && endingCondition) {
            if (
                (result === '1/2-1/2' && endingCondition !== 'agreed-draw') ||
                (result !== '1/2-1/2' && endingCondition === 'agreed-draw')
            ) {
                throw new HGNAnalysisError(
                    `Invalid HGN: game result "${result}" is incompatible with ending condition "${endingCondition}.`,
                );
            }
        }
    }
}
