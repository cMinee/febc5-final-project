"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XMarkIcon, CreditCardIcon, QrCodeIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Course } from "@/app/db";
import Image from "next/image";

interface PurchaseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  userId: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PurchaseModal({ course, isOpen, onClose, onPurchaseComplete, userId }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  const handlePurchase = async (method: "credit_card" | "qr_code") => {
    setIsProcessing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        const res = await fetch("/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                courseId: course.id,
                amount: typeof course.price === 'number' ? course.price : 0,
                method,
                slipUrl: method === 'qr_code' && slipFile ? "mock-slip-url.jpg" : undefined
            })
        });

        if (res.ok) {
            onPurchaseComplete();
            onClose();
        } else {
            alert("Purchase failed. Please try again.");
        }
    } catch (error) {
        console.error("Purchase error", error);
        alert("An error occurred.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                           Unlock Course Access
                        </Dialog.Title>
                        <p className="mt-2 text-sm text-gray-500">
                            To start learning <span className="font-semibold text-gray-900">{course.name}</span>, please complete your payment.
                        </p>
                        <div className="mt-4 text-3xl font-bold text-indigo-600">
                             ฿{course.price}
                        </div>
                    </div>

                    <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 mb-6">
                            <Tab
                            className={({ selected }) =>
                                classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-blue-600'
                                )
                            }
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <CreditCardIcon className="w-5 h-5" />
                                    Credit Card
                                </div>
                            </Tab>
                            <Tab
                            className={({ selected }) =>
                                classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-blue-600'
                                )
                            }
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <QrCodeIcon className="w-5 h-5" />
                                    QR Code Scan
                                </div>
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            {/* Credit Card Panel */}
                            <Tab.Panel className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" disabled />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">Expiry</label>
                                        <input type="text" placeholder="MM/YY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" disabled />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">CVC</label>
                                        <input type="text" placeholder="123" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" disabled />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePurchase("credit_card")}
                                    disabled={isProcessing}
                                    className="w-full mt-4 bg-indigo-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {isProcessing ? "Processing..." : "Pay Now"}
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    (This is a mock payment. No actual charge will be made.)
                                </p>
                            </Tab.Panel>

                            {/* QR Code Panel */}
                            <Tab.Panel className="space-y-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Scan to Pay via Banking App</p>
                                    <div className="relative w-48 h-48 bg-white p-2 shadow-sm rounded-lg mb-4">
                                        {/* Mock QR placeholder */}
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xs">
                                            {/* <QrCodeIcon className="w-12 h-12" /> */}
                                            <img src="../Payment-example.png" alt="Payment Example" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">Ref: {course.id}-{userId.slice(-4)}</p>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Upload Payment Slip</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                                            </div>
                                            <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setSlipFile(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                    </div>
                                    {slipFile && (
                                        <p className="text-sm text-green-600 mt-2 text-left flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {slipFile.name}
                                        </p>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => handlePurchase("qr_code")}
                                    disabled={isProcessing || !slipFile}
                                    className="w-full mt-4 bg-indigo-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {isProcessing ? "Verifying..." : "Confirm Payment"}
                                </button>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
