# Page

Pages are used to generate the documentation.

## Directory Structure

Here is an example structure for some pages using the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

```tree
pages
|___atoms
|   |___page.config.js
|   |___README.md
|___molecules
|   |___page.config.js
|   |___README.md
|___organisms
|   |___page.config.js
|   |___README.md
|___prototype
|   |___page.config.js
|   |___README.md
|   |___homepage
|   |   |___page.config.js
|   |   |___README.md
|   |___productlist
|   |   |___page.config.js
|   |   |___README.md
|   |___productdetails
|   |   |___page.config.js
|   |   |___README.md
|   |___cart
|       |___page.config.js
|       |___README.md
|       |___empty
|       |   |___page.config.js
|       |   |___README.md
|       |___full
|           |___page.config.js
|           |___README.md
|___page.config.js
|___README.md
    |___static
        |___brandmanual.pdf
        |___components.sketch
        |___logo.svg
```

A page can contain child pages and have [additional files](#additional-page-files).

## Page files

A page is identified by the presence of a `README.md` markdown file, which contains the page content:

```md
![ACME Design System](/static/logo.svg)

The ACME Design System: Components and templates for our web application.
```

In addition to this you can also provide a `page.config.js` file, which can list the subpages/components or define the template the page gets rendered with.

The `page.config.js` contents for the home/index page might look like this:

```js
module.exports = {
  title: "Home",
  children: ["atoms", "molecules", "organisms", "prototype"]
}
```

The `title` is the name of the page that is refered to in the navigation.
The `template` defines the template the page gets rendered with. See the [templates section](#templates) for details.
The `children` list is optional and can be used to leave out or reorder certain pages.
The `tags` list is optional and can be used to search for pages.

### Referencing components

The `README.md` contents for the atoms page might look like this:

```js
module.exports = {
  title: "Atoms",
  components: ["heading", "text", "link", "button"]
}
```

The `components` list references the component ids that should be included as child pages for this page.
Think of the components parent page as a kind of category – here we are using the Atomic Design Methodology to group components.

### Referencing design tokens

The `page.config.js` can also reference design tokens.
For details see the [design token docs](/advanced/design-tokens/).

## Additional page files

A page can have extra files and folders, too.
You can use this to add images or downloadable files for pages.
These files and folders will be copied to the target path.
Files and folders that start with an underscore are ignored.

## Templates

Custom page templates are expected to be located in the `templates` directory defined in the [source configuration](/basics/config/#source).

Here is an example structure for some templates:

```tree
templates
|___home.pug
|___checkout
    |___cart.pug
```

You can reference these templates as `home.pug` and `checkout/cart.pug` as the value for the `template` attribute of the page.
Templates are expected to return the whole content of the page, from `DOCTYPE` to `</html>`.

### Providing data

As you can use these custom templates to render example/prototype pages for your website/application, you might want to provide some sample data.
To pass this data into your template, you can use the `context` property of the page:

```js
const teasers = require("teasers/home.json")

module.exports = {
  title: "Sample home page",
  template: "home.pug",
  context: {
    pageTitle: "Welcome to ACME Corp.",
    teasers
  }
}
```

In this case the template `home` gets rendered with the variables `pageTitle` and `teasers`.
