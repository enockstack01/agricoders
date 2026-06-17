"use client";
import { useRef } from "react";
import { FormSubmission } from "@/types";
import { FormInput, SectionTitle, GridRow } from "./FormField";
import { Upload, X } from "lucide-react";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "RWF", "KES", "NGN", "ZAR", "GHS", "UGX", "TZS", "ETB", "INR", "CAD", "AUD"];

export default function StepCompanyInfo({ formData, update }: Props) {
  const ci = formData.companyInfo;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof ci, val: string) => {
    update("companyInfo", { ...ci, [key]: val });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) set("companyLogo", ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    set("companyLogo", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Enter your company and author information. This will appear on the cover page of your business plan.</p>

      <SectionTitle>Author Information</SectionTitle>
      <GridRow cols={2}>
        <FormInput
          label="Author Full Name"
          value={ci.authorName}
          onChange={(v) => set("authorName", v)}
          placeholder="Your full name"
          required
          hint="Full legal name of the person submitting this business plan."
        />
        <FormInput
          label="Author Title"
          value={ci.authorTitle}
          onChange={(v) => set("authorTitle", v)}
          placeholder="e.g. Founder & CEO"
          required
          hint="Your job title or role within the company (e.g. CEO, Director, Co-Founder)."
        />
      </GridRow>
      <GridRow cols={2}>
        <FormInput
          label="Phone Number"
          value={ci.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+1 555 000 0000"
          hint="Primary contact phone number including country code."
        />
        <FormInput
          label="Email Address"
          value={ci.email}
          onChange={(v) => set("email", v)}
          type="email"
          placeholder="you@yourcompany.com"
          hint="Professional email address for correspondence related to this plan."
        />
      </GridRow>

      <SectionTitle>Company Information</SectionTitle>
      <GridRow cols={2}>
        <FormInput
          label="Company Name"
          value={ci.companyName}
          onChange={(v) => set("companyName", v)}
          placeholder="Your company name"
          required
          hint="Official registered name of your company or business entity."
        />
        <FormInput
          label="Product / Project Name"
          value={ci.productName}
          onChange={(v) => set("productName", v)}
          placeholder="Your flagship product or project name"
          required
          hint="The main product, service, or project this business plan is centred around."
        />
      </GridRow>
      <GridRow cols={2}>
        <FormInput
          label="Location / Country"
          value={ci.location}
          onChange={(v) => set("location", v)}
          placeholder="e.g. Nairobi, Kenya"
          hint="City and country where the business is headquartered or primarily operates."
        />
        <FormInput
          label="Company Type"
          value={ci.companyType}
          onChange={(v) => set("companyType", v)}
          placeholder="e.g. Private Limited, LLC, Sole Trader"
          hint="Legal structure of the business (e.g. Private Limited Company, LLC, Partnership)."
        />
      </GridRow>
      <GridRow cols={2}>
        <FormInput
          label="Industry / Company Focus"
          value={ci.companyFocus}
          onChange={(v) => set("companyFocus", v)}
          placeholder="e.g. FinTech, AgriTech, Healthcare, Logistics, EdTech"
          hint="The sector or industry your business operates in. Used throughout the document to describe your market."
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-1">All monetary values in the business plan will be displayed in this currency.</p>
          <select
            value={COMMON_CURRENCIES.includes(ci.currency) ? ci.currency : "__custom__"}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                set("currency", ""); // clear so the text input appears
              } else {
                set("currency", e.target.value);
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mb-2"
          >
            {COMMON_CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__custom__">Other (enter below)</option>
          </select>
          {!COMMON_CURRENCIES.includes(ci.currency) && (
            <input
              value={ci.currency}
              onChange={(e) => set("currency", e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter currency code, e.g. MXN, JPY, BRL"
              maxLength={5}
              autoFocus
            />
          )}
        </div>
      </GridRow>
      <GridRow cols={2}>
        <FormInput
          label="Company Website"
          value={ci.website ?? ""}
          onChange={(v) => set("website", v)}
          placeholder="https://yourcompany.com"
          hint="Your company website URL. Included on the cover page and used by the AI to enrich the business plan with real company information."
        />
        <div />
      </GridRow>

      {/* Company Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
        <p className="text-xs text-gray-400 mb-2">Upload your company logo to have it displayed prominently on the cover page of the generated business plan. Accepted formats: PNG, JPG, GIF, WebP. Recommended size: 300×150 px or wider.</p>
        {ci.companyLogo ? (
          <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ci.companyLogo} alt="Company logo" className="h-16 object-contain rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-700 font-medium">Logo uploaded</p>
              <p className="text-xs text-gray-400">It will appear on the cover page of your business plan.</p>
            </div>
            <button
              type="button"
              onClick={removeLogo}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove logo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 hover:border-green-400 rounded-lg text-sm text-gray-500 hover:text-green-600 transition-colors w-full justify-center"
          >
            <Upload size={15} />
            Click to upload logo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={handleLogoUpload}
        />
      </div>

      <SectionTitle>Submission Details</SectionTitle>
      <GridRow cols={2}>
        <FormInput
          label="Submitted To (Name / Title)"
          value={ci.submittedTo}
          onChange={(v) => set("submittedTo", v)}
          placeholder="Reviewer or supervisor name"
          hint="Name and title of the person or institution this plan is being presented to (e.g. Board of Directors, Investor Name)."
        />
        <FormInput
          label="Submission Date"
          value={ci.submissionDate}
          onChange={(v) => set("submissionDate", v)}
          placeholder="e.g. 1st January 2026"
          hint="The date this business plan is formally submitted or presented."
        />
      </GridRow>
    </div>
  );
}
