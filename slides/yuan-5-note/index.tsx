import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { MorphElement, Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

import noteFront from './assets/note-front.jpg';
import noteBack from './assets/note-back.jpg';

/* ================= design system ================= */

export const design: DesignSystem = {
  palette: { bg: '#130823', text: '#f4effb', accent: '#a78bfa' },
  fonts: {
    display: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  typeScale: { hero: 168, body: 38 },
  radius: 20,
};

const muted = '#9c8ec2';
const hot = '#e879f9';
const panel = 'rgba(167, 139, 250, 0.08)';
const panelLine = 'rgba(167, 139, 250, 0.22)';
const grad = 'linear-gradient(120deg, #c4b5fd 0%, #e879f9 100%)';

const PAD = 120;

/* ================= transitions ================= */

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// RISE — house transition: quiet 6 px Y-rise, one DNA across the deck.
export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// SETTLE — cover-grade: rise + a hair of blur on enter only.
const settle: SlideTransition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// Morph pair: the back of the note glides from the design page (5) into the
// production page (6). Opacity-only fades keep all motion on the clone.
const MORPH_MS = 760;
const morphCut: SlideTransition = {
  duration: 280,
  exit: { duration: 224, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 308, delay: 112, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

/* ================= shared primitives ================= */

const page: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
};

const Keyframes = () => (
  <style>{`
    @keyframes y5-float { from { transform: translateY(0) } to { transform: translateY(-16px) } }
    @keyframes y5-glow { 0% { opacity: 0.32; transform: scale(1) } 100% { opacity: 0.5; transform: scale(1.15) } }
    @keyframes y5-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
    @keyframes y5-fade { from { opacity: 0 } to { opacity: 1 } }
    @keyframes y5-fadeup { from { opacity: 0; transform: translateY(26px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes y5-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
  `}</style>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        right: PAD,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 19,
        letterSpacing: '0.22em',
        color: muted,
        textTransform: 'uppercase',
      }}
    >
      <span>5&nbsp;¥ · Chinas lila Alltagsnote</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 64,
      fontWeight: 800,
      lineHeight: 1.15,
      margin: 0,
      letterSpacing: '-0.01em',
    }}
  >
    {children}
  </h2>
);

const gradText: CSSProperties = {
  background: grad,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const Glow = ({ left, top, size, color }: { left: number; top: number; size: number; color: string }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: 'blur(130px)',
      pointerEvents: 'none',
    }}
  />
);

// Decorative layer, clipped so glows never bleed past the canvas.
const Backdrop = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>{children}</div>
);

const noteShadow: CSSProperties = {
  borderRadius: 18,
  boxShadow: '0 48px 90px rgba(11, 3, 26, 0.65)',
  border: '1px solid rgba(255, 255, 255, 0.09)',
  display: 'block',
};

/* ================= 01 · Cover ================= */

const Cover: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={{ ...page, display: 'flex', alignItems: 'center' }}>
      <Keyframes />
      <Backdrop>
        <div
          style={{
            position: 'absolute',
            left: -180,
            top: -160,
            width: 820,
            height: 820,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
            filter: 'blur(60px)',
            animation: active ? 'y5-glow 7s ease-in-out infinite alternate' : undefined,
          }}
        />
        <Glow left={1250} top={520} size={720} color="rgba(232,121,249,0.16)" />
      </Backdrop>

      <div style={{ flex: 1, paddingLeft: 160, position: 'relative' }}>
        <Eyebrow>Geld · Geschichte · Gestaltung</Eyebrow>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 272,
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            margin: '20px 0 8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={gradText}>¥5</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.1,
            margin: '0 0 30px',
          }}
        >
          Die lila Alltagsnote
        </div>
        <p style={{ fontSize: 34, lineHeight: 1.55, color: muted, maxWidth: 700, margin: 0 }}>
          Geschichte, Gestaltung und Sicherheit der 5-Yuan-Note — Ausgabe der
          Volksbank Chinas vom 5. November 2020.
        </p>
      </div>

      <div style={{ position: 'relative', paddingRight: 130 }}>
        <div
          style={{
            animation: active ? 'y5-float 5s ease-in-out infinite alternate' : undefined,
          }}
        >
          <img
            src={noteFront}
            alt="5-Yuan-Note 2020, Vorderseite"
            width={700}
            height={326}
            style={{ ...noteShadow, transform: 'rotate(-4deg)' }}
          />
        </div>
      </div>
    </div>
  );
};
Cover.transition = settle;

/* ================= 02 · Agenda ================= */

const AgendaRow = ({
  num,
  title,
  sub,
}: {
  num: string;
  title: string;
  sub: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 44, marginBottom: 30 }}>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 44,
        fontWeight: 800,
        width: 92,
        color: 'var(--osd-accent)',
      }}
    >
      {num}
    </div>
    <div>
      <div style={{ fontSize: 42, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 27, color: muted, marginTop: 6 }}>{sub}</div>
    </div>
  </div>
);

