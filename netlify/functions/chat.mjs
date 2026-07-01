// netlify/functions/chat.js
//
// Serverless endpoint the React app calls at POST /.netlify/functions/chat
// It keeps GEMINI_API_KEY off the client and grounds answers in the
// FAQ_KNOWLEDGE block below. Edit that block with real, up-to-date info —
// anything marked [VERIFY] should be confirmed against the official school
// portal before you trust it in production.
//
// Uses Google's Gemini API (generativelanguage.googleapis.com), which has a
// genuine no-card free tier — good fit for a demo with no real traffic.

const FAQ_KNOWLEDGE = `
You are the AI help desk for Caleb University (CUL), a private university in
Imota, Lagos State, Nigeria, on the Ikorodu-Itoikin Road. Founded 2007,
academic activities began January 2008. Motto: "For God and Humanity."

ADMISSIONS (ADM-101)
- Entry routes: UTME (JAMB) or Direct Entry.
- Minimum JAMB score: 160 for the 2026/2027 session [VERIFY this each new session — it can change].
- Required documents: JAMB result, WAEC (or equivalent O'Level) result, JAMB
  registration slip, and JAMB admission letter.
- Post-UTME / screening form fee: ₦10,000.
- Current Colleges: COPAS, COLENSMA, COCIS, CASMAS, COCOMAS.
  [VERIFY if the college list changes — universities restructure occasionally.]

FEES & PAYMENTS (FEE-201)
- Acceptance fee: ₦250,000 — one-time, non-refundable, paid after receiving
  an admission offer, separate from tuition.
- Tuition examples (per session): Computer Science ≈ ₦1,200,000;
  Nursing ≈ ₦3,000,000. Other programmes vary by college —
  [VERIFY the exact figure for any programme not listed here before quoting
  a number; otherwise direct the student to the fee portal].
- Hostel fee: ₦200,000 (same rate for new and returning students).
- Payment structure: fees are paid in 2 installments; full payment must be
  completed before resuming for the second semester.
- Student/fees portal: ums.calebuniversity.edu.ng

REGISTRATION (REG-301)
- Course registration opens in the second week of each semester via
  ums.calebuniversity.edu.ng.
- Each department and level has a dedicated Level Adviser who guides
  course registration for students at that level.
- [VERIFY the exact add/drop deadline each semester from the academic calendar.]

EXAMS & RESULTS (EXM-401)
- Grading: a score of 70 and above is an A.
- CGPA classification: First Class is 4.5 and above; Second Class Upper is
  3.5 to 4.48. [VERIFY the remaining class boundaries and the exact CGPA
  threshold for academic probation if a student asks specifically.]
- For a missed exam or any exam-related issue, students should first contact
  their Level Adviser.
- [VERIFY exactly when and where results are published each semester.]

CAMPUS LIFE (GEN-501)
- ID card: students fill in and update their details on the university's ID
  card portal, then use the ID card checker tool to confirm when the card is
  ready for pickup. [VERIFY the exact ID card portal URL if a student asks.]
- [VERIFY the hostel application process and where the academic calendar is published.]

HOW TO ANSWER
- Be concise and direct — 2-5 sentences, no long essays.
- If the honest answer depends on a figure or date marked [VERIFY] above,
  say so plainly and tell the student to confirm on the official Caleb
  University student portal or with the registry/bursary — never invent a
  specific number or date.
- If a question is completely outside Caleb University student matters,
  politely say this desk only covers Caleb University student FAQs.
`

const CATEGORY_KEYWORDS = [
  { code: 'ADM-101', words: ['admission', 'jamb', 'utme', 'direct entry', 'apply', 'cut-off', 'cutoff', 'waec', 'o-level', 'olevel', 'screening'] },
  { code: 'FEE-201', words: ['fee', 'fees', 'pay', 'payment', 'tuition', 'acceptance fee', 'bursary', 'installment', 'ums', 'hostel fee'] },
  { code: 'REG-301', words: ['register', 'registration', 'course form', 'add', 'drop', 'adviser', 'advisor', 'level adviser', 'level advisor'] },
  { code: 'EXM-401', words: ['exam', 'exams', 'result', 'results', 'gpa', 'cgpa', 'probation', 'make-up', 'makeup', 'transcript score', 'grade', 'first class', 'second class'] },
  { code: 'GEN-501', words: ['hostel', 'accommodation', 'id card', 'id card checker', 'calendar', 'campus', 'club', 'transcript', 'shuttle'] },
]

function detectCategory(text) {
  const lower = text.toLowerCase()
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.words.some((w) => lower.includes(w))) return cat.code
  }
  return 'GEN-501'
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'GEMINI_API_KEY is not set. Add it in Netlify → Site settings → Environment variables.',
      }),
    }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const message = (payload.message || '').toString().trim()
  const history = Array.isArray(payload.history) ? payload.history.slice(-8) : []

  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'message is required' }) }
  }

  // Gemini expects history as {role: 'user'|'model', parts: [{text}]} —
  // note it's "model", not "assistant".
  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(h.text || '').slice(0, 2000) }],
    })),
    { role: 'user', parts: [{ text: message.slice(0, 2000) }] },
  ]

  // Gemini occasionally returns 503 "model is overloaded" during demand
  // spikes — this is transient and unrelated to your key/setup. We handle
  // it two ways: (1) retry the same model a couple of times with a short
  // delay, and (2) if it's STILL overloaded, fall back to a second model
  // that usually has separate capacity. Together, a brief spike should be
  // invisible to whoever's watching the demo instead of showing an error.
  const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite']
  const ATTEMPTS_PER_MODEL = 2
  const RETRY_DELAY_MS = 1000

  let lastErrorText = ''

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: FAQ_KNOWLEDGE }] },
              contents,
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 300,
              },
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "I couldn't generate a response — please try again."

          return {
            statusCode: 200,
            body: JSON.stringify({ reply, category: detectCategory(message) }),
          }
        }

        lastErrorText = await response.text()
        console.error(`Gemini error [${model}, attempt ${attempt}/${ATTEMPTS_PER_MODEL}]:`, lastErrorText)

        const isOverloaded = response.status === 503 || lastErrorText.includes('UNAVAILABLE')
        const isQuotaExhausted = response.status === 429 || lastErrorText.includes('RESOURCE_EXHAUSTED')

        if (isOverloaded && attempt < ATTEMPTS_PER_MODEL) {
          // Transient capacity blip — short delay, retry same model.
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
          continue
        }
        if (isQuotaExhausted) {
          // This model's daily/per-minute quota is used up — retrying the
          // same model won't help until it resets. Skip straight to the
          // next model in the fallback chain, which has its own separate
          // quota bucket, instead of wasting attempts here.
          break
        }
        if (!isOverloaded) {
          // Some other non-retryable error (bad key, bad request, etc.) —
          // give up now, no point trying the fallback model for this.
          return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error' }) }
        }
        // Overloaded and out of attempts for this model — fall through to
        // the next model in MODELS (the outer loop), if any remain.
      } catch (err) {
        console.error('Function error:', err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) }
      }
    }
  }

  // Every model in the fallback chain was overloaded or quota-exhausted.
  console.error('All models exhausted/overloaded:', lastErrorText)
  return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error' }) }
}
