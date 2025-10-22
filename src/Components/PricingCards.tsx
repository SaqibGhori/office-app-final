import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface FormDataType {
  device: number | null;
  durationValue: number | null;
  planDuration: string;
  price: number;
  basePrice: number;
  discountAmount: number;
  discountPercent: number;
}

export default function PricingCards() {
  const [formData, setFormData] = useState<FormDataType>({
    device: null,
    durationValue: null,
    planDuration: "Months",
    price: 0,
    basePrice: 0,
    discountAmount: 0,
    discountPercent: 0,
  });

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Mobile slider state/refs (mobile-only) ---
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3; // Monthly, Custom, Yearly
console.log(currentSlide)
  const pauseSlider = () => {
    setIsAutoSliding(false);
    if (autoTimerRef.current) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const scrollToIndex = (idx: number) => {
    const container = mobileSliderRef.current;
    if (!container) return;
    const child = container.children[idx] as HTMLElement | undefined;
    if (!child) return;
    // Center the slide smoothly
    child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const setFromMQ = (e: MediaQueryList | MediaQueryListEvent) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    setFromMQ(mq);
    mq.addEventListener?.("change", setFromMQ);
    return () => mq.removeEventListener?.("change", setFromMQ);
  }, []);

  // Auto-slide on mobile 
  useEffect(() => {
    // Pause auto-slide when modal is open
    if (isModalOpen) {
      pauseSlider();
      return;
    }
    if (!isMobile || !isAutoSliding) {
      if (autoTimerRef.current) {
        window.clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }
    autoTimerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % totalSlides;
        scrollToIndex(next);
        return next;
      });
    }, 2500); // auto advance every 2.5s

    return () => {
      if (autoTimerRef.current) {
        window.clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isMobile, isAutoSliding, isModalOpen]);

  const handleMobileCardClick = (index: number) => {
    // Clicking any slide should pause and lock on that slide
    pauseSlider();
    setCurrentSlide(index);
    scrollToIndex(index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const basePerDevice = 500;
    const { name, value } = e.target;
    const numValue = name === "planDuration" ? value : Number(value);

    if (
      name === "durationValue" &&
      formData.planDuration === "Months" &&
      typeof numValue === "number" &&
      numValue > 12
    ) {
      return;
    }

    const updatedForm = { ...formData, [name]: numValue };

    if (updatedForm.device == null || updatedForm.durationValue == null) {
      setFormData(updatedForm);
      return;
    }

    // Total months
    let totalMonths =
      updatedForm.planDuration === "Months"
        ? updatedForm.durationValue
        : updatedForm.durationValue * 12;

    const basePrice = updatedForm.device * (totalMonths * basePerDevice);

    let devicesDiscount = Math.min(
      Math.floor(updatedForm.device / 10) * 0.03,
      0.12
    );

    let durationDiscount = 0;
    if (updatedForm.planDuration === "Months") {
      durationDiscount = Math.min(
        Math.floor(updatedForm.durationValue / 3) * 0.03,
        0.12
      );
    } else if (updatedForm.planDuration === "Years") {
      durationDiscount = 0.12;
    }

    const totalDiscountPercent = devicesDiscount + durationDiscount;
    const discountAmount = basePrice * totalDiscountPercent;
    const finalPrice = basePrice - discountAmount;

    setFormData({
      ...updatedForm,
      price: finalPrice,
      basePrice,
      discountAmount,
      discountPercent: +(totalDiscountPercent * 100).toFixed(2),
    });
  };

  useEffect(() => {
    const savedPlan = localStorage.getItem("pendingPlan");
    if (savedPlan && localStorage.getItem("token")) {
      setSelectedPlan(JSON.parse(savedPlan));
      setIsModalOpen(true);
      localStorage.removeItem("pendingPlan");
    }
  }, []);

  const handleChooseClick = (plan: any) => {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("pendingPlan", JSON.stringify(plan));
      window.location.href = "/login";
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Yearly fixed plan (same as your logic)
  const yearlyDevices = 12;
  const yearlyBasePrice = yearlyDevices * (12 * 500);
  const yearlyDiscountPercent = 0.15 + 0.03;
  const yearlyDiscountAmount = yearlyBasePrice * yearlyDiscountPercent;
  const yearlyFinalPrice = yearlyBasePrice - yearlyDiscountAmount;

  const handleContinue = async () => {
    if (!selectedPlan) return alert("No plan selected");
    if (!proofFile) return alert("Please upload payment proof image");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("You are not logged in");

      const fd = new FormData();
      fd.append("planName", selectedPlan.name);
      fd.append("price", String(selectedPlan.price ?? 0));
      fd.append("duration", String(selectedPlan.duration ?? ""));
      if (selectedPlan.devices !== undefined)
        fd.append("devices", String(selectedPlan.devices));
      if (selectedPlan.basePrice !== undefined)
        fd.append("basePrice", String(selectedPlan.basePrice));
      if (selectedPlan.discountAmount !== undefined)
        fd.append("discountAmount", String(selectedPlan.discountAmount));
      if (selectedPlan.discountPercent !== undefined)
        fd.append("discountPercent", String(selectedPlan.discountPercent));
      fd.append("proof", proofFile);

      await api.postForm("/api/purchases", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Plan submitted for approval. We’ll review your payment proof.");
      setIsModalOpen(false);
      setProofFile(null);
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message || err.message || "Failed to save purchase"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#0b0f1a]">
      {/* purple glow like screenshot */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[520px] w-[520px] rounded-full bg-blue-800/30 blur-3xl"></div>
      </div>

      {/* Header — content same as your original */}
      <div className="relative text-center max-w-3xl mx-auto mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Choose Your IoT Plan
        </h2>
        <p className="text-gray-400 mt-3">
          Power up your business with flexible IoT plans. Get the best value,
          maximum performance, and easy scalability.
        </p>
      </div>

      {/* ---------------- MOBILE SLIDER (only on small screens) ---------------- */}
      <div
        ref={mobileSliderRef}
        className="md:hidden relative flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 px-6"
        // optional: hide scrollbar on some browsers
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Slide 0: Monthly */}
        <div
          className="snap-center shrink-0 w-[88%]"
          onClick={() => handleMobileCardClick(0)}
        >
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
            <h3 className="text-2xl font-bold text-indigo-400">Monthly</h3>
            <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
              500<span className="text-2xl align-top"> RS</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">per month</p>

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li>✔ 1 Device</li>
              <li>✔ 500 Base Price</li>
              <li>✔ 1 Month Access</li>
              <li>✔ Email Support</li>
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation(); // don't re-trigger slide pause
                handleChooseClick({
                  name: "Monthly",
                  price: 500,
                  duration: "1 Month",
                  devices: "1",
                  basePrice: 500,
                  discountAmount: 0,
                  discountPercent: 0,
                });
              }}
              className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Choose
            </button>
          </div>
        </div>

        {/* Slide 1: Custom */}
        <div
          className="snap-center shrink-0 w-[88%] mt-10"
          onClick={() => handleMobileCardClick(1)}
        >
          <div className="group relative rounded-2xl bg-gradient-to-b from-violet-600 to-fuchsia-600 p-[2px] shadow-2xl shadow-violet-900/30 transition-transform duration-300 hover:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-900 shadow">
              Most Popular
            </div>

            <div className="rounded-2xl bg-[#0b0f1a] p-8 text-center">
              <h3 className="text-2xl font-bold text-white">Custom</h3>
              <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
                {formData.price}
                <span className="text-2xl align-top"> RS</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                {formData.durationValue ?? 0} / {formData.planDuration}
              </p>

              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex items-center justify-center gap-2 text-white">
                  <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                  {formData.device || 0} Devices
                </li>
                <li className="flex items-center justify-center gap-2 text-white">
                  <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                  Base {formData.basePrice || 0} RS
                </li>
                <li className="flex items-center justify-center gap-2 text-white">
                  <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                  Save {formData.discountAmount || 0} RS
                </li>
                <li className="flex items-center justify-center gap-2 text-white">
                  <FontAwesomeIcon className="text-yellow-300" icon={faCheck} /> (
                  {formData.discountPercent || 0}% off)
                </li>
                <li className="flex items-center justify-center gap-2 text-white">
                  <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                  Full Access
                </li>
              </ul>

              {/* Radios */}
              <div className="mt-5 flex justify-center gap-6 text-sm text-white">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="planDuration"
                    value="Months"
                    onChange={handleChange}
                    checked={formData.planDuration === "Months"}
                  />{" "}
                  Monthly
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="planDuration"
                    value="Years"
                    onChange={handleChange}
                    checked={formData.planDuration === "Years"}
                  />{" "}
                  Yearly
                </label>
              </div>

              {/* Inputs */}
              <div className="mt-4 flex justify-center gap-3">
                <input
                  onChange={handleChange}
                  name="device"
                  value={formData.device ?? ""}
                  type="number"
                  placeholder="Devices"
                  className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/20"
                />
                <input
                  onChange={handleChange}
                  name="durationValue"
                  value={formData.durationValue ?? ""}
                  type="number"
                  placeholder="Duration"
                  className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChooseClick({
                    name: "Custom",
                    price: formData.price,
                    duration: `${formData.durationValue ?? 0} ${formData.planDuration}`,
                    devices: formData.device,
                    basePrice: formData.basePrice,
                    discountAmount: formData.discountAmount,
                    discountPercent: formData.discountPercent,
                  });
                }}
                className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Choose
              </button>
            </div>
          </div>
        </div>

        {/* Slide 2: Yearly */}
        <div
          className="snap-center shrink-0 w-[88%]"
          onClick={() => handleMobileCardClick(2)}
        >
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
            <h3 className="text-2xl font-bold text-indigo-400">Yearly</h3>
            <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
              {yearlyFinalPrice}
              <span className="text-2xl align-top"> RS</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">per year</p>

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li>✔ {yearlyDevices} Devices</li>
              <li>✔ Base {yearlyBasePrice} RS</li>
              <li>✔ Save {yearlyDiscountAmount} RS</li>
              <li>✔ ({yearlyDiscountPercent * 100}% off)</li>
              <li>✔ 1 Year Full Access</li>
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleChooseClick({
                  name: "Yearly",
                  price: yearlyFinalPrice,
                  duration: "1 Year",
                  devices: yearlyDevices,
                  basePrice: yearlyBasePrice,
                  discountAmount: yearlyDiscountAmount,
                  discountPercent: yearlyDiscountPercent * 100,
                });
              }}
              className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Choose
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- DESKTOP/TABLET GRID (unchanged UI, md and up) ---------------- */}
      <div className="relative mx-auto hidden md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl px-6">
        {/* Monthly */}
        <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
          <h3 className="text-2xl font-bold text-indigo-400">Monthly</h3>
          <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
            500<span className="text-2xl align-top"> RS</span>
          </p>
          <p className="mt-1 text-sm text-gray-400">per month</p>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li>✔ 1 Device</li>
            <li>✔ 500 Base Price</li>
            <li>✔ 1 Month Access</li>
            <li>✔ Email Support</li>
          </ul>

          <button
            onClick={() =>
              handleChooseClick({
                name: "Monthly",
                price: 500,
                duration: "1 Month",
                devices: "1",
                basePrice: 500,
                discountAmount: 0,
                discountPercent: 0,
              })
            }
            className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Choose
          </button>
        </div>

        {/* Custom */}
        <div className="group relative rounded-2xl bg-gradient-to-b from-violet-600 to-fuchsia-600 p-[2px] shadow-2xl shadow-violet-900/30 transition-transform duration-300 hover:-translate-y-2">
          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-900 shadow">
            Most Popular
          </div>

          <div className="rounded-2xl bg-[#0b0f1a] p-8 text-center">
            <h3 className="text-2xl font-bold text-white">Custom</h3>
            <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
              {formData.price}
              <span className="text-2xl align-top"> RS</span>
            </p>
            <p className="mt-1 text-sm text-white/70">
              {formData.durationValue ?? 0} / {formData.planDuration}
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-center justify-center gap-2 text-white">
                <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                {formData.device || 0} Devices
              </li>
              <li className="flex items-center justify-center gap-2 text-white">
                <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                Base {formData.basePrice || 0} RS
              </li>
              <li className="flex items-center justify-center gap-2 text-white">
                <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                Save {formData.discountAmount || 0} RS
              </li>
              <li className="flex items-center justify-center gap-2 text-white">
                <FontAwesomeIcon className="text-yellow-300" icon={faCheck} /> (
                {formData.discountPercent || 0}% off)
              </li>
              <li className="flex items-center justify-center gap-2 text-white">
                <FontAwesomeIcon className="text-yellow-300" icon={faCheck} />{" "}
                Full Access
              </li>
            </ul>

            {/* Radios */}
            <div className="mt-5 flex justify-center gap-6 text-sm text-white">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="planDuration"
                  value="Months"
                  onChange={handleChange}
                  checked={formData.planDuration === "Months"}
                />{" "}
                Monthly
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="planDuration"
                  value="Years"
                  onChange={handleChange}
                  checked={formData.planDuration === "Years"}
                />{" "}
                Yearly
              </label>
            </div>

            {/* Inputs */}
            <div className="mt-4 flex justify-center gap-3">
              <input
                onChange={handleChange}
                name="device"
                value={formData.device ?? ""}
                type="number"
                placeholder="Devices"
                className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/20"
              />
              <input
                onChange={handleChange}
                name="durationValue"
                value={formData.durationValue ?? ""}
                type="number"
                placeholder="Duration"
                className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <button
              onClick={() =>
                handleChooseClick({
                  name: "Custom",
                  price: formData.price,
                  duration: `${formData.durationValue ?? 0} ${formData.planDuration}`,
                  devices: formData.device,
                  basePrice: formData.basePrice,
                  discountAmount: formData.discountAmount,
                  discountPercent: formData.discountPercent,
                })
              }
              className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Choose
            </button>
          </div>
        </div>

        {/* Yearly */}
        <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
          <h3 className="text-2xl font-bold text-indigo-400">Yearly</h3>
          <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
            {yearlyFinalPrice}
            <span className="text-2xl align-top"> RS</span>
          </p>
          <p className="mt-1 text-sm text-gray-400">per year</p>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li>✔ {yearlyDevices} Devices</li>
            <li>✔ Base {yearlyBasePrice} RS</li>
            <li>✔ Save {yearlyDiscountAmount} RS</li>
            <li>✔ ({yearlyDiscountPercent * 100}% off)</li>
            <li>✔ 1 Year Full Access</li>
          </ul>

          <button
            onClick={() =>
              handleChooseClick({
                name: "Yearly",
                price: yearlyFinalPrice,
                duration: "1 Year",
                devices: yearlyDevices,
                basePrice: yearlyBasePrice,
                discountAmount: yearlyDiscountAmount,
                discountPercent: yearlyDiscountPercent * 100,
              })
            }
            className="mt-8 w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Choose
          </button>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedPlan?.name} Plan
            </h2>
            <p>
              <strong>Price:</strong> {selectedPlan?.price} RS
            </p>
            <p>
              <strong>Duration:</strong> {selectedPlan?.duration}
            </p>
            {selectedPlan?.devices && (
              <p>
                <strong>Devices:</strong> {selectedPlan.devices}
              </p>
            )}
            {selectedPlan?.basePrice && (
              <p>
                <strong>Base Price:</strong> {selectedPlan.basePrice} RS
              </p>
            )}
            {selectedPlan?.discountAmount !== undefined && (
              <p>
                <strong>Saved:</strong> {selectedPlan.discountAmount} RS
              </p>
            )}
            {selectedPlan?.discountPercent !== undefined && (
              <p>
                <strong>Discount:</strong> {selectedPlan.discountPercent}%
              </p>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Upload Payment Proof
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProofFile(e.target.files?.[0] || null)
                }
                className="w-full border rounded p-2"
              />
              {proofFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {proofFile.name} — {(proofFile.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleContinue}
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
