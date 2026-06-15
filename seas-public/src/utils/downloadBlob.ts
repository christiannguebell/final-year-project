export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdfFromApi(
  downloadFn: () => Promise<Blob>,
  filename: string
) {
  const blob = await downloadFn();
  saveBlob(blob, filename);
}
