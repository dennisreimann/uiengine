# Schema

The schema definitions can be used to document component attributes/parameters and data structures passed into the components.

## Schema definition

A schema definition describes a single attribute by its `type` and a short `description`.
In addition to that you can also mark the attribute as `required` and document a `default`.

```yaml
name:
  type: String
  description: Product name or title
  required: true
amount:
  type: Number
  description: The amount of items
  default: 1
purchased:
  type: Date
  description: The purchase date
isShipped:
  type: Boolean
  description: Has the product been shipped, yet
  default: 'false'
```

### Component attributes/parameters

You can document the component attributes in the [YAML frontmatter](./yaml.md#frontmatter) of a [component file](./component.md#component-file).

To do so you list the components using the name as key and the schema definition for each attribute as value:

```yaml
schema:
  +episode(episode):
    episode: 
      type: Episode
      required: true

  +cta(title, url):
    title:
      type: String
      description: Button-Title
      required: true
    url:
      type: String
      description: URL the button leads to
      required: true
``` 

The name is an arbitrary value and will be displayed as the title.
You can use it to describe the code that should be used to render the component – i.e. `+episode(data)` for a Pug component.

## Schema files

A schema can be stored in a file inside the [schema directory](./config.md#source). 
Each file contains the schema for the type referenced via the filename – i.e. `Episode.yml` for the type `Episode`.
