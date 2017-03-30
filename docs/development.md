# Development

- [Workflows](#workflows)
- [Important Notes and Guidelines](#notes)

## Workflows

### 📦 Setup

```bash
yarn install
```

### 🛠 Development

Create a build, run the tests and rerun on file change:

```bash
yarn start
```

Create a one-off build:

```bash
yarn run build
```

### 🚥 Tests

Setup:

```bash
yarn run test:setup
```

Basic linting:

```bash
yarn run lint
```

Run the tests:

```bash
yarn test
```

Tests with coverage info:

```bash
yarn run cover
```

### 🚀 Release

Create and publish a new release:

```bash
yarn run release
npm version VERSION
npm publish
```

## Notes

Here are some things to keep in mind and guidelines for working on the UIengine codebase.

### Coding standards

This project uses the [JavaScript Standard Style](http://standardjs.com/).
We try to keep it as functional as possible, so we are using [Ramda](http://ramdajs.com/) a lot.

### Public functions

- Are always `async`
- First argument should always be the `state`
