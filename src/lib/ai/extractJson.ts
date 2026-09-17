/**
 * Model bahasa kadang membungkus JSON dengan fence markdown (```json ... ```)
 * atau kalimat tambahan meski sudah diminta "JSON saja". Fungsi ini mencoba
 * beberapa strategi sebelum menyerah — tapi TETAP hanya mengembalikan objek
 * hasil `JSON.parse` mentah; validasi bentuk/isi tetap tugas schema.ts &
 * lib/simulation/effects.ts, bukan fungsi ini.
 */
export function extractJson(raw: string): { ok: true; value: unknown } | { ok: false; error: string } {
  const trimmed = raw.trim();

  const attempts: string[] = [trimmed];

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) attempts.push(fenceMatch[1].trim());

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    attempts.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of attempts) {
    try {
      return { ok: true, value: JSON.parse(candidate) };
    } catch {
      // coba strategi berikutnya
    }
  }

  return { ok: false, error: "Tidak bisa mem-parse JSON dari keluaran AI." };
}
