export class BaseComponent {
  nodeInDOM: HTMLElement;

  constructor(nodeInDOM: HTMLElement) {
    this.nodeInDOM = nodeInDOM;
  }

  static mountAll<T extends BaseComponent>(
    selector: string,
    Ctor: new (nodeInDOM: HTMLElement) => T,
    root: ParentNode = document,
  ): T[] {
    return Array.from(root.querySelectorAll(selector)).map((node) => new Ctor(node as HTMLElement));
  }
}
