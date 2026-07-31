# SighShield

Progress: 100%

A local desktop privacy tool that automatically detects and masks sensitive information (API keys, passwords, PII) on your screen in real-time to prevent accidental leaks during screen sharing.

---

## 31 July 2026

### Log #1

Completed Project & Requirements

#### What I worked on

- **Desktop Capture:** Implemented low-latency screen capture using the Windows Desktop Duplication API and DXcam.
- **OCR Integration:** Added text recognition using RapidOCR and optimized it with native Windows Media OCR for faster, background processing.
- **Secret Detection Engine:** Built a Regex-based detector that identifies AWS Access Keys, Google API Keys, OpenAI Keys, Slack Tokens, JWTs, Credit Cards, and Passwords.
- **Masking Overlay:** Created a transparent, click-through Qt window that dynamically overlays a cyber-glass mask over detected secrets in real-time.
- **Performance Optimization:** Integrated frame-difference detection and localized OCR scanning to minimize CPU usage and ensure the UI remains responsive.
- **Version Control:** Initialized Git repository and published the completed project to GitHub.
