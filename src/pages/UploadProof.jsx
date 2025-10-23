// src/pages/UploadProof.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "https://api.pleasantpearl.com";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const UploadProof = () => {
  const [params] = useSearchParams();
  const orderId = useMemo(() => (params.get("order") || "").trim(), [params]);

  const [file, setFile] = useState(null);
  const [txnRef, setTxnRef] = useState("");
  const [senderLast4, setSenderLast4] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      toast.error("Only JPG, PNG, or PDF files are allowed.");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("File is too large. Max 5MB.");
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId) {
      toast.error("Order ID is missing in the link.");
      return;
    }
    if (!file) {
      toast.error("Please choose an image or PDF.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("orderId", orderId);
      if (txnRef.trim()) form.append("transactionRef", txnRef.trim());
      if (senderLast4.trim()) form.append("senderLast4", senderLast4.trim());
      form.append("proof", file); // must match backend field name

      await axios.post(`${backendUrl}/api/order/upload-proof`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Payment proof uploaded successfully.");
      navigate("/thank-you", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md w-full rounded-2xl border p-6 bg-white shadow-sm">
          <h1 className="text-xl font-semibold mb-2">Upload Payment Proof</h1>
          <p className="text-sm text-gray-600">
            This link is missing the order id. Please open the link from the email again.
          </p>
        </div>
      </div>
    );
  }

  const isImage = file && file.type.startsWith("image/");

  return (
    <div className="min-h-screen grid place-items-center p-4 sm:p-6">
      <div className="max-w-md w-full rounded-2xl border p-6 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">Upload Payment Proof</h1>
        <p className="text-sm text-gray-600 mt-1">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Ref (optional)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2"
              placeholder="e.g. UBL-123456"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sender Last 4 digits (optional)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2"
              placeholder="e.g. 9876"
              maxLength={4}
              value={senderLast4}
              onChange={(e) => setSenderLast4(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Screenshot / Image / PDF</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onFileChange}
              className="block w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">Allowed: JPG, PNG, PDF. Max size 5MB.</p>

            {isImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="max-h-48 rounded-lg border object-contain"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-black text-white font-medium disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Submit Proof"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProof;
