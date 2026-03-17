import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  Mail,
  Zap,
  ChevronRight,
  AlertTriangle,
  Flame,
  Trophy,
  X,
  ShieldAlert,
} from "lucide-react";
import "./styles.css";

const EMAIL_DATABASE = [
  // --- TIER 1: EASY (Iron & Copper Ranks) ---
  // Indicators: Blatant typos, generic greetings, obvious bad domains.
  {
    id: 1,
    app: "Netflix",
    tier: 1,
    isPhish: true,
    sender: "support@netfllix-billing.com",
    subject: "Your Account is Suspended",
    body: "Dear Customer, your payment declined. Click here to update your card.",
    hidden: 'Hidden Data: "netfllix" is spelled with two Ls.',
    lesson: "Always check for brand misspellings in the sender address.",
  },
  {
    id: 2,
    app: "HR Dept",
    tier: 1,
    isPhish: false,
    sender: "benefits@company.com",
    subject: "Open Enrollment Starts Tomorrow",
    body: "A reminder that benefits enrollment opens tomorrow via the Workday portal.",
    hidden: "Hidden Data: Valid internal domain, no urgent links.",
    lesson: "Safe internal emails rarely demand immediate, panicked action.",
  },
  {
    id: 3,
    app: "IT Helpdesk",
    tier: 1,
    isPhish: true,
    sender: "admin@it-help-desk-update.info",
    subject: "MANDATORY: Update Your Password",
    body: "Your password expires in 2 hours. Click the link to retain network access.",
    hidden:
      "Hidden Data: The domain is a generic .info address, not your company.",
    lesson:
      "IT will never use external, generic domains for internal password resets.",
  },
  {
    id: 4,
    app: "Spotify",
    tier: 1,
    isPhish: true,
    sender: "no-reply@spotfy-premium.net",
    subject: "Receipt: Premium Family Plan",
    body: "Thank you for your $16.99 purchase. If you did not make this, cancel here.",
    hidden: 'Hidden Data: "spotfy" is misspelled and uses a .net domain.',
    lesson:
      'Fake receipts are meant to panic you into clicking "cancel" without thinking.',
  },
  {
    id: 5,
    app: "Zoom",
    tier: 1,
    isPhish: false,
    sender: "no-reply@zoom.us",
    subject: "Meeting Invitation: Q3 Review",
    body: "You have been invited to a scheduled meeting. Click below to join the lobby.",
    hidden: "Hidden Data: Verified zoom.us domain.",
    lesson:
      "Standard zoom.us links without aggressive urgency are generally safe.",
  },
  {
    id: 6,
    app: "Microsoft 365",
    tier: 1,
    isPhish: true,
    sender: "alert@microsoft-security-alert.com",
    subject: "Unusual sign-in activity",
    body: "We detected a login from Russia. Click to secure your Microsoft account.",
    hidden:
      "Hidden Data: Microsoft uses microsoft.com, not hyphenated domains.",
    lesson: 'Hyphenated "brand-security" domains are classic phishing setups.',
  },
  {
    id: 7,
    app: "LinkedIn",
    tier: 1,
    isPhish: true,
    sender: "messages@linkdin-connect.com",
    subject: "You appeared in 14 searches this week",
    body: "See who is looking at your profile. Click to view your new connections.",
    hidden: 'Hidden Data: "linkdin" is missing the "e".',
    lesson: "Social media alerts are easily faked; always check the spelling.",
  },
  {
    id: 8,
    app: "Slack",
    tier: 1,
    isPhish: false,
    sender: "notification@slack.com",
    subject: "New mention in #general",
    body: "You have unread mentions in your workspace. Open Slack to view.",
    hidden: "Hidden Data: Verified slack.com domain.",
    lesson:
      "Routine notifications from official domains are part of daily workflow.",
  },
  {
    id: 9,
    app: "DoorDash",
    tier: 1,
    isPhish: true,
    sender: "delivery@doordash-corporate.net",
    subject: "Catered Lunch Delivery Issue",
    body: "Your corporate lunch delivery is delayed. Click here to track the driver.",
    hidden:
      "Hidden Data: DoorDash uses doordash.com, not hyphenated .net domains.",
    lesson: "Attackers target lunch hours with food delivery scams.",
  },
  {
    id: 10,
    app: "Netskope",
    tier: 1,
    isPhish: false,
    sender: "rewards@netskope.com",
    subject: "Your Quarterly Swag Voucher!",
    body: "Use code SKOPE2026 for $50 off at the company store.",
    hidden: "Hidden Data: Valid netskope.com sender.",
    lesson: "Internal reward emails from official domains are safe.",
  },

  // --- TIER 2: MEDIUM (Bronze & Gold Ranks) ---
  // Indicators: Spoofed subdomains, realistic corporate workflows, subtle URL changes.
  {
    id: 11,
    app: "Salesforce",
    tier: 2,
    isPhish: true,
    sender: "support@salesforce-crm.com",
    subject: "Action Required: Lead Reassignment",
    body: "15 of your high-value leads have been reassigned. Log in to review the changes.",
    hidden:
      "Hidden Data: Real domain is salesforce.com, not salesforce-crm.com.",
    lesson:
      "Attackers create urgency around your specific job duties (like losing leads).",
  },
  {
    id: 12,
    app: "GitHub",
    tier: 2,
    isPhish: true,
    sender: "notifications@github.com.update-repo.net",
    subject: "[GitHub] Dependabot Alert: Critical Vulnerability",
    body: "A critical vulnerability was found in your repository. Patch immediately.",
    hidden:
      "Hidden Data: The real domain is update-repo.net. GitHub is just a subdomain.",
    lesson:
      "The subdomain trap: the real destination is the last part before the slash.",
  },
  {
    id: 13,
    app: "Workday",
    tier: 2,
    isPhish: false,
    sender: "system@workday.com",
    subject: "Action Required: Annual Performance Review",
    body: "Your self-evaluation is due by Friday. Please log in to complete it.",
    hidden: "Hidden Data: Valid workday.com sender and expected timeline.",
    lesson: "Expected corporate tasks from verified domains should be trusted.",
  },
  {
    id: 14,
    app: "DocuSign",
    tier: 2,
    isPhish: true,
    sender: "signature@docusign-secure.net",
    subject: "Completed: Updated NDA Form",
    body: "Please review the attached updated Non-Disclosure Agreement for Q4.",
    hidden:
      "Hidden Data: docusign.com is the real domain. Never trust docusign-secure.net.",
    lesson: "Fake documents often hide malware payloads. Verify the sender.",
  },
  {
    id: 15,
    app: "Figma",
    tier: 2,
    isPhish: false,
    sender: "comments@figma.com",
    subject: 'New comment on "Homepage Redesign"',
    body: 'Sarah left a comment: "Can we bump up the contrast on this button?"',
    hidden: "Hidden Data: Valid figma.com domain and contextually accurate.",
    lesson:
      "Context is key. If you are working on a redesign, this is a normal alert.",
  },
  {
    id: 16,
    app: "ADP Payroll",
    tier: 2,
    isPhish: true,
    sender: "payroll@adp-employee-portal.com",
    subject: "Failed Direct Deposit",
    body: "Your recent paycheck bounced due to a routing error. Update your bank details.",
    hidden:
      "Hidden Data: The domain is adp-employee-portal.com, a classic credential harvester.",
    lesson: "Payroll scams cause intense panic. Breathe and check the domain.",
  },
  {
    id: 17,
    app: "Notion",
    tier: 2,
    isPhish: false,
    sender: "notify@notion.so",
    subject: 'You were mentioned in "Q4 Roadmaps"',
    body: "You have been tagged in a new page. Click to view your action items.",
    hidden: "Hidden Data: Valid notion.so domain.",
    lesson: "Recognizing safe mail prevents security fatigue!",
  },
  {
    id: 18,
    app: "Zendesk",
    tier: 2,
    isPhish: true,
    sender: "tickets@zendesk-support.io",
    subject: "VIP Customer Escalation",
    body: "A Tier 1 customer has escalated ticket #49281. Review the logs attached.",
    hidden: "Hidden Data: zendesk-support.io is a spoofed domain.",
    lesson:
      "Customer support teams are heavily targeted with fake escalations.",
  },
  {
    id: 19,
    app: "Expensify",
    tier: 2,
    isPhish: false,
    sender: "concierge@expensify.com",
    subject: "Report Approved: Q1 Travel",
    body: "Your expense report for the March offsite has been approved and reimbursed.",
    hidden: "Hidden Data: Authenticated via SPF/DKIM. Valid Expensify link.",
    lesson: "Safe domains verified by email protocols should not be flagged.",
  },
  {
    id: 20,
    app: "Jira",
    tier: 2,
    isPhish: true,
    sender: "notifs@atlassian-support.co",
    subject: "Issue Assigned: Outage Post-Mortem",
    body: "You have been added as a reviewer for the recent API outage.",
    hidden: "Hidden Data: .co is a spoof of .com.",
    lesson: "Technical staff are targeted via fake Jira tickets.",
  },

  // --- TIER 3: HARD / IMPOSSIBLE (Titanium & Apex Ranks) ---
  // Indicators: TLD changes (.co instead of .com), clever routing, targeting admins.
  {
    id: 21,
    app: "AWS",
    tier: 3,
    isPhish: true,
    sender: "no-reply@aws.amazon.security-portal.io",
    subject: "Instance Limit Warning",
    body: "Your EC2 instances are being throttled due to billing issues. Sign in to update credentials.",
    hidden: "Hidden Data: security-portal.io is NOT amazon.com.",
    lesson:
      "The tail end of a URL reveals the true destination. Do not be fooled by the start.",
  },
  {
    id: 22,
    app: "Okta",
    tier: 3,
    isPhish: true,
    sender: "security@okta-verify.co",
    subject: "⚠️ Urgent: New Login Detected",
    body: "A login from Moscow, RU was detected. Verify your identity now to prevent account lockout.",
    hidden: "Hidden Data: Root domain is .co (Fake). Real Okta uses okta.com.",
    lesson:
      "Look at the root domain! Attackers use .co or .net to mimic corporate portals.",
  },
  {
    id: 23,
    app: "Google Workspace",
    tier: 3,
    isPhish: false,
    sender: "workspace-noreply@google.com",
    subject: "New App Connected",
    body: "A new third-party application has been granted access to your Google account.",
    hidden: "Hidden Data: Legitimate google.com automated alert.",
    lesson:
      "Automated security alerts from verified root domains are critical to read.",
  },
  {
    id: 24,
    app: "GitLab",
    tier: 3,
    isPhish: true,
    sender: "admin@gitlab.com.co",
    subject: "CI/CD Pipeline Failure: Master Branch",
    body: "Your recent commit broke the production build. Review the error logs here.",
    hidden:
      "Hidden Data: The domain is gitlab.com.co. The .co extension is the threat.",
    lesson:
      "Country code top-level domains (like .co) are frequently used to spoof .coms.",
  },
  {
    id: 25,
    app: "Vercel",
    tier: 3,
    isPhish: false,
    sender: "notifications@vercel.com",
    subject: "Deployment Successful",
    body: "Your recent push to production has been successfully built and deployed.",
    hidden: "Hidden Data: Valid vercel.com domain.",
    lesson:
      "Developer tools generate a lot of noise. Knowing what is safe speeds up your day.",
  },
  {
    id: 26,
    app: "Azure",
    tier: 3,
    isPhish: true,
    sender: "azure-noreply@microsoft-cloud-auth.net",
    subject: "Action Required: Key Vault Access Revoked",
    body: "Your access to the production Key Vault has expired. Re-authenticate via the portal.",
    hidden:
      "Hidden Data: microsoft-cloud-auth.net is an attacker-controlled domain.",
    lesson:
      "Alerts regarding secrets, keys, or passwords require the highest level of scrutiny.",
  },
  {
    id: 27,
    app: "CrowdStrike",
    tier: 3,
    isPhish: true,
    sender: "alerts@crowdstrike-falcon.io",
    subject: "Malware Detected on Endpoint",
    body: "Suspicious activity detected on your machine. Download the quarantine tool immediately.",
    hidden:
      "Hidden Data: crowdstrike-falcon.io is fake. Real domain is crowdstrike.com.",
    lesson:
      "Attackers spoof security vendors to trick you into downloading the actual malware.",
  },
  {
    id: 28,
    app: "1Password",
    tier: 3,
    isPhish: true,
    sender: "support@1password-vault.com",
    subject: "Device De-authorization",
    body: "Your current device will be de-authorized in 24 hours. Verify your master password.",
    hidden:
      "Hidden Data: 1password-vault.com is a harvester. Official is 1password.com.",
    lesson:
      "Password managers will never email you a link asking for your Master Password.",
  },
  {
    id: 29,
    app: "Datadog",
    tier: 3,
    isPhish: false,
    sender: "alerts@datadoghq.com",
    subject: "[Monitor Alert] High CPU Utilization",
    body: "Production-DB-01 has been running at 95% CPU for over 10 minutes.",
    hidden: "Hidden Data: Valid datadoghq.com monitoring alert.",
    lesson: "Infrastructure alerts from the official HQ domain are standard.",
  },
  {
    id: 30,
    app: "Gemini",
    tier: 3,
    isPhish: true,
    sender: "ai-billing@gemini-google.biz",
    subject: "Action Required: Your Pro Subscription",
    body: "Your AI Plus payment failed. Click to update your card details to keep your access.",
    hidden: "Hidden Data: Google uses google.com, not .biz.",
    lesson: "Trending AI tools are frequently used in billing scams.",
  },
];

