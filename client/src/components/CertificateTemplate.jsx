import { useState } from "react";
import { X, Upload, Download } from "lucide-react";

export default function CertificateTemplate({
  event,
  winners = [],
  participants = [],
  onClose,
}) {
  const [collegeName, setCollegeName] = useState("Your College Name");
  const [signatureImage, setSignatureImage] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("winner"); // "winner" or "participation"

  console.log("CertificateTemplate rendered with:", {
    event,
    winners,
    participants,
  });

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result);
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCertificate = (recipientName, certificateType) => {
    // Create a canvas for certificate generation
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");

    // Background - Purple gradient
    const gradient = ctx.createLinearGradient(0, 0, 1400, 900);
    gradient.addColorStop(0, "#6366F1");
    gradient.addColorStop(1, "#8B5CF6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1400, 900);

    // White content area
    ctx.fillStyle = "white";
    ctx.fillRect(50, 50, 1300, 800);

    // Top left decorative element
    ctx.fillStyle = "#6366F1";
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(50, 150);
    ctx.closePath();
    ctx.fill();

    // Decorative squares (logo-like)
    const squareSize = 15;
    const colors = ["#6366F1", "#8B5CF6", "#A78BFA"];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(70 + i * 20, 70, squareSize, squareSize);
    }

    // College name (top right)
    ctx.fillStyle = "#6366F1";
    ctx.font = "bold 18px 'Arial', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(collegeName, 1300, 100);

    // Horizontal line under college name
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(900, 120);
    ctx.lineTo(1350, 120);
    ctx.stroke();

    // Title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 56px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText(
      certificateType === "winner"
        ? "Certificate of Achievement"
        : "Certificate of Participation",
      700,
      230,
    );

    // Subtitle - Event name
    ctx.fillStyle = "#6B7280";
    ctx.font = "italic 20px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText(event?.title || "Event Certificate", 700, 270);

    // Decorative line
    ctx.strokeStyle = "#6366F1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(400, 290);
    ctx.lineTo(1000, 290);
    ctx.stroke();

    // Acknowledgment text
    ctx.fillStyle = "#6B7280";
    ctx.font = "15px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("This certificate proudly acknowledges that", 700, 340);

    // Recipient name box
    ctx.fillStyle = "#F3F4F6";
    ctx.fillRect(300, 360, 800, 80);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 40px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText(recipientName, 700, 410);

    // Achievement text
    ctx.fillStyle = "#6B7280";
    ctx.font = "15px 'Arial', sans-serif";
    ctx.textAlign = "center";
    if (certificateType === "winner") {
      ctx.fillText(
        "has demonstrated outstanding excellence and achievement in",
        700,
        480,
      );
      ctx.fillText(`the ${event?.title || "Event"} competition`, 700, 510);
    } else {
      ctx.fillText("has successfully participated in", 700, 480);
      ctx.fillText(`the ${event?.title || "Event"} competition`, 700, 510);
    }

    // Date
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);

    ctx.fillStyle = "#6B7280";
    ctx.font = "12px 'Arial', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Date of Issue: ${formattedDate}`, 100, 680);

    // Signature section
    ctx.fillStyle = "#111827";
    ctx.font = "bold 14px 'Arial', sans-serif";
    ctx.fillText("Authorized by:", 900, 650);

    // Signature line and label area
    if (signaturePreview) {
      const img = new Image();
      img.onload = () => {
        // Draw signature image with border
        ctx.strokeStyle = "#D1D5DB";
        ctx.lineWidth = 2;
        ctx.strokeRect(900, 670, 120, 80);
        ctx.drawImage(img, 905, 675, 110, 70);
        downloadPDF(canvas, recipientName, certificateType);
      };
      img.src = signaturePreview;
    } else {
      // Draw signature line
      ctx.strokeStyle = "#6B7280";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(900, 740);
      ctx.lineTo(1050, 740);
      ctx.stroke();

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px 'Arial', sans-serif";
      ctx.fillText("Signature", 920, 765);

      downloadPDF(canvas, recipientName, certificateType);
    }
  };

  const downloadPDF = (canvas, recipientName, certificateType) => {
    const link = document.createElement("a");
    link.download = `${recipientName}_${certificateType}_certificate.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Certificate Management
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {event?.title || "Event Certificate"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Configuration Section */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Certificate Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  College Name
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter college/institution name"
                />
              </div>

              {/* Signature Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Signature Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="signature-upload"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="signature-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    <Upload size={16} />
                    Upload Signature
                  </label>
                  {signaturePreview && (
                    <div className="relative">
                      <img
                        src={signaturePreview}
                        alt="Signature Preview"
                        className="h-16 w-20 object-contain border border-slate-300 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("winner")}
              className={`px-4 py-2 font-medium ${
                activeTab === "winner"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Winner Certificates (
              {winners?.filter((w) => w.position).length || 0})
            </button>
            <button
              onClick={() => setActiveTab("participation")}
              className={`px-4 py-2 font-medium ${
                activeTab === "participation"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Participation Certificates ({participants?.length || 0})
            </button>
          </div>

          {/* Winner Certificates */}
          {activeTab === "winner" && winners && winners.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Send Winner Certificates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {winner.position === "1st"
                          ? "🥇"
                          : winner.position === "2nd"
                            ? "🥈"
                            : "🥉"}{" "}
                        {winner.position} Place
                      </div>
                      <div className="text-sm text-slate-600">
                        {winner.teamName}
                      </div>
                      {winner.members && winner.members.length > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          {winner.members.map((m) => m.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const studentNames = winner.members
                          ? winner.members.map((m) => m.name).join(" & ")
                          : winner.teamName;
                        downloadCertificate(studentNames, "winner");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap ml-4"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "winner" ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No winners declared yet</p>
            </div>
          ) : null}

          {/* Participation Certificates */}
          {activeTab === "participation" &&
          participants &&
          participants.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Send Participation Certificates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {participant.teamName}
                      </div>
                      {participant.members &&
                        participant.members.length > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            {participant.members.map((m) => m.name).join(", ")}
                          </div>
                        )}
                      <div className="text-sm text-slate-600 mt-2">
                        {participant.projectTitle}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const studentNames = participant.members
                          ? participant.members.map((m) => m.name).join(" & ")
                          : participant.teamName;
                        downloadCertificate(studentNames, "participation");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap ml-4"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "participation" ? (
            <div className="text-center py-8">
              <p className="text-slate-600">
                No participants to send certificates to
              </p>
            </div>
          ) : null}

          {/* Send All Certificates Button */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send All Certificates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
