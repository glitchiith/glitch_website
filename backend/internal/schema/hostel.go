package schema

var HOSTELS = map[int]string{
	1:  "ARYABHATTA",
	2:  "MAITREYI",
	3:  "GARGI",
	4:  "ANANDI",
	5:  "SAROJINI NAIDU",
	6:  "KALPANA CHAWLA",
	7:  "CHARAKA",
	8:  "SUSRUTHA",
	9:  "KAUTILYA",
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
}

// LEADERBOARD_HOSTELS contains the participating units shown in hostel standings.
// Paired hostels share one score and one top-50 player cap.
var LEADERBOARD_HOSTELS = map[int]string{
	1:  "ARYABHATTA",
	2:  "MAITREYI",
	3:  "GARGI",
	4:  "ANANDI",
	5:  "SAROJINI NAIDU",
	6:  "KALPANA CHAWLA",
	11: "BRAHMAGUPTA + VYASA",
	12: "VARAHAMIHIRA + CHARAKA",
	13: "RAMANUJA",
	14: "VIVEKANANDA",
	15: "SN BOSE",
	16: "RAMANUJAN",
	17: "RAMAN",
	18: "KALAM",
	19: "BHABHA + KAUTILYA",
	20: "SARABHAI",
	21: "VISWESWARAYA",
	22: "BHASKARA + SUSRUTHA",
}
