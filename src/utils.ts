const waitForElement = (selector: string, parent?: ParentNode): Promise<HTMLElement | null> => {
  const root = parent ?? document;

  return new Promise((resolve) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      if (root.querySelector(selector)) {
        observer.disconnect();
        resolve(root.querySelector<HTMLElement>(selector));
      }
    });

    observer.observe(parent ?? document.body, {
      childList: true,
      subtree: true,
    });
  });
};

export { waitForElement };
