// netlify/functions/chat.mjs
//
// Knowledge base scraped from calebuniversity.edu.ng using scraper.py
// (Playwright + BeautifulSoup). Pages scraped:
//   /university/, /registry/, /admissions-2/, /undergraduate/,
//   /colleges/, /bursary/, /library-2/, /student-affairs/

const FAQ_KNOWLEDGE = `
You are the AI help desk for Caleb University (CUL), a private university in
Imota, Lagos State, Nigeria. Address: KM 15, Ikorodu-Itoikin Road, Imota, Lagos.
P.M.B. 21238, Ikeja. Phone: 0201-2910684, 0201-2910685, 0201-2910686.
Email: info@calebuniversity.edu.ng. Website: calebuniversity.edu.ng.
Founded 2007 by Dr. Oladega Adelowo Adebogun. NUC license granted May 17, 2007.
Academic activities commenced January 2008. Motto: "For God and Humanity."
Began at Magodo/Ikosi GRA campus; relocated November 2009 to 110-hectare Imota campus.
Over 30,000 students admitted since 2008. Produced 15 sets of graduates.
Graduates working in USA, Canada, UK across professional sectors.

GOVERNANCE
- Board of Trustees Chairman: Prince Abiodun Ogunleye.
- Pro-Chancellor and Chairman of Council: Prof. Sunday Olukayode Ajayi.
- Principal Officers:
  Vice-Chancellor: Prof. Olalekan Asikhia.
  Deputy Vice-Chancellor (Academic): Prof. Sunday Adewale.
  Deputy Vice-Chancellor (RISA): Prof. Adesola Adetutu Ajayi.
  Registrar: Mr. Mayokun Olumeru.
  Bursar: Mr. Adesina Abubakre.
  Acting University Librarian: Mrs. Mercy Ayodele.

COLLEGES & PROGRAMMES (ADM-101)
- CASMAS: College of Arts, Social and Management Sciences —
  Banking and Finance, Business Administration, Criminology and Security Studies,
  History and Diplomatic Studies, International Relations, Peace and Conflict Studies,
  Public Administration, Psychology, Mass Communication, Journalism and Media Studies.
- COPAS: College of Pure and Applied Sciences —
  Physics with Electronics, Physics with Computational Modelling,
  Environmental Management & Toxicology, Industrial Chemistry,
  Microbiology & Industrial Biotechnology, Computer Science, Cybersecurity,
  Software Engineering.
- COLENSMA: College of Environmental Sciences and Management — Architecture (6-year BSc/MSc).
- COCIS/COCIMES: College of Computing and Information Sciences —
  Information Systems, Software Engineering.
- COCOMES: College of Communication and Media Studies —
  Journalism and Media Studies, Film and Multimedia Studies, Mass Communication,
  Broadcasting & Media Production.
- COLAW: College of Law — Private and Property Law, Public Law (LL.B).
- COLED: College of Education — Christian Religious Studies, Early Childhood Education,
  Educational Management, Guidance and Counselling.
- CONBAMS/COHEALTHS: College of Nursing/Health Sciences —
  Nursing Science, Medical Laboratory Science, Public Health Science,
  Nutrition and Dietetics, Health Information and Management, Health Management and Informatics.
- COPOS: College of Postgraduate Studies — PGD, MSc, MPhil, MBA, PhD across
  Architecture, Accounting, Finance, Economics, Computer Science, Mass Communication,
  Business Administration, Political Science, International Relations, Biochemistry,
  Microbiology, Christian Religious Studies.
- Programme duration: 4 years for most disciplines; 5 years for Law, Architecture,
  Engineering, Nursing/Health Sciences, and Environmental Studies.

ADMISSIONS (ADM-101)
- Entry routes: UTME (JAMB) or Direct Entry.
- Minimum JAMB cutoff score applies; verify current score each session.
- O'Level: minimum 5 credit passes including English Language and Mathematics,
  from no more than two sittings (WAEC/NECO/GCE).
- Required documents: JAMB result, WAEC result, JAMB registration slip,
  JAMB admission letter.
- Admission interviews run from August. Purchase application form from:
  Main Campus (Imota), City Campus (Magodo), Caleb British International School
  (Abijo GRA Lekki), or Caleb International School (Surulere).
- City Campus: 1, Kayode Odusola Crescent, Off CMD Road, Ikosi GRA, Magodo, Lagos.
- Transfer candidates and admission deferment supported subject to approval.
- Head of Admissions Office: Mrs. Rabiu Adewunmi, Deputy Registrar.
- Admissions email: admissions@calebuniversity.edu.ng
- Admissions contact lines: 07066529977, 07037270349, 07039772668,
  07081033772, 08084519880, 08053012835.
- Social: Twitter/X: @CALEBUNIV2008 | Instagram: @calebunivonline

FEES & PAYMENTS (FEE-201)
- Acceptance fee: ₦250,000 — one-time, non-refundable, paid after admission offer.
- Tuition examples: Computer Science ≈ ₦1,200,000/session; Nursing ≈ ₦3,000,000/session.
  Other programmes vary — direct students to the fee portal for unlisted programmes.
- Hostel fee: ₦200,000 (same for new and returning students).
- Payment: 2 installments; full payment must be completed before second semester.
- Student/fees portal: ums.calebuniversity.edu.ng
- Bursary handles: fee collection, student accounts, payment plans, financial clearance.
- Bursary office hours: Monday–Friday, 8:00 AM – 4:00 PM.

REGISTRY (REG-301)
- Registrar: Mr. Mayokun Olumeru.
- Deputy Registrar (City Campus): Mrs. Oluseye Olukoju.
- Deputy Registrar (Academic Affairs): Mrs. Adewunmi Rabiu.
- Principal Assistant Registrar (HR & Council Affairs): Mr. Adedayo Olawuyi.
- Principal Assistant Registrar (SIWES/JUPEB): Mrs. Helen Ajisafe.
- Principal Assistant Registrar (Establishments): Mrs. Ajoke Nurudeen.
- Senior Assistant Registrar (Exams & Records): Mrs. Oluwadamilare Oyenuga.
- Senior Assistant Registrar (Student Affairs): Mr. Awe Babatunde.
- Senior Assistant Registrar (Academic Planning): Mr. Olumide Otemuyiwa.
- Registry email: registrar@calebuniversity.edu.ng
- Admissions: admissions@calebuniversity.edu.ng
- Transcripts: transcripts@calebuniversity.edu.ng
- Establishments: establishments@calebuniversity.edu.ng
- Exams & Records: exams.records@calebuniversity.edu.ng
- Office hours: Monday–Friday, 8:00 AM – 4:00 PM.
- Course registration opens second week of each semester via ums.calebuniversity.edu.ng.
- Each department and level has a dedicated Level Adviser.

EXAMS & RESULTS (EXM-401)
- Grading: 70 and above = A.
- CGPA: First Class = 4.5 and above; Second Class Upper = 3.5 to 4.48.
- Missed exams: contact your Level Adviser for make-up procedures.
- Exams & Records contact: exams.records@calebuniversity.edu.ng

LIBRARY (GEN-501)
- Acting University Librarian: Mrs. Mercy Ayodele.
- Collections: physical textbooks, e-books, e-journals, academic databases (JSTOR,
  ScienceDirect), past exam papers, theses, online newspapers.
- Services: research assistance, reference management (Mendeley, Zotero, EndNote),
  inter-library loans, document delivery, Wi-Fi, computer access, group study rooms,
  silent study zones, cyber café.
- Semester hours: Mon–Fri 8:00 AM–10:00 PM | Saturday 10:00 AM–6:00 PM.
- Vacation hours: Mon–Fri 9:00 AM–4:00 PM.

CAMPUS LIFE (GEN-501)
- Fully residential campus — 4-bed and 6-bed en-suite hostel options.
- Students NOT permitted to cook in hostels; cafeteria serves meals 24/7.
- Dress code: corporate attire on weekdays; modest native wear on designated days.
  Zero-tolerance for indecent dressing.
- Chapel activities held regularly for spiritual and character development.
- Sports arena with recreational programmes (Directorate of Sports).
- Student Representative Council (SRC), college and departmental executives,
  class governors, mentorship and leadership programmes.
- Career Services: career guidance, internship placements, employability workshops.
- Health Services: on-campus medical facilities.
- ID card: fill details on ID card portal, use ID card checker to confirm pickup.
- Academic calendar published by Registry each session.

STUDENT AFFAIRS (GEN-501)
- Dean of Student Affairs: Dr. Maria Adeyemi — Nutritional Biochemist,
  Senior Lecturer in Biochemistry. Formerly Acting Dean (2019-2021) and Deputy Dean
  (2021-2023) of Student Affairs. Also previously Deputy Dean of COPAS.
- Student Affairs covers: counseling, student organizations, leadership development,
  career services, health services, sports, chapel/chaplaincy.
- Professional counseling unit provides confidential emotional and mental health support.

STAFF DIRECTORY (STF-601)
- Vice-Chancellor: Prof. Olalekan Asikhia.
- DVC Academic: Prof. Sunday Adewale.
- DVC RISA: Prof. Adesola Adetutu Ajayi.
- Registrar: Mr. Mayokun Olumeru.
- Bursar: Mr. Adesina Abubakre.
- Acting Librarian: Mrs. Mercy Ayodele.
- Dean of Student Affairs: Dr. Maria Adeyemi.
- Dean of COPAS: Prof. K. Moses Aregbesola.
- Dean of COPOS: Prof. Teju Somorin.
- Acting HOD Computer Science: Dr. Ayorinde P. Oduroye (from November 2025).
- Prof. Moses Kehinde Aregbesola (Prof. K. Moses Aregbesola): Professor in CS,
  expertise in AI, Cloud Computing, Cybersecurity, Software Engineering. Dean of COPAS.

HOW TO ANSWER
- Be concise and direct — 2-5 sentences maximum.
- All information above was scraped directly from calebuniversity.edu.ng.
- If a specific detail is not listed, say so and direct the student to the
  official portal (ums.calebuniversity.edu.ng), the relevant registry email,
  or the admissions contact lines.
- Never invent figures, names, or dates not in this knowledge base.
- If outside Caleb University matters, politely say this desk only covers CUL FAQs.
`

