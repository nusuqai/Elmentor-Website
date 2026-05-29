export default [
  {
    id: "rule_01",
    title: "ضرورة وجود هدف محدد وقابل للقياس",
    kind: "eligibility",
    weight: 0,
    summary:
      "يجب أن يحدد المتعلم هدفاً محدداً وقابلاً للقياس قبل بدء المطابقة.",
    severity: "blocker",
  },
  {
    id: "rule_02",
    title: "خبرة مباشرة أو قريبة جداً",
    kind: "eligibility",
    weight: 30,
    summary:
      "يجب أن يمتلك المرشد خبرة مباشرة أو قريبة جداً من مجال هدف المتعلم.",
    severity: "blocker",
  },
  {
    id: "rule_03",
    title: "مرحلة مهنية مشابهة",
    kind: "eligibility",
    weight: 0,
    summary:
      "يجب أن يكون المرشد قد مر شخصياً بمرحلة مشابهة لمرحلة المتعلم الحالية.",
    severity: "blocker",
  },
  {
    id: "rule_04",
    title: "تغطية 60 بالمئة من المجال",
    kind: "eligibility",
    weight: 25,
    summary: "يجب أن يقع هدف المتعلم ضمن 60 بالمئة على الأقل من خبرة المرشد.",
    severity: "blocker",
  },
  {
    id: "rule_05",
    title: "فجوة خبرة بين 3 و10 سنوات",
    kind: "eligibility",
    weight: 0,
    summary: "يجب أن تكون فجوة الخبرة بين 3 و10 سنوات.",
    severity: "blocker",
  },
  {
    id: "rule_06",
    title: "حد أقصى لعدد المتعلمين",
    kind: "eligibility",
    weight: 0,
    summary: "لا يجوز أن يكون لدى المرشد أكثر من 3 متعلمين في الوقت نفسه.",
    severity: "blocker",
  },
  {
    id: "rule_07",
    title: "توافق التوفر",
    kind: "eligibility",
    weight: 20,
    summary:
      "يجب وجود نافذة زمنية مشتركة واحدة على الأقل أسبوعياً مع الاتفاق على التكرار والقناة.",
    severity: "blocker",
  },
  {
    id: "rule_08",
    title: "نموذج التقييم الموزون",
    kind: "scoring",
    weight: 100,
    summary: "يتم احتساب المطابقة عبر خمسة معايير موزونة.",
    severity: "info",
  },
  {
    id: "rule_09",
    title: "نطاقات الدرجات",
    kind: "decision",
    weight: 0,
    summary:
      "85-100 ممتاز، 70-84 موصى به، 55-69 يحتاج جلسة مواءمة، وأقل من 55 مرفوض.",
    severity: "info",
  },
  {
    id: "rule_10",
    title: "جلسة تجريبية إلزامية",
    kind: "onboarding",
    weight: 0,
    summary: "كل مطابقة معتمدة تبدأ بجلسة تجريبية واحدة مع تأكيد الطرفين.",
    severity: "info",
  },
  {
    id: "rule_11",
    title: "الرفض بعد الجلسة يعيد المطابقة",
    kind: "onboarding",
    weight: 0,
    summary:
      "إذا رفض أحد الطرفين بعد الجلسة التجريبية تتم إعادة المطابقة تلقائياً.",
    severity: "info",
  },
  {
    id: "rule_12",
    title: "مراجعة الصحة كل 4 إلى 6 أسابيع",
    kind: "governance",
    weight: 0,
    summary:
      "تتم مراجعة صحة المطابقة كل 4 إلى 6 أسابيع وفق الاستمرارية والتقدم والرضا.",
    severity: "info",
  },
  {
    id: "rule_13",
    title: "تغيير الهدف يعيد المطابقة",
    kind: "governance",
    weight: 0,
    summary: "أي تغيير جوهري في هدف المتعلم يعيد المطابقة فوراً.",
    severity: "warning",
  },
  {
    id: "rule_14",
    title: "شروط إنهاء المطابقة",
    kind: "governance",
    weight: 0,
    summary:
      "تُنهى المطابقة عند الغياب مرتين متتاليتين دون إشعار أو بطلب الإنهاء من أي طرف.",
    severity: "warning",
  },
];
