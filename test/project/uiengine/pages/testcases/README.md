# Test Cases

::: intro
These are just some test cases and pages that exclusively exist for testing.
Content formatting and all that good stuff.
But really: Nothing interesting to see here, move along :)
:::

## Code blocks

This is `inline code`.

Here is indented code block:

    var test = true;

And this is a fenced code block with syntax highlighting:

```js
var test = true;
```

That's it.

## Relative links

### With base not being set

| Type                                   | Default base                                     | Base being set to `/design-system/`                          |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------|
| Existing, but not a documentation page | [Link](/_pages/testcases/custom-template.html)   | [Link](/design-system/_pages/testcases/custom-template.html) |
| Custom Template                        | [Link](/testcases/custom-template/)              | [Link](/design-system/testcases/custom-template/)            |
| Entities page                          | [Link](/_entities/)                              | [Link](/design-system/_entities/)                            |
| Settings page                          | [Link](/_settings/)                              | [Link](/design-system/_settings/)                            |
| Non existing page                      | [Link](/doesnotexist/)                           | [Link](/design-system/doesnotexist/)                         |

---

# Content

Simple text in a paragraph.

- list 1
- list 2

---

## Headline 2

Test text.

1. list
2. list

Text after a list.

---

### [Headline 3](#)

Simple text in a paragraph.

::: details Some more details
See, you clicked it!
:::
