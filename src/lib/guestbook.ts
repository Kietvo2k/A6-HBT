export const GUESTBOOK_NAME_LIMIT = 40;
export const GUESTBOOK_MESSAGE_LIMIT = 280;

export type GuestbookValidationResult = {
  name?: string;
  message?: string;
};

export function validateGuestbookInput(
  name: string,
  message: string,
): GuestbookValidationResult {
  const errors: GuestbookValidationResult = {};
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    errors.name = "Tên người gửi không được để trống.";
  } else if (trimmedName.length > GUESTBOOK_NAME_LIMIT) {
    errors.name = `Tên người gửi nên ngắn hơn ${GUESTBOOK_NAME_LIMIT} ký tự.`;
  }

  if (!trimmedMessage) {
    errors.message = "Lời nhắn không được để trống.";
  } else if (trimmedMessage.length > GUESTBOOK_MESSAGE_LIMIT) {
    errors.message = `Lời nhắn nên ngắn hơn ${GUESTBOOK_MESSAGE_LIMIT} ký tự.`;
  }

  return errors;
}
