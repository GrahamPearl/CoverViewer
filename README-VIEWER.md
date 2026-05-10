# Firebase Cover Data Viewer

A standalone web application for viewing and analyzing cover teacher allocation data stored in Firebase Firestore.

## Features

✅ **Date-based filtering** — View covers for any date (defaults to today)  
✅ **Teacher search** — Autocomplete filter by absent or cover teacher name  
✅ **Persistent filters** — Filters saved in localStorage, apply automatically on next visit  
✅ **Sortable columns** — Click column headers to sort data  
✅ **Live statistics** — Real-time stats bar showing unique teachers, top absences, etc.  
✅ **Multi-format export** — CSV, Excel (with summary sheet), print  
✅ **Separate Firebase config** — Own `viewer.env` file, independent from main dashboard  
✅ **Connection testing** — Validate Firebase credentials before saving  

---

## File Structure

```
viewer/
├── viewer.html              Main HTML (consolidated UI)
├── viewer.js                Core logic (fetching, filtering, rendering)
├── viewer-config.js         Firebase config management
├── viewer-export.js         CSV/Excel/Print utilities
├── viewer-styles.css        Styling (minimal, print-friendly)
├── viewer.env               Firebase credentials template
├── firebase-adapter.js      Shared from main project
└── README.md                This file
```

---

## Setup

### 1. Copy Firebase Adapter
The viewer requires `firebase-adapter.js` from the main CoverTeacher project:
```bash
cp ../index/firebase-adapter.js ./viewer/
```

### 2. Configure Firebase Credentials

#### Option A: Environment File (Recommended)
Create `viewer.env` in the same directory as `viewer.html`:
```env
apiKey=YOUR_API_KEY_HERE
projectId=YOUR_PROJECT_ID_HERE
authDomain=YOUR_PROJECT.firebaseapp.com
storageBucket=YOUR_PROJECT.appspot.com
messagingSenderId=YOUR_SENDER_ID_HERE
appId=YOUR_APP_ID_HERE
schoolId=your-school-id
```

#### Option B: Manual Configuration
Open the viewer → ⚙️ Settings → Firebase Storage → Fill in all fields → Save

Configuration priority:
1. **localStorage** (saved settings override everything)
2. **viewer.env** (if file exists)
3. **Built-in defaults** (empty/fallback)

### 3. Verify Firestore Structure

The viewer expects data at:
```
Firestore Database
└── schools/
    └── {schoolId}/
        ├── history/          (Collection of cover records)
        └── other collections...
```

Each history document should have:
```json
{
  "date": "2025-05-10",
  "week": 1,
  "coveredTeacher": "John Smith",
  "coverTeacher": "Jane Doe",
  "absentReason": "Sick Leave",
  "period": 1,
  "subject": "Maths",
  "className": "10A",
  "venue": "Room 101"
}
```

---

## Usage

### Opening the Viewer
1. Open `viewer.html` in a web browser
2. First time? Configure Firebase in ⚙️ Settings
3. Data fetches automatically for today's date

### Filtering
- **Date**: Pick any date to view covers for that day
- **Absent Teacher**: Start typing to search (autocomplete dropdown)
- **Cover Teacher**: Start typing to search (autocomplete dropdown)
- **Clear Filters**: Reset all filters at once

Filters **persist globally** — they apply to all dates automatically on future visits.

### Statistics
The gradient bar at the top shows:
- **Total Records**: Matching current filters
- **Dates**: Number of unique dates in filtered results
- **Unique Absent**: Number of different teachers absent
- **Unique Cover**: Number of different cover teachers used
- **Top Absent**: Most frequently absent teacher
- **Top Cover**: Most frequently assigned cover teacher

### Sorting
Click any column header to sort:
- First click: Ascending (A→Z, 1→9, oldest→newest)
- Second click: Descending (Z→A, 9→1, newest→oldest)

### Exporting
Click **⬇️ Export** to choose format:

**CSV Export**
- Simple comma-separated file
- Opens in Excel, Google Sheets, etc.
- Includes filtered results only

