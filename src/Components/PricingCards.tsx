import React, { useEffect, useState } from "react";

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

  const updatedForm = {
    ...formData,
    [name]: numValue,
  };

  if (updatedForm.device == null || updatedForm.durationValue == null) {
    setFormData(updatedForm);
    return;
  }

  // Total months calculation
  let totalMonths = updatedForm.planDuration === "Months"
    ? updatedForm.durationValue
    : updatedForm.durationValue * 12;

  // Base price (without discount)
  const basePrice = updatedForm.device * (totalMonths * basePerDevice);

  // Discounts
  let devicesDiscount = Math.min(Math.floor(updatedForm.device / 10) * 0.03, 0.12);

  let durationDiscount = 0;
  if (updatedForm.planDuration === "Months") {
    durationDiscount = Math.min(Math.floor(updatedForm.durationValue / 3) * 0.03, 0.12);
  } else if (updatedForm.planDuration === "Years") {
    durationDiscount = 0.12;
  }

  const totalDiscountPercent = devicesDiscount + durationDiscount;
  const discountAmount = basePrice * totalDiscountPercent;
  const finalPrice = basePrice - discountAmount;

  // Update state
  setFormData({
    ...updatedForm,
    price: finalPrice,
    basePrice: basePrice,
    discountAmount: discountAmount,
    discountPercent: +(totalDiscountPercent * 100).toFixed(2)
  });
};



  useEffect(() => {
    // Login ke baad wapas aane par modal auto-open kare
    const savedPlan = localStorage.getItem("pendingPlan");
    if (savedPlan && localStorage.getItem("token")) {
      setSelectedPlan(JSON.parse(savedPlan));
      setIsModalOpen(true);
      localStorage.removeItem("pendingPlan"); // Ek baar use karke remove kar do
    }
  }, []);

  const handleChooseClick = (plan: any) => {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("pendingPlan", JSON.stringify(plan)); // Plan store karo
      window.location.href = "/login";
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  // Yearly price calculation
  const yearlyDevices = 12; // static yearly plan ka devices count
  const yearlyBasePrice = yearlyDevices * (12 * 500); // base price (12 months * 500 per device per month)
  const yearlyDiscountPercent = 0.15 + 0.03; // 15% yearly + 3% device discount
  const yearlyDiscountAmount = yearlyBasePrice * yearlyDiscountPercent; // kitne Rs ka discount mila
  const yearlyFinalPrice = yearlyBasePrice - yearlyDiscountAmount; // final price after discount

  return (
    <>
      <div className="bg-secondary h-[100vh] py-10">
        {/* Header */}
        <div className="bg-primary mx-auto text-center py-10 px-6 rounded-lg w-[90%] h-72">
          <h2 className="text-white text-2xl font-bold uppercase">Choose Your IoT Plan</h2>
          <p className="text-blue-100 mt-2">
            Power up your business with the perfect IoT device plan — whether you’re starting small or scaling big, we’ve got you covered.
            Enjoy secure connectivity, smart automation, and maximum value for your investment.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-[-100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6">

          {/* Monthly */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2">Monthly</h3>
            <p className="text-indigo-900 font-bold text-lg">500 <span>RS</span></p>
            <p className="mb-4">1<span>/Month</span></p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ 1 Device</li>
              <li>✔ 500 Base Price</li>
              <li>✔ You save 0 RS</li>
              <li>✔ (0% off)</li>
              <li>✔ 1 Month Limited Access</li>
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
                  discountPercent: 0
                })
              }
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-950"
            >
              Choose
            </button>
          </div>

          {/* Custom */}
          <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center transform scale-105 border-t-4 border-red-400">
            <h3 className="text-xl font-bold mb-2">Custom</h3>
            <p className="text-indigo-900 font-bold text-lg">{formData.price} <span>RS</span></p>
            <p className="mb-4">{formData.durationValue ?? 0}<span>/{formData.planDuration}</span></p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ {formData.device || 0} Devices</li>
              <li>✔ {formData.basePrice || 0}  Base price</li>
              <li>✔ You saved {formData.discountAmount || 0} RS </li>
              <li>✔ ({formData.discountPercent || 0}% off)</li>
              <li>✔ {formData.planDuration === "Years" ? `${formData.durationValue || 0} Year Access` : `${formData.durationValue || 0} Month Access`}</li>
              <li>✔ Email Support, Call Support</li>
            </ul>
            <div className="flex justify-start gap-4">
              <label>
                <input type="radio" name="planDuration" value="Months" onChange={handleChange} checked={formData.planDuration === "Months"} /> Monthly
              </label>
              <label>
                <input type="radio" name="planDuration" value="Years" onChange={handleChange} checked={formData.planDuration === "Years"} /> Yearly
              </label>
            </div>
            <div className="flex justify-center gap-5 mt-4">
              <input onChange={handleChange} name="device" value={formData.device ?? ""} type="number" placeholder="Devices" className="w-24 h-10 px-3" />
              <input onChange={handleChange} name="durationValue" value={formData.durationValue ?? ""} type="number" placeholder="Duration" className="w-24 h-10 px-3" />
            </div>
            <button
              onClick={() =>
                handleChooseClick({
                  name: "Custom",
                  price: formData.price,
                  duration: `${formData.durationValue ?? 0} ${formData.planDuration}`,
                  devices: formData.device,
                  basePrice: formData.basePrice || formData.price,
                  discountAmount: formData.discountAmount,
                  discountPercent: formData.discountPercent
                })
              }
              className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 mt-4"
            >
              Choose
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2">Yearly</h3>
            <p className="text-indigo-900 font-bold text-lg">{yearlyFinalPrice} <span>RS</span></p>
            <p className="mb-4">1<span>/Year</span></p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ {yearlyDevices} Devices</li>
              <li>✔ {yearlyBasePrice} Yearly Base Price</li>
              <li>✔ You saved {yearlyDiscountAmount} RS</li>
              <li>✔ ({yearlyDiscountPercent * 100}% off)</li>
              <li>✔ 1 Year Full Access</li>
              <li>✔ Email Support, Call Support</li>
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
                  discountPercent: yearlyDiscountPercent * 100
                })
              }
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-950"
            >
              Choose
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">{selectedPlan?.name} Plan</h2>
              <p><strong>Price:</strong> {selectedPlan?.price} RS</p>
              <p><strong>Duration:</strong> {selectedPlan?.duration}</p>
              {selectedPlan?.devices && <p><strong>Devices:</strong> {selectedPlan.devices}</p>}
              {selectedPlan?.basePrice && <p><strong>Base Price:</strong> {selectedPlan.basePrice} RS</p>}
              {selectedPlan?.discountAmount !== undefined && <p><strong>Saved:</strong> {selectedPlan.discountAmount} RS</p>}
              {selectedPlan?.discountPercent !== undefined && <p><strong>Discount:</strong> {selectedPlan.discountPercent}%</p>}

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => alert("Next step logic yahan ayega")}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
