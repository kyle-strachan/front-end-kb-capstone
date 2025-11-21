import { toast } from "react-toastify";

export default function notify(message, type = "Info") {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
}
