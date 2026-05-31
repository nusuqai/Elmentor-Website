export interface TranslationDict {
  nav: {
    mentors: string;
    howItWorks: string;
    getMatched: string;
    logoText: string;
  };
  hero: {
    headlinePre: string;
    headlineHighlight: string;
    headlinePost: string;
    subtitle: string;
    findMentorBtn: string;
    browseMentorsBtn: string;
    trustBadges: string[];
    stats: Array<{ value: string; label: string }>;
    searchCardTitle: string;
    searchCardSubtitle: string;
    goalLabel: string;
    levelLabel: string;
    formatLabel: string;
    popularLabel: string;
    findMatchesBtn: string;
    viewAllMentors: string;
    testimonialsHeader: string;
  };
  howItWorks: {
    tag: string;
    titlePre: string;
    titleHighlight: string;
    getStartedBtn: string;
    steps: Array<{ title: string; description: string }>;
  };
  valueProps: {
    tag: string;
    titlePre: string;
    titleHighlight: string;
    items: Array<{ title: string; description: string }>;
  };
  stats: {
    expertMentors: string;
    careerDomains: string;
    matchSatisfaction: string;
    sessionsCompleted: string;
  };
  cta: {
    titlePre: string;
    titleHighlight: string;
    subtitle: string;
    findMentorBtn: string;
    browseMentorsLink: string;
  };
  footer: {
    brandDescription: string;
    platform: string;
    domains: string;
    company: string;
    about: string;
    privacy: string;
    terms: string;
    copyright: string;
    regionalNote: string;
  };
  mentorsPage: {
    title: string;
    subtitle: string;
    clearFilters: string;
    foundCount: string;
    foundCountPlural: string;
    noMentors: string;
    clearAllFilters: string;
    viewProfile: string;
    getMatched: string;
    available: string;
    full: string;
    anyExperience: string;
    anyLanguage: string;
    anyStatus: string;
    experienceFilters: Array<{ label: string; value: string }>;
    languageFilters: Array<{ label: string; value: string }>;
    availabilityFilters: Array<{ label: string; value: string }>;
  };
  detailModal: {
    overview: string;
    expertise: string;
    schedule: string;
    yearsExp: string;
    sessions: string;
    languages: string;
    coreAreas: string;
    communicationStyle: string;
    personality: string;
    frequency: string;
    channels: string;
    availableWindows: string;
    getMatchedWith: string;
    close: string;
    atCapacity: string;
    isExperienced: string;
    professionalWith: string;
    yearsInIndustry: string;
  };
  chatPage: {
    title: string;
    statusText: string;
    backToHome: string;
    currentSession: string;
    quickStartTitle: string;
    browseManually: string;
    startYourMatch: string;
    welcomeText: string;
    textareaPlaceholder: string;
    sessionConnecting: string;
    submitAnswers: string;
    eligibilityDetails: string;
    band: string;
    nextAction: string;
    followUpQuestions: string;
    viewProfileBtn: string;
    getMatchedBtn: string;
    loadingText: string;
    failedToConnect: string;
    quickStarts: string[];
  };
}

