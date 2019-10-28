import { transform, Transform } from 'sucrase';

class SucrasePlugin {
  private enabled = true;
  private transforms: Transform[] = [];

  public onStart({ data: { option } }): void {
    if (!option) return;
    const { enable = true, transforms } = option;

    this.enabled = enable;
    this.transforms = transforms || this.transforms;
  }

  public onHandleConfig({ data: { config } }): void {
    if (!this.enabled || !this.transforms.includes('typescript')) return;

    // eslint-disable-next-line no-param-reassign
    if (!config.includes) config.includes = [];

    config.includes.push('\\.ts$', '\\.js$');
  }

  private transformsNeeded(filePath): Transform[] {
    return this.transforms.filter(
      t =>
        (t === 'typescript' && filePath.endsWith('.ts')) ||
        (t === 'flow' && filePath.endsWith('.js'))
    );
  }

  public onHandleCodeParser(event): void {
    if (!this.enabled) return;

    const { parser: esParser, filePath } = event.data;

    const transforms = this.transformsNeeded(filePath);
    if (transforms.length) {
      // eslint-disable-next-line no-param-reassign
      event.data.parser = (code: string): string =>
        esParser(this.transform(code, filePath, transforms));
    }
  }

  private transform(code: string, filePath: string, transforms: Transform[]): string {
    try {
      return transform(code, { transforms }).code;
    } catch (err) {
      if (!err.loc) err.loc = { line: 0, col: 0 };

      throw err;
    }
  }
}

export default new SucrasePlugin();
