type MouseEventType = {
  [K in keyof GlobalEventHandlersEventMap]: GlobalEventHandlersEventMap[K] extends MouseEvent
    ? MouseEvent extends GlobalEventHandlersEventMap[K]
      ? K
      : never
    : never;
}[keyof GlobalEventHandlersEventMap];


export default class Mouse<T extends MouseEventType> {
  #el: HTMLElement;
  #type: T;

  constructor(el: HTMLElement, type: T) {
    this.#type = type;
    this.#el = el;
  }


}
