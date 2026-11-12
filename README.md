# Eagle Structure · LifeOS

Your single mission: build six teams, each with ten Core IBOs, with every leg reaching 3%+.

## The six wings
- Six owner-private team records, seeded as Team 1 through Team 6.
- Each IBO counts as Core only after Meeting Attended, Booking Made and Business Active are checked.
- People Pipeline records unlimited conversations and follow-ups.
- Daily Actions records conversations, follow-ups, meetings booked, meetings attended, presentations, team meetings and business activity.
- Eagle Progress shows the real 60-Core-IBO and six-leg qualification numbers.
- Wins and setbacks use different visual/audio feedback.

## Data
Firebase Authentication and Cloud Firestore keep each owner's records under `users/{uid}`. The Firestore rules are owner-only. Use Settings → Export All Data for a JSON backup.

## Deploy
The existing workflow is `.github/workflows/deploy.yml`. It builds the app and deploys the `tusharraut` Firebase Hosting target in project `personal-mgmt-app`.

GitHub Actions requires one Repository Secret:
- Preferred name: `FIREBASE_SERVICE_ACCOUNT_PERSONAL_MGMT_APP`
- Fallback name supported by the workflow: `FIREBASE_SERVICE_ACCOUNT`

The value must be the service-account JSON for the Firebase project, with permission to deploy Firebase Hosting. Add it in GitHub → Settings → Secrets and variables → Actions. Never commit the JSON key to this repository or paste it into chat.

## Install on a phone
Open the deployed app in Chrome on Android and choose ⋮ → Install app / Add to Home screen. In Safari on iPhone, choose Share → Add to Home Screen.
