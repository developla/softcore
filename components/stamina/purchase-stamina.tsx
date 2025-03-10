"use client";
import React, { useState } from "react";
import { FaBatteryThreeQuarters, FaWallet } from "react-icons/fa";
import { useWallet } from "@/lib/contexts/WalletContext";
import { useAuth } from "@/lib/hooks/useAuth";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StaminaPlan {
  amount: number;
  price: string;
  name: string;
  description: string;
}

const STAMINA_PLANS: StaminaPlan[] = [
  {
    name: "Basic Pack",
    amount: 3,
    price: "0.1",
    description: "Perfect for casual players",
  },
  {
    name: "Premium Pack",
    amount: 10,
    price: "0.3",
    description: "Most popular choice",
  },
  {
    name: "Ultra Pack",
    amount: 25,
    price: "0.6",
    description: "Best value for active players",
  },
];

interface PurchaseStaminaProps {
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function PurchaseStamina({
  onSuccess,
  isOpen: propIsOpen,
  onClose,
}: PurchaseStaminaProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StaminaPlan | null>(null);
  const { signer, walletAddress, connectWallet } = useWallet();

  // Use prop value if provided
  const showDialog = propIsOpen ?? isOpen;

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
    setSelectedPlan(null);
  };

  // Only render if user is logged in
  if (!user) {
    return null;
  }

  const handlePurchase = async (plan: StaminaPlan) => {
    if (!signer || !walletAddress) {
      connectWallet();
      return;
    }

    if (!process.env.NEXT_PUBLIC_TREASURY_ADDRESS) {
      console.error("Treasury address not configured");
      alert("System configuration error");
      return;
    }

    setIsPurchasing(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create initial transaction object
      const tx = {
        to: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
        value: ethers.parseEther(plan.price),
        from: walletAddress,
      };

      // Get fee data
      const feeData = await signer.provider.getFeeData();

      // Estimate gas
      const gasEstimate = await signer.provider.estimateGas(tx);

      // Create final transaction with all necessary parameters
      const finalTx = {
        ...tx,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gas: gasEstimate,
      };

      // Send transaction
      const transaction = await signer.sendTransaction(finalTx);
      console.log("Transaction sent:", transaction.hash);

      // Wait for transaction confirmation
      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);

      // Save transaction and update stamina
      const response = await fetch("/api/user/stamina/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.amount,
          price: plan.price,
          transactionHash: transaction.hash,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      setIsOpen(false);
      setSelectedPlan(null);
      onSuccess?.();

      // Redirect to transactions page
      router.push("/transactions");
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Failed to purchase stamina. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <>
      {/* Only show the button if propIsOpen is not provided */}
      {propIsOpen === undefined && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 bg-pink-500 text-white rounded-full p-4 shadow-lg hover:bg-pink-600 transition-colors z-50"
          title="Purchase Stamina"
        >
          <FaBatteryThreeQuarters className="w-6 h-6" />
        </button>
      )}

      {showDialog && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl p-4 w-80 border-2 border-black z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Purchase Stamina</h3>
            <div className="flex items-center space-x-2">
              <Link
                href="/transactions"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                title="View Transaction History"
              >
                History
              </Link>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {STAMINA_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlan === plan
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <p className="text-sm mt-1">
                      Get <span className="font-bold">{plan.amount}</span>{" "}
                      stamina points
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">{plan.price} CORE</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!signer || !walletAddress ? (
            <button
              onClick={connectWallet}
              className="w-full py-3 px-4 rounded-lg mt-4 font-semibold bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center gap-2"
            >
              <FaWallet className="text-xl" />
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={() => selectedPlan && handlePurchase(selectedPlan)}
              disabled={isPurchasing}
              className={`w-full py-3 px-4 rounded-lg mt-4 font-semibold ${
                isPurchasing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {isPurchasing
                ? "Processing..."
                : !selectedPlan
                ? "Select a Plan"
                : `Purchase ${selectedPlan.name}`}
            </button>
          )}
        </div>
      )}
    </>
  );
}
