import React, { useEffect, useState } from "react";

export default function Plans() {
  const [formData, setFormData] = useState({
    device: null as number | null,
    durationValue: null as number | null,
    planDuration: "Months",
    price: 0,
  });

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const perDevice = 500;
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

    const calculatedPrice = updatedForm.device * perDevice;

    let devicesDiscount = Math.min(
      Math.floor(updatedForm.device / 10) * 0.03,
      0.12
    );

    let monthlyDiscount = 0;
    if (updatedForm.planDuration === "Months") {
      monthlyDiscount = Math.min(
        Math.floor(updatedForm.durationValue / 3) * 0.03,
        0.12
      );
    } else if (updatedForm.planDuration === "Years") {
      monthlyDiscount = 0.12;
    }

    const totalDiscount = devicesDiscount + monthlyDiscount;
    updatedForm.price = calculatedPrice - calculatedPrice * totalDiscount;

    setFormData(updatedForm);
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
  return (
    <>
      <div className="bg-secondary py-10">
        {/* Header */}
        <div className="bg-primary mx-auto text-center py-10 px-6 rounded-lg w-[90%] h-72">
          <h2 className="text-white text-2xl font-bold uppercase">Choose Your Plan</h2>
          <p className="text-blue-100 mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Universa enim
            illorum ratione cum tota vestra confluigendum puto.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-[-100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6">
          
          {/* Start-Up */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2">Monthly</h3>
            <p className="text-indigo-900 font-bold text-lg">500<span>RS</span></p>
            <p className="mb-4">1<span>/Month</span></p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ Unlimited Downloads</li>
              <li>✔ Email Support</li>
              <li>✔ Limited Access</li>
            </ul>
            <button
              onClick={() =>
                handleChooseClick({ name: "Monthly", price: 500, duration: "1 Month" })
              }
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-950"
            >
              Choose
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center transform scale-105 border-t-4 border-red-400">
            <h3 className="text-xl font-bold mb-2">Custom</h3>
            <p className="text-indigo-900 font-bold text-lg">
              {formData.price} <span>RS</span>
            </p>
            <p className="mb-4">
              {formData.durationValue ?? 0}
              <span>/{formData.planDuration}</span>
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ Up to 10 Users</li>
              <li>✔ Email Support, Call Support</li>
              <li>✔ 1 Year Access</li>
            </ul>

            <div className="flex justify-start gap-4">
              <label>
                <input
                  type="radio"
                  name="planDuration"
                  value="Months"
                  onChange={handleChange}
                  checked={formData.planDuration === "Months"}
                />{" "}
                Monthly
              </label>
              <label>
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

            <div className="flex justify-center gap-5 mt-4">
              <input
                onChange={handleChange}
                name="device"
                value={formData.device ?? ""}
                type="number"
                className="w-24 h-10 px-3"
                placeholder="Add devices"
              />
              <input
                onChange={handleChange}
                name="durationValue"
                value={formData.durationValue ?? ""}
                type="number"
                placeholder="years/months"
                max={formData.planDuration === "Months" ? 12 : undefined}
                className="w-24 h-10 px-3"
              />
            </div>

            <button
              onClick={() =>
                handleChooseClick({
                  name: "Custom",
                  price: formData.price,
                  duration: `${formData.durationValue ?? 0} ${formData.planDuration}`,
                  devices: formData.device,
                })
              }
              className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 mt-4"
            >
              Choose
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2">Yearly</h3>
            <p className="text-indigo-900 font-bold text-lg">6000<span>RS</span></p>
            <p className="mb-4">1<span>/Year</span></p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✔ 12 Devices</li>
              <li>✔ On-demand Request</li>
              <li>✔ 1 Year Access</li>
            </ul>
            <button
              onClick={() =>
                handleChooseClick({ name: "Yearly", price: 6000, duration: "1 Year" })
              }
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-950"
            >
              Choose
            </button>
          </div>
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
    </>
  );
}
