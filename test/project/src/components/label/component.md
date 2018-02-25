---
label: A1

properties:
  Label:
    id:
      type: String
      required: true
    title:
      type: String
      required: true

# This context is applied to all variants
context:
  id: "name"
  title: "Name"

# Sample for variant objects
variants:
  - file: label.ejs
    title: Label (EJS)
    label: A1.0
  - file: label.hbs
    title: Label (Handlebars)
    label: A1.1
  - file: label.html
    title: Label (HTML)
    label: A1.2
  - file: label.marko
    title: Label (Marko)
    label: A1.3
  - file: label.pug
    title: Label (Pug)
    label: A1.4
  - file: label.jsx
    title: Label (React)
    label: A1.5
  - file: label-vue.js
    title: Label (Vue JS)
    label: A1.6
  - file: label-vue-sfc.vhtml
    title: Label (Vue SFC)
    label: A1.7
---
A label for form elements
