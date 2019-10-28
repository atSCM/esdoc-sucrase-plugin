"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _sucrase = require('sucrase');

class SucrasePlugin {constructor() { SucrasePlugin.prototype.__init.call(this);SucrasePlugin.prototype.__init2.call(this); }
   __init() {this.enabled = true}
   __init2() {this.transforms = []}

   onStart({ data: { option } }) {
    if (!option) return;
    const { enable = true, transforms } = option;

    this.enabled = enable;
    this.transforms = transforms || this.transforms;
  }

   onHandleConfig({ data: { config } }) {
    if (!this.enabled || !this.transforms.includes('typescript')) return;

    // eslint-disable-next-line no-param-reassign
    if (!config.includes) config.includes = [];

    config.includes.push('\\.ts$', '\\.js$');
  }

   transformsNeeded(filePath) {
    return this.transforms.filter(
      t =>
        (t === 'typescript' && filePath.endsWith('.ts')) ||
        (t === 'flow' && filePath.endsWith('.js'))
    );
  }

   onHandleCodeParser(event) {
    if (!this.enabled) return;

    const { parser: esParser, filePath } = event.data;

    const transforms = this.transformsNeeded(filePath);
    if (transforms.length) {
      // eslint-disable-next-line no-param-reassign
      event.data.parser = (code) =>
        esParser(this.transform(code, filePath, transforms));
    }
  }

   transform(code, filePath, transforms) {
    try {
      return _sucrase.transform.call(void 0, code, { transforms }).code;
    } catch (err) {
      if (!err.loc) err.loc = { line: 0, col: 0 };

      throw err;
    }
  }
}

exports. default = new SucrasePlugin();

module.exports = exports.default;
