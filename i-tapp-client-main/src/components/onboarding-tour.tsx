"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TourRole = "student" | "corps" | "company";

type Step = {
  /** CSS selector for the real element to spotlight. Omit for a centered welcome/finish card. */
  selector?: string;
  title: string;
  description: string;
  /** Fired right before this step is measured/shown (e.g. open a mobile drawer). */
  beforeShow?: () => void;
  /** Fired when leaving this step (e.g. close a mobile drawer). */
  afterHide?: () => void;
};

const STORAGE_PREFIX = "placeit_coachmarks_seen_";
const REPLAY_EVENT = "placeit:replay-tour";
const MOBILE_BREAKPOINT = 768; // Tailwind `md`

function openMobileNav() {
  window.dispatchEvent(new CustomEvent("placeit:mobilenav:open"));
}
function closeMobileNav() {
  window.dispatchEvent(new CustomEvent("placeit:mobilenav:close"));
}
function openCompanySidenav() {
  window.dispatchEvent(new CustomEvent("placeit:sidenav:open"));
}
function closeCompanySidenav() {
  window.dispatchEvent(new CustomEvent("placeit:sidenav:close"));
}

/** Call this from anywhere (e.g. a "Replay tutorial" button) to re-run a role's tour on demand. */
export function replayOnboardingTour(role: TourRole) {
  window.dispatchEvent(new CustomEvent(REPLAY_EVENT, { detail: { role } }));
}

function getSteps(role: TourRole, isMobile: boolean): Step[] {
  const welcome: Record<TourRole, Step> = {
    student: {
      title: "Welcome to PlaceIT 🎯",
      description:
        "Nigeria's placement marketplace — let's take a quick 60-second look at where everything lives.",
    },
    corps: {
      title: "Welcome to PlaceIT 🎯",
      description:
        "Let's take a quick 60-second look at how to find and manage your PPA.",
    },
    company: {
      title: "Welcome to PlaceIT 🚀",
      description:
        "Let's take a quick 60-second look at how to post roles and manage applicants.",
    },
  };

  const finish: Record<TourRole, Step> = {
    student: {
      title: "You're all set! 🎉",
      description:
        "Start by browsing opportunities or completing your profile to improve your chances of getting shortlisted.",
    },
    corps: {
      title: "You're all set! 🎉",
      description: "Start browsing PPAs, or complete your profile first to stand out to companies.",
    },
    company: {
      title: "Ready to go! 🚀",
      description:
        "Complete your company profile to build trust with students, then post your first opportunity.",
    },
  };

  if (role === "student" || role === "corps") {
    const desktopNavSteps: Step[] =
      role === "student"
        ? [
            {
              selector: '[data-tour="nav-find-it-space"]',
              title: "Find IT Space",
              description: "Browse verified industrial training opportunities from Nigerian companies.",
            },
            {
              selector: '[data-tour="nav-my-it-space"]',
              title: "My IT Space",
              description: "Once you're placed, manage your ongoing IT space from here.",
            },
            {
              selector: '[data-tour="nav-my-application"]',
              title: "Track Applications",
              description: "See the status of every application you've submitted, in real time.",
            },
            {
              selector: '[data-tour="nav-saved-applications"]',
              title: "Saved Applications",
              description: "Bookmark opportunities you're interested in and revisit them anytime.",
            },
          ]
        : [
            {
              selector: '[data-tour="nav-find-ppa"]',
              title: "Find PPA",
              description: "Browse verified Places of Primary Assignment for your service year.",
            },
            {
              selector: '[data-tour="nav-my-ppa-space"]',
              title: "My PPA Space",
              description: "Once you're placed, manage your ongoing PPA from here.",
            },
            {
              selector: '[data-tour="nav-my-applications"]',
              title: "Track Applications",
              description: "See the status of every application you've submitted, in real time.",
            },
            {
              selector: '[data-tour="nav-saved-ppa"]',
              title: "Saved",
              description: "Bookmark PPAs you're interested in and revisit them anytime.",
            },
          ];

    const desktopExtras: Step[] = [
      {
        selector: '[data-tour="notifications"]',
        title: "Notifications",
        description: "You'll be notified here the moment a company responds to your application.",
      },
      {
        selector: '[data-tour="avatar-menu"]',
        title: "Your Profile",
        description: "Keep your profile updated — companies review it before shortlisting anyone.",
      },
    ];

    if (!isMobile) {
      return [
        welcome[role],
        { selector: '[data-tour="logo"]', title: "Your Dashboard", description: "This is your PlaceIT home base — you can always get back here from the logo." },
        ...desktopNavSteps,
        ...desktopExtras,
        finish[role],
      ];
    }

    // Mobile: everything lives behind the hamburger menu.
    const mobileNavSteps: Step[] =
      role === "student"
        ? [
            { selector: '[data-tour="mnav-find-it-space"]', title: "Find IT Space", description: "Browse verified industrial training opportunities from Nigerian companies." },
            { selector: '[data-tour="mnav-my-it-space"]', title: "My IT Space", description: "Once you're placed, manage your ongoing IT space from here." },
            { selector: '[data-tour="mnav-my-application"]', title: "Track Applications", description: "See the status of every application you've submitted, in real time." },
            { selector: '[data-tour="mnav-saved-applications"]', title: "Saved Applications", description: "Bookmark opportunities you're interested in and revisit them anytime." },
          ]
        : [
            { selector: '[data-tour="mnav-find-ppa"]', title: "Find PPA", description: "Browse verified Places of Primary Assignment for your service year." },
            { selector: '[data-tour="mnav-my-ppa-space"]', title: "My PPA Space", description: "Once you're placed, manage your ongoing PPA from here." },
            { selector: '[data-tour="mnav-my-applications"]', title: "Track Applications", description: "See the status of every application you've submitted, in real time." },
            { selector: '[data-tour="mnav-saved-ppa"]', title: "Saved", description: "Bookmark PPAs you're interested in and revisit them anytime." },
          ];

    return [
      welcome[role],
      {
        selector: '[data-tour="hamburger-trigger"]',
        title: "Your Menu",
        description: "Tap here anytime to reach every section of the app.",
        beforeShow: closeMobileNav,
      },
      {
        selector: '[data-tour="mnav-profile"]',
        title: "Your Profile",
        description: "Keep your profile updated — companies review it before shortlisting anyone.",
        beforeShow: openMobileNav,
      },
      ...mobileNavSteps.map((s, i) => ({ ...s, beforeShow: i === 0 ? openMobileNav : undefined })),
      { ...finish[role], beforeShow: closeMobileNav },
    ];
  }

  // company
  if (!isMobile) {
    return [
      welcome.company,
      { selector: '[data-tour="logo"]', title: "Your Dashboard", description: "This is your PlaceIT home base — you can always get back here from the logo." },
      { selector: '[data-tour="nav-dashboard"]', title: "Dashboard", description: "Get an overview of your listings and applicants at a glance." },
      { selector: '[data-tour="nav-opportunities"]', title: "Post Opportunities", description: "Create and manage your placement listings — set requirements, duration, and stipend." },
      { selector: '[data-tour="avatar-menu"]', title: "Your Profile", description: "Complete your company profile to build trust with students." },
      finish.company,
    ];
  }

  return [
    welcome.company,
    {
      selector: '[data-tour="nav-dashboard"]',
      title: "Dashboard",
      description: "Get an overview of your listings and applicants at a glance.",
      beforeShow: openCompanySidenav,
    },
    {
      selector: '[data-tour="nav-opportunities"]',
      title: "Post Opportunities",
      description: "Create and manage your placement listings — set requirements, duration, and stipend.",
    },
    {
      selector: '[data-tour="avatar-menu"]',
      title: "Your Profile",
      description: "Complete your company profile to build trust with students.",
      beforeShow: closeCompanySidenav,
    },
    finish.company,
  ];
}

