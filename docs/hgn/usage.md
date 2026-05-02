# HGN Usage

## Code Example

```ts
import { Analyser, Builder, type HGN, Parser, Writer } from 'hexolib/hgn';

// ------------------------------ PARSING ------------------------------
let parsedHgn: HGN | undefined;
try {
    const hgnParser = new Parser(
        '[name "Closed Game"][timecontrol "5+2"] 0. (0, 0) 1. (1, 0) (-1, 1)',
    );
    parsedHgn = hgnParser.parse();
} catch (error) {
    console.error('Failed to parse HGN:', error);
}

// ------------------------------ BUILDING ------------------------------
const hgnBuilder = new Builder()
    .setMetadata({ matchName: 'Closed Game' }) // Sets a metadata object
    .addMetadataAttribute('timeControl', { mode: 'match', initialTime: 5, increment: 2 }) // Adds a single metadata attribute
    .addTurn({ turnNumber: 0, first: { x: 0, y: 0 } })
    .addTurn({ turnNumber: 1, first: { x: 1, y: 0 }, second: { x: -1, y: 1 } });
const builtHgn = hgnBuilder.build(false /* skip correctness check */);

// ------------------------------ ANALYSING ------------------------------
// Manually check correctness
try {
    new Analyser(builtHgn).analyse();
} catch (error) {
    console.error('Built HGN is invalid:', error);
}

// ------------------------------ WRITING ------------------------------
const hgnWriter = new Writer(builtHgn);
const hgnStr = hgnWriter.write();

console.log('Parsed HGN:', parsedHgn);
console.log('Written HGN:\n' + hgnStr);

```

## Type Definitions

Type definitions are located in [`src/hgn/types.ts`](../../src/hgn/types.ts).
