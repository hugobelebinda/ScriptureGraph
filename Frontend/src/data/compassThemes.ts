export type CompassEmotionId =
  | "peace"
  | "anxious"
  | "lonely"
  | "grief"
  | "guilt"
  | "hope"
  | "weary"
  | "joy";

export type CompassVerse = {
  uid: string;
  summaryKey: string;
};

export type CompassTheme = {
  id: CompassEmotionId;
  colorClass: string;
  labelKey: string;
  subtitleKey: string;
  verses: CompassVerse[];
};

export const COMPASS_THEMES: CompassTheme[] = [
  {
    id: "peace",
    colorClass: "bg-emerald-100",
    labelKey: "compass.card.peace.title",
    subtitleKey: "compass.card.peace.subtitle",
    verses: [
      { uid: "PHP.4.6", summaryKey: "compass.summaries.peace.PHP_4_6" },
      { uid: "PHP.4.7", summaryKey: "compass.summaries.peace.PHP_4_7" },
      { uid: "JHN.14.27", summaryKey: "compass.summaries.peace.JHN_14_27" },
      { uid: "PSA.23.1", summaryKey: "compass.summaries.peace.PSA_23_1" },
      { uid: "ISA.26.3", summaryKey: "compass.summaries.peace.ISA_26_3" },
      { uid: "PSA.4.8", summaryKey: "compass.summaries.peace.PSA_4_8" },
      { uid: "PSA.46.10", summaryKey: "compass.summaries.peace.PSA_46_10" },
      { uid: "MAT.5.9", summaryKey: "compass.summaries.peace.MAT_5_9" },
    ],
  },
  {
    id: "anxious",
    colorClass: "bg-sky-100",
    labelKey: "compass.card.anxious.title",
    subtitleKey: "compass.card.anxious.subtitle",
    verses: [
      { uid: "MAT.6.34", summaryKey: "compass.summaries.anxious.MAT_6_34" },
      { uid: "1PE.5.7", summaryKey: "compass.summaries.anxious._1PE_5_7" },
      { uid: "ISA.41.10", summaryKey: "compass.summaries.anxious.ISA_41_10" },
      { uid: "PSA.56.3", summaryKey: "compass.summaries.anxious.PSA_56_3" },
      { uid: "PSA.56.4", summaryKey: "compass.summaries.anxious.PSA_56_4" },
      { uid: "PSA.46.1", summaryKey: "compass.summaries.anxious.PSA_46_1" },
      { uid: "2TI.1.7", summaryKey: "compass.summaries.anxious._2TI_1_7" },
      { uid: "JHN.14.1", summaryKey: "compass.summaries.anxious.JHN_14_1" },
    ],
  },
  {
    id: "lonely",
    colorClass: "bg-cyan-100",
    labelKey: "compass.card.lonely.title",
    subtitleKey: "compass.card.lonely.subtitle",
    verses: [
      { uid: "PSA.27.10", summaryKey: "compass.summaries.lonely.PSA_27_10" },
      { uid: "JHN.14.18", summaryKey: "compass.summaries.lonely.JHN_14_18" },
      { uid: "HEB.13.5", summaryKey: "compass.summaries.lonely.HEB_13_5" },
      { uid: "ISA.49.15", summaryKey: "compass.summaries.lonely.ISA_49_15" },
      { uid: "2TI.4.16", summaryKey: "compass.summaries.lonely._2TI_4_16" },
      { uid: "2TI.4.17", summaryKey: "compass.summaries.lonely._2TI_4_17" },
      { uid: "PSA.68.6", summaryKey: "compass.summaries.lonely.PSA_68_6" },
      { uid: "PRO.18.24", summaryKey: "compass.summaries.lonely.PRO_18_24" },
    ],
  },
  {
    id: "grief",
    colorClass: "bg-violet-100",
    labelKey: "compass.card.grief.title",
    subtitleKey: "compass.card.grief.subtitle",
    verses: [
      { uid: "PSA.34.18", summaryKey: "compass.summaries.grief.PSA_34_18" },
      { uid: "MAT.5.4", summaryKey: "compass.summaries.grief.MAT_5_4" },
      { uid: "JHN.11.35", summaryKey: "compass.summaries.grief.JHN_11_35" },
      { uid: "REV.21.4", summaryKey: "compass.summaries.grief.REV_21_4" },
      { uid: "ISA.61.3", summaryKey: "compass.summaries.grief.ISA_61_3" },
      { uid: "2CO.1.3", summaryKey: "compass.summaries.grief._2CO_1_3" },
      { uid: "2CO.1.4", summaryKey: "compass.summaries.grief._2CO_1_4" },
      { uid: "PSA.147.3", summaryKey: "compass.summaries.grief.PSA_147_3" },
    ],
  },
  {
    id: "guilt",
    colorClass: "bg-amber-100",
    labelKey: "compass.card.guilt.title",
    subtitleKey: "compass.card.guilt.subtitle",
    verses: [
      { uid: "1JN.1.9", summaryKey: "compass.summaries.guilt._1JN_1_9" },
      { uid: "PSA.51.10", summaryKey: "compass.summaries.guilt.PSA_51_10" },
      { uid: "ISA.1.18", summaryKey: "compass.summaries.guilt.ISA_1_18" },
      { uid: "ROM.8.1", summaryKey: "compass.summaries.guilt.ROM_8_1" },
      { uid: "PSA.32.1", summaryKey: "compass.summaries.guilt.PSA_32_1" },
      { uid: "PSA.32.5", summaryKey: "compass.summaries.guilt.PSA_32_5" },
      { uid: "MIC.7.18", summaryKey: "compass.summaries.guilt.MIC_7_18" },
      { uid: "PSA.51.1", summaryKey: "compass.summaries.guilt.PSA_51_1" },
    ],
  },
  {
    id: "hope",
    colorClass: "bg-lime-100",
    labelKey: "compass.card.hope.title",
    subtitleKey: "compass.card.hope.subtitle",
    verses: [
      { uid: "ROM.15.13", summaryKey: "compass.summaries.hope.ROM_15_13" },
      { uid: "PSA.42.11", summaryKey: "compass.summaries.hope.PSA_42_11" },
      { uid: "LAM.3.22", summaryKey: "compass.summaries.hope.LAM_3_22" },
      { uid: "HEB.10.23", summaryKey: "compass.summaries.hope.HEB_10_23" },
      { uid: "ROM.8.24", summaryKey: "compass.summaries.hope.ROM_8_24" },
      { uid: "ROM.8.25", summaryKey: "compass.summaries.hope.ROM_8_25" },
      { uid: "ROM.8.28", summaryKey: "compass.summaries.hope.ROM_8_28" },
      { uid: "ROM.15.4", summaryKey: "compass.summaries.hope.ROM_15_4" },
    ],
  },
  {
    id: "weary",
    colorClass: "bg-indigo-100",
    labelKey: "compass.card.weary.title",
    subtitleKey: "compass.card.weary.subtitle",
    verses: [
      { uid: "MAT.11.28", summaryKey: "compass.summaries.weary.MAT_11_28" },
      { uid: "MAT.11.29", summaryKey: "compass.summaries.weary.MAT_11_29" },
      { uid: "ISA.40.31", summaryKey: "compass.summaries.weary.ISA_40_31" },
      { uid: "2CO.12.9", summaryKey: "compass.summaries.weary._2CO_12_9" },
      { uid: "PSA.62.5", summaryKey: "compass.summaries.weary.PSA_62_5" },
      { uid: "HEB.12.3", summaryKey: "compass.summaries.weary.HEB_12_3" },
      { uid: "GAL.6.9", summaryKey: "compass.summaries.weary.GAL_6_9" },
      { uid: "PSA.40.1", summaryKey: "compass.summaries.weary.PSA_40_1" },
    ],
  },
  {
    id: "joy",
    colorClass: "bg-rose-100",
    labelKey: "compass.card.joy.title",
    subtitleKey: "compass.card.joy.subtitle",
    verses: [
      { uid: "PSA.16.11", summaryKey: "compass.summaries.joy.PSA_16_11" },
      { uid: "PSA.30.11", summaryKey: "compass.summaries.joy.PSA_30_11" },
      { uid: "1TH.5.18", summaryKey: "compass.summaries.joy._1TH_5_18" },
      { uid: "JAS.1.2", summaryKey: "compass.summaries.joy.JAS_1_2" },
      { uid: "PSA.100.4", summaryKey: "compass.summaries.joy.PSA_100_4" },
      { uid: "PSA.103.1", summaryKey: "compass.summaries.joy.PSA_103_1" },
      { uid: "PSA.103.2", summaryKey: "compass.summaries.joy.PSA_103_2" },
      { uid: "2CO.9.15", summaryKey: "compass.summaries.joy._2CO_9_15" },
    ],
  },
];

