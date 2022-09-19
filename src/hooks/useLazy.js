import { useState, useEffect } from "react";

export function useLazy(observer = undefined) {
  const [detachLoadMore, setDetachLoadMore] = useState(false);

  function setObserverParent(element) {
    const target = element.querySelector(
      observer
    );
    if(target) {
      const heightTarget = target.offsetHeight;
      if (
        element.scrollHeight -
          element.scrollTop -
          element.offsetHeight <
        heightTarget
      ) {
        if (!detachLoadMore) {
          setDetachLoadMore(true);
        }
      }
    }
  }

  function setRequestStatus(status = false) {
    setDetachLoadMore(status);
  }

  return [detachLoadMore, setObserverParent, setRequestStatus];
}
