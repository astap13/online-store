function capetalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
}
function createElementWithClass(el: string, cla: string): HTMLElement {
    const element = document.createElement(el);
    element.classList.add(cla);
    return element;
}

export { createElementWithClass, capetalize };
