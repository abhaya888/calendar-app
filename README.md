# 📅 Wall Calendar (React + Vite)

A modern, responsive wall-style calendar built using React.
The project is created using Vite, with all core functionality implemented in a single custom component.

---

## 🚀 Features

* 📆 Interactive monthly calendar view
* 🔁 Navigate between months
* 🎯 Select single dates or date ranges
* 📝 Add notes for:

  * Individual days
  * Date ranges
  * Entire months
* 💾 Persistent storage using `localStorage`
* 🎨 Dynamic monthly background images
* 📱 Responsive design (mobile + desktop)
* 🎉 Highlighted holidays

---

## 📂 Project Structure

This project was bootstrapped using **Vite + React**.

```
├── src/
│   ├── App.jsx        # Main implementation (written by me)
│   ├── main.jsx       # Default Vite entry file
│   ├── index.css      # Default styles
│
├── index.html         # Default Vite template
├── package.json
├── vite.config.js
```

> All core logic, UI, and functionality are implemented inside `App.jsx`.
> The remaining files are standard Vite boilerplate.

---

## ⚙️ Setup & Run

Make sure you have Node.js installed.

```
npm install
npm run dev
```

Then open the local development URL shown in the terminal.

---

## 🧠 Implementation Details

* Calendar renders a fixed **6×7 grid (42 cells)** for consistency
* Dates are encoded as integers (`YYYYMMDD`) for easy comparison
* Notes are stored in `localStorage` using structured keys:

  * `day-YYYYMMDD`
  * `range-START-END`
  * `month-YYYY-M`

---

## 🕹️ Usage

* Click a date → select it
* Click another date → create a range
* Click the same date again → clear selection
* Use arrows to navigate months
* Add notes in the side panel
* Notes are saved automatically

---

## 🧩 Key Components (inside App.jsx)

* `WallCalendar` → Main container
* `HeroPanel` → Month banner with image
* `DayCell` → Individual date cell
* `NotesSection` → Notes editor panel
* `SpiralBar` → Decorative header

---

## 🛠️ Tech Stack

* React (Hooks)
* Vite
* JavaScript (ES6+)
* Inline CSS

---
