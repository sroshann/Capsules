Most households have a drawer somewhere with half-used medicine strips, no one sure what's expired, what's running low, or who's buying the next refill.

I built Capsules to fix that.
---

Capsules is a full-stack web app that turns a household's shared medicine cabinet into a live, collaborative inventory. Create a "home," invite the people who share it with you, and every strip, bottle, and course gets tracked — quantity, disease, expiry date — visible and editable by everyone with access, in real time.

Medicine management at home is usually informal — a mental note, a sticky pad, a WhatsApp message. That breaks the moment more than one person is involved: someone finishes the last dose without telling anyone, a strip expires unnoticed, or stock runs low with no warning. Capsules replaces that guesswork with one shared source of truth, updated instantly for everyone.

Core features:
• Create or join a "home" — a shared space for the people who use that cabinet
• Add, consume, and remove medicines with live quantity tracking and auto expiry flagging
• Real-time sync across every member's screen — no refresh needed
• Automated email alerts for join requests, approvals, and course completions
• Discover and request access to other homes, with admin approval
• Built-in medicine lookup — instantly pull purpose, generic name, usage, and warnings

Beyond basic CRUD:
• Real-time layer on Socket.io — changes appear instantly, no polling
• Redis caching in front of MongoDB for fast repeat reads
• Role-aware access control — admins vs. regular members
• Automated transactional email via Nodemailer for real events, not just signup
• JWT auth in httpOnly cookies, with OTP email verification for resets
• Responsive UI with GSAP animations, built to scale — not one monolithic file

Where it stands: Capsules is feature-complete and I'm currently working through deployment — real infrastructure lessons along the way:
• Cross-origin cookies behave differently once frontend and backend live on separate domains, so SameSite/Secure attributes needed real attention
• Socket.io and Redis both need persistent, always-on connections — a poor fit for free hosting tiers built around cold starts
• AWS, Azure, and GCP all offer solid free tiers, but they're time-bound — as a student funding this independently, recurring cloud billing isn't sustainable yet
• The medicine lookup runs on openFDA, FDA's free public API — great, but coverage is limited to what it's indexed, and it's rate-limited

If you've ever opened a family medicine drawer with no idea what's in there — this is the problem I set out to solve.
---
