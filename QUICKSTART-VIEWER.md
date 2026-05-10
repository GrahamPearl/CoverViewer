# Quick Start — Firebase Cover Data Viewer

## 30-Second Setup

### Step 1: Prepare Files
```bash
# Copy to your web directory
- viewer.html
- viewer.js
- viewer-config.js
- viewer-export.js
- viewer-styles.css
- viewer.env
- firebase-adapter.js (copy from main project)
```

### Step 2: Configure Firebase
Edit `viewer.env`:
```env
apiKey=YOUR_KEY_FROM_FIREBASE_CONSOLE
projectId=your-project-id
authDomain=your-project.firebaseapp.com
storageBucket=your-project.appspot.com
messagingSenderId=12345678901
appId=1:12345:web:abc123
schoolId=your-school-id
```

**Where to find these:**
- Firebase Console → Project Settings → Your apps → SDK setup

### Step 3: Open & Test
1. Open `viewer.html` in browser
2. Go to ⚙️ Settings → Firebase Storage
3. Click **Test Connection**
4. If green ✅ → Data should load automatically

---

## Data Requirements

Firestore must have this structure:
```
schools/
  └── {schoolId}/
      └── history/
          └── documents with fields:
             {
               date, week, coveredTeacher, coverTeacher,
               absentReason, period, subject, className, venue
             }
```

Replace `{schoolId}` with value in `viewer.env`.

---

## Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **Filter by date** | Pick date in "Date" field |
| **Search teacher** | Type in "Absent Teacher" or "Cover Teacher" fields |
| **Save filters** | Filters auto-save; apply next time you visit |
| **Sort table** | Click column header |
| **Export CSV** | Click ⬇️ Export → CSV |
| **Export Excel** | Click ⬇️ Export → Excel (includes summary sheet) |
| **Print** | Click ⬇️ Export → Print |

---

## Minimal Config (Fastest Setup)

If you have a `viewer.env` file prepared:

```env
apiKey=AIzaSyxxxxxxxxx
projectId=my-project
schoolId=my-school
```

That's the **minimum required**. Open the viewer → data loads.

Other fields (authDomain, storageBucket, etc.) auto-populate from Firebase defaults.

---

## Manual Config (No `.env` File)

1. Open `viewer.html`
2. ⚙️ Settings
3. Fill in **at least**:
   - School ID
   - API Key
   - Project ID
4. Save
5. Refresh page

---

## Troubleshooting Checklist

- [ ] `schoolId` matches Firestore document path
- [ ] `apiKey` is **Web API Key** (not Service Account key)
- [ ] Firestore rules allow reads (check Firebase console)
- [ ] `schools/{schoolId}/history` collection exists
- [ ] History documents have correct field names (exact match)
- [ ] Browser allows file downloads (for export)

---

## Deploy to Web

### Firebase Hosting (5 min)
```bash
firebase init hosting
firebase deploy --only hosting
```

### Netlify (Drag & Drop)
Drag `viewer/` folder → Netlify dashboard

### GitHub Pages
Push to GitHub repo → Enable Pages → Access at `github.io/repo/viewer/`

---

## Questions?

1. Check browser console for errors (F12)
2. Verify Firebase config in Settings modal
3. Read `README-VIEWER.md` for full documentation

---

**Ready to go!** Open `viewer.html` and start viewing cover data. 🎉
