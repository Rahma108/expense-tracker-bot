export function isValidName(name: string): boolean {
  const normalized = name.trim().replace(/\s+/g, ' ');

  return /^[\p{Script=Arabic}\p{Script=Latin}]+(?:[ '-][\p{Script=Arabic}\p{Script=Latin}]+)*$/u.test(
    normalized,
  );
}