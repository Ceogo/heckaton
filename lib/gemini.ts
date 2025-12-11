"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface RequestData {
  title?: string
  description?: string
  category?: string
  address?: string
  coordinates?: [number, number]
}

interface GeminiResponse {
  message: string
  requestData?: Partial<RequestData>
  isComplete?: boolean
}

export async function chatWithGemini(conversationHistory: string, currentData: RequestData): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Ты - помощник для подачи заявок в КСК (кооператив собственников квартир).
Твоя задача - собрать информацию о проблеме жильца и помочь сформировать заявку.

ВАЖНО: Всегда включай ТОЛЬКО СОБРАННЫЕ И ВАЛИДНЫЕ данные в requestData. Не включай null значения.

Текущие данные заявки:
${JSON.stringify(currentData, null, 2)}

История разговора:
${conversationHistory}

Твои действия в порядке приоритета:
1. Определи категорию проблемы (emergency, cleaning, lighting, lift, heating, repair, parking, playground, noise, other)
2. Получи описание проблемы (минимум 20 символов)
3. Получи адрес или попроси указать местоположение на карте (нажми кнопку с иконкой маркера)
4. Сформируй краткий заголовок заявки (до 50 символов)

Инструкции:
- Ответь на русском языке, дружелюбно и кратко
- Задавай по одному вопросу за раз
- Если данные уже есть в currentData, не переспрашивай
- ОБЯЗАТЕЛЬНО требуй выбор местоположения на карте через кнопку с маркером
- Заявка НЕ может быть завершена без координат и адреса (от выбора на карте)
- Если все обязательные поля заполнены (категория, описание, адрес И координаты), установи isComplete: true
- ТОЛЬКО для валидных данных включай их в requestData объект

Формат ответа (СТРОГИЙ JSON):
{
  "message": "твой ответ пользователю",
  "requestData": {
    "title": "краткий заголовок если есть",
    "description": "описание если есть",
    "category": "категория если определена",
    "address": "адрес если указан"
  },
  "isComplete": true/false
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    try {
      let jsonText = response.trim()
      // Remove markdown code blocks if present
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      }
      const parsed = JSON.parse(jsonText)
      // Clean up null values from requestData
      if (parsed.requestData) {
        Object.keys(parsed.requestData).forEach(key => {
          if (parsed.requestData[key] === null || parsed.requestData[key] === undefined) {
            delete parsed.requestData[key]
          }
        })
      }
      return parsed as GeminiResponse
    } catch {
      return {
        message: response,
        requestData: {},
        isComplete: false,
      }
    }
  } catch (error) {
    console.error("[v0] Gemini API Error:", error)
    return {
      message: "К сожалению, я временно недоступен. Пожалуйста, заполните заявку вручную.",
      requestData: {},
      isComplete: false,
    }
  }
}
