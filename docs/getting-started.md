# Getting Started

This guide assumes you have set up your `PATH` in a way that the installed node module binaries are available.
If that is not the case and you get errors when running the `uiengine` command, please use prefixed path `./node_modules/.bin/uiengine` to execute the command. 

## 🏎 TL;DR – The fast lane

```bash
mkdir uiengine-test && cd uiengine-test && npm init
npm install --save-dev uiengine uiengine-adapter-pug
uiengine init
uiengine component button
uiengine page atoms molecules organisms
mkdir src/templates && echo '!= variant.rendered' > src/templates/variant-preview.pug
uiengine build
```

Now you have a basic test project setup and can read about the steps in detail … 

## 📦 How to install the UIengine?

The UIengine should be installed as a dependency for a project.

```bash
npm install --save-dev uiengine
```

You will also need at least one adapter to render your components.
Here we will use Pug as an example, so go ahead and install it:

```bash
npm install --save-dev uiengine-adapter-pug
```

See the [adapter docs](./adapters.md) for details and a list of available adapters.

## 🔰 How to setup the UIengine in a project?

You should initialize the UIengine in the directory that also contains your `package.json`.

```bash
uiengine init
```

This command creates a config file named `uiengine.yml`, which contains the basic configuration.
It also creates the folder `pages` containing a `page.md` file.
This is the page file for the index page of the documentation.

## ⚙️ How to configure the project?

The config file `uiengine.yml` contains the basic configuration for your project.
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
This markdown file can contain [YAML frontmatter](yaml.md) and has to be named like the variant, but must have the file extension `.md`.

To render a variant, we also need a layout:

```bash
mkdir src/templates && echo '!= variant.rendered' > src/templates/variant-preview.pug
```

The output of the variable `variant.rendered` will be the rendered HTML of the variant (hence the name 😉).
You can go ahead and wrap it in a proper layout with corect HTML and style and script references, like so:

```pug
doctype
html(class=`preview-${variant.id}`)
  head
    title= variant.title
    link(rel="stylesheet" href="/style/my.css")
  body
    != variant.rendered
    script(src="/scripts/my.js")
```

As you can see the template also gets some variant meta data for the rendering, like `variant.title` and `variant.id`.

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

Example: Say you would like to create pages for grouping your components with the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

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
