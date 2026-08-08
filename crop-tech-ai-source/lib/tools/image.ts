import type { UploadedArtifact } from "./document";

export function summarizeImageInput(files?: UploadedArtifact[]) {
  const images = (files || []).filter((file) => file.type.startsWith("image/") && file.dataUrl);
  if (!images.length) {
    return {
      images: [],
      error: "No image data was provided for analysis."
    };
  }
  return {
    images: images.map((file) => ({
      name: file.name,
      type: file.type,
      dataUrl: file.dataUrl
    }))
  };
}
