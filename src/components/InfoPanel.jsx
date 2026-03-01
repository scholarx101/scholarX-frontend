//import { X } from "lucide-react";
import { useEffect } from "react";

const contentMap = {
  about: {
  title: "এবাউট আস",
  body: `সিরাতুল মুস্তাকিম একটি আধুনিক অনলাইন ইসলামিক একাডেমি, যার লক্ষ্য ঘরে বসেই বিশুদ্ধ ও মানসম্মত দ্বীনি শিক্ষা সবার জন্য সহজলভ্য করা।

আমরা কুরআন তিলাওয়াত, তাজবীদ, আরবি ভাষা ও প্রাথমিক ইসলামিক জ্ঞান বিষয়ক কোর্স প্রদান করি দক্ষ ও অভিজ্ঞ শিক্ষক-শিক্ষিকাদের মাধ্যমে। আমাদের সকল ক্লাস শরীয়াহসম্মত পরিবেশে পরিচালিত হয় এবং পুরুষ ও মহিলাদের জন্য আলাদা ব্যাচের ব্যবস্থা রয়েছে।

লাইভ ও রেকর্ডেড ক্লাস, ডিভাইস-ইনডিপেন্ডেন্ট অ্যাক্সেস এবং সহায়ক সাপোর্ট সিস্টেমের মাধ্যমে আমরা শিক্ষার্থীদের একটি স্বচ্ছ, নিরাপদ ও কার্যকর শিক্ষার অভিজ্ঞতা দিতে প্রতিশ্রুতিবদ্ধ।

আমাদের বিশ্বাস — বিশুদ্ধ দ্বীনি জ্ঞান সমাজে নৈতিকতা, সচেতনতা ও আত্মশুদ্ধির পথ সুগম করে।`,
},

refund: {
  title: "রিফান্ড পলিসি",
  body: `সিরাতুল মুস্তাকিম একাডেমির প্রতিটি কোর্সের একটি ডেমো ক্লাস সবার জন্য সম্পূর্ণ ফ্রি প্রদান করা হয়, যাতে শিক্ষার্থীরা কোর্স ও শিক্ষকের মান সম্পর্কে ধারণা নিতে পারেন।

কোর্সে ভর্তি হওয়ার পর, কোর্স শুরুর প্রথম ৭ দিনের মধ্যে নির্দিষ্ট ও যুক্তিসংগত কারণ দেখিয়ে রিফান্ডের জন্য আবেদন করা যাবে। 
আবেদন করতে আপনার কোর্স কেনার মেইল এবং ড্যাশবোর্ডে কোর্সের স্ক্রিনশট সঙ্গযুক্ত করে নিম্নোক্ত কারণ সমূহের বিবরণ প্রদান করে আমাদের মেইল করুন contact@siratulmustakim.com এড্রেসে।

গ্রহণযোগ্য রিফান্ড কারণসমূহের উদাহরণঃ  
- কোর্সের প্রতিশ্রুত কনটেন্ট বা ম্যাটেরিয়াল সরবরাহ না করা হলে  
- শিক্ষক বা সাপোর্ট টিম থেকে নির্দিষ্ট সময়ের মধ্যে কোনো সাড়া না পাওয়া গেলে  
- কোর্সের গুণগত মান বিজ্ঞাপিত বিবরণের সাথে অসামঞ্জস্যপূর্ণ হলে  

নিম্নোক্ত ক্ষেত্রে রিফান্ড প্রযোজ্য হবে নাঃ  
- কোর্সের উল্লেখযোগ্য অংশ সম্পন্ন করার পর  
- ডেমো ক্লাস দেখার পরও কোনো বৈধ কারণ ছাড়া আবেদন করলে  
- ব্যক্তিগত অনাগ্রহ বা সময়জনিত সমস্যার জন্য  

রিফান্ড সংক্রান্ত সকল সিদ্ধান্ত কর্তৃপক্ষের যাচাই-বাছাই শেষে চূড়ান্ত বলে গণ্য হবে।`,
},

  terms: {
    title: "টার্মস এন্ড কন্ডিশনস",
    html: `<style>
  [data-custom-class='body'], [data-custom-class='body'] * {
    background: transparent !important;
  }
  [data-custom-class='title'], [data-custom-class='title'] * {
    font-family: Arial !important;
    font-size: 20px !important;
    color: #000000 !important;
    margin-bottom: 15px !important;
  }
  [data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
    font-family: Arial !important;
    color: #595959 !important;
    font-size: 14px !important;
  }
  [data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
    font-family: Arial !important;
    font-size: 17px !important;
    color: #000000 !important;
    margin-top: 20px !important;
    margin-bottom: 10px !important;
  }
  [data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
    font-family: Arial !important;
    font-size: 15px !important;
    color: #000000 !important;
  }
  [data-custom-class='body_text'], [data-custom-class='body_text'] * {
    color: #595959 !important;
    font-size: 13px !important;
    font-family: Arial !important;
  }
  [data-custom-class='link'], [data-custom-class='link'] * {
    color: #3030F1 !important;
    font-size: 13px !important;
    font-family: Arial !important;
    word-break: break-word !important;
  }
  ul {
    list-style-type: square;
    margin-left: 20px !important;
  }
  ul > li > ul {
    list-style-type: circle;
  }
  ul > li > ul > li > ul {
    list-style-type: square;
  }
  ol li {
    font-family: Arial;
  }
</style>
<div style="font-family: Arial; color: #595959; font-size: 14px;">
  <h2 style="font-size: 19px; color: #000000; margin-bottom: 15px;">TERMS AND CONDITIONS</h2>
  <p><strong>Last updated:</strong> January 21, 2026</p>
  
  <h3 style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">AGREEMENT TO OUR LEGAL TERMS</h3>
  
  <p>We are <strong>ScholarX</strong> ('Company', 'we', 'us', or 'our').</p>
  
  <p>We operate the website <a href="https://siratulmustakim.com/" style="color: #3030F1; text-decoration: underline;">https://siratulmustakim.com/</a> (the 'Site'), as well as any other related products and services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services').</p>
  
  <p>You can contact us by email at <a href="mailto:scholarx.technology@gmail.com" style="color: #3030F1; text-decoration: underline;">scholarx.technology@gmail.com</a>.</p>
  
  <p><strong>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and ScholarX, concerning your access to and use of the Services.</strong></p>
  
  <p style="color: #d32f2f; font-weight: bold;">IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
  
  <h3 style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">KEY PROVISIONS</h3>
  
  <ul style="margin-left: 20px;">
    <li><strong>User Representations:</strong> All registration information you provide must be true, accurate, current, and complete.</li>
    <li><strong>Prohibited Activities:</strong> You agree not to use the Services for any illegal purposes, to harass others, or to circumvent security features.</li>
    <li><strong>Intellectual Property:</strong> All content, trademarks, and logos in the Services are owned by us or our licensors.</li>
    <li><strong>User Contributions:</strong> Any contributions you make grant us an unrestricted, worldwide license to use such content.</li>
    <li><strong>Termination:</strong> We reserve the right to terminate your access at any time for any reason.</li>
    <li><strong>Payments:</strong> We accept online payment systems of Bangladesh. All payments shall be in BDT.</li>
    <li><strong>Governing Law:</strong> These terms are governed by the laws of Bangladesh.</li>
    <li><strong>Privacy:</strong> Your use of the Services is subject to our Privacy Policy.</li>
    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
    <li><strong>Refund Policy:</strong> Refunds are subject to our stated refund policy and conditions.</li>
  </ul>
  
  <h3 style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">TABLE OF CONTENTS</h3>
  
  <ul style="margin-left: 20px; color: #3030F1;">
    <li><a href="#services" style="color: #3030F1; text-decoration: none;">1. OUR SERVICES</a></li>
    <li><a href="#ip" style="color: #3030F1; text-decoration: none;">2. INTELLECTUAL PROPERTY RIGHTS</a></li>
    <li><a href="#userreps" style="color: #3030F1; text-decoration: none;">3. USER REPRESENTATIONS</a></li>
    <li><a href="#userreg" style="color: #3030F1; text-decoration: none;">4. USER REGISTRATION</a></li>
    <li><a href="#purchases" style="color: #3030F1; text-decoration: none;">5. PURCHASES AND PAYMENT</a></li>
    <li><a href="#prohibited" style="color: #3030F1; text-decoration: none;">6. PROHIBITED ACTIVITIES</a></li>
    <li><a href="#ugc" style="color: #3030F1; text-decoration: none;">7. USER GENERATED CONTRIBUTIONS</a></li>
    <li><a href="#license" style="color: #3030F1; text-decoration: none;">8. CONTRIBUTION LICENSE</a></li>
    <li><a href="#reviews" style="color: #3030F1; text-decoration: none;">9. GUIDELINES FOR REVIEWS</a></li>
    <li><a href="#sitemanage" style="color: #3030F1; text-decoration: none;">10. SERVICES MANAGEMENT</a></li>
    <li><a href="#ppno" style="color: #3030F1; text-decoration: none;">11. PRIVACY POLICY</a></li>
    <li><a href="#terms" style="color: #3030F1; text-decoration: none;">12. TERM AND TERMINATION</a></li>
    <li><a href="#modifications" style="color: #3030F1; text-decoration: none;">13. MODIFICATIONS AND INTERRUPTIONS</a></li>
    <li><a href="#law" style="color: #3030F1; text-decoration: none;">14. GOVERNING LAW</a></li>
    <li><a href="#disputes" style="color: #3030F1; text-decoration: none;">15. DISPUTE RESOLUTION</a></li>
    <li><a href="#corrections" style="color: #3030F1; text-decoration: none;">16. CORRECTIONS</a></li>
    <li><a href="#disclaimer" style="color: #3030F1; text-decoration: none;">17. DISCLAIMER</a></li>
    <li><a href="#liability" style="color: #3030F1; text-decoration: none;">18. LIMITATIONS OF LIABILITY</a></li>
    <li><a href="#indemnification" style="color: #3030F1; text-decoration: none;">19. INDEMNIFICATION</a></li>
    <li><a href="#userdata" style="color: #3030F1; text-decoration: none;">20. USER DATA</a></li>
    <li><a href="#electronic" style="color: #3030F1; text-decoration: none;">21. ELECTRONIC COMMUNICATIONS</a></li>
    <li><a href="#misc" style="color: #3030F1; text-decoration: none;">22. MISCELLANEOUS</a></li>
    <li><a href="#contact" style="color: #3030F1; text-decoration: none;">23. CONTACT US</a></li>
  </ul>
  
  <h3 id="services" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">1. OUR SERVICES</h3>
  <p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.</p>
  
  <h3 id="ip" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">2. INTELLECTUAL PROPERTY RIGHTS</h3>
  <p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>
  <p>Our Content and Marks are protected by copyright and trademark laws and treaties around the world. The Content and Marks are provided in or through the Services 'AS IS' for your personal, non-commercial use only.</p>
  
  <h3 id="userreps" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">3. USER REPRESENTATIONS</h3>
  <p>By using the Services, you represent and warrant that: all registration information you submit will be true, accurate, current, and complete; you will maintain the accuracy of such information; you have the legal capacity and agree to comply with these Legal Terms; you are not a minor in your jurisdiction; you will not access the Services through automated means; you will not use the Services for any illegal purpose; and your use will not violate any applicable law or regulation.</p>
  
  <h3 id="userreg" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">4. USER REGISTRATION</h3>
  <p>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove or reclaim a username if we determine it is inappropriate or objectionable.</p>
  
  <h3 id="purchases" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">5. PURCHASES AND PAYMENT</h3>
  <p>We accept online payment systems of Bangladesh. You agree to provide current, complete, and accurate purchase and account information for all purchases. You further agree to promptly update account and payment information as needed. All payments shall be in BDT. We reserve the right to refuse any order placed through the Services and to correct any errors in pricing.</p>
  
  <h3 id="prohibited" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">6. PROHIBITED ACTIVITIES</h3>
  <p>You may not access or use the Services for any purpose other than that for which we make the Services available. As a user, you agree not to engage in unauthorized access, distribution of viruses, harassment, deception, or any other prohibited activities listed in the full legal terms.</p>
  
  <h3 id="sitemanage" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">10. SERVICES MANAGEMENT</h3>
  <p>We reserve the right to monitor the Services for violations, take appropriate legal action, refuse access, limit availability, disable content, and manage the Services to protect our rights and facilitate proper functioning.</p>
  
  <h3 id="ppno" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">11. PRIVACY POLICY</h3>
  <p>We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy posted on the Services, which is incorporated into these Legal Terms.</p>
  
  <h3 id="terms" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">12. TERM AND TERMINATION</h3>
  <p>These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access to and use of the Services to any person for any reason or for no reason, including without limitation for breach of any representation, warranty, or covenant contained in these Legal Terms.</p>
  
  <h3 id="modifications" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">13. MODIFICATIONS AND INTERRUPTIONS</h3>
  <p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We cannot guarantee the Services will be available at all times.</p>
  
  <h3 id="law" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">14. GOVERNING LAW</h3>
  <p>These Legal Terms shall be governed by and defined following the laws of Bangladesh. ScholarX and yourself irrevocably consent that the courts of Bangladesh shall have exclusive jurisdiction to resolve any dispute.</p>
  
  <h3 id="disputes" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">15. DISPUTE RESOLUTION</h3>
  <p>To expedite resolution and control the cost of any dispute, the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration.</p>
  
  <h3 id="corrections" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">16. CORRECTIONS</h3>
  <p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time.</p>
  
  <h3 id="disclaimer" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">17. DISCLAIMER</h3>
  <p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES.</p>
  
  <h3 id="liability" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">18. LIMITATIONS OF LIABILITY</h3>
  <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES.</p>
  
  <h3 id="indemnification" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">19. INDEMNIFICATION</h3>
  <p>You agree to defend, indemnify, and hold us harmless from any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to your Contributions, use of the Services, breach of these Legal Terms, or violation of any third party's rights.</p>
  
  <h3 id="userdata" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">20. USER DATA</h3>
  <p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. Although we perform regular routine backups, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.</p>
  
  <h3 id="electronic" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">21. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h3>
  <p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS.</p>
  
  <h3 id="misc" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">22. MISCELLANEOUS</h3>
  <p>These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision.</p>
  
  <h3 id="contact" style="font-size: 17px; color: #000000; margin-top: 20px; margin-bottom: 10px;">23. CONTACT US</h3>
  <p>For questions or concerns regarding the Services, please contact us at:<br><br><strong>ScholarX</strong><br>Email: <a href="mailto:scholarx.technology@gmail.com" style="color: #3030F1; text-decoration: underline;">scholarx.technology@gmail.com</a></p>
  
  <p style="margin-top: 30px; font-size: 12px; color: #888;">By using this platform, you acknowledge that you have read and agree to be bound by all provisions of these Terms and Conditions.</p>
</div>`,
  },
};

export default function InfoPanel({ type, onClose }) {
  const content = contentMap[type];

  // prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="
          relative w-full max-w-3xl mx-auto
          bg-white rounded-t-3xl shadow-2xl
          p-6 sm:p-8
          animate-slideUp
        "
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
            {content.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* body */}
        <div className="text-slate-700 text-sm sm:text-base leading-relaxed overflow-y-auto max-h-[60vh]">
          {content.html ? (
            <div dangerouslySetInnerHTML={{ __html: content.html }} />
          ) : (
            <div className="whitespace-pre-line">{content.body}</div>
          )}
        </div>
      </div>
    </div>
  );
}
