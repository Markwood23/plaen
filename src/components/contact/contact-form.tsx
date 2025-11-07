"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
  };

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    resetTimerRef.current = window.setTimeout(() => setIsSubmitted(false), 3000);

    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, [isSubmitted]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
          rows={6}
          className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Tell us how we can help..."
          required
        />
      </div>

      {isSubmitted && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-green-800">
            Message sent! We'll get back to you within 24 hours.
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-black text-white transition hover:bg-gray-900 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            Send message
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
