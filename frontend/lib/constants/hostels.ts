// src/lib/constants/hostels.ts
export const HOSTELS: Record<number, string> = {
  1: "ARYABHATTA",
  2: "MAITREYI",
  3: "GARGI",
  4: "ANANDI",
  5: "SAROJINI NAIDU",
  6: "KALPANA CHAWLA",
  7: "CHARAKA",
  8: "SUSRUTHA",
  9: "KAUTILYA",
  10: "VYASA",
  11: "BRAHMAGUPTA",
  12: "VARAHAMIHIRA",
  13: "RAMANUJA",
  14: "VIVEKANANDA",
  15: "SN BOSE",
  16: "RAMANUJAN",
  17: "RAMAN",
  18: "KALAM",
  19: "BHABHA",
  20: "SARABHAI",
  21: "VISWESWARAYA",
  22: "BHASKARA",
};

// Optional helper list
export const HOSTEL_LIST = Object.entries(HOSTELS).map(([id, name]) => ({
  id: Number(id),
  name,
}));
