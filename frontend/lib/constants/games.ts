// src/constants/games.ts

export const Games_Inverse = {
  PG: { game_id: 1, game_name: "Ponglike", creator: "Pushkar" },
  GM: { game_id: 2, game_name: "GeomDashlike", creator: "Alfien" },
  TDS: { game_id: 3, game_name: "Shooterlike", creator: "Nithin" },
  MC: { game_id: 4, game_name: "Mountain Climber", creator: "Likith" },
  RYM: { game_id: 5, game_name: "FnfLike", creator: "Vijay" },
} as const;


export const Games_Forward = {
  1: { game_code: "PG", game_name: "Ponglike", creator: "Pushkar" },
  2: { game_code: "GM", game_name: "GeomDashlike", creator: "Alfien" },
  3: { game_code: "TDS", game_name: "Shooterlike", creator: "Nithin" },
  4: { game_code: "MC", game_name: "Mountain Climber", creator: "Likith" },
  5: { game_code: "RYM", game_name: "FnfLike", creator: "Vijay" },
} as const;
