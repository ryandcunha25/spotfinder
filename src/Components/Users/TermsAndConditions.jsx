import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">SpotFinder - Terms and Conditions</h1>
          <p className="mt-2 text-blue-100">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                These Terms and Conditions govern your use of our venue booking system and services. By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part, you may not access the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">2. Booking Process</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All bookings are subject to venue availability</li>
                <li>You must provide accurate information during the booking process</li>
                <li>We reserve the right to refuse any booking at our discretion</li>
                <li>Bookings are not confirmed until payment is received and confirmation is issued</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">3. Payments & Cancellations</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">3.1 Payment Terms</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Full payment has to be done before the event date</li>
                    <li>We accept major credit cards and other payment methods as indicated</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">3.2 Cancellation Policy</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Cancellations made more than 30 days before the event: Full refund</li>
                    <li>Cancellations 30 days before the event: No refund</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">4. Venue Usage</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The venue must be left in the same condition as found</li>
                <li>Any damages will be charged to the booking party</li>
                <li>Smoking is prohibited unless in designated areas</li>
                <li>Compliance with all venue rules and local laws is mandatory</li>
                <li>Maximum capacity limits must not be exceeded</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">5. Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our company is not liable for any loss, damage, injury, or expenses incurred by you or your guests during your use of the venue, except where such liability cannot be excluded by law.
                </p>
                <p>
                  You are responsible for ensuring the venue is suitable for your intended use and that you have obtained all necessary permits or licenses required for your event.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">6. Changes to Bookings</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Requests to change booking dates or details must be made in writing. We will accommodate changes where possible, subject to availability and potential additional charges.
                </p>
                <p>
                  Significant changes may be treated as a cancellation and rebooking, subject to the cancellation policy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">7. Force Majeure</h2>
              <p className="text-gray-700">
                We are not liable for failure to perform our obligations due to events beyond our reasonable control, including but not limited to natural disasters, acts of government, pandemics, or venue closures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">8. Governing Law</h2>
              <p className="text-gray-700">
                These terms shall be governed by and construed in accordance with the laws of Maharastra. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of Mumbai.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Your continued use of our services after any changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Contact Information</h3>
            <p className="text-blue-700">
              For any questions regarding these Terms and Conditions, please contact us at:
              <br />
              Email: spotfinder.2025@gmail.com
              <br />
              Phone: +91 982-123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;