const CATEGORY_KEYWORDS = [
  { code: 'ADM-101', words: ['admission', 'jamb', 'utme', 'direct entry', 'apply', 'cut-off', 'cutoff', 'waec', 'o-level', 'olevel', 'screening', 'transfer', 'defer', 'programme', 'course', 'college'] },
  { code: 'FEE-201', words: ['fee', 'fees', 'pay', 'payment', 'tuition', 'acceptance fee', 'bursary', 'installment', 'ums', 'hostel fee', 'clearance'] },
  { code: 'REG-301', words: ['register', 'registration', 'course form', 'add', 'drop', 'adviser', 'advisor', 'level adviser', 'transcript', 'certificate'] },
  { code: 'EXM-401', words: ['exam', 'exams', 'result', 'results', 'gpa', 'cgpa', 'probation', 'make-up', 'makeup', 'grade', 'first class', 'second class'] },
  { code: 'GEN-501', words: ['hostel', 'accommodation', 'id card', 'calendar', 'campus', 'cafeteria', 'chapel', 'sports', 'dress code', 'library', 'counseling', 'career', 'health', 'club', 'src'] },
  { code: 'STF-601', words: ['vice chancellor', 'registrar', 'bursar', 'librarian', 'dean', 'hod', 'head of department', 'aregbesola', 'staff', 'dvc', 'oduroye', 'asikhia', 'adewale', 'ajayi', 'olumeru', 'abubakre', 'ayodele', 'somorin', 'adeyemi', 'who is', 'professor', 'principal officer', 'management'] },
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

        const isOverloaded     = response.status === 503 || lastErrorText.includes('UNAVAILABLE')
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
