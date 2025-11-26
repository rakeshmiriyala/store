import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

const CustomerServices: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Customer services form submitted");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-white">
          {/* CENTER CONTENT */}
          <div className="mx-auto flex justify-center md:justify-center max-w-6xl px-4 py-10 md:px-6 md:py-12">

            <div className="w-full md:w-[55%]">
              <Card className="sticky top-20 shadow-md">
                <CardContent className="p-5">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Sales Requests
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-4 text-sm"
                  >

                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company Shop Name</Label>
                      <Input id="company" name="company" placeholder="Your business name" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" placeholder="Your Email Address" type="email" autoComplete="email" required />
                      </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="enquiryType">Enquiry type</Label>
                      <select
                        id="enquiryType"
                        name="enquiryType"
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        required
                      >
                        <option value="">Please select</option>
                        <option value="order">Order / delivery</option>
                        <option value="returns">Returns / damages</option>
                        <option value="account">Account / payment</option>
                        <option value="product">Product information</option>
                        <option value="general">General enquiry</option>
                        <option value="supplier">New supplier enquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="accountType">
                        Customer / supplier type
                      </Label>
                      <select
                        id="accountType"
                        name="accountType"
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="">Please select</option>
                        <option value="trade">Trade customer</option>
                        <option value="retail">Retail customer</option>
                        <option value="supplier">Supplier</option>
                        <option value="prospect">Prospective customer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    

                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" name="firstName" autoComplete="given-name" required />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" name="lastName" autoComplete="family-name" required />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor="phone">Contact number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+44 ..." />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor="accountNumber">Account number (optional)</Label>
                        <Input id="accountNumber" name="accountNumber" placeholder="Optional" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor="orderNumber">Order / invoice number</Label>
                        <Input id="orderNumber" name="orderNumber" placeholder="Optional" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="Brief summary" required />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Include relevant details such as product codes, quantities, delivery dates, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2 rounded-md bg-slate-50 p-3 text-[11px] text-slate-600">
                      <p>
                        By submitting this form you agree that we may use the
                        details you provide to respond to your enquiry. Your data
                        will be handled in line with our privacy policy.
                      </p>
                    </div>

                    <Button type="submit" className="mt-1 w-full rounded-full text-sm font-medium">
                      Send enquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerServices;
