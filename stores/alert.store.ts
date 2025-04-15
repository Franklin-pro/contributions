import { defineStore } from "pinia";
import { useToast } from "primevue/usetoast";
export const useAlertStore = defineStore("alertStore", () => {
  const toast = useToast();
  const success = (message: string, timeout: number = 5000) => {
    if (
      message.includes("<br>") ||
      message.includes("<br/>") ||
      message.includes("<br />")
    ) {
      timeout = 0;
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };
  const error = (message: string, timeout: number = 5000) => {
    //check if message contains <br> or <br/> or <br /> and set timeout to 0
    // if (!message) {
    //   console.error("Unable to show toast: Error message is empty")
    //   return
    // }
    message = message ?? "Error Occured on our end.";
    if (
      message.includes("<br>") ||
      message.includes("<br/>") ||
      message.includes("<br />")
    ) {
      timeout = 0;
    }
    toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
      life: timeout,
    });
  };
  const warning = (message: string, timeout: number = 5000) => {
    if (
      message.includes("<br>") ||
      message.includes("<br/>") ||
      message.includes("<br />")
    ) {
      timeout = 0;
    }
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
      life: timeout,
    });
  };

  return { success, error, warning };
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot));
}
