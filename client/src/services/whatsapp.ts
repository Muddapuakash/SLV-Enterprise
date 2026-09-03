/**
 * Centralized WhatsApp URL builder.
 * Reads from BusinessSettings so the phone number is never hardcoded.
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  message = 'Hello SV Enterprises, I would like to know more about your services.'
): string {
  const clean = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppUrl(settings: Record<string, string>, message?: string): string {
  const phone = settings['whatsapp_number'] || '919620406789';
  return buildWhatsAppUrl(phone, message);
}
