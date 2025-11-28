// utils/toastify.js
import { toast } from "react-toastify";

export default function notify(message, type = "info") {
  switch (type.toLowerCase()) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    case "info":
    default:
      toast.info(message);
      break;
  }
}
