import instanceJson from "./instanceJSON";
import instanceText from "./instanceText";

import info from "./passengerInfo";
import sendData from "./sendData";

export default {
  passenger: info(instanceJson),
  requestData: sendData(instanceText),
};
