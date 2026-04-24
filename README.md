# Hexolib

TypeScript utility library for HeXO game websites and tooling.

## Features

More to come, but currently includes:

- `hgn` module (HeXO Game Notation) - [more details](./docs/hgn/usage.md)
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
