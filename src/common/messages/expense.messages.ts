export const EXPENSE_MESSAGES = {
     ASK_AMOUNT: `
  💰 Enter expense amount:
  `,

      ASK_CATEGORY: `
  📂 Enter category:
  `,

      ASK_NOTE: `
  📝 Add a note for this expense
  (or type skip):
  `,

      CREATED: `
  ✅ Expense created successfully
  `,

      UPDATED: `
  ✅ Expense updated successfully
  `,

      DELETED: `
  ✅ Expense deleted successfully
  `,

      INVALID_AMOUNT: `
  ❌ Please enter a valid amount.
  `,

      INVALID_TEXT: `
      ❌ Please send text only.
      `,
      SESSION_EXPIRED: `
    ❌ Session expired. Please start again.
    `,

        EMPTY_CATEGORY: `
    ❌ Category cannot be empty.
      `,

      EXPENSES_EMPTY: `
      📭 No expenses found.
      `,

      EXPENSE_LIST: (
      expenses: string,
        page: number,
        pages: number,
        total: number,
      )=>`
      💰 Your Expenses

      ${expenses}

      📄 Page ${page}/${pages}
      📊 Total Expenses: ${total}
      `,
      

      UPDATE_SUCCESS: `
      ✅ Expense updated successfully.
      `,
       INVALID_EXPENSE_ID: '❌ Invalid expense ID.',

      ASK_EXPENSE_ID: `
    ✏️ Enter the expense ID you want to update.
    `,
     INVALID_CATEGORY: `
❌ Please enter a valid category.
`,
        INVALID_NOTE: `
        ❌ Please enter a valid category.
        `,
        ASK_NEW_AMOUNT: `
💰 Enter the new amount.
`,

    ASK_NEW_CATEGORY: `
📂 Enter the new category.
`,

    ASK_NEW_NOTE: `
📝 Enter the new note.

Type "skip" if you don't want to add a note.
`,

    ASK_EXPENSE_ID_:
    '🆔 Enter Expense ID',

    DELETE_SUCCESS:
    '🗑 Expense deleted successfully',

    NO_DELETED_EXPENSES:`
    ❕No Deleted expenses .
    `,
     ASK_EXPENSE_ID_TO_RESTORE :'♻️ Enter expense ID you want to restore:' ,

    // Restore
    RESTORE_SUCCESS: '♻️ Expense restored successfully',
    DELETED_EXPENSE_NOT_FOUND: '❌ Deleted expense not found',

        ASK_HARD_DELETE_ID:
        '🗑️ Enter expense ID to permanently delete:',

    HARD_DELETE_SUCCESS:
        '🗑️ Expense permanently deleted successfully.',

  };