export const translations: Record<'en' | 'ar', TranslationDict> = {
  en: {
    nav: {
      mentors: 'Mentors',
      howItWorks: 'How It Works',
      getMatched: 'Get Matched',
      logoText: 'Elmentor',
    },
    hero: {
      headlinePre: 'Clarity today.',
      headlineHighlight: 'Confidence',
      headlinePost: 'tomorrow.',
      subtitle: 'Connect with vetted professionals who understand your goals and help you take the right steps forward.',
      findMentorBtn: 'Find My Mentor',
      browseMentorsBtn: 'Browse Mentors',
      trustBadges: ['Personalized matches', 'Vetted experts', 'Private & secure', 'Flexible scheduling'],
      stats: [
        { value: '10+', label: 'Expert mentors' },
        { value: '500+', label: 'Mentorship sessions' },
        { value: '4.9/5', label: 'Average rating' },
        { value: '95%', label: 'Would recommend' },
      ],
      searchCardTitle: 'Find your right mentor',
      searchCardSubtitle: 'Tell us about your goals and we will match you with the right expert.',
      goalLabel: 'What do you want help with?',
      levelLabel: 'Your experience level',
      formatLabel: 'Preferred format',
      popularLabel: 'Popular:',
      findMatchesBtn: 'Find Matches',
      viewAllMentors: 'View all mentors',
      testimonialsHeader: 'What our mentees say',
    },
    howItWorks: {
      tag: 'How It Works',
      titlePre: 'Three steps to the',
      titleHighlight: 'right mentor',
      getStartedBtn: 'Get Started Now',
      steps: [
        {
          title: 'Share Your Goals',
          description: 'Tell us about your career stage, where you want to go, and what kind of support you need.',
        },
        {
          title: 'We Find Your Match',
          description: 'Our intelligent matching considers your goals, schedule, communication style, and personality for the perfect fit.',
        },
        {
          title: 'Start Growing',
          description: 'Begin with a trial session. Once you and your mentor click, your journey of growth takes off.',
        },
      ],
    },
    valueProps: {
      tag: 'Why Elmentor',
      titlePre: 'Mentorship that actually',
      titleHighlight: 'moves the needle',
      items: [
        {
          title: 'Precision Matching',
          description: 'We go beyond keywords. Our matching considers your goals, personality, communication style, and schedule to find a mentor who truly fits.',
        },
        {
          title: 'Vetted Experts',
          description: 'Every mentor is a working professional with real experience. No hobbyists, no resellers - just people who have been where you want to go.',
        },
        {
          title: 'Flexible Communication',
          description: 'Video calls, async chat, voice notes - your mentorship adapts to your life, not the other way around.',
        },
        {
          title: 'Real Career Growth',
          description: "Our mentees don't just learn - they land roles, earn promotions, and build the confidence to lead.",
        },
      ],
    },
    stats: {
      expertMentors: 'Expert Mentors',
      careerDomains: 'Career Domains',
      matchSatisfaction: 'Match Satisfaction',
      sessionsCompleted: 'Sessions Completed',
    },
    cta: {
      titlePre: 'Ready to accelerate',
      titleHighlight: 'your career?',
      subtitle: 'Tell us your goals and let our AI find the perfect mentor match for you. Your first session is completely free.',
      findMentorBtn: 'Find My Mentor',
      browseMentorsLink: 'Or browse mentors',
    },
    footer: {
      brandDescription: 'Personalized mentorship that connects you with the right professionals for your career journey.',
      platform: 'Platform',
      domains: 'Domains',
      company: 'Company',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2026 Elmentor. All rights reserved.',
      regionalNote: 'Made with care for the MENA region.',
    },
    mentorsPage: {
      title: 'Browse Mentors',
      subtitle: 'Explore our community of experienced professionals across multiple domains. Find someone who aligns with your career goals.',
      clearFilters: 'Clear filters',
      foundCount: 'mentor found',
      foundCountPlural: 'mentors found',
      noMentors: 'No mentors match your current filters.',
      clearAllFilters: 'Clear all filters',
      viewProfile: 'View Profile',
      getMatched: 'Get Matched',
      available: 'Available',
      full: 'Full',
      anyExperience: 'Any experience',
      anyLanguage: 'Any language',
      anyStatus: 'All statuses',
      experienceFilters: [
        { label: 'Any experience', value: 'any' },
        { label: '1-4 years', value: 'junior' },
        { label: '5-8 years', value: 'mid' },
        { label: '9+ years', value: 'senior' },
      ],
      languageFilters: [
        { label: 'Any language', value: 'any' },
        { label: 'English', value: 'English' },
        { label: 'Arabic', value: 'Arabic' },
      ],
      availabilityFilters: [
        { label: 'All statuses', value: 'any' },
        { label: 'Available', value: 'available' },
        { label: 'Full', value: 'full' },
      ],
    },
    detailModal: {
      overview: 'Overview',
      expertise: 'Expertise',
      schedule: 'Schedule',
      yearsExp: 'Years Exp.',
      sessions: 'Sessions',
      languages: 'Languages',
      coreAreas: 'Core Areas',
      communicationStyle: 'Communication Style',
      personality: 'Personality',
      frequency: 'Frequency',
      channels: 'Channels',
      availableWindows: 'Available Windows',
      getMatchedWith: 'Get Matched With',
      close: 'Close',
      atCapacity: 'At Capacity',
      isExperienced: 'is an experienced',
      professionalWith: 'professional with',
      yearsInIndustry: 'years in the industry. Currently helping mentees',
    },
    chatPage: {
      title: 'AI Matching Agent',
      statusText: 'Tell me your goals and I will find your match',
      backToHome: 'Back to home',
      currentSession: 'Current Session',
      quickStartTitle: 'Quick Start',
      browseManually: 'Browse mentors manually',
      startYourMatch: 'Start Your Match',
      welcomeText: 'Tell me about your current role, career goals, and what you are looking for in a mentor. I will find and score your best matches.',
      textareaPlaceholder: 'Describe your career goals or ask about a mentor...',
      sessionConnecting: 'Connecting...',
      submitAnswers: 'Submit Answers',
      eligibilityDetails: 'Eligibility Details',
      band: 'Band:',
      nextAction: 'Next Action',
      followUpQuestions: 'Follow-up Questions:',
      viewProfileBtn: 'View Profile',
      getMatchedBtn: 'Get Matched',
      loadingText: 'Thinking...',
      failedToConnect: 'Unable to reach the matching service right now. Please try again in a moment.',
      quickStarts: [
        'I want to transition from analyst to product manager.',
        'Find me a mentor in backend engineering who is currently available.',
        "I'm a junior designer wanting to build my portfolio - who can help?",
        "I'm in fintech and want to grow into a senior strategy role.",
      ],
    },
  },
  ar: {
    nav: {
      mentors: 'الموجهون',
      howItWorks: 'كيف يعمل',
      getMatched: 'جد موجهك',
      logoText: 'إلمنتور',
    },
    hero: {
      headlinePre: 'وضوح اليوم.',
      headlineHighlight: 'ثقة',
      headlinePost: 'الغد.',
      subtitle: 'تواصل مع خبراء معتمدين يفهمون أهدافك ويساعدونك على اتخاذ الخطوات الصحيحة إلى الأمام.',
      findMentorBtn: 'جد موجهي المناسب',
      browseMentorsBtn: 'تصفح الموجهين',
      trustBadges: ['توجيه مخصص لك', 'خبراء معتمدون', 'خاص وآمن', 'جدولة مرنة'],
      stats: [
        { value: '+١٠', label: 'موجهون خبراء' },
        { value: '+٥٠٠', label: 'جلسة توجيهية' },
        { value: '٤.٩/٥', label: 'متوسط التقييم' },
        { value: '٩٥٪', label: 'ينصحون بنا' },
      ],
      searchCardTitle: 'اعثر على موجهك المناسب',
      searchCardSubtitle: 'أخبرنا عن أهدافك وسنقوم بمطابقتك مع الخبير المناسب.',
      goalLabel: 'ما الذي تريد المساعدة فيه؟',
      levelLabel: 'مستوى خبرتك الحالي',
      formatLabel: 'الوسيلة المفضلة',
      popularLabel: 'شائع:',
      findMatchesBtn: 'ابحث عن موجهين',
      viewAllMentors: 'عرض جميع الموجهين',
      testimonialsHeader: 'ماذا يقول المشتركون',
    },
    howItWorks: {
      tag: 'كيف يعمل',
      titlePre: 'ثلاث خطوات للوصول لـ',
      titleHighlight: 'الموجه المناسب',
      getStartedBtn: 'ابدأ رحلتك الآن',
      steps: [
        {
          title: 'شاركنا أهدافك',
          description: 'أخبرنا عن مرحلتك المهنية، وما تسعى للوصول إليه، ونوع الدعم والمهارات التي تحتاجها.',
        },
        {
          title: 'نقوم بمطابقتك',
          description: 'نظام المطابقة الذكي لدينا يأخذ بالاعتبار أهدافك، وجدولك، وأسلوب التواصل المناسب لك وشخصيتك لضمان التوافق المثالي.',
        },
        {
          title: 'ابدأ في التطور',
          description: 'ابدأ بجلسة تجريبية سريعة. بمجرد أن تتفق مع موجهك، تنطلق رحلتك نحو التطور والريادة.',
        },
      ],
    },
    valueProps: {
      tag: 'لماذا إلمنتور',
      titlePre: 'توجيه مهني يُحدث',
      titleHighlight: 'فرقاً حقيقياً',
      items: [
        {
          title: 'مطابقة فائقة الدقة',
          description: 'نتجاوز مجرد الكلمات المفتاحية. تراعي خوارزمياتنا أهدافك المهنية، وشخصيتك، وأسلوب تواصلك المفضل لضمان الموجه المثالي لك.',
        },
        {
          title: 'خبراء حقيقيون ممارسون',
          description: 'كل موجه لدينا هو خبير يعمل في كبرى الشركات ولديه خبرة مهنية حقيقية - وليسوا مجرد هواة أو باعة دورات.',
        },
        {
          title: 'مرونة تامة في التواصل',
          description: 'جلسات فيديو، محادثات نصية غير متزامنة، أو ملاحظات صوتية - نوائم التوجيه ليتناسب مع حياتك اليومية.',
        },
        {
          title: 'تطور مهني ملموس',
          description: 'من يتدربون لدينا لا يتعلمون فقط، بل يترقون في وظائفهم، ويحصلون على فرص أفضل، ويبنون الثقة لقيادة المستقبل.',
        },
      ],
    },
    stats: {
      expertMentors: 'موجهون خبراء',
      careerDomains: 'مجالات مهنية',
      matchSatisfaction: 'رضا الأعضاء',
      sessionsCompleted: 'جلسة مكتملة',
    },
    cta: {
      titlePre: 'جاهز لتسريع',
      titleHighlight: 'مسيرتك المهنية؟',
      subtitle: 'أخبرنا بأهدافك ودع الذكاء الاصطناعي يطابقك مع الموجه المثالي لك. الجلسة الأولى مجانية تماماً.',
      findMentorBtn: 'جد موجهي المناسب',
      browseMentorsLink: 'أو تصفح الموجهين يدوياً',
    },
    footer: {
      brandDescription: 'برنامج توجيه مخصص يربطك بالمهنيين والخبراء المناسبين لدعم رحلتك ومستقبلك المهني.',
      platform: 'المنصة',
      domains: 'المجالات',
      company: 'الشركة',
      about: 'عن المنصة',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      copyright: '© ٢٠٢٦ إلمنتور. جميع الحقوق محفوظة.',
      regionalNote: 'صنع بكل حب للمنطقة العربية والشرق الأوسط.',
    },
    mentorsPage: {
      title: 'تصفح الموجهين',
      subtitle: 'استكشف مجتمع الموجهين والمهنيين ذوي الخبرة عبر مجالات متعددة. ابحث عن الشخص الذي يتوافق مع طموحاتك.',
      clearFilters: 'إلغاء التصفية',
      foundCount: 'موجه تم العثور عليه',
      foundCountPlural: 'موجهين تم العثور عليهم',
      noMentors: 'لا يوجد موجهون يطابقون خيارات التصفية الحالية.',
      clearAllFilters: 'إلغاء جميع الفلاتر',
      viewProfile: 'عرض الملف الشخصي',
      getMatched: 'ابدأ المطابقة',
      available: 'متاح',
      full: 'ممتلئ',
      anyExperience: 'أي خبرة',
      anyLanguage: 'أي لغة',
      anyStatus: 'كل الحالات',
      experienceFilters: [
        { label: 'أي خبرة', value: 'any' },
        { label: '١-٤ سنوات', value: 'junior' },
        { label: '٥-٨ سنوات', value: 'mid' },
        { label: '٩+ سنوات', value: 'senior' },
      ],
      languageFilters: [
        { label: 'أي لغة', value: 'any' },
        { label: 'الإنجليزية', value: 'English' },
        { label: 'العربية', value: 'Arabic' },
      ],
      availabilityFilters: [
        { label: 'كل الحالات', value: 'any' },
        { label: 'متاح', value: 'available' },
        { label: 'ممتلئ', value: 'full' },
      ],
    },
    detailModal: {
      overview: 'نظرة عامة',
      expertise: 'الخبرات',
      schedule: 'الجدول والاتصال',
      yearsExp: 'سنوات الخبرة',
      sessions: 'الجلسات',
      languages: 'اللغات',
      coreAreas: 'المجالات الأساسية',
      communicationStyle: 'أسلوب التواصل',
      personality: 'الشخصية',
      frequency: 'التكرار والوتيرة',
      channels: 'قنوات الاتصال',
      availableWindows: 'الأوقات المتاحة',
      getMatchedWith: 'تواصل ومطابقة مع',
      close: 'إغلاق',
      atCapacity: 'كامل السعة',
      isExperienced: 'هو خبير متمرس في مجال',
      professionalWith: 'ولديه خبرة تزيد عن',
      yearsInIndustry: 'سنوات في هذا القطاع. يساعد حالياً المتدربين على الانتقال',
    },
    chatPage: {
      title: 'مساعد المطابقة الذكي',
      statusText: 'أخبرني بأهدافك وسأقوم بالبحث والمطابقة لك',
      backToHome: 'العودة للرئيسية',
      currentSession: 'الجلسة الحالية',
      quickStartTitle: 'البدء السريع',
      browseManually: 'تصفح الموجهين يدوياً',
      startYourMatch: 'ابدأ مطابقتك الآن',
      welcomeText: 'أخبرني عن دورك الوظيفي الحالي، وأهدافك المهنية، وما تبحث عنه في الموجه المناسب. وسأقوم بالبحث والتقييم واقتراح أفضل الموجهين لك.',
      textareaPlaceholder: 'اكتب أهدافك المهنية أو استفسر عن موجه محدد...',
      sessionConnecting: 'جاري الاتصال بالنظام...',
      submitAnswers: 'إرسال الإجابات',
      eligibilityDetails: 'تفاصيل مطابقة الشروط والقبول',
      band: 'فئة التوافق:',
      nextAction: 'الخطوة التالية الموصى بها',
      followUpQuestions: 'الأسئلة المقترحة للمتابعة:',
      viewProfileBtn: 'الملف الشخصي',
      getMatchedBtn: 'طلب المطابقة',
      loadingText: 'جاري التفكير والمطابقة...',
      failedToConnect: 'تعذر الاتصال بخدمة المطابقة حالياً. يرجى المحاولة بعد قليل.',
      quickStarts: [
        'أريد الانتقال من محلل بيانات إلى مدير منتج.',
        'ابحث لي عن موجه في هندسة البرمجيات الخلفية متاح حالياً.',
        'أنا مصمم مبتدئ أريد بناء بورتفوليو متميز - من يمكنه مساعدتي؟',
        'أعمل في مجال التكنولوجيا المالية وأطمح للنمو إلى دور استراتيجي قيادي.',
      ],
    },
  },
};
