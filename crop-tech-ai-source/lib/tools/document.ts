export type UploadedArtifact = {
  name: string;
  type: string;
  text?: string;
  dataUrl?: string;
};

export function summarizeDocumentInput(files?: UploadedArtifact[]) {
  const documents = (files || []).filter((file) => file.text);
  if (!documents.length) {
    return {
      documents: [],
      error: "No extracted document text was provided. TXT files are supported in-browser; PDF and DOCX extraction need a server-side parser before analysis."
    };
  }
  return {
    documents: documents.map((file) => ({
      name: file.name,
      type: file.type,
      textPreview: file.text?.slice(0, 12000)
    }))
  };
}
