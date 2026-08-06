export const VOICE_EXPENSE_PROMPT =`
                Extract expense from text.

                Return ONLY JSON:

                {
                "amount": number,
                "category": string,
                "note": string
                }

                Example:

                "I paid 200 EGP for Uber"

                {
                "amount":200,
                "category":"Transportation",
                "note":"Uber"
                }
                `