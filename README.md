# UIengine

Workbench for UI-driven development:
A tool for developers and designers to build and document web sites and apps.

Useful if you want to …

- Create a living pattern library
- Document your design system
- Prototype with your apps components and templates
- Use code as a single source of truth

![UIengine: Workbench for UI-driven development](./uiengine.png)

## 🚀  What it enables

- Establish a UI-driven workflow and structure your web UI into modular components.
- Give your team and stakeholders a central spot to develop and discuss the UI.
- Replace deliverables with usable, testable and production ready output/code.
- Make documentation fun and easy by providing structure and nice looking pages.

## 🏎 Quickstart

To explore the features yourself you can quickly initialize a project with some demo content:

```bash
mkdir uiengine-demo && cd uiengine-demo && npm init -y
npm install @uiengine/core @uiengine/adapter-html --save-dev
npx uiengine init --demo
npx uiengine build --serve --watch
```

See the [getting started guide](https://dennisreimann.github.io/uiengine/basics/getting-started/)
for further details.
There are also some [introduction videos](https://www.youtube.com/watch?v=YBm_ye9da-Q&list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2):

<div class='ytEmbed'><iframe title="UIengine Introduction Videos" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## 🖥 Examples and Screenshots

To get an idea of what a real-world project looks like, see the React sample project:

- [Tasty BBQ Design System](https://dennisreimann.github.io/uiengine-sample-react/design-system/): The UIengine output for this sample project
- [Tasty BBQ Website](https://dennisreimann.github.io/uiengine-sample-react/): The corresponding website, built with React and Next.js.
- [Tasty BBQ Source Code](https://github.com/dennisreimann/uiengine-sample-react).

## 📘 Documentation

See the [documentation](https://dennisreimann.github.io/uiengine/) site, which is also generated with the UIengine.

## 🔩 Technical TL;DR

[![npm](https://img.shields.io/npm/v/@uiengine/core.svg)](https://www.npmjs.com/package/@uiengine/core)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://github.com/dennisreimann/uiengine/actions/workflows/build.yml/badge.svg)](https://github.com/dennisreimann/uiengine/actions/workflows/build.yml)
[![Test Status](https://github.com/dennisreimann/uiengine/actions/workflows/test.yml/badge.svg)](https://github.com/dennisreimann/uiengine/actions/workflows/test.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/dennisreimann/uiengine/badge.svg)](https://snyk.io/test/github/dennisreimann/uiengine)
[![Coverage Status](https://coveralls.io/repos/github/dennisreimann/uiengine/badge.svg?branch=master)](https://coveralls.io/github/dennisreimann/uiengine?branch=master)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#-contributors)
[![Maintained with lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Support the project](https://badgen.net/badge/support/via%20donation/cyan)](https://github.com/sponsors/dennisreimann)

### ⚒ How does it work?

At its core, the UIengine is a static site generator.
It can be used in standalone mode or integrated into your build process.

➡️ Input: Your projects components, templates, pages and documentation

⬅️ Output: A static site that can be used as a workbench for development and deployed documentation

It consumes the files and structure of your project and generates the documentation based on this.
In development mode the output is regenerated on file change and synced to the browser.
This provides you with a development environment for creating the components, prototyping and writing the docs.

### 💯 Main features

- **Templating agnostic**:
  Various templating engines are integrated via adapters.
  This gives you flexibility of choice and the option to integrate custom ones.
  It works with whatever can be rendered via JavaScript, e.g. JSX, Vue, EJS, Pug/Jade, Handlebars.
- **Prototyping environment**:
  Build your UI without the need for an existing backend/API.
  Render your templates and components with mock data.
  Build various variants for pages by providing different data to your views.
- **Best practice approach**:
  The tool guides you towards best practices like
  [the component folder pattern](https://medium.com/styled-components/component-folder-pattern-ee42df37ec68),
  [the modlet workflow](https://css-tricks.com/key-building-large-javascript-apps-modlet-workflow/)
  and by proposing a separation of data and template/component.
- **In sync with the end product**:
  The docs are generated from the code that is used in your application.
  Hence you get a living pattern library – not a separate thing that needs to be looked after regularly.
- **Flexible integrations**:
  Templating engines can be configured so you can fit it to your needs.
  Same goes for the markdown parsing/rendering which is configurable too.
- **Covers green- and brownfield projects**:
  Whether you start out with a pattern library or want to transition your process and refactor your existing UI into modular components, the UIengine has you covered.

For the evaluation process you might also want to have a look at the [alternatives](#-alternatives).

### 🗜 Prerequisites

UIengine requires at least Node.js 16.16 (tracking the latest active Node.js LTS version).
This guarantees a reasonable level of backwards compatibility.

### 🖖 Alternatives

OK, the UIengine looks really cool but it's not quite what you are looking for?
Or you want to first compare a few solutions to see which one is the right fit?
Here are some other projects that you might want to evaluate:

- [Storybook](https://storybook.js.org/)
- [Pattern Lab](http://patternlab.io/)
- or have a look at [the ever growing list of similar tools](https://github.com/davidhund/styleguide-generators).

## 🛠 Development

You like this project and are interested in participating?
See the [development docs](https://dennisreimann.github.io/uiengine/development/contributing/) for an introduction and workflows when hacking on the UIengine.

## ✨ Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://www.persiel.com"><img src="https://avatars2.githubusercontent.com/u/6762951?v=4" width="100px;" alt="Jan Persiel"/><br /><sub><b>Jan Persiel</b></sub></a><br /><a href="#design-janpersiel" title="Design">🎨</a></td>
    <td align="center"><a href="https://twitter.com/Cos_Anca"><img src="https://avatars1.githubusercontent.com/u/4587864?v=4" width="100px;" alt="Cos Anca"/><br /><sub><b>Cos Anca</b></sub></a><br /><a href="#design-cosanca" title="Design">🎨</a> <a href="https://github.com/dennisreimann/uiengine/commits?author=CosAnca" title="Code">💻</a></td>
    <td align="center"><a href="http://geers.tv"><img src="https://avatars3.githubusercontent.com/u/152287?v=4" width="100px;" alt="Michael Geers"/><br /><sub><b>Michael Geers</b></sub></a><br /><a href="https://github.com/dennisreimann/uiengine/commits?author=naltatis" title="Code">💻</a></td>
    <td align="center"><a href="https://modo.md"><img src="https://avatars0.githubusercontent.com/u/858428?v=4" width="100px;" alt="Matteo Fogli"/><br /><sub><b>Matteo Fogli</b></sub></a><br /><a href="https://github.com/dennisreimann/uiengine/commits?author=therealpecus" title="Code">💻</a></td>
    <td align="center"><a href="https://jonas-havers.de"><img src="https://avatars3.githubusercontent.com/u/1322093?v=4" width="100px;" alt="Jonas Havers"/><br /><sub><b>Jonas Havers</b></sub></a><br /><a href="https://github.com/dennisreimann/uiengine/commits?author=JonasHavers" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.lost-in-technology.com/blog/"><img src="https://avatars0.githubusercontent.com/u/17713179?v=4" width="100px;" alt="René Mäkeler"/><br /><sub><b>René Mäkeler</b></sub></a><br /><a href="#example-MrAvantiC" title="Examples">💡</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!

- - - - -

👨🏻‍💻 Brought to you by the nice people behind [UIengineering](https://uiengineering.de). 👨🏻‍💻
