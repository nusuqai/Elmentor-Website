export default [
  {
    id: "rule_01",
    title: "Specific measurable goal required",
    kind: "eligibility",
    weight: 0,
    summary:
      "The mentee must define a specific measurable goal before matching begins.",
    severity: "blocker",
  },
  {
    id: "rule_02",
    title: "Direct or closely related experience",
    kind: "eligibility",
    weight: 30,
    summary:
      "Mentor should have direct or closely related experience in the mentee's target field.",
    severity: "blocker",
  },
  {
    id: "rule_03",
    title: "Similar career stage",
    kind: "eligibility",
    weight: 0,
    summary:
      "Mentor must have personally passed through a stage similar to the mentee's current stage.",
    severity: "blocker",
  },
  {
    id: "rule_04",
    title: "60 percent domain coverage",
    kind: "eligibility",
    weight: 25,
    summary:
      "The goal must fall within at least 60 percent of the mentor's expertise.",
    severity: "blocker",
  },
  {
    id: "rule_05",
    title: "Experience gap between 3 and 10 years",
    kind: "eligibility",
    weight: 0,
    summary: "The experience gap should stay between 3 and 10 years.",
    severity: "blocker",
  },
  {
    id: "rule_06",
    title: "Mentor capacity limit",
    kind: "eligibility",
    weight: 0,
    summary: "A mentor must not currently mentor more than 3 mentees.",
    severity: "blocker",
  },
  {
    id: "rule_07",
    title: "Availability overlap",
    kind: "eligibility",
    weight: 20,
    summary:
      "Both parties must overlap on at least one availability window and agree on cadence and channel.",
    severity: "blocker",
  },
  {
    id: "rule_08",
    title: "Weighted scoring rubric",
    kind: "scoring",
    weight: 100,
    summary:
      "Score the match using domain alignment, goal compatibility, availability, communication style, and personality fit.",
    severity: "info",
  },
  {
    id: "rule_09",
    title: "Score bands",
    kind: "decision",
    weight: 0,
    summary:
      "85-100 excellent, 70-84 recommended, 55-69 pre-alignment, below 55 rejected.",
    severity: "info",
  },
  {
    id: "rule_10",
    title: "Trial session required",
    kind: "onboarding",
    weight: 0,
    summary:
      "Every approved match must start with one trial session and both sides must confirm.",
    severity: "info",
  },
  {
    id: "rule_11",
    title: "Decline after trial triggers rematch",
    kind: "onboarding",
    weight: 0,
    summary:
      "If either party declines after the trial, re-matching happens automatically.",
    severity: "info",
  },
  {
    id: "rule_12",
    title: "Health review every 4 to 6 weeks",
    kind: "governance",
    weight: 0,
    summary:
      "Review match health every 4 to 6 weeks using consistency, progress, and satisfaction.",
    severity: "info",
  },
  {
    id: "rule_13",
    title: "Goal change triggers rematch",
    kind: "governance",
    weight: 0,
    summary:
      "A significant mentee goal change triggers re-matching immediately.",
    severity: "warning",
  },
  {
    id: "rule_14",
    title: "Termination conditions",
    kind: "governance",
    weight: 0,
    summary:
      "Dissolve the match for repeated no-shows or if either party requests termination.",
    severity: "warning",
  },
];
