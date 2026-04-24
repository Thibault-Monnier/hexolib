# HGN Usage

## Code Example

```ts
import {type HGN, HGNParser, HGNWriter} from 'hexolib/hgn';

const hgnParser = new HGNParser('[name "Closed Game"] 0. (0, 0) 1. (1, 0) (-1, 1)');
const parsedHgn: HGN = hgnParser.parse();

const hgnWriter = new HGNWriter({
    metadata: {matchName: 'Closed Game'},
    turns: [
        {turnNumber: 0, first: {x: 0, y: 0}},
        {turnNumber: 1, first: {x: 1, y: 0}, second: {x: -1, y: 1}},
    ],
});
const hgnStr = hgnWriter.write();
```

## Type Definitions

Type definitions are located in [`src/hgn/hgnTypes.ts`](../../src/hgn/hgnTypes.ts).
