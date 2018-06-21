# Contributing

- [Development Workflow](#development-workflow)
- [Important Notes and Guidelines](#notes)

## Development workflow

### 📦 Setup

Dependencies are managed via [Yarn](https://yarnpkg.com/).
Once you have Yarn installed and this repo cloned, you can setup the packages:

```bash
yarn run setup
```

### 🛠 Development

Create a build and rebuild on file change.

```bash
yarn start
```

### 🚥 Tests

Basic linting is done in the project root:

```bash
yarn lint
```

Run the tests:

```bash
yarn test
```

Run the tests continually on file change:

```bash
yarn test-watch
```

Tests with coverage info:

```bash
yarn cover
```

### 🚀 Release

Build and publish new release:

```bash
yarn release
```

This command also accepts the [lerna publish options](https://github.com/lerna/lerna#publish).

## Notes

Here are some things to keep in mind and guidelines for working on the UIengine codebase.

### Coding standards

This project uses the [JavaScript Standard Style](http://standardjs.com/).
We try to keep it as functional as possible, so we are using [Ramda](http://ramdajs.com/) a lot.

### Public functions in core

- Are always `async`
- First argument should always be the `state`
