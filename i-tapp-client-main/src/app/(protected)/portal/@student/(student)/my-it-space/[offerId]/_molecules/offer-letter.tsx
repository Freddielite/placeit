import React from "react";
import { Download, FileText, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const isPdf = (url: string) =>
  url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("/pdf");

const DownloadOfferLetterSection = ({ offerDetails }: any) => {
  const offerLetterUrl: string | undefined = offerDetails?.letterUrl;
  const companyName = offerDetails?.company?.name ?? "the company";

  const handlePreview = () => {
    if (!offerLetterUrl) return;
    // PDFs open natively in browser; images also open directly
    window.open(offerLetterUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!offerLetterUrl) return;
    const a = document.createElement("a");
    a.href = offerLetterUrl;
    a.download = `offer-letter-${offerDetails?.id ?? "document"}${isPdf(offerLetterUrl) ? ".pdf" : ""}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fileIcon = offerLetterUrl && !isPdf(offerLetterUrl)
    ? <ImageIcon size={24} className="text-blue-600" />
    : <FileText size={24} className="text-blue-600" />;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg">{fileIcon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Offer Letter</h3>
          <p className="text-xs text-gray-600">
            Your official placement offer from {companyName}
          </p>
        </div>
      </div>

      {offerLetterUrl ? (
        <div className="space-y-3">
          <Button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Offer Letter
          </Button>

          <Button
            onClick={handlePreview}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            Preview in Browser
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">
          No offer letter uploaded yet.
        </p>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        Please review the offer letter before your start date
      </p>
    </section>
  );
};

export default DownloadOfferLetterSection;
