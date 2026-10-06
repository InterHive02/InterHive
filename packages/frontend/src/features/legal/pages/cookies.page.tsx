import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { PublicNavbar } from '../../landing/components/public-navbar';
import { PublicFooter } from '../../landing/components/public-footer';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <PublicNavbar
        onOpenInternshipModal={() => {}}
        onOpenCompanyModal={() => {}}
      />

      {/* Hero Header */}
      <section className="relative pt-16 pb-12 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
            <Cookie className="w-3.5 h-3.5" />
            <span>Transparency & Browser Storage</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cookie & Storage Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2">
            Last Updated: October 2, 2026 · Effective Date: October 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 leading-relaxed text-sm">
        
        {/* Transparent Core Statement */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-black text-emerald-900 block">Zero Tracking / Advertising Cookies</span>
            <p className="text-emerald-800/90 font-medium">
              InterHive does <strong>NOT</strong> use third-party advertising cookies, marketing tracking pixels, cross-site trackers, or data-broker scripts. We value your privacy and only use strictly necessary browser storage to maintain secure user sessions.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">1</span>
            <span>How InterHive Uses Browser Storage</span>
          </h2>
          <p>
            Unlike conventional websites that plant advertising tracking cookies, InterHive utilizes standard browser <code>localStorage</code> exclusively for essential technical and functional operations:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Storage Key</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-mono font-semibold text-blue-600">accessToken</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Strictly Necessary</span></td>
                  <td className="p-3 text-slate-600">Authenticates secure API calls to the server for logged-in sessions.</td>
                  <td className="p-3 text-slate-500">Session / Logout</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-blue-600">refreshToken</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Strictly Necessary</span></td>
                  <td className="p-3 text-slate-600">Enables secure token rotation so sessions stay active safely.</td>
                  <td className="p-3 text-slate-500">7 Days / Logout</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-blue-600">user</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">Functional</span></td>
                  <td className="p-3 text-slate-600">Caches minimal user profile info (name, role) for instant interface rendering.</td>
                  <td className="p-3 text-slate-500">Session / Logout</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-blue-600">theme-mode</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">Preference</span></td>
                  <td className="p-3 text-slate-600">Remembers your dark or light display preference across page visits.</td>
                  <td className="p-3 text-slate-500">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">2</span>
            <span>Why You Won't See an Intrusive Cookie Banner</span>
          </h2>
          <p>
            Under international privacy regulations (ePrivacy Directive, GDPR) and Indian data protection principles:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <p>
              <strong>Strictly necessary storage</strong> (such as authentication tokens required to deliver a requested service) and <strong>user-requested preference cookies</strong> (like dark mode) do NOT require opt-in consent banners because they are fundamental to service operation and do not track users across the web.
            </p>
            <p>
              Because we respect your focus and do not use advertising or surveillance trackers, we do not interrupt your browsing with intrusive pop-up banners.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
            <span>How to Clear or Inspect Your Storage</span>
          </h2>
          <p>
            You have full control over your browser data. You can clear local storage and cache anytime:
          </p>
          <ul className="text-xs space-y-2 list-disc pl-5">
            <li><strong>Logging Out:</strong> Clicking "Logout" in your InterHive profile immediately deletes all authentication tokens and cached user data from your browser.</li>
            <li><strong>Browser Settings:</strong> In Chrome, Edge, Firefox, or Safari, go to <em>Settings → Privacy & Security → Clear Browsing Data</em> and select "Cookies and site data".</li>
            <li><strong>Developer Tools:</strong> Press <code>F12</code>, navigate to the <em>Application → Storage → Local Storage</em> tab, and right-click to clear.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">4</span>
            <span>Contact Regarding Storage Practices</span>
          </h2>
          <p>
            If you have questions regarding our technical storage or data safeguards, contact our security and privacy team at <a href="mailto:interhive.info@gmail.com" className="text-blue-600 font-bold">interhive.info@gmail.com</a> or by phone at <a href="tel:+918278314925" className="text-blue-600 font-bold">+91 82783 14925</a>.
          </p>
        </section>

      </main>

      <PublicFooter
        onOpenInternshipModal={() => {}}
        onOpenCompanyModal={() => {}}
      />
    </div>
  );
};
