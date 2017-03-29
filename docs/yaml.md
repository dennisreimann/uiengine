# YAML extensions

The UIengine input files leverage YAML in a lot of ways.
You will come across a lot of files that contain data and information in the form of [YAML frontmatter](#frontmatter).

The noteworthy part about this are the [custom schema](#custom-schema) the UIengine supports to make embedding differnt types of data easier.

## Frontmatter

For the details on how to configure the individual items, see the information in the specific documentation:

- [Page](./page.md)
- [Component](./component.md)
- [Variation](./variation.md)

## Custom schema

These are the extensions you can use to embed/include data living in an external file.
You can use these custom YAML schemas in raw YAML files (like the configuration file) as well as in the frontmatter.

### !include

Includes the content of external YAML, JSON, JS or Markdown files.

- **YAML**: The referenced YAML file gets parsed and can contain includes as well. Be careful to prevent include cycles!
- **JSON**: The JSON file gets required and its data structure will be available under the including key.
- **JS**: The JS file gets required and has to provide its data via `module.exports`.
- **Markdown**: The content gets rendered before embedding the content, so you get HTML as the value.

The root for the included file path is the directory of the file that is including it (this enables relative references).
In case you use an absolute reference (file path starting with `/`) the root is the directory the [configuration file](./config.md) is living in.

```yaml
yaml_data: !include data.yml
fake_json: !include ../fake_data/live-export.json
helpers: !include ./helpers.js
readme: !include /README.md
```

In case the file is not a YAML, JSON, JS or Markdown file, the file path is left as a fallback value for the key.

### !data

Like `!include` but uses the `source.data` directory configured in the [configuration file](./config.md) as the root of the file path.
Think of it as a convenience helper for including your mock data.

```yaml
context:
  productlist:
    - !data items/product-01.yml
    - !data items/product-02.yml
```

You should prefer this to the `!include` schema for referencing your mocks which should be kept in one place (namely `source.data`). 

### !markdown

In case you do not want to reference an external markdown file, the `!markdown` allows you to render markdown inline in a YAML file:

```yaml
context:
  content: !markdown |
    # Bacon ipsum dolor amet 
    
    Pancetta pastrami boudin tenderloin, turkey bacon brisket ball tip shoulder meatloaf meatball jerky. 
    
    - Strip steak
    - Picanha 
    - Pork ham 
    
    ## Tasty stuff

    Pork belly short loin beef pig filet mignon shank chuck t-bone.
```



