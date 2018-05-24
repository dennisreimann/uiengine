# Getting Started

This guide assumes you have set up your `PATH` in a way that the installed node module binaries are available.
If that is not the case and you get errors when running the `uiengine` command, please use prefixed path `./node_modules/.bin/uiengine` to execute the command.

## 🏎 TL;DR – The fast lane

```bash
mkdir uiengine-test && cd uiengine-test && npm init
npm install --save-dev @uiengine/core @uiengine/adapter-html
uiengine init
uiengine component button
uiengine page atoms molecules organisms
uiengine build
```

Now you have a basic test project setup and can read about the steps in detail …

You can also use the demo flag when initializing the project:

```bash
uiengine init --demo
```

This generates some demo pages and components to give a basic overview for some of the features.
Beware: It uses the html adapter, hence the components are very simplistic!

## 📦 How to install the UIengine?

The UIengine should be installed as a dependency for a project.

```bash
npm install --save-dev @uiengine/core
```

You will also need at least one adapter to render your components.
Here we will use the HTML adapter as an example, so go ahead and install it:

```bash
npm install --save-dev @uiengine/adapter-html
```

See the [adapter docs](./adapters.md) for details and a list of available adapters.

## 🔰 How to setup the UIengine in a project?

You should initialize the UIengine in the directory that also contains your `package.json`.

```bash
uiengine init
```

This command creates a config file named `uiengine.config.js`, which contains the basic configuration.
It also creates the folder `pages` containing a `page.md` file.
This is the page file for the index page of the documentation.

You can also use the demo flag when initializing the project:

```bash
uiengine init --demo
```

This generates some demo pages and components to give a basic overview for some of the features.
Beware: It uses the html adapter, hence the components are very simplistic!

## ⚙️ How to configure the project?

The config file `uiengine.config.js` contains the basic configuration for your project.
If you generated the file with the `init` command it contains comments for the individual sections.
See the [config documentation](./config.md) for details.

## ➕ How to create a component?

To generate the basic files of a component you can use the `component` command:

```bash
uiengine component COMPONENT_ID
```

This will also generate a default variant named after the component.
In case you want to directly add some variants, you can list them like so:

```bash
uiengine component COMPONENT_ID VARIANT_1 VARIANT_2 VARIANT_3
```

## ➕ How to create a variant?

A variant needs at least a file to render.
You create a variant by adding a file renderable by one of the configured adapters to the `variants` directory of a component.

In addition to the raw render file, you can also add a markdown file containing the metadata for the variant.
This markdown file can contain [YAML frontmatter](./yaml.md) and has to be named like the variant, but must have the file extension `.md`.

To render a variant, we also need a layout.
The `uiengine init` command created a basic html layout file in `src/templates/uiengine.html`.
It includes the `<!-- uiengine:content -->` comment, which will be replaced with the HTML of the rendered variant.
You can go ahead and extend the layout to fit your needs and include the correct HTML and style and script references.

This layout file is just there to get you started.
Feel free to change its content and use an other adapter to fit your projects needs.

## ➕ How to create a page?

To generate the basic files and folders of a page you can use the `page` command:

```bash
uiengine page PAGE_ID
```

This generate a `page.md` inside the folder matching the page id in you pages source directory.
In case you want to directly add some pages, you can list them like so:

```bash
uiengine page PAGE_1_ID PAGE_2_ID PAGE_3_ID
```

Say you would like to create pages for grouping your components with the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

```bash
uiengine page atoms molecules organisms templates pages
```

## ✨ How to generate the project?

The site can be generated with the following command:

```bash
uiengine build
```

To rebuild on file change you can also leverage the watch mode:

```bash
uiengine build --watch
```

You can also spawn a server for the generated site:

```bash
uiengine build --serve
```

The `watch` and `serve` options can be combined, which makes a good development environment:

```bash
uiengine build --watch --serve
```

Under the hood [BrowserSync](https://www.browsersync.io/) is used to provide serving and watching the files.
For information on how to configure the server and pass additional options, see the [configuration documentation](./config.md#BrowserSync).
