# Page

Pages are used to generate the documentation.

## Directory Structure

Here is an example structure for some pages using the [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/):

```
pages
|___atoms
|   |___page.md
|___molecules
|   |___page.md
|___organisms
|   |___page.md
|___sandbox
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
template: theme:sitemap
children:
- atoms
- molecules
- organisms
- sandbox
---

<img src="static/logo.svg" alt="ACME Interface Exchange" class="acme-logo" />

The ACME Interface Exchange: Components and templates for our web application.
````

The `title` is the name of the page that is refered to in the navigation. 
The `template` defines the template the page gets rendered with. See the [page templates section](#page-templates) for details.
The `children` list is optional and can be used to leave out or reorder certain pages.

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

## Additional page files

A page can have extra files and folders, too.
You can use this to add images or downloadable files for pages.
These files and folders will be copied to the target path.
Files and folders that start with an underscore are ignored.

## Templates

Basically there are two types of pages …

### Theme templates

These pages are the documentation part of your Interface Exchange, which use predefined templates:

- `theme:page` – the default page template that contains the title and description as well as a navigation for child pages.
- `theme:sandbox` – a template like the page template, but also contains more detailed information about the child pages.
- `theme:sitemap` – a template like the page template, but also contains a sitemap of the whole Interface Exchange, which is handy for the home/index page.
- `theme:component` – the template a component page gets rendered with, listing the component details and its variants.
- `theme:schema` - the template the schema page gets rendered with: It contains tabular data of the [component schema](./schema.md).

### Your custom templates

These templates are read from the directory defined in the [source configuration](./config.md#source) – the file path without extension being the key/id of the template.

Here is an example structure for some templates:

```
templates
|___home.pug
|___checkout
    |___cart.pug
```

Yopu can reference these templates as `home` and `checkout/cart` as the value for the `template` property of the page. 

In addition to that you can also define custom names for the [templates configuration](./config.md#templates) for details.

#### Providing data

As you can use these custom templates to render example/sandbox pages for your website/application, you might want to provide some [sample data](./yaml.md#include).
To pass this data into your template, you can use the `context` property of the page:

```markdown
---
title: Sample home page
template: home
context:
  pageTitle: "Welcome to ACME Corp."
  teasers: !data /teasers/home.json
---
This is an example of our homepage with some teasers.
```

In this case the template `home` gets rendered with the variables `pageTitle` and `teasers`.
