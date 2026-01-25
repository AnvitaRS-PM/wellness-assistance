# Adding Screen Recordings to README

## 📹 How to Add Your QuickTime Recordings:

### Step 1: Move Your Video Files

Copy your QuickTime recordings (.mov files) into the `demos/` folder:

```bash
# Example - replace with your actual file names:
cp ~/Desktop/01_welcome_screen.mov "./demos/"
cp ~/Desktop/02_personalization.mov "./demos/"
# ... etc for all screens
```

**Name them clearly:**
- `01_welcome_screen.mov`
- `02_personalization.mov`
- `03_goals.mov`
- etc.

---

### Step 2: Two Options for README

#### Option A: Link to Videos (Recommended)
Videos will be stored in the repo and users can click to view:

```markdown
## 📹 Screen Recordings

### 01. Welcome Screen
[Watch Demo](./demos/01_welcome_screen.mov)

### 02. Personalization Screen
[Watch Demo](./demos/02_personalization.mov)

### 03. Goals Screen
[Watch Demo](./demos/03_goals.mov)
```

#### Option B: Embedded HTML Video (Shows inline)
```markdown
## 📹 Screen Recordings

### 01. Welcome Screen
<video width="300" controls>
  <source src="./demos/01_welcome_screen.mov" type="video/quicktime">
  Your browser does not support the video tag.
</video>
```

---

### Step 3: Add to Git

```bash
git add demos/
git add README.md
git commit -m "Add screen recordings for all app screens"
git push origin main
```

---

## 🎯 Where Are Your Video Files?

Tell me where your QuickTime recordings are saved, and I'll help you:
1. Copy them to the demos/ folder
2. Update the README.md
3. Commit and push to GitHub

**What are your video file names and where are they located?**
