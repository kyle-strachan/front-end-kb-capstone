import { toast } from "react-toastify";

export default function notify(message, type = "info") {
  switch (type.toLowerCase()) {
    case "success":
      toast.success(message, { autoClose: 2000 });
      break;
    case "error":
      toast.error(message, { autoClose: 5000 });
      break;
    case "warn":
      toast.warn(message, { autoClose: 3000 });
      break;
    case "info":
    default:
      toast.info(message, { autoClose: 3000 });
      break;
  }
}
