export const UserMessages = {
    WELCOME: `
        👋 Welcome to Expense Tracker Bot!

        Track your expenses and income easily.

        To get started, create your account:

        /register

        Need help?
        Use /help
        `,

          WELCOME_BACK: (name: string) => `
        👋 Welcome back, ${name}! 😊

        Manage your expenses and income easily.

        Available commands:

        /profile - View your profile
        /help - Show all commands
        `,

        ALREADY_REGISTERED: `
        ✅ You are already registered.
        Use /profile to view your information.
        `,

        REGISTER_START: `
        👋 Welcome to registration!

        What is your first name?
        `,

        ASK_FIRST_NAME: `
        ✍️ Please enter your first name.
        `,

        ASK_LAST_NAME: `
        Great! 🎉

        Now send me your last name.
        `,

        INVALID_TEXT: `
        ❌ Please send text only.
        `,

        SESSION_EXPIRED: `
        ⌛ Registration session expired.

        Please type /register again.
        `,

        REGISTER_SUCCESS: (fullName: string) => `
        🎉 Registration completed successfully!

        Welcome, ${fullName}! 👋
        `,

        REGISTRATION_IN_PROGRESS: `
        ⚠️ You are already in the registration process.

        Please finish it or use /cancel.
        `,
        PROFILE_NOT_FOUND: `
            ❌ You are not registered.

            Use /register first.
            `,
        USER_NOT_FOUND:`
        ❌ User Not Exists

            Use /register to registration
        `,

          PROFILE: (
              firstName: string,
              lastName: string,
              username?: string,
              currency?: string,
            ) => `👤 <b>Your Profile</b>

              🙍 <b>Name:</b> ${firstName} ${lastName}

              👤 <b>Username:</b> ${username ? '@' + username : '-'}

              💰 <b>Currency:</b> ${currency ?? 'EGP'}`,

          HELP: `
                📚 *Expense Tracker Bot*

                👤 *Account*
                /start              - Start the bot
                /register           - Create your account
                /profile            - View your profile


                💰 *Expenses*
                /add                - Add a new expense
                /expenses           - View all expenses
                /update             - Update an existing expense
                /delete             - Move expense to trash
                /trash              - View deleted expenses
                /restore            - Restore deleted expense
                /hard               - Permanently delete expense


                📂 *Categories*
                /addCategory        - Create category
                /categories         - View categories
                /updateCategory     - Update category
                /deleteCategory     - Delete category
                /categoryTrash      - View deleted categories
                /restoreCategory    - Restore category
                /hardDeleteCategory - Permanently delete category


                📊 *Reports*
                /report             - Detailed expense report
                /stats              - Quick statistics


                💰 *Budget*
                /budget             - View current budget
                /budget 5000        - Set monthly budget


                📄 *Export*
                /export             - Export expenses as CSV
                /export monthly     - Export current month CSV
                /exportPdf          - Export PDF report


                🤖 *AI Features*
                /scan               - Scan receipt using OCR
                /insights           - Smart spending insights
                /forecast           - Monthly spending forecast
                🎤 Voice
                /voice                  Send voice message:
                "Paid 200 EGP for lunch"


                🎛 *Quick Menu Buttons*

                💰 Add Expense
                📷 Scan Receipt
                📊 Report
                📈 Statistics
                🤖 AI Insights
                🔮 Forecast
                📂 Categories
                👤 Profile
                ❓ Help


                ⚙️ *Other*

                /cancel             - Cancel current operation
                `,
        INVALID_FIRST_NAME: `
            ❌ Invalid first name.

            Please enter letters only.
            `,

            INVALID_LAST_NAME: `
            ❌ Invalid last name.

            Please enter letters only.
            `,

};