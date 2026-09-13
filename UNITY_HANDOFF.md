# Unity WebGL handoff

The new game is not in this repository yet. The current files under
`frontend/public/gameglitch/Final/` are the previous event's compiled game and
are not embedded by the website.

Before exporting the new build, the Unity developer needs to provide:

- The Unity version and whether the project uses `UnityEngine.UI` or TextMeshPro.
- The script that owns the final score.
- The scene that starts gameplay and the `ScoreSubmit` scene.
- The GameObject and method called by the Submit button.
- A `ScoreBridge.jslib` function that posts the final integer score to the
  parent website as `{ type: "unity-score-submit", score }`.
- A GameObject named `ScoreSubmitController` with `SubmissionSucceeded(string)`
  and `SubmissionFailed(string)` methods for displaying the website response.

The agreed browser/backend contract is:

1. The website requests a run from `POST /api/runs` with the player's Firebase
   bearer token before it loads the game.
2. The website retains the run ID and public RSA parameters for that page load.
3. Unity posts only `{ type: "unity-score-submit", score: 4500 }` to its
   same-origin parent page.
4. The website validates the iframe source, encrypts UTF-8 JSON
   `{"runId":"...","score":4500}` using PKCS#1 v1.5, and sends it to
   `POST /api/submit-score` with a fresh Firebase token.
5. The website posts a `website-score-result` message back to the iframe after
   the backend responds. A failed network request can retry the same run and score.

Once the prepared WebGL build arrives, the remaining work is to copy it into a
new public directory, set `NEXT_PUBLIC_UNITY_GAME_PATH`, add the small iframe-side
listener that forwards result messages into Unity, confirm compression settings,
and run the end-to-end submission tests.

Unity does not receive the run ID, RSA key, Firebase UID, or Firebase token. The
backend derives the player UID and hostel from the verified login.
