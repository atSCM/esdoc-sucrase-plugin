# esdoc-sucrase-plugin

> Transpile sources with [sucrase](https://sucrase.io) before passing them to [esdoc](https://esdoc.org).

**Note: Event though you can use TypeScript and Flow with this plugin, it doesn't add any type info to your docs.**

## Installation

Run `npm i --save-dev esdoc-sucrase-plugin`.

## Usage

Add the plugin to your _esdoc.json_ file and specify which [sucrase transforms](https://github.com/alangpierce/sucrase#transforms) to use:

```json
{
  "source": "./src",
  ...
  "plugins": [
    ...
    {
      "name": "esdoc-sucrase-plugin",
      "option": { "transforms": ["typescript"] }
    },
  ]
}
```

> Note: We test only with TypeScript, but flow should work as well.
