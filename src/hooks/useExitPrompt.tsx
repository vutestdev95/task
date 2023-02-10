import { useEffect, useState } from "react";

const initBeforeUnLoad = (showExitPrompt: boolean) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      if (event) {
        event.preventDefault();
        event.returnValue = "";
      }
      return "";
    }
  };
};

const useExitPrompt = (bool: boolean) => {
  const [showExitPrompt, setShowExitPrompt] = useState<boolean>(bool);

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt);
  };

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
  }, [showExitPrompt]);

  return { showExitPrompt, setShowExitPrompt };
};

export default useExitPrompt;
