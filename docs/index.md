# UIengine

Workbench for UI-driven development:
A tool for developers and designers to build and document web sites and apps.

Useful if you want to …

- Create a living pattern library
- Document your design system
- Prototype with your apps components and templates
- Use code as a single source of truth

## 🚀  What it enables

- Establish a UI-driven workflow and structure your web UI into modular components.
- Give your team and stakeholders a central spot to develop and discuss the UI.
- Replace deliverables with usable, testable and production ready output/code.
- Make documentation fun and easy by providing structure and nice looking pages.

## 🖥 Examples and Screenshots

To get an idea of what this looks like, see the
[deployed sample project](http://uiengine-sample-project.uix.space/)
and the
[sample project source code](https://github.com/dennisreimann/uiengine/tree/master/test/project/).
There is also an
[introduction video](https://www.youtube.com/watch?v=OKHAhIQLvjU).

## 🔩 Technical TL;DR

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/dennisreimann/uiengine.svg?branch=master)](https://travis-ci.org/dennisreimann/uiengine)
[![Known Vulnerabilities](https://snyk.io/test/github/dennisreimann/uiengine/badge.svg)](https://snyk.io/test/github/dennisreimann/uiengine)
[![Coverage Status](https://coveralls.io/repos/github/dennisreimann/uiengine/badge.svg?branch=master)](https://coveralls.io/github/dennisreimann/uiengine?branch=master)
[![Maintained with lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


### ⚒ How does it work?

At its core, the UIengine is a static site generator.
It can be used in standalone mode or integrated into your build process.

➡️ Input: Your projects components, templates, pages and documentation

⬅️ Output: A static site that can be used as a workbench for development and deployed documentation

It consumes the files and structure of your project and generates the documentation based on this.
In development mode the output is regenerated on file change and synced to the browser.
This provides you with a development environment for creating the components, prototyping and writing the docs.

### 💯 Main features

- **Templating agnostic**: Various templating engines are integrated via adapters, giving you flexibility of choice and the option to integrate custom ones. It works with whatever can be rendered via JavaScript, which includes popular solutions like JSX, Vue, EJS, Pug/Jade, Handlebars, etc.
- **Prototyping environment**: Build your UI without the need for an existing backend/API. Render your templates and components with mock data and build various variants for pages by providing different data to your views.
- **Best practice approach**: The tool guides you towards best practices like not using application logic in the view layer by proposing a separation of data and template/component.
- **In sync with the end product**: Since the docs are generated from the code that is used in your application, you get a living pattern library – not a separate thing that needs to be looked after regularly.
- **Flexible integrations**: Templating engines can be configured so you can fit it to your needs. Same goes for the markdown parsing/rendering which is configurable too.
- **Covers green- and brownfield projects**: Whether you start out with a pattern library or want to transition your process and refactor your existing UI into modular components, the UIengine has you covered.

For the evaluation process you might also want to have a look at the [alternatives](#-alternatives).

### 🗜 Prerequisites

UIengine requires at least Node.js 8.9. Future versions will track the latest active Node.js LTS version, which guarantees a reasonable level of backwards compatibility.

## 📘 Documentation

How To and Quick Start:

- [Getting Started](https://dennisreimann.github.io/uiengine/getting-started.html)
- [Configuration](https://dennisreimann.github.io/uiengine/config.html)
- [Component](https://dennisreimann.github.io/uiengine/component.html)
- [Variant](https://dennisreimann.github.io/uiengine/variant.html)
- [Page](https://dennisreimann.github.io/uiengine/page.html)

Technical documentation, with more detailed information:

- [Adapters](https://dennisreimann.github.io/uiengine/adapters.html)
- [Design Tokens](https://dennisreimann.github.io/uiengine/design-tokens.html)
- [Entities/Properties](https://dennisreimann.github.io/uiengine/entities-properties.html)
- [YAML](https://dennisreimann.github.io/uiengine/yaml.html)
- [UI](https://dennisreimann.github.io/uiengine/ui.html)
- [Integrations](https://dennisreimann.github.io/uiengine/integrations.html)
- [Deployment](https://dennisreimann.github.io/uiengine/deployment.html)
- [Development](https://dennisreimann.github.io/uiengine/development.html)

## 💁 Individual packages

| Name | Type | Docs | NPM |
| ---- | ---- | ---- | --- |
| [Core](https://github.com/dennisreimann/uiengine/tree/master/packages/core)                             | 🚀 | [📖](https://dennisreimann.github.io/uiengine/index.html) | [![npm](https://img.shields.io/npm/v/@uiengine/core.svg)](https://www.npmjs.com/package/@uiengine/core)                             |
| [User Interface](https://github.com/dennisreimann/uiengine/tree/master/packages/ui)                     | 🎨 | [📖](https://dennisreimann.github.io/uiengine/ui.html)| [![npm](https://img.shields.io/npm/v/@uiengine/ui.svg)](https://www.npmjs.com/package/@uiengine/ui)                                 |
| [Pug adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-pug)               | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/pug.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-pug.svg)](https://www.npmjs.com/package/@uiengine/adapter-pug)               |
| [React/JSX adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-react)       | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/react.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-react.svg)](https://www.npmjs.com/package/@uiengine/adapter-react)           |
| [Vue adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-vue)               | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/vue.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-vue.svg)](https://www.npmjs.com/package/@uiengine/adapter-vue)               |
| [Marko adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-marko)           | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/marko.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-marko.svg)](https://www.npmjs.com/package/@uiengine/adapter-marko)           |
| [Handlebars adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-handlebars) | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/handlebars.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-handlebars.svg)](https://www.npmjs.com/package/@uiengine/adapter-handlebars) |
| [EJS adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-ejs)               | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/ejs.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-ejs.svg)](https://www.npmjs.com/package/@uiengine/adapter-ejs)               |
| [HTML adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-html)             | 🔌 | [📖](https://dennisreimann.github.io/uiengine/adapter/html.html) | [![npm](https://img.shields.io/npm/v/@uiengine/adapter-html.svg)](https://www.npmjs.com/package/@uiengine/adapter-html)             |

### 🖖 Alternatives

OK, the UIengine looks really cool but it's not quite what you are looking for?
Or you want to first compare a few solutions to see which one is the right fit?
Here are some other projects that you might want to evaluate:

- [Fractal](http://fractal.build/)
- [Storybook](https://storybook.js.org/)
- [Pattern Lab](http://patternlab.io/)
- [patternplate](https://github.com/sinnerschrader/patternplate/)

… or have a look at [the ever growing list of similar tools](https://github.com/davidhund/styleguide-generators).

## 🛠 Development

You like this project and are interested in participating?
See the [development docs](https://dennisreimann.github.io/uiengine/development.html) for an introduction and workflows when hacking on the UIengine.

- - - - -

👨🏻‍💻 Brought to you by the nice people behind [UIengineering](https://www.uiengineering.de). 👨🏻‍💻
