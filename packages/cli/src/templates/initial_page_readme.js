module.exports = title => `
# ${title}

Hey! It looks like you have just set up this project.
Here are some first tips to get started.
Feel free to replace these hints with the actual content for your homepage once you got going …

## How to create a component?

To generate the basic files of a component you can use the \`component\` command:

\`\`\`bash
npx uiengine component COMPONENT_ID
\`\`\`

This will also generate a default variant named after the component.
In case you want to directly add some variants, you can list them like so:

\`\`\`bash
npx uiengine component COMPONENT_ID VARIANT_1 VARIANT_2 VARIANT_3
\`\`\`

## How to create a variant?

A variant needs at least a file to render.
You create a variant by adding a file renderable by one of the configured adapters to the \`variants\` directory of a component.

To render a variant, we also need a layout.
The \`npx uiengine init\` command created a basic html layout file in \`src/templates/uiengine.html\`.
It includes the \`<!-- uiengine:content -->\` comment, which will be replaced with the HTML of the rendered variant.
You can go ahead and extend the layout to fit your needs and include the correct HTML and style and script references.

This layout file is just there to get you started.
Feel free to change its content and use an other adapter to fit your projects needs.

## How to create a page?

To generate the basic files and folders of a page you can use the \`page\` command:

\`\`\`bash
npx uiengine page PAGE_ID
\`\`\`

This generate a \`README.md\` and a \`page.config.js\` file inside the folder matching the page id in you pages source directory.
In case you want to directly add some pages, you can list them like so:

\`\`\`bash
npx uiengine page PAGE_1_ID PAGE_2_ID PAGE_3_ID
\`\`\`

Say you would like to create pages for grouping your components with the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

\`\`\`bash
npx uiengine page atoms molecules organisms templates pages
\`\`\`

## How to generate the project?

The site can be generated with the following command:

\`\`\`bash
npx uiengine build
\`\`\`

To rebuild on file change you can also leverage the watch mode:

\`\`\`bash
npx uiengine build --watch
\`\`\`

You can also spawn a server for the generated site:

\`\`\`bash
npx uiengine build --serve
\`\`\`

The \`watch\` and \`serve\` options can be combined, which makes a good development environment:

\`\`\`bash
npx uiengine build --watch --serve
\`\`\`

Under the hood [BrowserSync](https://www.browsersync.io/) is used to provide serving and watching the files.
For information on how to configure the server and pass additional options, see the [configuration documentation](https://dennisreimann.github.io/uiengine/basics/config/#BrowserSync).`
