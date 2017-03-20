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

## ⚙️ How to configure the project?

TODO: Add short description linking to the [config.md](config details).

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

In addition to the raw render file, you can also add a markdown file containing the meta information for the variation.
This markdown file can contain [YAML frontmatter](yaml.md) and has to be named like the variation, but having with the fil extension `.md`.