**Excel Export (with Summary)**
- Sheet 1: Detailed records (filtered)
- Sheet 2: Summary statistics
  - Top absent/cover teachers (top 10)
  - Absence reasons breakdown
  - Total records, unique teachers, etc.

**Print**
- Opens print-friendly view
- Hide filters/controls automatically
- Page breaks handled intelligently

---

## Configuration

### Settings Modal
⚙️ **Settings** button opens configuration panel with two tabs:

**Firebase Storage Tab**
- School ID (required) — Unique identifier for this school
- API Key (required) — Firebase API key
- Project ID (required) — GCP project ID
- Auth Domain, Storage Bucket, etc. (optional but recommended)
- **Test Connection** button — Validates credentials

### Environment File (`viewer.env`)
Format: `KEY=VALUE` (one per line, no quotes)

Lines starting with `#` are comments and ignored.

Example:
```env
# Firebase credentials
apiKey=AIzaSyDjxxxxxxxxxxxxxxxxxxxxxxxxxx
projectId=cover-app-12345
authDomain=cover-app-12345.firebaseapp.com

# School identifier
schoolId=springfield-high
```

---

## Features Explained

### Persistent Filters
- Filters stored in browser `localStorage` under key: `viewerFilters`
- Applied automatically when you revisit the viewer
- Clear filters to remove persistence, or manually edit localStorage

### Data Caching
- Recent fetch cached in localStorage (`viewerDataCache`)
- Speeds up repeated access to the same data
- Does not prevent fresh Firebase queries

### Autocomplete Dropdowns
- Teacher name suggestions appear as you type
- Suggestions drawn from currently visible data
- Click to auto-fill filter field

### Responsive Design
- Works on desktop, tablet, mobile
- Print stylesheet ensures clean output
- Sortable table works on all devices

---

## Troubleshooting

### Firebase Connection Failed
1. Check ⚙️ Settings → Firebase Storage
2. Ensure **School ID**, **API Key**, and **Project ID** are filled
3. Verify credentials match your Firebase console
4. Test with **Test Connection** button
5. Check browser console (F12) for errors

### No Data Showing
1. Confirm `schoolId` in settings matches Firestore document path
2. Verify `schools/{schoolId}/history` collection exists in Firestore
3. Check Firestore rules — viewer needs read access
4. Try different date (may not have data for selected date)

### Filters Not Working
1. Clear browser localStorage (`Settings` → clear localStorage)
2. Reload page
3. Reapply filters

### Export Not Working
- **CSV**: Check browser allows file downloads
- **Excel**: Ensure XLSX library loaded (check browser console)
- **Print**: Use browser's native print (Ctrl+P or Cmd+P)

---

## Deployment

### Static Hosting (Recommended)
- No backend required
- Host on: Firebase Hosting, Netlify, GitHub Pages, AWS S3, etc.
- Files needed: All HTML, JS, CSS, ENV, firebase-adapter.js
- Direct file access only (no build step)

### Example: Firebase Hosting
```bash
firebase init hosting
# Select viewer/ directory
firebase deploy --only hosting
```

### Example: GitHub Pages
1. Push viewer/ to GitHub repo
2. Enable GitHub Pages → main branch
3. Access at: `https://username.github.io/repo/viewer/viewer.html`

---

## Security Notes

⚠️ **Firebase credentials in `.env` are exposed in the browser**
- This viewer is for **internal/admin use only**
- Use Firestore security rules to restrict access
- Example rule: only allow reads within school's own data

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId}/history/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## Performance Tips

1. **Firestore indexes**: Add index on `date` field for faster queries
2. **Filter early**: Use date picker to narrow data before viewing
3. **Limit export size**: Export only weeks/months needed, not entire year
4. **Cache: Subsequent loads fetch from browser cache, not Firebase

---

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Verify Firebase configuration
3. Confirm Firestore data structure matches expected format
4. Review Firestore security rules

---

## License

Same as CoverTeacher main project.

**Version**: 1.0  
**Last Updated**: May 2025
