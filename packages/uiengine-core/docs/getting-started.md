# Getting Started

## 📦 How to install the UIengine?

The UIengine should be installed as a dependency for a project.

```bash
npm install --save uiengine
```

In case you do not want to hook it into you CI pipeline you can also install it as a development dependency only.

## 🔰 How to setup the UIengine in a project?

You should initialize the UIengine in the directory that also contains your `package.json`.

```bash
uiengine init
```

This command creates a config file named `uiengine.yml`, which contains the basic configuration.
It also creates the folder `pages` containing a `page.md` file.
This is the page file for the index page of the Interface Exchange.

## ⚙️ How to configure the project?

The config file `uiengine.yml` contains the basic configuration for your project.
If you generated the file with the `init` command it contains comments for the individual sections.
See the [config documentation](./config.md) for details.

## ➕ How to create a component?

To generate the basic files of a component you can use the `scaffold` command:

```bash
uiengine scaffold COMPONENT_ID
```

This will also generate a default variation named after the component.
In case you want to directly add some variations, you can list them like so:

```bash
uiengine scaffold COMPONENT_ID VARIATION_1 VARIATION_2 VARIATION_3
```

## ➕ How to create a variation?

A variation needs at least a file to render.
You create a variation by adding a file renderable by one of the configured adapters to the `variations` directory of a component.

In addition to the raw render file, you can also add a markdown file containing the metadata for the variation.
This markdown file can contain [YAML frontmatter](yaml.md) and has to be named like the variation, but must have the file extension `.md`.

## ✨ How to generate the project?

The site can be generated with the following command:

```bash
uiengine generate
```

To rebuild on file change you can also leverage the watch mode:

```bash
uiengine generate --watch
```

You can also spawn a server for the generated site:

```bash
uiengine generate --serve
```

The `watch` and `serve` options can be combined, which makes a good development environment:

```bash
uiengine generate --watch --serve
```

Under the hood [BrowserSync](https://www.browsersync.io/) is used to provide serving and watching the files.
For information on how to configure the server and pass additional options, see the [configuration documentation](./config.md#BrowserSync).
