# Getting Started

This guide helps you to get started quickly with the `uiengine`.
We will use `npx` to run the locally installed `uiengine` in the following.

>
 `npx` is bundled with `npm` since [v5.2.0](https://github.com/npm/npm/releases/tag/v5.2.0).
 It allows us to easily run locally installed packages like `uiengine`, which must have been installed globally otherwise, setup in the `$PATH` variable or called with a path prefix.

## 🏎 TL;DR – The fast lane

The following process is also covered in the [introduction videos](https://www.youtube.com/watch?v=YBm_ye9da-Q&list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2):

<div class='ytEmbed'><iframe title="UIengine Introduction Videos" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

Initialize a new npm project:

```bash
mkdir uiengine-demo && cd uiengine-demo && npm init
```

You will be prompted for the project information.
To skip the prompt and use some empty defaults, run `npm init -y` instead.

Next, install the UIengine development dependencies locally:

```bash
npm install @uiengine/core @uiengine/adapter-html --save-dev
```

Now initialize an empty UIengine demo project:

```bash
npx uiengine init --demo
```

Serve the project locally and watch for changes:

```bash
npx uiengine build --serve --watch
```

Congratulations! 🎉
Now you have a basic UIengine demo project running.

In the following you can read about the steps in more detail.

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

See the [adapter docs](/adapters/) for details and a list of available adapters.

## 🔰 How to setup the UIengine in a project?

You should initialize the UIengine in the directory that also contains your `package.json`.

```bash
npx uiengine init
```

This command creates a config file named `uiengine.config.js`, which contains the basic configuration.
It also creates the folder `pages` containing a `README.md` file.
This is the page file for the index page of the documentation.

You can also use the demo flag when initializing the project:

```bash
npx uiengine init --demo
```

This generates some demo pages and components to give a basic overview for some of the features.
Beware: It uses the HTML adapter, hence the components are very simplistic.

## ⚙️ How to configure the project?

The config file `uiengine.config.js` contains the basic configuration for your project.
If you generated the file with the `init` command it contains comments for the individual sections.
See the [config documentation](/basics/config/) for details.

## ➕ How to create a component?

To generate the basic files of a component you can use the `component` command:

```bash
npx uiengine component COMPONENT_ID
```

This will also generate a default variant named after the component.
In case you want to directly add some variants, you can list them like so:

```bash
npx uiengine component COMPONENT_ID VARIANT_1 VARIANT_2 VARIANT_3
```

## ➕ How to create a variant?

A variant needs at least a file to render.
You create a variant by adding a file renderable by one of the configured adapters to the `variants` directory of a component.

To render a variant, we also need a layout.
The `npx uiengine init` command created a basic html layout file in `src/templates/uiengine.html`.
It includes the `<!-- uiengine:content -->` comment, which will be replaced with the HTML of the rendered variant.
You can go ahead and extend the layout to fit your needs and include the correct HTML and style and script references.

This layout file is just there to get you started.
Feel free to change its content and use an other adapter to fit your projects needs.

## ➕ How to create a page?

To generate the basic files and folders of a page you can use the `page` command:

```bash
npx uiengine page PAGE_ID
```

This generates a `README.md` and a `page.config.js` file inside the folder matching the page id in you pages source directory.
In case you want to directly add some pages, you can list them like so:

```bash
npx uiengine page PAGE_1_ID PAGE_2_ID PAGE_3_ID
```

Say you would like to create pages for grouping your components with the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

```bash
npx uiengine page atoms molecules organisms templates pages
```

## ✨ How to generate the project?

The site can be generated with the following command:

```bash
npx uiengine build
```

To rebuild on file change you can also leverage the watch mode:

```bash
npx uiengine build --watch
```

You can also spawn a server for the generated site:

```bash
npx uiengine build --serve
```

The `watch` and `serve` options can be combined, which makes a good development environment:

```bash
npx uiengine build --watch --serve
```

Under the hood [BrowserSync](https://www.browsersync.io/) is used to provide serving and watching the files.
For information on how to configure the server and pass additional options, see the [configuration documentation](/basics/config/#BrowserSync).
