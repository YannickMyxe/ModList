export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  if (json === undefined) {
    throw new Error("Unable to serialize data as JSON");
  }

  const blob = new Blob([json], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
