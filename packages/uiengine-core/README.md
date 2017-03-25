# UIengine

A pattern library generator that gets out of your way.

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## ❗️ Disclaimer

This project is currently under active development.

Some of the concepts and APIs are subject to change.
We do not recommend to use this project in production until it hits a v1.0 release.
Nevertheless we encourage people to try it out and provide us feedback.
Please do not to rely on it for production use until we provide a stable release and remove this disclaimer.

## 🗜 Prerequisites

UIengine requires at least Node.js 6.9.
Future versions will track the latest active Node.js LTS version, which guarantees a reasonable level of backwards compatibility.

## 👓 Why choose the UIengine?

The general case for this project is to establish a pattern library driven development approach.
The UIengine helps you structuring your web UI into modular components.
It gives you and your clients/stakeholders a platform to document, discuss and develop the interface or the website/application. 

- **Template agnostic**: UIengine gives you freedom of choice regarding the templating engine your project uses.
  It works best with whatever can be rendered via JavaScript, which includes popular solutions like JSX, Pug/Jade, Handlebars,etc.
- **Best Practice approach**: The tools tries to get out of your way as much as possible and does not enforce a particular structure. 
  Nevertheless it guides you towards best practices like not using application logic in the view layer (i.e. having crazy amounts of helpers or global variables) by proposing a separation of data and template.
- **Produces production ready code**: You can establish a pattern library first approach, yet the view layer/templating developed will be ready to use in your application from day one.
  By separating the generating of the pattern library/documentation from the actual build process, you can integrate the UIengine into existing projects or start out from the beginning in greenfield projects.
- **Flexible integrations**: Various templating engines are integrated via a concept of adapters, giving you flexibility of choice and the option to integrate custom ones. Same goes for the theme, which can be configured with different skins or can be completely swapped out so you can fit it to your needs. 

For the evaluation process you might also want to have a look at the [alternatives](#-alternatives).

## 📘 Documentation

How To and Quick Start:

- [Getting Started](./docs/getting-started.md)
- [Integrations](./docs/integrations.md)

Technical documentation, with more detailed information:

- [Configuration](./docs/config.md)
- [Adapters](./docs/adapters.md)
- [Component](./docs/component.md)
- [Variation](./docs/variation.md)
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

- [Fractal](http://fractal.build/)
- [patternplate](https://github.com/sinnerschrader/patternplate)
- [Pattern Lab](http://patternlab.io/)
- [Fabricator](https://fbrctr.github.io/)
- [Assemble](http://assemble.io/)

- - - - -

Brought to you by the nice people behind [UIengineering](https://www.uiengineering.de). 
