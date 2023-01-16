function capetalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
}
function createElementWithClass(el: string, cla: string): HTMLElement {
    const element = document.createElement(el);
    element.classList.add(cla);
    return element;
}
function createInput(classname: string, type?: string, placeholder?: string) {
    const element = createElementWithClass('input', classname) as HTMLInputElement;
    if (type) element.type = type;
    if (placeholder) element.placeholder = placeholder;
    return element;
}

export { createElementWithClass, createInput, capetalize };
