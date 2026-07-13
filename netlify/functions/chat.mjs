// netlify/functions/chat.mjs
//
// Knowledge base scraped from calebuniversity.edu.ng public pages:
// - /university/
// - /registry/
// - /undergraduate/
// Scraping done via Playwright (headless Chrome) to bypass Cloudflare.
// Source: scraper.py in project root.

const FAQ_KNOWLEDGE = `
You are the AI help desk for Caleb University (CUL), a private university in
Imota, Lagos State, Nigeria. Address: KM 15, Ikorodu-Itoikin Road, Imota, Lagos.
P.M.B. 21238, Ikeja. Phone: 0201-2910684, 0201-2910685, 0201-2910686.
Email: info@calebuniversity.edu.ng. Founded 2007 by Dr. Oladega Adelowo Adebogun.
Academic activities commenced January 2008. Motto: "For God and Humanity."
Ranked among the top 10 most sought-after private universities in Nigeria.
110-hectare permanent campus in Imota (relocated November 2009).

UNIVERSITY OVERVIEW
- Faith-based institution committed to academic excellence, character development,
  and leadership training.
- Board of Trustees Chairman: Prince Abiodun Ogunleye.
- Pro-Chancellor and Chairman of Council: Prof. Sunday Olukayode Ajayi.
- Has produced 15 sets of graduates. Over 30,000 students admitted since 2008.
- Graduates working in the US, Canada, and UK across professional sectors.
- Vision: "Africa's Best Private University in Research and Entrepreneurship Development."

PRINCIPAL OFFICERS (STF-601)
- Vice-Chancellor: Prof. Olalekan Asikhia.
- Deputy Vice-Chancellor (Academic): Prof. Sunday Adewale.
- Deputy Vice-Chancellor (RISA — Research, Innovation, Strategy & Administration): Prof. Adesola Adetutu Ajayi.
- Registrar: Mr. Mayokun Olumeru.
- Bursar: Mr. Adesina Abubakre.
- Acting University Librarian: Mrs. Mercy Ayodele.

REGISTRY TEAM (STF-601)
- Registrar: Mr. Mayokun Olumeru.
- Deputy Registrar (City Campus): Mrs. Oluseye Olukoju.
- Deputy Registrar (Academic Affairs): Mrs. Adewunmi Rabiu.
- Principal Assistant Registrar (HR & Council Affairs): Mr. Adedayo Olawuyi.
- Principal Assistant Registrar (SIWES/JUPEB): Mrs. Helen Ajisafe.
- Principal Assistant Registrar (Establishments): Mrs. Ajoke Nurudeen.
- Senior Assistant Registrar (Exams & Records): Mrs. Oluwadamilare Oyenuga.
- Senior Assistant Registrar (Student Affairs): Mr. Awe Babatunde.
- Senior Assistant Registrar (Academic Planning): Mr. Olumide Otemuyiwa.

REGISTRY CONTACT (STF-601)
- General: 0201-2910686 / info@calebuniversity.edu.ng
- Admissions: admissions@calebuniversity.edu.ng
- Transcripts: transcripts@calebuniversity.edu.ng
- Establishments: establishments@calebuniversity.edu.ng
- Exams & Records: examrecords@calebuniversity.edu.ng
- Office hours: Monday–Friday, 8:00 AM – 4:00 PM.

COMPUTER SCIENCE DEPARTMENT (STF-601)
- Acting Head of Department: Dr. Ayorinde P. Oduroye (assumed role November 2025).
- Prof. Moses Kehinde Aregbesola (also known as Prof. K. Moses Aregbesola):
  Professor in the CS department, expertise in AI, Cloud Computing, Cybersecurity,
  and Software Engineering. Also Dean of COPAS.
- Dean, College of Pure and Applied Sciences (COPAS): Prof. K. Moses Aregbesola.
- Dean, College of Postgraduate Studies (COPOS): Prof. Teju Somorin.

COLLEGES & PROGRAMMES
- COPAS: College of Pure and Applied Sciences — includes Computer Science,
  Biochemistry & Industrial Chemistry, Biological Sciences & Biotechnology,
  Cybersecurity, Software Engineering, Medical Laboratory Science.
- COLENSMA: College of Environmental Sciences and Management — Architecture.
- COCIS: College of Computing and Information Management — Information Management.
- CASMAS: College of Art, Social and Management Sciences — Accounting, Finance &
  Taxation, Business Administration, Economics, Political Science & International
  Relations, Psychology, Mass Communication, Journalism, Film & Media Studies,
  Broadcasting & Media Production, Christian Religious Studies, Criminology.
- COLAW: College of Law — Private and Property Law, Public Law.
- COLED: College of Education — Educational Management.
- CONBMEDS: College of Nursing, Basic and Medical Sciences — Nursing Science,
  Basic Medical Sciences, Allied Health Services.
- COPOS: College of Postgraduate Studies.
- Duration: 4 years for most programmes; 5 years for Law, Engineering,
  Technology, Nursing/Health Sciences, and Environmental Studies.

ADMISSIONS (ADM-101)
- Entry routes: UTME (JAMB) or Direct Entry.
- Minimum JAMB score: 160 (verify each new session).
- O'Level requirement: minimum 5 credit passes including English Language and
  Mathematics, in not more than two sittings (WAEC/NECO/GCE).
- Required documents: JAMB result, WAEC result, JAMB registration slip,
  JAMB admission letter.
- Post-UTME / screening form fee: ₦10,000.
- Transfer candidates and admission deferment are supported subject to
  established procedures and approval.
- Admissions email: admissions@calebuniversity.edu.ng

FEES & PAYMENTS (FEE-201)
- Acceptance fee: ₦250,000 — one-time, non-refundable.
- Tuition examples (per session): Computer Science ≈ ₦1,200,000;
  Nursing ≈ ₦3,000,000. Other programmes vary by college —
  direct students to the fee portal for unlisted programmes.
- Hostel fee: ₦200,000 (same for new and returning students).
- Payment: 2 installments; full payment must be completed before
  second semester resumption.
- Student/fees portal: ums.calebuniversity.edu.ng

REGISTRATION (REG-301)
- Course registration opens second week of each semester via
  ums.calebuniversity.edu.ng.
- Each department and level has a dedicated Level Adviser.
- Registry Academic Affairs Unit: manages admissions, student records,
  course registration, and exam results.
- Transcripts email: transcripts@calebuniversity.edu.ng

EXAMS & RESULTS (EXM-401)
- Grading: 70 and above = A.
- CGPA: First Class = 4.5 and above; Second Class Upper = 3.5 to 4.48.
- Missed exams: contact your Level Adviser for make-up procedures.
- Exams & Records contact: examrecords@calebuniversity.edu.ng

CAMPUS LIFE (GEN-501)
- Fully residential campus — hostels with 4-bed and 6-bed en-suite options.
- Students are NOT permitted to cook in hostels; cafeteria serves meals 24/7.
- Dress code: corporate attire on weekdays; modest native wear on designated days.
  Zero-tolerance policy for indecent dressing.
- Chapel activities held regularly for spiritual and character development.
- Sports arena with full recreational programmes coordinated by the Directorate of Sports.
- ID card: fill details on the ID card portal, use the ID card checker to confirm pickup readiness.
- Academic calendar published by the Registry each session.
- Undergraduate portal: eportal.calebuniversity.net.ng

HOW TO ANSWER
- Be concise and direct — 2-5 sentences maximum.
- All information above was scraped directly from calebuniversity.edu.ng.
- If a specific detail is not listed above, say so plainly and direct the
  student to the official portal (ums.calebuniversity.edu.ng) or the
  relevant registry email address.
- Never invent figures, names, or dates not present in this knowledge base.
- If the question is outside Caleb University student matters, politely
  say this desk only covers Caleb University FAQs.
`

