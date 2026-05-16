export class BaseBlock {
  nodeInDOM: HTMLElement;
  private started = false;

  constructor(nodeInDOM: HTMLElement) {
    this.nodeInDOM = nodeInDOM;
  }

  start(): void {
    this.started = true;
  }

  destroy(): void {
    this.started = false;
  }

  get isStarted(): boolean {
    return this.started;
  }

  static mountAll<T extends BaseBlock>(
    selector: string,
    Ctor: new (nodeInDOM: HTMLElement) => T,
    root: ParentNode = document,
  ): T[] {
    return Array.from(root.querySelectorAll(selector)).map((node) => {
      const instance = new Ctor(node as HTMLElement);
      instance.start();
      return instance;
    });
  }
}
