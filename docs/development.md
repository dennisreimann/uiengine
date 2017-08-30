# Development

- [Workflows](#workflows)
- [Important Notes and Guidelines](#notes)

## Workflows

### 📦 Setup

Dependencies are managed via [Yarn](https://yarnpkg.com/).
Once you have Yarn installed and this repo cloned, you can bootstrap the packages:

```bash
yarn run bootstrap
```

### 🛠 Development


Create a build, run the tests and rerun on file change.
This needs to be done per package in the particular folder:

```bash
yarn start
```

### 🚥 Tests

Basic linting is done in the project root:

```bash
standard
```

Run the tests:

```bash
lerna run test
```

Tests with coverage info:

```bash
lerna run cover
```

### 🚀 Release

Build a new release:

```bash
lerna run build
```

Publish a new release:

```bash
lerna publish
```

## Notes

Here are some things to keep in mind and guidelines for working on the UIengine codebase.

### Coding standards

This project uses the [JavaScript Standard Style](http://standardjs.com/).
We try to keep it as functional as possible, so we are using [Ramda](http://ramdajs.com/) a lot.

### Public functions in core

- Are always `async`
- First argument should always be the `state`
