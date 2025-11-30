import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black mb-8 tracking-tight">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Effective Date: November 28, 2025
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to HomeFlow ("we," "us," or "our"). By accessing or using our
            website and services (collectively, the "Service"), you agree to be
            bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, do not use the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
          <p>
            HomeFlow provides a platform for homeowners to plan, manage, and
            execute Accessory Dwelling Unit (ADU) and home extension projects.
            Our services include feasibility analysis, project management tools,
            and directories of third-party contractors.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
          <p>
            You must create an account to access certain features. You are
            responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account. You
            agree to notify us immediately of any unauthorized use.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available." We make no
            warranties, expressed or implied, regarding the accuracy of zoning
            data, cost estimates, or the quality of third-party contractors
            listed on our platform. You are responsible for verifying all
            information with local authorities and professionals.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall HomeFlow be liable for any indirect, incidental,
            special, consequential, or punitive damages, including without
            limitation, loss of profits, data, or use, arising out of or in
            connection with your use of the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Google Maps</h2>
          <p>
            Our Service utilizes Google Maps features and content. Use of Google
            Maps features and content is subject to the current versions of the:
            (1) <a href="https://maps.google.com/help/terms_maps.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Maps/Google Earth Additional Terms of Service</a>; and (2) <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice or liability, for any reason,
            including without limitation if you breach these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@homeflow.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