const BASE_LEADERBOARD = [
  { id: "npc1", name: "SecOps_Ninja", xp: 1450, acc: "98%" },
  { id: "npc2", name: "Alex_IT", xp: 1100, acc: "95%" },
  { id: "npc3", name: "Sarah.Dev", xp: 800, acc: "97%" },
  { id: "npc4", name: "Michael.HR", xp: 400, acc: "92%" },
  { id: "npc5", name: "Dwight.S", xp: 200, acc: "89%" },
];

export default function SkopeAwarenessStandalone() {
  const [username, setUsername] = useState("");
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("IRON");
  const [streak, setStreak] = useState(0);
  // CHANGED: We now track challenges completed instead of a global index
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- NEW: STATS ENGINE ---
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  
  const RANK_THRESHOLDS = {
    IRON: 0,
    COPPER: 200,
    BRONZE: 600,
    GOLD: 1200,
    TITANIUM: 1800,
    APEX: 2400,
  };
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  // 2. THE CONTENT SEQUENCER ENGINE
  const getDifficultyTier = (currentRank) => {
    if (currentRank === "IRON" || currentRank === "COPPER") return 1;
    if (currentRank === "BRONZE" || currentRank === "GOLD") return 2;
    return 3; // TITANIUM or APEX
  };

  const currentTier = getDifficultyTier(rank);
  const filteredEmails = EMAIL_DATABASE.filter(
    (email) => email.tier === currentTier
  );
  const activeEmail =
    filteredEmails[challengesCompleted % filteredEmails.length];

  /// Calculate live accuracy (prevent dividing by zero on the first load)
  const liveAccuracy = totalDecisions > 0 
  ? Math.round((correctDecisions / totalDecisions) * 100) + "%" 
  : "100%";

const dynamicLeaderboard = [...BASE_LEADERBOARD, { id: 'me', name: username || 'Guest_Investigator', xp: xp, acc: liveAccuracy, isMe: true }]
  .sort((a, b) => b.xp - a.xp)
  .map((user, index) => ({ ...user, rank: index + 1 }))
  .slice(0, 6);

  // 1. DYNAMIC RANK CALCULATION
  useEffect(() => {
    const getRank = (v) => {
      if (v < RANK_THRESHOLDS.COPPER) return "IRON";
      if (v < RANK_THRESHOLDS.BRONZE) return "COPPER";
      if (v < RANK_THRESHOLDS.GOLD) return "BRONZE";
      if (v < RANK_THRESHOLDS.TITANIUM) return "GOLD";
      if (v < RANK_THRESHOLDS.APEX) return "TITANIUM";
      return "APEX";
    };

    const newRank = getRank(xp);

    if (newRank !== rank && xp > 0) {
      setRank(newRank);
      setShowRankUp(true);
      const rankUpSound = new Audio(
        "https://actions.google.com/sounds/v1/science_fiction/power_up_flash.ogg"
      );
      rankUpSound.volume = 0.6;
      rankUpSound
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    }
  }, [xp, rank]);

  // 2. DYNAMIC PROGRESS BAR CALCULATION
  const getProgressPercentage = () => {
    if (xp >= RANK_THRESHOLDS.APEX) return 100; // Maxed out!

    let currentBase = 0;
    let nextTarget = RANK_THRESHOLDS.COPPER;

    if (xp >= RANK_THRESHOLDS.TITANIUM) {
      currentBase = RANK_THRESHOLDS.TITANIUM;
      nextTarget = RANK_THRESHOLDS.APEX;
    } else if (xp >= RANK_THRESHOLDS.GOLD) {
      currentBase = RANK_THRESHOLDS.GOLD;
      nextTarget = RANK_THRESHOLDS.TITANIUM;
    } else if (xp >= RANK_THRESHOLDS.BRONZE) {
      currentBase = RANK_THRESHOLDS.BRONZE;
      nextTarget = RANK_THRESHOLDS.GOLD;
    } else if (xp >= RANK_THRESHOLDS.COPPER) {
      currentBase = RANK_THRESHOLDS.COPPER;
      nextTarget = RANK_THRESHOLDS.BRONZE;
    }

    const xpIntoCurrentRank = xp - currentBase;
    const xpNeededForNextRank = nextTarget - currentBase;

    return (xpIntoCurrentRank / xpNeededForNextRank) * 100;
  };

  const handleDecision = (choice) => {
    // 1. Log that a decision was made
    setTotalDecisions(prev => prev + 1);

    const isCorrect = (choice === 'PHISH' && activeEmail.isPhish) || (choice === 'SAFE' && !activeEmail.isPhish);
    
    if (isCorrect) {
      // 2. Log that the decision was correct
      setCorrectDecisions(prev => prev + 1);
      
      const xpGained = 100 * multiplier;
      setXp(prev => prev + xpGained);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'success', text: `Correct! ${activeEmail.lesson} (+${xpGained} XP)` });
    } else {
      setStreak(0);
      setFeedback({ type: 'error', text: `Failed. ${activeEmail.lesson}` });
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <Zap size={28} fill="currentColor" />
          <span
            style={{
              fontWeight: 900,
              fontSize: "1.5rem",
              letterSpacing: "-1px",
            }}
          >
            SKOPE_Phish
          </span>
        </div>

        <div className="rank-section">
          <div className="rank-label">Investigator ID</div>
          <input
            type="text"
            className="username-input"
            placeholder="Enter Your Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="rank-label">Current Rank</div>
          <h2 className="rank-title">{rank}</h2>

          <div className="xp-bar-container">
            <motion.div
              className="xp-bar-fill"
              animate={{ width: `${getProgressPercentage()}%` }} />
            />
          </div>

          {streak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="streak-badge"
            >
              <Flame size={14} fill="currentColor" />
              <span>{multiplier}X MULTIPLIER</span>
            </motion.div>
          )}
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "10px",
              fontWeight: 800,
            }}
          >
            STREAK: {streak} 🔥 | TOTAL: {xp} XP
          </div>
        </div>

        <button
          onClick={() => setInspectorActive(!inspectorActive)}
          className={`inspector-toggle ${
            inspectorActive ? "toggle-on" : "toggle-off"
          }`}
        >
          <Search size={20} />{" "}
          {inspectorActive ? "INSPECTOR ON" : "ENABLE INSPECTOR"}
        </button>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="sidebar-btn-secondary"
        >
          <Trophy size={16} /> Global Leaderboard
        </button>
      </aside>

      {/* MAIN VIEW */}
      <main
        className="main-view"
        style={{ cursor: inspectorActive ? "none" : "default" }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <header className="header">
          {/* 3. NEW THREAT LEVEL UI */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 900,
                color:
                  currentTier === 1
                    ? "#10b981"
                    : currentTier === 2
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              <ShieldAlert size={16} />
              THREAT LEVEL:{" "}
              {currentTier === 1
                ? "EASY"
                : currentTier === 2
                ? "MEDIUM"
                : "HARD"}
            </div>
            <span>|</span>
            <div>
              Simulation:{" "}
              <strong style={{ color: "#0f172a" }}>{activeEmail.app}</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="btn-base btn-safe"
              onClick={() => handleDecision("SAFE")}
            >
              Mark Safe
            </button>
            <button
              className="btn-base btn-phish"
              onClick={() => handleDecision("PHISH")}
            >
              Report Phish
            </button>
          </div>
        </header>

        <div className="reading-pane">
          <div className="email-paper">
            <h1 style={{ fontSize: "2rem", margin: "0 0 1.5rem 0" }}>
              {activeEmail.subject}
            </h1>
            <div
              style={{
                display: "flex",
                gap: "15px",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>{activeEmail.app} Support</div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: inspectorActive ? "#fef9c3" : "transparent",
                    color: inspectorActive ? "#854d0e" : "#64748b",
                  }}
                >
                  {inspectorActive ? activeEmail.hidden : activeEmail.sender}
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                color: "#334155",
              }}
            >
              {activeEmail.body}
            </p>
          </div>

          {/* INSPECTOR MAGNIFIER */}
          {inspectorActive && (
            <motion.div
              className="magnifier"
              animate={{ x: mousePos.x - 120, y: mousePos.y - 120 }}
              transition={{ type: "tween", duration: 0 }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#854d0e",
                  textTransform: "uppercase",
                }}
              >
                <Search size={24} style={{ marginBottom: "8px" }} />
                <br />
                Analyzing Trace Data...
              </div>
            </motion.div>
          )}
        </div>

        {/* FEEDBACK OVERLAY */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`feedback-banner ${
                feedback.type === "success" ? "bg-success" : "bg-error"
              }`}
            >
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                {feedback.type === "success" ? (
                  <CheckCircle size={40} />
                ) : (
                  <AlertTriangle size={40} />
                )}
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.25rem" }}>
                    {feedback.type === "success"
                      ? "MISSION SUCCESS"
                      : "STREAK BROKEN"}
                  </div>
                  <div style={{ opacity: 0.9 }}>{feedback.text}</div>
                </div>
              </div>
              <button
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  color: "#000",
                  background: "#fff",
                }}
                onClick={() => {
                  setFeedback(null);
                  setChallengesCompleted((prev) => prev + 1); // MOVE TO NEXT FILTERED EMAIL
                }}
              >
                Next Challenge
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* RANK UP OVERLAY */}
      <AnimatePresence>
        {showRankUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rank-up-overlay"
          >
            <motion.div
              style={{
                position: "absolute",
                width: "800px",
                height: "800px",
                background: "rgba(234, 179, 8, 0.15)",
                borderRadius: "50%",
                filter: "blur(100px)",
              }}
              animate={{ scale: [0.8, 1.2], opacity: [0.3, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "reverse",
              }}
            />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                color: "#eab308",
                fontWeight: 900,
                letterSpacing: "8px",
                textTransform: "uppercase",
                marginBottom: "1rem",
                zIndex: 10,
              }}
            >
              Rank Up!!
            </motion.p>
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              }}
              style={{
                color: "#ffffff",
                fontSize: "8rem",
                fontWeight: 900,
                fontStyle: "italic",
                textTransform: "uppercase",
                textShadow:
                  "0 0 50px rgba(234,179,8,0.8), 0 0 10px rgba(255,255,255,0.5)",
                margin: "0 0 3rem 0",
                zIndex: 10,
              }}
            >
              {rank}
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRankUp(false)}
              style={{
                padding: "1rem 3rem",
                background: "#eab308",
                color: "#000",
                border: "none",
                fontWeight: 900,
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 10,
                textTransform: "uppercase",
                letterSpacing: "2px",
                boxShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
              }}
            >
              Level Up!!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL LEADERBOARD MODAL */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="leaderboard-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setShowLeaderboard(false)}
              >
                <X size={24} />
              </button>
              <div className="leaderboard-header">
                <h2 className="leaderboard-title">Apex Protocol</h2>
                <div className="leaderboard-subtitle">
                  Live Global Investigator Rankings
                </div>
              </div>

              <div className="leaderboard-list">
                {dynamicLeaderboard.map((user) => (
                  <motion.div
                    key={user.id}
                    className={`leaderboard-item ${user.isMe ? "is-me" : ""} ${
                      user.rank <= 3 && !user.isMe ? "elite" : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: user.rank * 0.1 }}
                  >
                    <div className={`leaderboard-rank rank-${user.rank}`}>
                      #{user.rank}
                    </div>
                    <div className="leaderboard-name">
                      {user.name} {user.isMe && "(You)"}
                    </div>
                    <div className="leaderboard-stats">
                      <div className="leaderboard-xp">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="leaderboard-acc">{user.acc} Accuracy</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
