import moment from "moment";

export function exportUserInfo(data: any, id: string) {
  const date = moment(Date.now()).format("MMMddyyyy_hhmmss");
  const dataExport = data.find((x: any) => x?.["@OrderID"] === id);
  const fileData = JSON.stringify({ Order: dataExport });
  const blob = new Blob([fileData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.className = "download-file";
  link.download = `Order_${id}_${date}.text`;
  link.href = url;
  link.click();
}
