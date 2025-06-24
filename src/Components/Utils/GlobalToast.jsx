
export const triggerGlobalToast = (title, message, type = "error") => {
  const event = new CustomEvent("trigger-global-toast", {
    detail: { title, message, type },
  });
  window.dispatchEvent(event);
};
