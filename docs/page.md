# Page

Pages are used to generate the documentation.

## Directory Structure

Here is an example structure for some pages using the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

```tree
pages
|___atoms
|   |___page.md
|___molecules
|   |___page.md
|___organisms
|   |___page.md
|___prototype
|   |___page.md
|   |___homepage
|   |   |___page.md
|   |___productlist
|   |   |___page.md
|   |___productdetails
|   |   |___page.md
|   |___cart
|       |___page.md
|       |___empty
|       |   |___page.md
|       |___full
|           |___page.md
|___page.md
    |___static
        |___brandmanual.pdf
        |___components.sketch
        |___logo.svg
```

A page can contain child pages and have [additional files](#additional-page-files).

## Page file

A page is identified by the presence of a `page.md` markdown file.
This file contains meta data about the page and can supply the title, and description as well as define the template the page gets redered with.

The `page.md` contents for the home/index page might look like this:

```markdown
---
title: Home
children:
- atoms
- molecules
- organisms
- prototype
---

<img src="static/logo.svg" alt="ACME Design System" class="acme-logo" />

The ACME Design System: Components and templates for our web application.
````

The `title` is the name of the page that is refered to in the navigation.
The `template` defines the template the page gets rendered with. See the [page templates section](#page-templates) for details.
The `children` list is optional and can be used to leave out or reorder certain pages.
The `tags` list is optional and can be used to search for pages.

### Referencing components

The `page.md` contents for the atoms page might look like this:

```markdown
---
title: Atoms
components:
- heading
- text
- link
- button
---
The most basic elements of our application.
```

The `components` list references the component ids that should be included as child pages for this page.
Think of the components parent page as a kind of category – here we are using the Atomic Design Methodology to group components.

### Referencing design tokens

The `page.md` can also reference design tokens.
For details see the [design token docs](./design-tokens.md).

## Additional page files

A page can have extra files and folders, too.
You can use this to add images or downloadable files for pages.
These files and folders will be copied to the target path.
Files and folders that start with an underscore are ignored.

## Templates

Custom page templates are expected to be located in the `templates` directory defined in the [source configuration](./config.md#source).

Here is an example structure for some templates:

```tree
templates
|___home.pug
|___checkout
    |___cart.pug
```

You can reference these templates as `home.pug` and `checkout/cart.pug` as the value for the `template` attribute of the page.

## Providing data

As you can use these custom templates to render example/prototype pages for your website/application, you might want to provide some [sample data](./yaml.md#include).
To pass this data into your template, you can use the `context` property of the page:

```markdown
---
title: Sample home page
template: home.pug
context:
  pageTitle: "Welcome to ACME Corp."
  teasers: !data /teasers/home.json
---
This is an example of our homepage with some teasers.
```

In this case the template `home` gets rendered with the variables `pageTitle` and `teasers`.