const Agenda: Page = () => (
  <div style={{ ...page, padding: `${PAD}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={1320} top={-220} size={640} color="rgba(139,92,246,0.18)" />
    </Backdrop>
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', gap: 120, position: 'relative' }}>
      <div style={{ flex: '0 0 480px' }}>
        <Eyebrow>Ablauf</Eyebrow>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.08,
            margin: '24px 0 0',
          }}
        >
          Fünf Kapitel,
          <br />
          <span style={gradText}>eine Note.</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Steps>
          <Step>
            <AgendaRow num="01" title="Geschichte" sub="Vom Renminbi 1948 zur Ausgabe am 5. 11. 2020" />
          </Step>
          <Step>
            <AgendaRow num="02" title="Gestaltung &amp; Symbolik" sub="Mao, Narzissenblüte, Taishan" />
          </Step>
          <Step>
            <AgendaRow num="03" title="Sicherheitsmerkmale" sub="Wasserzeichen, Seriennummer &amp; Co." />
          </Step>
          <Step>
            <AgendaRow num="04" title="Wirtschaft &amp; Wert" sub="Wechselkurs zum CHF, Inflation" />
          </Step>
          <Step>
            <AgendaRow num="05" title="Die Note heute" sub="Bargeld im Handy-Zeitalter" />
          </Step>
        </Steps>
      </div>
    </div>
    <Footer />
  </div>
);

/* ================= 03 · Geburt der Note ================= */

const TimelineEvent = ({
  year,
  title,
  text,
  last = false,
}: {
  year: string;
  title: string;
  text: string;
  last?: boolean;
}) => (
  <div style={{ display: 'flex', gap: 36 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--osd-accent)', marginTop: 10 }} />
      {!last && <div style={{ width: 3, flex: 1, background: panelLine, minHeight: 56 }} />}
    </div>
    <div style={{ paddingBottom: last ? 0 : 52 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--osd-accent)', letterSpacing: '0.04em' }}>{year}</div>
      <div style={{ fontSize: 38, fontWeight: 700, margin: '6px 0 10px' }}>{title}</div>
      <div style={{ fontSize: 30, color: muted, lineHeight: 1.45, maxWidth: 800 }}>{text}</div>
    </div>
  </div>
);

const Geburt: Page = () => (
  <div style={{ ...page, padding: `${PAD - 10}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={-220} top={560} size={680} color="rgba(139,92,246,0.16)" />
    </Backdrop>
    <Eyebrow>Geschichte</Eyebrow>
    <Heading>Vom Volksgeld zur lila Note</Heading>
    <div style={{ display: 'flex', gap: 90, marginTop: 56, position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <Steps>
          <Step>
            <TimelineEvent
              year="1948"
              title="Der Renminbi entsteht"
              text="Die erste Serie des „Volksgeldes“ erscheint — der Fünf-Yuan-Schein ist von Anfang an dabei."
            />
          </Step>
          <Step>
            <TimelineEvent
              year="1. Okt 1999"
              title="Fünfte Serie startet"
              text="Zum 50. Geburtstag der Volksrepublik. Der 5er dieser Serie folgt am 18. November 2002."
            />
          </Step>
          <Step>
            <TimelineEvent
              year="5. Nov 2020"
              title="Die neue 5-¥-Note"
              text="Als letzter Wert der 2019er-Generation — mit neuartiger Drucktechnik gegen Fälscher."
              last
            />
          </Step>
        </Steps>
      </div>
      <div style={{ flex: '0 0 620px', display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
        <img src={noteFront} alt="5-Yuan-Note 2020" width={600} height={280} style={noteShadow} />
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              flex: 1,
              background: panel,
              border: `1px solid ${panelLine}`,
              borderRadius: 'var(--osd-radius)',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--osd-accent)' }}>135 × 63 mm</div>
            <div style={{ fontSize: 23, color: muted, marginTop: 4 }}>das kompakte Format</div>
          </div>
          <div
            style={{
              flex: 1,
              background: panel,
              border: `1px solid ${panelLine}`,
              borderRadius: 'var(--osd-radius)',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--osd-accent)' }}>Lila</div>
            <div style={{ fontSize: 23, color: muted, marginTop: 4 }}>die Farbe des 5ers</div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

/* ================= 04 · Die Note, die zuletzt kam ================= */

const StatCard = ({
  value,
  label,
  sub,
  size = 104,
}: {
  value: string;
  label: string;
  sub: string;
  size?: number;
}) => (
  <div
    style={{
      width: 536,
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '44px 40px',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={gradText}>{value}</span>
    </div>
    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 22 }}>{label}</div>
    <div style={{ fontSize: 24, color: muted, marginTop: 8 }}>{sub}</div>
  </div>
);

const Spaet: Page = () => (
  <div style={{ ...page, padding: `${PAD - 10}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={640} top={-260} size={720} color="rgba(232,121,249,0.12)" />
    </Backdrop>
    <Eyebrow>November 2020</Eyebrow>
    <Heading>Die Note, die zuletzt kam</Heading>
    <div style={{ display: 'flex', gap: 36, marginTop: 64, position: 'relative' }}>
      <Steps>
        <Step>
          <StatCard size={68} value="5. Nov 2020" label="Ausgabetag der neuen Note" sub="vorgestellt bereits am 8. Juli 2020" />
        </Step>
        <Step>
          <StatCard size={88} value="14 Monate" label="nach den anderen Werten" sub="¥50, ¥20, ¥10 und ¥1 kamen im August 2019" />
        </Step>
        <Step>
          <StatCard value="Nr. 3" label="Ausgabe der fünften Serie" sub="nach der 1999er- und der 2005er-Auflage" />
        </Step>
      </Steps>
    </div>
    <div style={{ marginTop: 56, fontSize: 27, color: muted, position: 'relative' }}>
      Der Grund für die Pause: Die Volksbank ließ für den 5er neue Druck- und Sicherheitstechniken testen —
      die 1999er-Auflage war wegen hochwertiger Fälschungen bereits 2018 vorgezogen aus dem Verkehr gezogen worden.
    </div>
    <Footer />
  </div>
);

/* ================= 05 · Design & Symbolik ================= */

const DesignCap = ({ title, lines }: { title: string; lines: string }) => (
  <div style={{ marginTop: 24 }}>
    <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--osd-accent)' }}>{title}</div>
    <div style={{ fontSize: 26, color: muted, lineHeight: 1.45, marginTop: 8 }}>{lines}</div>
  </div>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 999,
      padding: '14px 28px',
      fontSize: 24,
      color: 'var(--osd-text)',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Design: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={1200} top={620} size={620} color="rgba(139,92,246,0.15)" />
    </Backdrop>
    <Eyebrow>Gestaltung &amp; Symbolik</Eyebrow>
    <Heading>Mao, Blüte und heiliger Berg</Heading>
    <div style={{ display: 'flex', gap: 56, marginTop: 44, position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <img src={noteFront} alt="Vorderseite: Mao-Porträt und Narzissen" width={720} height={335} style={noteShadow} />
        <DesignCap
          title="Vorderseite — Mao &amp; Narzisse"
          lines="Porträt von Mao Zedong nach Liu Wenxi, umrankt von Narzissen-Blüten (水仙花)."
        />
      </div>
      <div style={{ flex: '0 0 780px' }}>
        <MorphElement id="y5-back">
          <div
            style={{
              background: panel,
              border: `1px solid ${panelLine}`,
              borderRadius: 26,
              padding: 20,
              width: 760,
            }}
          >
            <img src={noteBack} alt="Rückseite: der Berg Taishan" width={720} height={335} style={{ ...noteShadow, borderRadius: 12 }} />
            <div style={{ fontSize: 25, color: muted, marginTop: 16, textAlign: 'center' }}>
              Rückseite — der Berg Taishan (泰山)
            </div>
          </div>
        </MorphElement>
        <div style={{ fontSize: 26, color: muted, lineHeight: 1.45, marginTop: 14, width: 760 }}>
          Der erste der fünf heiligen Berge Chinas — UNESCO-Welterbe, mit der Felsinschrift 五岳独尊.
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 20, marginTop: 44, position: 'relative' }}>
      <Chip>Blüte: Narzisse 水仙花</Chip>
      <Chip>Berg: Taishan 泰山</Chip>
      <Chip>Porträt: Liu Wenxi</Chip>
      <Chip>5 Sprachen + Braille</Chip>
    </div>
    <Footer />
  </div>
);
Design.transition = morphCut;

/* ================= 06 · Farbe & Herstellung ================= */

const ProdRow = ({ title, text }: { title: string; text: string }) => (
  <div style={{ display: 'flex', gap: 28, marginBottom: 34 }}>
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: grad,
        marginTop: 14,
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontSize: 34, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 27, color: muted, lineHeight: 1.45, marginTop: 6, maxWidth: 860 }}>{text}</div>
    </div>
  </div>
);

const EdChip = ({ name, period }: { name: string; period: string }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '18px 26px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 700 }}>{name}</div>
    <div style={{ fontSize: 21, color: muted, marginTop: 4 }}>{period}</div>
  </div>
);

const Herstellung: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={-240} top={-180} size={640} color="rgba(232,121,249,0.12)" />
    </Backdrop>
    <Eyebrow>Farbe, Stil &amp; Herstellung</Eyebrow>
    <Heading>Wie der 5er gemacht ist</Heading>
    <div style={{ display: 'flex', gap: 80, marginTop: 48, position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <ProdRow title="Lila — die Farbe des Alltagscheins" text="Jeder Wert der Serie hat seine Farbe: der 5er leuchtet in Violetttönen." />
        <ProdRow title="Spezialpapier mit Sicherheitsfasern" text="Gelbe und blaue Fasern im Papier — sichtbar unter UV-Licht." />
        <ProdRow title="Stichtiefdruck (Intaglio)" text="Porträt, Blüten und Ziffern sind erhaben — fühlbar mit bloßen Fingern." />
        <ProdRow title="Farbwechsel-Ziffer „5“" text="Neu bei diesem Wert: Kippt man die Note, wechselt die große 5 von Gold zu Grün." />
      </div>
      <div style={{ flex: '0 0 740px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <MorphElement id="y5-back">
          <img src={noteBack} alt="Rückseite der 5-Yuan-Note" width={740} height={345} style={noteShadow} />
        </MorphElement>
        <div>
          <div style={{ fontSize: 24, color: muted, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
            Drei Auflagen der fünften Serie
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <EdChip name="1999er" period="ab Nov 2002" />
            <EdChip name="2005er" period="ab Aug 2005" />
            <EdChip name="2020er" period="ab Nov 2020" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
Herstellung.transition = morphCut;

/* ================= 07 · Sicherheitsmerkmale ================= */

const iconWrap: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 16,
  background: 'rgba(167, 139, 250, 0.14)',
  border: `1px solid ${panelLine}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const IconStroke = '#a78bfa';

const IcoWatermark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M4 18c3-5 7-7.5 11-7.5S23 13 26 18" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 18c3-5 7-7.5 11-7.5" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    <circle cx="24" cy="18" r="6" stroke={IconStroke} strokeWidth="2.5" />
  </svg>
);
const IcoThread = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M18 4v28" stroke={IconStroke} strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />
    <path d="M9 12l4 4M27 12l-4 4M9 26l4-4M27 26l-4-4" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);
const IcoHologram = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M18 4l11 7v14l-11 7L7 25V11z" stroke={IconStroke} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M18 11l5.5 3.5v7L18 25l-5.5-3.5v-7z" stroke={hot} strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);
const IcoTilt = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M5 13h20M25 13l-5-5M25 13l-5 5" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M31 23H11M11 23l5-5M11 23l5 5" stroke={hot} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoRegister = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="16" height="16" rx="3" stroke={IconStroke} strokeWidth="2.5" />
    <rect x="16" y="13" width="16" height="16" rx="3" stroke={hot} strokeWidth="2.5" />
  </svg>
);
const IcoMicro = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M6 10h24" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 17h16" stroke={IconStroke} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 24h8" stroke={IconStroke} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="31" r="1.6" fill={IconStroke} />
  </svg>
);
const IcoUv = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M12 22a7 7 0 1 1 12 0" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 26h8M15 30h6" stroke={IconStroke} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 3v5M6 8l3.5 3.5M30 8l-3.5 3.5" stroke={hot} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const IcoEurion = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="3.2" fill={IconStroke} />
    <circle cx="7" cy="12" r="2.4" fill={IconStroke} />
    <circle cx="29" cy="12" r="2.4" fill={IconStroke} />
    <circle cx="7" cy="25" r="2.4" fill={IconStroke} />
    <circle cx="29" cy="25" r="2.4" fill={IconStroke} />
    <circle cx="18" cy="31" r="2" fill={hot} />
  </svg>
);

const FeatureCard = ({
  icon,
  name,
  hint,
}: {
  icon: ReactNode;
  name: string;
  hint: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 28px',
      marginBottom: 22,
    }}
  >
    <div style={iconWrap}>{icon}</div>
    <div>
      <div style={{ fontSize: 31, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 23, color: muted, marginTop: 5 }}>{hint}</div>
    </div>
  </div>
);

const Sicherheit: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={900} top={700} size={700} color="rgba(139,92,246,0.13)" />
    </Backdrop>
    <Eyebrow>Sicherheitsmerkmale · Überblick</Eyebrow>
    <Heading>Hightech auf kleinem Format</Heading>
    <div style={{ display: 'flex', gap: 44, marginTop: 44, position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <Steps>
          <Step>
            <FeatureCard icon={<IcoWatermark />} name="Wasserzeichen" hint="Narzisse + helle „5“" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoThread />} name="Sicherheitslinie" hint="holografisch, magnetisch, fensterführend" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoTilt />} name="Kippfarbe" hint="die große 5: Gold → Grün" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoHologram />} name="Versteckte Ziffer" hint="„5“ erscheint erst beim Kippen" />
          </Step>
        </Steps>
      </div>
      <div style={{ flex: 1 }}>
        <Steps>
          <Step>
            <FeatureCard icon={<IcoRegister />} name="Braille &amp; Fühlstreifen" hint="ertastbar für Sehbehinderte" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoMicro />} name="Mikroschrift" hint="feinste Schrift im Muster" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoUv />} name="UV-Merkmale" hint="gelbe Ziffer &amp; Fasern leuchten" />
          </Step>
          <Step>
            <FeatureCard icon={<IcoEurion />} name="EURion-Konstellation" hint="Kreis-Schutz gegen Kopierer" />
          </Step>
        </Steps>
      </div>
    </div>
    <Footer />
  </div>
);