const CATEGORY_KEYWORDS = [
  { code: 'ADM-101', words: ['admission', 'jamb', 'utme', 'direct entry', 'apply', 'cut-off', 'cutoff', 'waec', 'o-level', 'olevel', 'screening', 'transfer', 'defer'] },
  { code: 'FEE-201', words: ['fee', 'fees', 'pay', 'payment', 'tuition', 'acceptance fee', 'bursary', 'installment', 'ums', 'hostel fee'] },
  { code: 'REG-301', words: ['register', 'registration', 'course form', 'add', 'drop', 'adviser', 'advisor', 'level adviser', 'transcript'] },
  { code: 'EXM-401', words: ['exam', 'exams', 'result', 'results', 'gpa', 'cgpa', 'probation', 'make-up', 'makeup', 'grade', 'first class', 'second class'] },
  { code: 'GEN-501', words: ['hostel', 'accommodation', 'id card', 'calendar', 'campus', 'cafeteria', 'chapel', 'sports', 'dress code', 'shuttle'] },
  { code: 'STF-601', words: ['vice chancellor', 'registrar', 'bursar', 'librarian', 'dean', 'hod', 'head of department', 'aregbesola', 'staff', 'dvc', 'oduroye', 'asikhia', 'adewale', 'ajayi', 'olumeru', 'abubakre', 'ayodele', 'somorin', 'who is', 'professor', 'principal officer'] },
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

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(h.text || '').slice(0, 2000) }],
    })),
    { role: 'user', parts: [{ text: message.slice(0, 2000) }] },
  ]

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
              generationConfig: { temperature: 0.4, maxOutputTokens: 350 },
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

        const isOverloaded    = response.status === 503 || lastErrorText.includes('UNAVAILABLE')
        const isQuotaExhausted = response.status === 429 || lastErrorText.includes('RESOURCE_EXHAUSTED')

        if (isOverloaded && attempt < ATTEMPTS_PER_MODEL) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
          continue
        }
        if (isQuotaExhausted) break
        if (!isOverloaded) {
          return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error' }) }
        }
      } catch (err) {
        console.error('Function error:', err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) }
      }
    }
  }

  console.error('All models exhausted/overloaded:', lastErrorText)
  return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error' }) }
}
