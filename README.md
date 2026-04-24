# Hexolib

TypeScript utility library for HeXO game websites and tooling.

## Features

More to come, but currently includes:

- `hgn` module (HeXO Game Notation)
    - Parse HGN strings to `HGN` object
    - Write HGN strings from `HGN` object
    - `HGN` TypeScript type definition

## Install

npm

```bash
npm install git+https://github.com/Thibault-Monnier/hexolib.git
```

yarn

```bash
yarn add git+https://github.com/Thibault-Monnier/hexolib.git
```

pnpm

```bash
pnpm add git+https://github.com/Thibault-Monnier/hexolib.git
```

## Usage

### HGN module

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

## Scripts

- `yarn build`: build once
- `yarn dev`: build in watch mode
- `yarn test`: run tests once
- `yarn test:watch`: run tests in watch mode
- `yarn lint`: ESLint checks
- `yarn format`: Prettier formatting
- `yarn check`: lint + test + build

## License

See [LICENSE](./LICENSE)
