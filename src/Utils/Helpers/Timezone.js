/**
 * Timezone utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: FormatDateZone.
 */

import moment from "moment";

export /**
 * Format date zone component.
 * @param {*} startdate - Input value.
 * @param {*} enddate - Input value.
 * @returns {void}
 */
const FormatDateZone = (startdate, enddate) => {
  const fmt = "DD MMM, YYYY"; 
  const start = moment(startdate, fmt);
  const end = moment(enddate, fmt);
  if (!start.isValid() || !end.isValid()) {
    console.warn("Invalid date format:", startdate, enddate);
    return "";
  }
  const sd = start.format("DD"),
        ed = end.format("DD"),
        sm = start.format("MM"),
        em = end.format("MM"),
        sy = start.format("YYYY"),
        ey = end.format("YYYY");
  if (sd === ed && sm === em && sy === ey) {
    return start.format("MMM DD, YYYY");
  } else if (sm === em && sy === ey) {
    return `${start.format("MMM DD")} - ${ed}, ${ey}`;
  } else if (sm !== em && sy === ey) {
    return `${start.format("MMM DD")} - ${end.format("MMM DD")}, ${ey}`;
  } else {
    return `${start.format("MMM DD, YYYY")} - ${end.format("MMM DD, YYYY")}`;
  }
};
