const isScriptNode = (node: HTMLScriptElement) => {
  return node.tagName === "SCRIPT";
};

const isExternalScript = (node: HTMLScriptElement) => {
  return !!node.src && node.src !== "";
};

const cloneScriptNode = (node: HTMLScriptElement) => {
  const script = document.createElement("script");
  script.text = node.innerHTML;
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
  }
  return script;
};

export const replaceScriptNode = (node: any) => {
  if (isScriptNode(node) && !isExternalScript(node)) {
    if (node.parentNode) {
      node.parentNode.replaceChild(cloneScriptNode(node), node);
    }
  } else {
    let i = 0;
    const children = node.childNodes;
    while (i < children.length) {
      replaceScriptNode(children[i++]);
    }
  }
  return node;
};

export const setupGeneralJSListeners = () => {
  if (window._sw) {
    window._sw((api) => {
      api.on("door_code_changed", (doorCode) =>
        console.log("door code changed: ", doorCode)
      );
      api.on("courier_instructions_changed", (courierInstructions) =>
        console.log("courier instructions changed: ", courierInstructions)
      );

      api.on("data_changed", (data, meta) => {
        console.log("data changed", { data, meta });
      });
    });
  }
};
