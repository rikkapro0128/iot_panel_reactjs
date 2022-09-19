import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";
dayjs.extend(localizedFormat);
dayjs.locale("vi");
dayjs.extend(relativeTime);

export function useMiruDate(cb) {

  const handleDate = cb(dayjs);

  function setHandleDate(date) {
    return handleDate(date)
  }

  return setHandleDate

}

