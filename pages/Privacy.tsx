import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
        <h1 className="text-4xl font-black mb-8 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Effective Date: November 28, 2025
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>
            HomeFlow ("we," "us," or "our") respects your privacy and is
            committed to protecting your personal data. This Privacy Policy
            explains how we collect, use, and share information about you when
            you use our website and services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, create a project, or communicate with us. This may
            include your name, email address, property address, and project
            details.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our
            Service, including to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and manage your ADU projects.</li>
            <li>Connect you with contractors (only upon your request).</li>
            <li>Send you technical notices, updates, and support messages.</li>
            <li>Respond to your comments and questions.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share your information only in
            the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              With contractors or service providers, but <strong>only when you explicitly send them a request or add them to your team</strong>.
            </li>
            <li>To comply with legal obligations.</li>
            <li>With your consent or at your direction.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention & Deletion</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill
            the purposes for which we collected it. You may request the deletion
            of your account and all associated data at any time via your
            account settings or by contacting us.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Third-Party Services</h2>
          <p>
            Our Service may contain links to third-party websites or services
            (e.g., Google Maps) that are not owned or controlled by us. We have
            no control over and assume no responsibility for the content,
            privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@homeflow.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
