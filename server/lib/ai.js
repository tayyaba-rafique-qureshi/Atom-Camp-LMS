import { GoogleGenerativeAI } from '@google/generative-ai'

/** Trim and strip accidental quotes from .env (common cause of API_KEY_INVALID) */
function readGeminiKey() {
  return (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '')
}

function readModelName() {
  return (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim()
}

let cachedKey = ''
let cachedModelName = ''
let cachedModel = null

function getModel() {
  const key = readGeminiKey()
  const modelName = readModelName()
  if (!key) {
    throw new Error('GEMINI_API_KEY is missing or empty in server/.env')
  }
  if (cachedKey === key && cachedModelName === modelName && cachedModel) return cachedModel
  cachedKey = key
  cachedModelName = modelName
  cachedModel = new GoogleGenerativeAI(key).getGenerativeModel({
    model: modelName,
  })
  return cachedModel
}

function parseModelJSON(text) {
  let cleaned = String(text)
    .replace(/```json\s*|```/gi, '')
    .trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1)
  }
  return JSON.parse(cleaned)
}

/** Short, safe message for the API client (no huge stack traces) */
function userFacingDetail(msg) {
  const s = String(msg).replace(/\s+/g, ' ').trim()
  if (s.length <= 240) return s
  return `${s.slice(0, 240)}…`
}

export async function callAI(systemPrompt, userMessage) {
  try {
    const model = getModel()
    const result = await model.generateContent(
      `${systemPrompt}\n\nUser: ${userMessage}\n\nRespond with valid JSON only. No markdown. No backticks. No explanation.`
    )
    const response = result.response

    const blockReason = response.promptFeedback?.blockReason
    if (blockReason) {
      throw new Error(
        `Gemini blocked the request (${blockReason}). Try shorter or neutral wording.`
      )
    }

    const cand = response.candidates?.[0]
    if (!cand) {
      throw new Error('Gemini returned no candidates (quota, outage, or policy). Try again in a moment.')
    }

    const fr = cand.finishReason
    const badFinish = ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII']
    if (fr && badFinish.includes(fr)) {
      throw new Error(`Gemini stopped (${fr}). Try neutral wording or try again.`)
    }

    let text
    try {
      text = response.text()
    } catch (e) {
      const em = String(e?.message || e)
      throw new Error(
        em.includes('text') || em.includes('content') || em.includes('candidate')
          ? 'Gemini returned no usable text (often safety filters). Try different wording.'
          : userFacingDetail(em)
      )
    }

    if (!text || !String(text).trim()) {
      throw new Error('Gemini returned an empty response. Try again.')
    }

    try {
      return parseModelJSON(text)
    } catch (parseErr) {
      if (parseErr instanceof SyntaxError) {
        const preview = String(text).slice(0, 160).replace(/\s+/g, ' ')
        throw new Error(`AI JSON parse failed. Start of response: ${preview}${String(text).length > 160 ? '…' : ''}`)
      }
      throw parseErr
    }
  } catch (err) {
    console.error('AI error:', err)
    const msg = String(err?.message || err)

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      throw new Error(
        'Gemini API key rejected by Google. Set GEMINI_API_KEY in server/.env (no quotes), create a key at https://aistudio.google.com/apikey , restart the server.'
      )
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota')) {
      throw new Error('Gemini quota exceeded or rate limited. Wait a bit or check billing in Google AI Studio.')
    }
    if ((msg.includes('404') || msg.includes('not found')) && msg.includes('model')) {
      throw new Error(
        'Gemini model not found. In server/.env set GEMINI_MODEL=gemini-2.0-flash or gemini-1.5-flash and restart.'
      )
    }
    if (msg.includes('JSON parse failed') || msg.includes('invalid JSON') || err instanceof SyntaxError) {
      throw err instanceof SyntaxError
        ? new Error(`AI JSON parse failed: ${userFacingDetail(msg)}`)
        : err
    }
    if (msg.includes('blocked') || msg.includes('no usable text') || msg.includes('no candidates') || msg.includes('empty response')) {
      throw err
    }
    if (msg.includes('Gemini stopped')) {
      throw err
    }
    if (msg.includes('GEMINI_API_KEY')) {
      throw err
    }
    if (msg.includes('quota')) {
      throw err
    }

    if (msg && msg !== 'AI service failed' && !msg.includes('at callAI') && !msg.includes('at process')) {
      throw new Error(`Gemini: ${userFacingDetail(msg)}`)
    }
    throw new Error('AI service failed')
  }
}
