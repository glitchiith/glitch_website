# Unity WebGL handoff

The new game is not in this repository yet. The current files under
`frontend/public/gameglitch/Final/` are the previous event's compiled game and
are not embedded by the website.

Before exporting the new build, the Unity developer needs to provide:

- The Unity version and whether the project uses `UnityEngine.UI` or TextMeshPro.
- The script that owns the final score.
- The scene that starts gameplay and the `ScoreSubmit` scene.
- The GameObject and method called by the Submit button.
- Either the Unity source project for integration, or a build that already
  exposes clearly documented JavaScript calls for starting a run and submitting
  the final score.

The agreed browser/backend contract is:

1. Before gameplay, request a run from `POST /api/runs` with the website's
   Firebase bearer token.
2. Preserve the returned run ID until the `ScoreSubmit` scene.
3. On Submit, encrypt UTF-8 JSON `{"runId":"...","score":4500}` using the
   returned RSA public key, PKCS#1 v1.5 padding, and standard Base64.
4. Pass only the encrypted text to the website. The website adds the current
   Firebase token and sends `POST /api/submit-score`.
5. Show success only after the backend replies. A network retry must reuse the
   same run ID and score.

Once the source or prepared WebGL build arrives, the remaining work is to add
the JavaScript bridge, connect it to the real Unity methods, replace the old
build directory, confirm the generated filenames/compression settings, and run
the end-to-end submission tests.

Do not embed the RSA private key or Firebase token in Unity. The backend derives
the player UID and hostel from the verified login.
