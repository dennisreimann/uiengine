# UIengine

An [*Interface Exchange*](#-the--interface--exchange-)  generator that gets out of your way.

## 🚀  What it enables

- Establishes a *pattern library driven workflow* and helps you structuring your web UI into modular components.
- Gives your team and stakeholders a central spot to *discuss, develop, and document* the UI of the website/application.
- Produces production ready code from day one and *aims to replace most deliverables* with usable and testable output.
- *Makes documentation fun and easy* by providing the tools to create and structure the docs in a way that fits your project.

### 👩‍💻 The 👨‍🎨 Interface 👩‍🔬 Exchange 👨‍💼

The terms *Pattern Library* or *Styleguide* suggest an association with a particular craft that affects the UI. Pattern libraries are understood as a tool that is primarily used by developers, whereas styleguides are associated with the creative output of the designers.
In contrast to that, the term *Interface Exchange* describes a place where everyone involved in the UI comes together: Concept and user experience, product owners, as well as designers and developers.

## 🖥 Screenshots

![Component](./docs/media/screenshot-component.png)

## ☝️ Disclaimer

This project is currently under active development.

Some of the concepts and APIs are subject to change. Please do not to rely on it for production use until we provide a stable v1.0 release (see the [roadmap](https://github.com/dennisreimann/uiengine/milestones) for details). Nevertheless we encourage you to try it out and provide feedback.

## 🗜 Prerequisites

UIengine requires at least Node.js 6.9. Future versions will track the latest active Node.js LTS version, which guarantees a reasonable level of backwards compatibility.

## 🔩 Technical TL;DR

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/dennisreimann/uiengine.svg?branch=master)](https://travis-ci.org/dennisreimann/uiengine)

At its core, the UIengine is a static site generator. It consumes the data by parsing the files and structure of your project and generates the Interface Exchange based on this data. In development mode the output is regenerated on file change and synced to the browser, giving you a comfortable experience creating the components and docs.

- **Template agnostic**: Various templating engines are integrated via the concept of adapters, giving you flexibility of choice and the option to integrate custom ones. It works best with whatever can be rendered via JavaScript, which includes popular solutions like JSX, Pug/Jade, Handlebars, etc.
- **Best practice approach**: The tool guides you towards best practices like not using application logic in the view layer (i.e. having crazy amounts of helpers or global variables) by proposing a separation of data and template.
- **In sync with the end product**: Since the docs are generated from the code that will be used in your application, you get a living pattern library – not a thing that needs to be looked after as a separate task.
- **Covers green- and brownfield projects**: Whether you start out with a pattern library or want to transition your process and refactor your existing UI into modular components, the UIengine has you covered.
- **Flexible integrations**: The theme can be configured with different skins or can be completely swapped out so you can fit it to your needs. Same goes for the markdown parsing/rendering which is configurable too.

For the evaluation process you might also want to have a look at the [alternatives](#-alternatives).

## 📘 Documentation

How To and Quick Start:

- [Getting Started](./docs/getting-started.md)
- [Integrations](./docs/integrations.md)

Technical documentation, with more detailed information:

- [Configuration](./docs/config.md)
- [Adapters](./docs/adapters.md)
- [Component](./docs/component.md)
- [Variant](./docs/variant.md)
- [Schema](./docs/schema.md)
- [Theme](./docs/theme.md)
- [YAML](./docs/yaml.md)

## 🛠 Development 

You like this project and are interested in participating?
See the [development docs](./docs/development.md) for an introduction and workflows when hacking on the UIengine.

## 💁 Related projects

- 🎨 [UIengine default theme](https://github.com/dennisreimann/uiengine-theme-default)
- 🔌 [Pug templating adapter](https://github.com/dennisreimann/uiengine-adapter-pug)
- 🔌 [React/JSX templating adapter](https://github.com/dennisreimann/uiengine-adapter-react)
- 🔌 [Handlebars templating adapter](https://github.com/dennisreimann/uiengine-adapter-handlebars)

### 🖖 Alternatives

OK, the UIengine looks really cool but it's not quite what you are looking for?
Or you want to first compare a few solutions to see which one is the right fit?
Here are some other projects that you might want to evaluate:

- [Pattern Lab](http://patternlab.io/)
- [Fractal](http://fractal.build/)
- [patternplate](https://github.com/sinnerschrader/patternplate/)
- [PatternPack](http://patternpack.org/)
- [Fabricator](https://fbrctr.github.io/)
- [Assemble](http://assemble.io/)

- - - - -

👨🏻‍💻 Brought to you by the nice people behind [UIengineering](https://www.uiengineering.de). 👨🏻‍💻
