
# 🕒 TaskPulse – Daily Workout Reminder App

A simple task reminder mobile app built with **React Native** and **TypeScript**. Create tasks with a date and time, and receive local notifications when they're due.

---

## ✨ Features

- 🔐 Login & Signup UI (frontend only)
- 📝 Create tasks with title, description, date & time
- ✅ Mark tasks as complete or delete them
- 🔔 Local push notifications when tasks are due
- 📆 Optional calendar view for scheduled tasks

---

## 🚀 Tech Stack

- **React Native**
- **TypeScript**
- **react-navigation** – Screen navigation
- **AsyncStorage** – Local data storage
- **react-native-push-notification** – Local notifications
- **@react-native-community/datetimepicker** – Date and time picker

---

## 📦 Installation

```bash
git clone https://github.com/your-username/taskpulse.git
cd taskpulse
npm install
````

---


Add permissions to `Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>fetch</string>
  <string>remote-notification</string>
</array>
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>
```

---

## 🚨 TypeScript Fix for `react-native-push-notification`

If you get this error:

```
Could not find a declaration file for module 'react-native-push-notification'
```

👉 Create this file: `src/types/react-native-push-notification.d.ts`

```ts
declare module 'react-native-push-notification';
```

Update `tsconfig.json`:

```json
"typeRoots": ["./node_modules/@types", "./src/types"]
```

---

## 🧪 Run the App

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

---

## 🗂 Folder Structure

```
/src
  /components
  /screens
  /utils
  /types
App.tsx
```

---

## 📌 To-Do

* [ ] Backend integration (Firebase or custom API)
* [ ] Recurring tasks support
* [ ] Calendar view enhancement
* [ ] User settings and themes

