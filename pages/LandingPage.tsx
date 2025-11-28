import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import MapPreview from "../components/MapPreview";

const LandingPage = () => {
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (address.length > 5) {
      setIsAnalyzed(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold w-fit border border-blue-100">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Instant Feasibility Check
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Does your property qualify for an{" "}
              <span className="text-primary">ADU?</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Get an instant feasibility report, construction cost estimates,
              and connect with vetted builders in seconds.
            </p>

            <div className="w-full max-w-md">
              <div className="flex items-center w-full bg-white p-2 rounded-xl border-2 border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
                <span className="material-symbols-outlined text-slate-400 ml-3">
                  search
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Enter your property address..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-500 text-base h-12 px-3 outline-none"
                />
                <button
                  onClick={handleAnalyze}
                  className="px-6 h-12 flex items-center justify-center bg-primary hover:bg-primary-hover text-slate text-base font-bold rounded-lg transition-colors"
                >
                  Analyze
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 ml-2">
                <span className="font-bold">Try:</span> 123 Maple Street, San
                Francisco
              </p>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] w-full">
            <MapPreview className="h-full w-full" isAnalyzed={isAnalyzed} />

            {/* Potential Card Overlay */}
            {isAnalyzed && (
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-5 rounded-xl shadow-xl border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      High Potential Found!
                    </h3>
                    <p className="text-sm text-slate-500">
                      Zoning allows for a detached ADU.
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Max Size
                    </p>
                    <p className="font-black text-slate-900 text-lg">
                      800 sqft
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Est. ROI
                    </p>
                    <p className="font-black text-green-600 text-lg">+22%</p>
                  </div>
                </div>
                <Link
                  to={
                    user
                      ? "/dashboard"
                      : `/login?mode=signup&address=${encodeURIComponent(
                          address
                        )}`
                  }
                  className="w-full h-11 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate font-bold rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    lock_open
                  </span>
                  Unlock Full Report
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features / How it Works */}
      <section
        id="how-it-works"
        className="bg-white py-20 border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Smartest Way to Plan Your Home Extension
            </h2>
            <p className="text-lg text-slate-600">
              We simplify the entire process, providing you with the tools and
              resources you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "check_circle",
                title: "Feasibility Check",
                desc: "Instantly see what's possible for your property with our zoning and regulation analysis.",
              },
              {
                icon: "calculate",
                title: "Budget Planning",
                desc: "Create an accurate budget with our cost estimation tools and track your expenses.",
              },
              {
                icon: "groups",
                title: "Contractor Matching",
                desc: "Connect with vetted and reliable local builders who specialize in your project type.",
              },
              {
                icon: "description",
                title: "Permit Guidance",
                desc: "Navigate the complex permitting process with our step-by-step guidance and support.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-100 bg-bg-light hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary mb-4">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "32px" }}
                  >
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Trusted by Homeowners Like You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah L.",
                quote:
                  "HomeFlow took all the guesswork out of building our granny flat. The cost estimator was incredibly accurate!",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZLc32F4Ed4O7YzBCOU7UQHVW7IDc0mT3lOvE8b65Gfzpgm1qhVLatpi9SsoRr8fzv1EtVt8r1W1kg1Z3yuajGOeedSg3kmuy7adL2y-lyh5Vn-LMaZ7HBdJfPKEfEKozIwBNaNuHoH6C-ldi87xsPgJiFgYbUObkqz8aKMNRl2jF9JcNrOCynUaEEdf-Td4_8aCk3u_zp_s-ZGD4sFkgbgSJpFTkxmvCCGrKKMn2sS3oe516JXZ3RMbT6EjSBQbrT9Bf6TpnzUQg",
              },
              {
                name: "Mike and Jen R.",
                quote:
                  "We found the perfect builder through this app. The entire process was seamless from start to finish.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9aPD2Fgwg64WVy6Vr4a5zdv1PFLDAjR5D83yVRLY4p4xM7m09tKX15EByUgJhbIa0xtPNdMRweXyhSDDsERKhsE92ovfZk2DYPfMYRBgoRhut7w0FhUwuJYShNuQmafchrV40z3V8ddCoI7vFROzlrL5ofegpHrSN5OMZqwjNykxNIssIaIYX22NT_VSK0dP5ruFqQtIcGUd5WRNlZK2jJh8Cwe-hw1tIVaOZot37vXZCoE4aDUUnM6Zwx-4fDe107fWCHolKr_Q",
              },
              {
                name: "David C.",
                quote:
                  "Navigating the permits was my biggest fear, but the guidance provided made it surprisingly straightforward.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTLCBubiv0XF6hTgBsq_7AnKPDnQTKhibB-Mq_SGsCmKL9-uJsAwYUR6JCfZO2ZXBU-At77n5G_0BE6rKgenDdrb707DeFAHygJVGRQ8Mg_8P84CKKThVOXqeT_tg99HPgXzGit3CJ9Ck9Gfv9yyeY_8qgYbnGa2n4F7lViN8iJUpSlNOtLlKglCM4LpitL1lRx8BYeCjXS_FehlERaqiiKVkqo0XN_lLAJRKfhPUj1vPF6keTXXC6s1F5AjE0mHyNQvB1Xm3ShVM",
              },
            ].map((t, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className="w-24 h-24 rounded-full bg-cover bg-center mb-6 shadow-md"
                  style={{ backgroundImage: `url(${t.img})` }}
                ></div>
                <p className="text-slate-600 mb-4 italic">"{t.quote}"</p>
                <p className="font-bold text-slate-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
              </svg>
            </div>
            <span className="font-bold text-slate-900">HomeFlow</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2024 HomeFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
