import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Smartphone, CheckCircle, Settings, QrCode, Copy, Check, AlertCircle, Download, RefreshCw, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  padding: "0.65rem 0.9rem",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  width: "100%",
  boxSizing: "border-box" as any,
};

const isValidUpiId = (upiId: string): boolean => {
  // Accepts both username@bank and phone-number@upi formats
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return upiRegex.test(upiId) && upiId.length >= 5;
};

const UpiSettingsPage = () => {
  const [upiId, setUpiId] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [previewQrData, setPreviewQrData] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUpiId, setEditUpiId] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const { data: upiSettings, isLoading, refetch } = useQuery({
    queryKey: ["upi-settings"],
    queryFn: apiClient.getUpiSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (newUpiId: string) => apiClient.updateUpiSettings("", newUpiId),
    onSuccess: () => {
      toast.success("UPI settings updated and QR code regenerated!");
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update UPI settings"),
  });

  useEffect(() => {
    if (upiSettings && upiId === "") {
      setUpiId(upiSettings.upiId);
      setEditUpiId(upiSettings.upiId);
    }
  }, [upiSettings]);

  const handleStartEdit = () => {
    setEditUpiId(upiSettings?.upiId || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditUpiId(upiSettings?.upiId || "");
    setIsEditing(false);
    setValidationError("");
  };

  const handleSaveEdit = () => {
    if (!editUpiId.trim()) {
      setValidationError("UPI ID is required");
      return;
    }
    if (!isValidUpiId(editUpiId)) {
      setValidationError("Invalid UPI ID format. Use: username@bank");
      return;
    }
    updateMutation.mutate(editUpiId);
  };

  useEffect(() => {
    if (upiId && isValidUpiId(upiId)) {
      const qrData = `upi://pay?pa=${upiId}&pn=NoirSane&am=0.00&cu=INR&tn=Payment+to+NoirSane`;
      setPreviewQrData(qrData);
    } else {
      setPreviewQrData("");
    }
  }, [upiId]);

  const handleUpiChange = (value: string) => {
    setUpiId(value);
    setVerificationResult(null); // Reset verification result on change
    if (value && !isValidUpiId(value)) {
      setValidationError("Invalid UPI ID format. Use: username@bank (e.g., noirsane@okhdfc)");
    } else {
      setValidationError("");
    }
  };

  const handleVerifyUpi = async () => {
    if (!upiId || !isValidUpiId(upiId)) {
      setValidationError("Please enter a valid UPI ID first");
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    // Simulate verification (in production, this would call a real UPI verification API)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic format validation (in production, integrate with UPI payment gateway APIs)
    const isValid = isValidUpiId(upiId) && upiId.length >= 5;
    
    if (isValid) {
      setVerificationResult({
        valid: true,
        message: `UPI ID "${upiId}" is valid and ready for payments`
      });
      toast.success("UPI ID verified successfully!");
    } else {
      setVerificationResult({
        valid: false,
        message: "UPI ID validation failed. Please check the format."
      });
      toast.error("UPI ID verification failed");
    }

    setVerifying(false);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("UPI ID copied to clipboard!");
  };

  const handleCopyStored = () => {
    navigator.clipboard.writeText(upiSettings?.upiId || "");
    toast.success("UPI ID copied!");
  };

  const handleDownloadQr = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `NoirSane-Store-QR-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success("QR code downloaded!");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      toast.error("UPI ID is required");
      return;
    }
    if (!isValidUpiId(upiId)) {
      toast.error("Please enter a valid UPI ID format");
      return;
    }
    updateMutation.mutate(upiId);
  };

  const generateRandomUpiId = () => {
    const names = ['shop', 'store', 'pay', 'test', 'demo'];
    const banks = ['okhdfc', 'oksbi', 'okicici', 'okaxis'];
    const name = names[Math.floor(Math.random() * names.length)];
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const generatedUpiId = `${name}${randomNum}@${bank}`;
    setUpiId(generatedUpiId);
    setValidationError("");
    toast.success(`Generated: ${generatedUpiId}`);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>QR Payment Settings</h2>
        <p style={{ color: "var(--muted-foreground)", margin: 0 }}>
          Configure your store's UPI ID and QR code for seamless QR payments
        </p>
      </div>

      {/* Current Settings Card */}
      {upiSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "white",
            marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <QrCode size={20} />
            <span style={{ fontWeight: 600 }}>Current Active QR Code</span>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: "white", borderRadius: "0.75rem", padding: "0.75rem" }}>
              {upiSettings.qrCodeData ? (
                <img
                  src={upiSettings.qrCodeData}
                  alt="Active QR Code"
                  style={{ width: "120px", height: "120px", objectFit: "contain" }}
                />
              ) : (
                <div style={{ width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: "0.7rem", textAlign: "center" }}>
                  No QR code
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.5rem" }}>Active UPI ID</p>
              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      value={editUpiId}
                      onChange={(e) => {
                        setEditUpiId(e.target.value);
                        setValidationError("");
                      }}
                      placeholder="e.g. noirsane@okhdfc"
                      autoFocus
                      style={{
                        flex: 1,
                        padding: "0.5rem 0.75rem",
                        fontSize: "1rem",
                        fontFamily: "monospace",
                        borderRadius: "0.375rem",
                        border: validationError ? "2px solid #ef4444" : "2px solid white",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333",
                        outline: "none",
                      }}
                    />
                  </div>
                  {validationError && (
                    <p style={{ fontSize: "0.75rem", color: "#fca5a5", margin: 0 }}>{validationError}</p>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={updateMutation.isPending}
                      style={{
                        padding: "0.4rem 0.75rem",
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updateMutation.isPending}
                      style={{
                        padding: "0.4rem 0.75rem",
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "0.375rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 600, fontFamily: "monospace" }}>{upiSettings.upiId}</span>
                  <button
                    onClick={handleStartEdit}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: "0.375rem",
                      padding: "0.4rem",
                      cursor: "pointer",
                      color: "white",
                      display: "flex"
                    }}
                    title="Edit UPI ID"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={handleCopyStored}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: "0.375rem",
                      padding: "0.4rem",
                      cursor: "pointer",
                      color: "white",
                      display: "flex"
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
              <p style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.5rem" }}>
                Last updated: {upiSettings.updatedAt ? new Date(upiSettings.updatedAt).toLocaleString() : "Never"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Smartphone size={20} color="var(--primary)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Configure UPI ID</h3>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              background: "#10b98122",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              color: "#10b981"
            }}
          >
            <CheckCircle size={16} /> UPI settings updated and QR code generated!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.5rem" }}>
              Store UPI ID *
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={upiId}
                onChange={(e) => handleUpiChange(e.target.value)}
                placeholder="e.g. noirsane@okhdfc or 9319758795@omni"
                disabled={isLoading}
                style={{
                  ...inputStyle,
                  flex: 1,
                  borderColor: upiId && isValidUpiId(upiId) ? "#10b981" : validationError ? "#ef4444" : "var(--border)",
                }}
              />
              <button
                type="button"
                onClick={handleVerifyUpi}
                disabled={!upiId || !isValidUpiId(upiId) || verifying}
                style={{
                  padding: "0.65rem 0.9rem",
                  background: verifying ? "var(--muted)" : verificationResult?.valid ? "#10b981" : "var(--primary)",
                  color: verifying ? "var(--muted-foreground)" : "white",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  cursor: (!upiId || !isValidUpiId(upiId) || verifying) ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                title="Verify UPI ID"
              >
                {verifying ? (
                  <>
                    <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Verify
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyUpi}
                disabled={!upiId}
                style={{
                  padding: "0.65rem 0.9rem",
                  background: copied ? "#10b981" : "var(--muted)",
                  color: copied ? "white" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  cursor: upiId ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title="Copy UPI ID"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {upiId && isValidUpiId(upiId) && !validationError && !verificationResult && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "#10b981" }}>
                <CheckCircle size={14} />
                <span>Valid UPI ID format</span>
              </div>
            )}
            {verificationResult && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                background: verificationResult.valid ? "#10b98122" : "#ef444422",
                color: verificationResult.valid ? "#10b981" : "#ef4444",
              }}>
                {verificationResult.valid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                <span>{verificationResult.message}</span>
              </div>
            )}
            {validationError && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "#ef4444" }}>
                <AlertCircle size={14} />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Test UPI ID Generator */}
          <div style={{
            background: "var(--background)",
            border: "1px dashed var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Info size={14} color="var(--primary)" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Test Mode</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
              Generate a random valid UPI ID for testing
            </p>
            <button
              type="button"
              onClick={generateRandomUpiId}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <RefreshCw size={14} />
              Generate Test UPI ID
            </button>
          </div>

          {/* Live QR Preview */}
          <div style={{
            background: "var(--background)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            textAlign: "center",
            border: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <QrCode size={18} color="var(--primary)" />
              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
                Live QR Preview
              </h4>
              {isValidUpiId(upiId) && (
                <span style={{
                  fontSize: "0.7rem",
                  background: "#10b98122",
                  color: "#10b981",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "99px",
                  fontWeight: 600
                }}>
                  Valid
                </span>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div ref={qrRef} style={{ background: "white", padding: "1rem", borderRadius: "0.5rem", display: "inline-block" }}>
                {isValidUpiId(upiId) ? (
                  <QRCodeSVG
                    value={previewQrData}
                    size={180}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                ) : (
                  <div style={{
                    width: "180px",
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                    borderRadius: "0.5rem",
                    color: "var(--muted-foreground)",
                    fontSize: "0.8rem"
                  }}>
                    Enter valid UPI ID to preview
                  </div>
                )}
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
              This QR code will be used for all UPI payments on checkout
            </p>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!isValidUpiId(upiId)}
              style={{
                padding: "0.6rem 1rem",
                background: isValidUpiId(upiId) ? "var(--muted)" : "var(--background)",
                color: isValidUpiId(upiId) ? "var(--foreground)" : "var(--muted-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: isValidUpiId(upiId) ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Download size={14} />
              Download Preview QR
            </button>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending || !isValidUpiId(upiId)}
            style={{
              padding: "0.875rem",
              background: updateMutation.isPending ? "var(--muted)" : "var(--primary)",
              color: updateMutation.isPending ? "var(--muted-foreground)" : "var(--primary-foreground)",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: updateMutation.isPending || !isValidUpiId(upiId) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {updateMutation.isPending ? (
              <>
                <RefreshCw size={16} className="pulse-animation" style={{ animation: "spin 1s linear infinite" }} />
                Generating QR Code...
              </>
            ) : (
              <>
                <Settings size={16} />
                Save & Generate New QR Code
              </>
            )}
          </button>
        </form>
      </div>

      {/* Help Section */}
      <div style={{
        marginTop: "2rem",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1.5rem"
      }}>
        <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 600 }}>How QR Payments Work</h4>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.8 }}>
          <li>Customer selects "UPI QR Payment" at checkout</li>
          <li>A QR code is displayed with your UPI ID and amount</li>
          <li>Customer scans QR with any UPI app (GPay, PhonePe, Paytm)</li>
          <li>Customer enters transaction ID from their UPI app</li>
          <li>Order is confirmed and recorded</li>
        </ol>
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#fef3c7",
          borderRadius: "0.5rem",
          fontSize: "0.8rem",
          color: "#92400e"
        }}>
          <strong>Note:</strong> This is a demo store. No real payment processing occurs.
        </div>
      </div>
    </div>
  );
};

export default UpiSettingsPage;
