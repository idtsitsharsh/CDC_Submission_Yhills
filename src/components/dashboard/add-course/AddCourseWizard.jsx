"use client";

import { useState } from "react";
import { z } from "zod";
import StepIndicator from "./StepIndicator";
import StepBasicInfo from "./StepBasicInfo";
import StepPricing from "./StepPricing";
import StepImage from "./StepImage";
import StepReview from "./StepReview";
import { useRouter } from "next/navigation";

const STEPS = ["Basic Info", "Pricing", "Image", "Review"];

const BasicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  department: z.string().min(2, "Department is required"),
});

const PricingSchema = z.object({
  price: z.number().nonnegative("Price cannot be negative"),
});

const ImageSchema = z.object({
  image: z.any().optional(),
});

export default function AddCourseWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    price: 0,
    image: null,
    thumbnail: "", 
    instructors: [],     
    curriculum: [], 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const next = async () => {
    let validation;
    if (step === 0) validation = BasicInfoSchema.safeParse(formData);
    if (step === 1) validation = PricingSchema.safeParse(formData);
    if (step === 2) validation = ImageSchema.safeParse(formData);

    if (validation && !validation.success) {
    const messages = validation.error?.issues?.map(e => e.message) || ["Invalid input"];
    setError(messages.join(", "));
    return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

//   const handleUploadImage = async () => {
//     if (!formData.image) return "";

//     const fileData = new FormData();
//     fileData.append("file", formData.image);

//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/upload-image", {
//         method: "POST",
//         body: fileData,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Upload failed");
//       setFormData((prev) => ({ ...prev, thumbnail: data.path }));
//       return data.path;
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Image upload failed");
//       return "";
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        price: formData.price,
        thumbnail: formData.thumbnail || undefined,
        instructors: formData.instructors, 
        curriculum: formData.curriculum,     
      };

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && Array.isArray(data.errors)) {
            setError(data.errors.join(", "));
            return;
        }
        throw new Error(data.message || "Create course failed");
        }

      alert("Course created successfully!");
      router.push("/dashboard"); 
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Add New Course</h1>

      <StepIndicator steps={STEPS} current={step} />

      <div className="wizard-card">
        {step === 0 && <StepBasicInfo data={formData} setData={setFormData} />}
        {step === 1 && <StepPricing data={formData} setData={setFormData} />}
        {step === 2 && <StepImage data={formData} setData={setFormData} />}
        {step === 3 && <StepReview data={formData} />}

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <div className="wizard-actions">
          {step > 0 && (
            <button className="btn-secondary" onClick={back} disabled={loading}>
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={next} disabled={loading}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