type Rect = { top: number; left: number; width: number; height: number };

export function OnboardingTour({
  role,
  blocked = false,
}: {
  role: TourRole;
  /** While true, the tour won't auto-start (e.g. a higher-priority modal is still open). */
  blocked?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const stepsRef = useRef<Step[]>([]);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const storageKey = STORAGE_PREFIX + role;

  useEffect(() => setMounted(true), []);

  const buildSteps = useCallback(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    stepsRef.current = getSteps(role, isMobile);
  }, [role]);

  const measure = useCallback(() => {
    const s = stepsRef.current[step];
    if (!s?.selector) {
      setRect(null);
      return;
    }
    const el = document.querySelector(s.selector);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  const start = useCallback(() => {
    buildSteps();
    setStep(0);
    setVisible(true);
  }, [buildSteps]);

  // Auto-trigger for first-time visitors. Waits for `blocked` to clear (e.g. a
  // pending-review modal closing) before starting, and re-arms once it does.
  useEffect(() => {
    if (!mounted) return;
    if (blocked) return;
    if (localStorage.getItem(storageKey)) return;
    const t = setTimeout(start, 700);
    return () => clearTimeout(t);
  }, [mounted, blocked, storageKey, start]);

  // Manual replay trigger (from a "Replay tutorial" button elsewhere).
  useEffect(() => {
    function onReplay(e: Event) {
      const detail = (e as CustomEvent).detail as { role: TourRole };
      if (detail?.role === role) start();
    }
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_EVENT, onReplay);
  }, [role, start]);

  // Run beforeShow, then measure. Drawer/sidenav opens animate over ~500ms,
  // so we wait for that to finish before measuring, then re-check shortly
  // after as a safety net against any late layout shift.
  useEffect(() => {
    if (!visible) return;
    stepsRef.current[step]?.beforeShow?.();
    const hasDrawerTransition = Boolean(stepsRef.current[step]?.beforeShow);
    const delay = hasDrawerTransition ? 560 : 60;
    const t1 = setTimeout(measure, delay);
    const t2 = setTimeout(measure, delay + 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, step, measure]);

  // Keep spotlight glued to the target on resize/scroll.
  useEffect(() => {
    if (!visible) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [visible, measure]);

  // A mobile-drawer step opens a Radix Sheet, which (as a modal dialog) marks every
  // OTHER top-level element on the page — including this tour's own portal, since it's
  // a separate root appended to document.body — as aria-hidden/inert while it's open.
  // That makes our Next/Back/Skip buttons invisible to accessibility tooling and, in
  // some browsers, unclickable. Actively strip that back off for as long as the tour
  // itself is visible, since the tour should always stay interactive regardless of
  // what else on the page is (or isn't) currently modal.
  useEffect(() => {
    if (!visible) return;
    const node = portalRef.current;
    if (!node) return;

    const clean = () => {
      if (node.hasAttribute("aria-hidden")) node.removeAttribute("aria-hidden");
      if (node.hasAttribute("data-aria-hidden")) node.removeAttribute("data-aria-hidden");
      if (node.style.pointerEvents !== "auto") node.style.pointerEvents = "auto";
    };
    clean();

    const observer = new MutationObserver(clean);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["aria-hidden", "data-aria-hidden", "style"],
    });
    return () => observer.disconnect();
  }, [visible]);

  const finish = useCallback(() => {
    stepsRef.current[step]?.afterHide?.();
    closeMobileNav();
    closeCompanySidenav();
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }, [step, storageKey]);

  const next = useCallback(() => {
    const isLast = step === stepsRef.current.length - 1;
    stepsRef.current[step]?.afterHide?.();
    if (isLast) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }, [step, finish]);

  const prev = useCallback(() => {
    if (step === 0) return;
    stepsRef.current[step]?.afterHide?.();
    setStep((s) => Math.max(0, s - 1));
  }, [step]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!visible) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, next, prev, finish]);

  if (!mounted || !visible) return null;

  const steps = stepsRef.current;
  const total = steps.length;
  const current = steps[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;
  const PADDING = 8;

  // Tooltip placement: below the target if there's room, else above; centered if no target (welcome/finish).
  let tooltipStyle: CSSProperties = {
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  };
  if (rect) {
    const spaceBelow = window.innerHeight - (rect.top + rect.height);
    const placeBelow = spaceBelow > 220 || rect.top < 220;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, 170),
      window.innerWidth - 170,
    );
    tooltipStyle = placeBelow
      ? { position: "fixed", left, top: rect.top + rect.height + PADDING + 12, transform: "translateX(-50%)" }
      : { position: "fixed", left, top: rect.top - PADDING - 12, transform: "translate(-50%, -100%)" };
  }

  return createPortal(
    <div ref={portalRef} className="fixed inset-0 z-[999]" style={{ pointerEvents: "auto" }}>
      {/* Dimmed backdrop with a spotlight cutout over the target */}
      <div
        className="absolute inset-0 transition-all duration-200"
        style={
          rect
            ? {
                position: "fixed",
                top: rect.top - PADDING,
                left: rect.left - PADDING,
                width: rect.width + PADDING * 2,
                height: rect.height + PADDING * 2,
                borderRadius: 12,
                boxShadow: "0 0 0 9999px rgba(15, 15, 20, 0.65)",
                pointerEvents: "none",
              }
            : {
                background: "rgba(15, 15, 20, 0.65)",
              }
        }
      />
      {/* Click-catcher so background isn't interactive while touring (skip button still works) */}
      <div className="absolute inset-0" onClick={finish} />

      {/* Pulsing ring around the target */}
      {rect && (
        <div
          className="fixed rounded-xl border-2 border-primary pointer-events-none animate-pulse"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
          }}
        />
      )}

      {/* Tooltip / welcome card */}
      <div
        style={tooltipStyle}
        className="w-[280px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={finish}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-400 hover:text-gray-600"
          aria-label="Skip tour"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-5 bg-primary" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">{current.title}</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{current.description}</p>
        </div>

        <div className="flex items-center justify-between mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={isFirst}
            className="gap-1 text-gray-400 disabled:opacity-0 h-8 px-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={next}
            className="gap-1 bg-primary text-white hover:bg-primary/90 h-8 px-3 text-xs font-semibold"
          >
            {isLast ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
