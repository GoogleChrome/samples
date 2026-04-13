interface MorphDomOptions {
    getNodeKey?: (node: Node) => any;
    onBeforeNodeAdded?: (node: Node) => false | Node;
    onNodeAdded?: (node: Node) => void;
    onBeforeElUpdated?: (fromEl: HTMLElement, toEl: HTMLElement) => boolean;
    onElUpdated?: (el: HTMLElement) => void;
    onBeforeNodeDiscarded?: (node: Node) => boolean;
    onNodeDiscarded?: (node: Node) => void;
    onBeforeElChildrenUpdated?: (fromEl: HTMLElement, toEl: HTMLElement) => boolean;
    skipFromChildren?: (fromEl: HTMLElement) => boolean;
    addChild?: (parent: HTMLElement, child: HTMLElement) => void;
    childrenOnly?: boolean;
}

declare function morphdom(
    fromNode: Node,
    toNode: Node | string,
    options?: MorphDomOptions,
): Node;

export default morphdom;