/* ================= 08 · Gegen das Licht ================= */

const DetailRow = ({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) => (
  <div
    style={{
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start',
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '30px 36px',
      marginBottom: 26,
    }}
  >
    <div style={iconWrap}>{icon}</div>
    <div>
      <div style={{ fontSize: 34, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 27, color: muted, lineHeight: 1.5, marginTop: 8 }}>{text}</div>
    </div>
  </div>
);

const GegenLicht: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={1120} top={-160} size={640} color="rgba(232,121,249,0.13)" />
    </Backdrop>
    <Eyebrow>Sicherheitsmerkmale · Detail</Eyebrow>
    <Heading>Einfach gegen das Licht halten</Heading>
    <div style={{ display: 'flex', gap: 70, marginTop: 44, alignItems: 'center', position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <DetailRow
          icon={<IcoWatermark />}
          title="Wasserzeichen"
          text="Die Narzissen-Blüte erscheint mehrtonig — daneben die helle „5“ als Weißwasserzeichen."
        />
        <DetailRow
          icon={<IcoThread />}
          title="Sicherheitslinie"
          text="Die fensterführende, holografisch-magnetische Linie trägt das ¥-Zeichen und wechselt die Farbe."
        />
        <DetailRow
          icon={<IcoRegister />}
          title="Ränder im Verbund"
          text="Die Muster an allen vier Rändern setzen sich von Vorder- und Rückseite exakt fort."
        />
      </div>
      <div
        style={{
          flex: '0 0 640px',
          position: 'relative',
          borderRadius: 26,
          padding: 34,
          background: 'radial-gradient(circle at 50% 40%, rgba(196,181,253,0.22), rgba(19,8,35,0) 72%)',
        }}
      >
        <img src={noteFront} alt="Lichttapen-Effekt" width={620} height={289} style={noteShadow} />
        <div style={{ fontSize: 24, color: muted, textAlign: 'center', marginTop: 18, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Auf der Lichttapel zeigen sich alle drei
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

/* ================= 09 · Seriennummer ================= */

const mono = 'ui-monospace, "Cascadia Mono", "SF Mono", Consolas, monospace';

const Bracket = ({ width, label }: { width: number; label: string }) => (
  <div style={{ width, textAlign: 'center' }}>
    <div style={{ borderTop: `3px solid ${panelLine}`, borderRadius: '3px 3px 0 0' }} />
    <div style={{ fontSize: 23, color: muted, marginTop: 10, lineHeight: 1.3 }}>{label}</div>
  </div>
);

const FactChip = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 999,
      padding: '12px 24px',
      fontSize: 24,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Seriennummer: Page = () => (
  <div style={{ ...page, padding: `${PAD - 10}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={-200} top={-220} size={620} color="rgba(139,92,246,0.16)" />
    </Backdrop>
    <Eyebrow>Sicherheitsmerkmale · Seriennummer</Eyebrow>
    <Heading>Jede Note ein Unikat</Heading>

    <div style={{ marginTop: 66, position: 'relative' }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: 'var(--osd-accent)' }}>QC</span>
        <span style={{ color: muted }}>&nbsp;</span>
        <span>48296617</span>
      </div>
      <div style={{ display: 'flex', marginTop: 22, fontFamily: mono }}>
        <Bracket width={132} label="Präfix" />
        <div style={{ width: 66 }} />
        <Bracket width={528} label="fortlaufende Nummer" />
      </div>
    </div>

    <div style={{ display: 'flex', gap: 18, marginTop: 62, flexWrap: 'wrap', position: 'relative' }}>
      <FactChip>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800 }}>Ohne „V“</span>
        <span style={{ color: muted }}> — der Buchstabe kommt nie vor</span>
      </FactChip>
      <FactChip>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800 }}>Zweifarbig</span>
        <span style={{ color: muted }}> — Schwarz + Dunkelrot</span>
      </FactChip>
      <FactChip>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800 }}>8 Ziffern</span>
        <span style={{ color: muted }}> — nach zwei Buchstaben</span>
      </FactChip>
    </div>

    <div style={{ marginTop: 56, fontSize: 27, color: muted, lineHeight: 1.5, maxWidth: 1360, position: 'relative' }}>
      Die Kombination ist einmalig — gestohlene oder gefälschte Serien lassen sich damit genau verfolgen.
      Das Präfix-Kürzel ordnet die Note ihrer Ausgabe zu.
    </div>
    <Footer />
  </div>
);

/* ================= 10 · Was 5 ¥ kaufen ================= */

const StackIcon = ({ bars, color }: { bars: number; color: string }) => (
  <svg width={300} height={160} viewBox="0 0 300 160" fill="none">
    {Array.from({ length: bars }, (_, i) => (
      <rect
        key={i}
        x={26 + (i % 2) * 10}
        y={142 - i * (126 / bars)}
        width={248 - (i % 2) * 10}
        height={Math.max(4, 126 / bars - 4)}
        rx={3}
        fill={color}
        opacity={0.35 + (0.5 * (bars - i)) / bars}
      />
    ))}
  </svg>
);

const BuyCard = ({
  place,
  big,
  unit,
  rows,
  bars,
  color,
}: {
  place: string;
  big: string;
  unit: string;
  rows: string[];
  bars: number;
  color: string;
}) => (
  <div
    style={{
      flex: 1,
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 44px',
    }}
  >
    <div style={{ fontSize: 24, letterSpacing: '0.24em', textTransform: 'uppercase', color: muted }}>{place}</div>
    <StackIcon bars={bars} color={color} />
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 10 }}>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 112,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        <span style={gradText}>{big}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700 }}>{unit}</div>
    </div>
    {rows.map((r) => (
      <div key={r} style={{ fontSize: 27, color: muted, marginTop: 10, lineHeight: 1.4 }}>
        {r}
      </div>
    ))}
  </div>
);

const Kaufkraft: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={760} top={640} size={640} color="rgba(232,121,249,0.12)" />
    </Backdrop>
    <Eyebrow>Wirtschaftliche Bedeutung</Eyebrow>
    <Heading>Was 5 ¥ kaufen</Heading>
    <div style={{ display: 'flex', gap: 40, marginTop: 44, position: 'relative' }}>
      <BuyCard
        place="In China"
        big="5 ¥"
        unit="klein, aber oho"
        bars={6}
        color="#a78bfa"
        rows={['fast eine Schale Nudeln', 'eine U-Bahn-Fahrt', 'zwei, drei Dampfnudeln (Baozi)']}
      /><BuyCard
        place="In der Schweiz"
        big="0,62 CHF"
        unit="Stand heute"
        bars={3}
        color="#e879f9"
        rows={['kaum ein Kaffee zum Mitnehmen', 'gerade mal ein Brötchen']}
      />
    </div>
    <div style={{ marginTop: 44, fontSize: 27, color: muted, position: 'relative' }}>
      Die kleine Note trägt den Alltag: Für Kleinbeträge ist der 5er überall dabei — vom Marktstand
      bis zur U-Bahn. Bei 1,4 Milliarden Menschen summiert sich das.
    </div>
    <Footer />
  </div>
);

/* ================= 11 · Handy-Zeitalter ================= */

const CaseRow = ({
  tag,
  text,
}: {
  tag: string;
  text: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 34px',
      marginBottom: 24,
    }}
  >
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
        whiteSpace: 'nowrap',
      }}
    >
      {tag}
    </div>
    <div style={{ fontSize: 29, lineHeight: 1.4 }}>{text}</div>
  </div>
);

const Handy: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={1240} top={-200} size={660} color="rgba(139,92,246,0.17)" />
    </Backdrop>
    <Eyebrow>Wirtschaftliche Bedeutung · Wandel</Eyebrow>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 80,
        fontWeight: 800,
        lineHeight: 1.16,
        margin: '26px 0 20px',
        maxWidth: 1600,
      }}
    >
      In China zahlt fast jeder per <span style={gradText}>QR-Code</span> —
      <br />
      und trotzdem bleibt die lila Note.
    </div>
    <div style={{ fontSize: 26, color: muted, marginBottom: 44 }}>
      WeChat Pay und Alipay haben den Alltag erobert — Bargeld wird aber nicht abgeschafft.
    </div>
    <div style={{ position: 'relative' }}>
      <Steps>
        <Step>
          <CaseRow tag="QR-Code" text="Der Großteil der Kleinbeträge läuft mobil — vom Supermarkt bis zur Hütte am Straßenrand." />
        </Step>
        <Step>
          <CaseRow tag="Bargeld bleibt" text="Ältere Menschen und ländliche Regionen zahlen weiter mit Noten — der 5er ist ihr Alltagsschein." />
        </Step>
        <Step>
          <CaseRow tag="Roter Umschlag" text="Zum Neujahrsfest stecken Eltern frische Scheine in rote Umschläge (红包) — kleine Werte sind Kult." />
        </Step>
      </Steps>
    </div>
    <Footer />
  </div>
);

/* ================= 12 · Wechselkurs CHF ================= */

const FX: Array<[number, number]> = [
  [2006, 0.1628],
  [2007, 0.1555],
  [2008, 0.1543],
  [2009, 0.1572],
  [2010, 0.1514],
  [2011, 0.1417],
  [2012, 0.1491],
  [2013, 0.1463],
  [2014, 0.1489],
  [2015, 0.1608],
  [2015.6, 0.1553],
  [2016, 0.153],
  [2017, 0.1474],
  [2018, 0.1496],
  [2019, 0.1438],
  [2020, 0.1394],
  [2020.85, 0.1369],
  [2021, 0.136],
  [2022, 0.1437],
  [2022.18, 0.1463],
  [2023, 0.134],
  [2024, 0.1189],
  [2025, 0.1244],
  [2026, 0.1134],
  [2026.72, 0.1234],
];

const FXW = 1660;
const FXH = 540;
const fxX = (yr: number) => 80 + ((yr - 2006) / (2026.72 - 2006)) * (FXW - 130);
const fxY = (r: number) => 26 + ((0.17 - r) / 0.07) * (452 - 26);
const fxPoints = FX.map(([yr, r]) => `${fxX(yr).toFixed(1)},${fxY(r).toFixed(1)}`).join(' ');
const fxArea = `M ${fxX(FX[0][0])},452 L ${fxPoints.split(' ').join(' L ')} L ${fxX(FX[FX.length - 1][0])},452 Z`;

const FxNote = ({ x, y, label, sub, anchor = 'middle' }: { x: number; y: number; label: string; sub?: string; anchor?: 'start' | 'middle' | 'end' }) => (
  <g>
    <circle cx={x} cy={y} r={7} fill="#130823" stroke="#e879f9" strokeWidth={3} />
    <text x={x} y={y - 20} textAnchor={anchor} fontSize={22} fontWeight={700} fill="#f4effb">
      {label}
      {sub ? <tspan fill="#9c8ec2" fontWeight={500}> · {sub}</tspan> : null}
    </text>
  </g>
);

const FxChart = ({ animate }: { animate: boolean }) => (
  <svg width={FXW} height={FXH} viewBox={`0 0 ${FXW} ${FXH}`}>
    <defs>
      <linearGradient id="y5-fxarea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[0.16, 0.14, 0.12].map((g) => (
      <g key={g}>
        <line x1={80} y1={fxY(g)} x2={FXW - 50} y2={fxY(g)} stroke="rgba(156,142,194,0.18)" strokeDasharray="3 7" />
        <text x={62} y={fxY(g) + 8} textAnchor="end" fontSize={20} fill="#9c8ec2">
          {g.toFixed(2).replace('.', ',')}
        </text>
      </g>
    ))}
    {[2006, 2010, 2014, 2018, 2022, 2026].map((yr) => (
      <text key={yr} x={fxX(yr)} y={496} textAnchor="middle" fontSize={20} fill="#9c8ec2">
        {yr}
      </text>
    ))}
    <path d={fxArea} fill="url(#y5-fxarea)" opacity={animate ? undefined : 1} style={animate ? { animation: 'y5-fade 0.8s ease-out 1.1s both' } : undefined} />
    <polyline
      points={fxPoints}
      fill="none"
      stroke="#a78bfa"
      strokeWidth={5}
      strokeLinejoin="round"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      style={animate ? { animation: 'y5-draw 1.6s cubic-bezier(0,0,0.2,1) both' } : undefined}
    />
    <FxNote x={fxX(2006)} y={fxY(0.1628)} label="0,16" sub="2006" anchor="start" />
    <FxNote x={fxX(2020.85)} y={fxY(0.1369)} label="Ausgabe" sub="Nov 2020 · 0,137" />
    <FxNote x={fxX(2026.72)} y={fxY(0.1234)} label="0,123" sub="heute" anchor="end" />
  </svg>
);

const KursChf: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={{ ...page, padding: '90px 110px' }}>
      <Keyframes />
      <Backdrop>
        <Glow left={-220} top={520} size={640} color="rgba(139,92,246,0.15)" />
      </Backdrop>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div>
          <Eyebrow>Wirtschaft &amp; Wert · Wechselkurs</Eyebrow>
          <Heading>Der Franken-Check</Heading>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 68, fontWeight: 900, lineHeight: 1 }}>
            <span style={gradText}>1 ¥ = 0,12 CHF</span>
          </div>
          <div style={{ fontSize: 26, color: muted, marginTop: 10 }}>5 ¥ = 0,62 CHF · Stand Sept 2026</div>
        </div>
      </div>
      <div
        style={{
          background: panel,
          border: `1px solid ${panelLine}`,
          borderRadius: 'var(--osd-radius)',
          padding: '26px 30px 10px',
          marginTop: 34,
          position: 'relative',
        }}
      >
        <FxChart animate={active} />
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 30, position: 'relative' }}>
        <Chip>2006: 1 ¥ = 0,16 CHF</Chip>
        <Chip>Ausgabe Nov 2020: 0,137</Chip>
        <Chip>Heute: 0,123</Chip>
        <Chip>−24 % seit 2006</Chip>
      </div>
      <Footer />
    </div>
  );
};

/* ================= 13 · Inflation ================= */

const INFL: Array<[number, number]> = [
  [2015, 1.4], [2016, 2.0], [2017, 1.6], [2018, 2.1], [2019, 2.9], [2020, 2.4],
  [2021, 1.0], [2022, 2.0], [2023, 0.2], [2024, 0.2], [2025, 0.1],
];

const INFW = 1660;
const INFH = 440;
const infBarW = 84;
const infStep = (INFW - 140) / INFL.length;
const infX = (i: number) => 90 + i * infStep;
const infH = (v: number) => (v / 3.0) * 330;
const infY = (v: number) => 380 - infH(v);

const InflChart = ({ animate }: { animate: boolean }) => (
  <svg width={INFW} height={INFH} viewBox={`0 0 ${INFW} ${INFH}`}>
    <line x1={90} y1={380} x2={INFW - 50} y2={380} stroke="rgba(156,142,194,0.28)" />
    {INFL.map(([yr, v], i) => (
      <rect
        key={yr}
        x={infX(i)}
        y={infY(v)}
        width={infBarW}
        height={infH(v)}
        rx={7}
        fill={yr === 2020 ? '#e879f9' : '#a78bfa'}
        opacity={yr === 2020 ? 1 : 0.66}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'bottom',
          animation: animate ? `y5-grow 0.9s cubic-bezier(0,0,0.2,1) ${i * 0.045}s both` : undefined,
        }}
      />
    ))}
    {[4, 5].map((i) => (
      <text
        key={i}
        x={infX(i) + infBarW / 2}
        y={infY(INFL[i][1]) - 14}
        textAnchor="middle"
        fontSize={24}
        fontWeight={700}
        fill="#f4effb"
      >
        {INFL[i][1].toFixed(1).replace('.', ',')}
      </text>
    ))}
    {INFL.map(([yr], i) => (
      <text key={yr} x={infX(i) + infBarW / 2} y={420} textAnchor="middle" fontSize={20} fill="#9c8ec2">
        {yr}
      </text>
    ))}
  </svg>
);

const Inflation: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={{ ...page, padding: '90px 110px' }}>
      <Keyframes />
      <Backdrop>
        <Glow left={1180} top={620} size={640} color="rgba(232,121,249,0.12)" />
      </Backdrop>
      <Eyebrow>Wirtschaft &amp; Wert · Inflation</Eyebrow>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 74,
          fontWeight: 800,
          lineHeight: 1.12,
          margin: '22px 0 0',
        }}
      >
        Was 2020 <span style={gradText}>5&nbsp;¥</span> kostete, kostet heute{' '}
        <span style={gradText}>≈ 5,18&nbsp;¥</span>
      </div>
      <div
        style={{
          background: panel,
          border: `1px solid ${panelLine}`,
          borderRadius: 'var(--osd-radius)',
          padding: '24px 30px 6px',
          marginTop: 34,
          position: 'relative',
        }}
      >
        <InflChart animate={active} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, position: 'relative' }}>
        <div style={{ fontSize: 24, color: muted }}>Jahresinflation China (VPI) · Quelle: Weltbank</div>
        <Chip>Kaufkraft seit Ausgabe: ≈ −3 %</Chip>
      </div>
      <Footer />
    </div>
  );
};

/* ================= 14 · Die Note heute ================= */

const StatusRow = ({
  dot,
  title,
  text,
}: {
  dot: 'ok' | 'down' | 'star';
  title: string;
  text: string;
}) => {
  const dotColor = dot === 'ok' ? '#4ade80' : dot === 'down' ? '#e879f9' : '#a78bfa';
  return (
    <div
      style={{
        display: 'flex',
        gap: 28,
        alignItems: 'center',
        background: panel,
        border: `1px solid ${panelLine}`,
        borderRadius: 'var(--osd-radius)',
        padding: '24px 32px',
        marginBottom: 22,
      }}
    >
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: 30, fontWeight: 700 }}>{title}</span>
        <span style={{ fontSize: 27, color: muted }}> — {text}</span>
      </div>
    </div>
  );
};

const MiniEvent = ({ year, text, last = false }: { year: string; text: string; last?: boolean }) => (
  <div style={{ display: 'flex', gap: 22 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--osd-accent)', marginTop: 8 }} />
      {!last && <div style={{ width: 2, flex: 1, background: panelLine, minHeight: 34 }} />}
    </div>
    <div style={{ paddingBottom: last ? 0 : 30 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--osd-accent)' }}>{year}</div>
      <div style={{ fontSize: 24, color: muted, marginTop: 4, lineHeight: 1.4 }}>{text}</div>
    </div>
  </div>
);

const Heute: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={-200} top={-200} size={620} color="rgba(139,92,246,0.15)" />
    </Backdrop>
    <Eyebrow>Ausblick</Eyebrow>
    <Heading>Die Note heute</Heading>
    <div style={{ display: 'flex', gap: 80, marginTop: 44, position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <Steps>
          <Step>
            <StatusRow dot="ok" title="Aktuell im Umlauf" text="die 2020er-Ausgabe ist die gültige 5-¥-Note" />
          </Step>
          <Step>
            <StatusRow dot="ok" title="Alte Auflagen bleiben gültig" text="1999er werden seit April 2018 nur entgegengenommen, nie mehr ausgegeben" />
          </Step>
          <Step>
            <StatusRow dot="down" title="Bargeld im Wandel" text="Noten laufen seltener um — bleiben aber auch im QR-Code-Zeitalter gefragt" />
          </Step>
          <Step>
            <StatusRow dot="star" title="„Grandpa Mao“ (毛爷爷)" text="der liebevolle Volksspitzname der ganzen Notenserie" />
          </Step>
        </Steps>
      </div>
      <div style={{ flex: '0 0 460px', paddingTop: 10 }}>
        <MiniEvent year="1999" text="fünfte Serie startet" />
        <MiniEvent year="2002" text="erster 5er der Serie" />
        <MiniEvent year="2005" text="zweite Auflage" />
        <MiniEvent year="5. 11. 2020" text="dritte Auflage — unsere Note" />
        <MiniEvent year="Heute" text="die aktuelle lila 5" last />
      </div>
    </div>
    <Footer />
  </div>
);

/* ================= 15 · Fazit ================= */

const Takeaway = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => (
  <div
    style={{
      flex: 1,
      background: panel,
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 36px',
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--osd-accent)', marginBottom: 14 }}>{title}</div>
    <div style={{ fontSize: 27, lineHeight: 1.5, color: 'var(--osd-text)' }}>{text}</div>
  </div>
);

const Fazit: Page = () => (
  <div style={{ ...page, padding: `${PAD - 20}px ${PAD}px` }}>
    <Keyframes />
    <Backdrop>
      <Glow left={620} top={-240} size={720} color="rgba(232,121,249,0.13)" />
      <Glow left={-220} top={640} size={620} color="rgba(139,92,246,0.15)" />
    </Backdrop>
    <Eyebrow>Fazit</Eyebrow>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 84,
        fontWeight: 800,
        lineHeight: 1.12,
        margin: '24px 0 44px',
      }}
    >
      Danke — <span style={gradText}>Fragen? 谢谢</span>
    </div>
    <div style={{ display: 'flex', gap: 32, position: 'relative' }}>
      <Takeaway
        title="Symbol"
        text="Mao, Narzisse, Taishan — auf kleinstem Format erzählt die Note Chinas Selbstbild."
      />
      <Takeaway
        title="Technik"
        text="Farbwechsel-Ziffer, Narzissen-Wasserzeichen, fühlbare Linien — ein Kleinschein mit Großschein-Schutz."
      />
      <Takeaway
        title="Wert"
        text="0,62 CHF und nur −3 % Kaufkraft seit 2020 — die lila Note ist bemerkenswert stabil."
      />
    </div>
    <div style={{ marginTop: 60, fontSize: 21, color: muted, lineHeight: 1.6, position: 'relative' }}>
      Quellen: Volksbank Chinas (PBOC) · Weltbank (VPI China) · EZB-Referenzkurse CNY/CHF (Stand Sept 2026) ·
      Wikipedia (EN/ZH: „Fifth series of the renminbi“ / 第五套人民币).
      <br />
      Notenabbildungen: Design © PBOC via Wikipedia (zh).
    </div>
    <Footer />
  </div>
);

/* ================= export ================= */

export const meta: SlideMeta = {
  title: 'Die 5-Yuan-Note · Chinas lila Alltagsnote',
  createdAt: '2026-09-25T18:37:40.805Z',
};

export default [
  Cover,
  Agenda,
  Geburt,
  Spaet,
  Design,
  Herstellung,
  Sicherheit,
  GegenLicht,
  Seriennummer,
  Kaufkraft,
  Handy,
  KursChf,
  Inflation,
  Heute,
  Fazit,
] satisfies Page[];
