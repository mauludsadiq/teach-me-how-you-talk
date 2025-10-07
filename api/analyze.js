export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), { status: 405 });
    }

    const { term, meaning } = await req.json();
    if (!term || !meaning) {
      return new Response(JSON.stringify({ ok: false, error: "Missing term or meaning" }), { status: 400 });
    }

    const lower = term.toLowerCase();
    const tokens = lower.split(/\s+/);
    const isVerb = /\b(am|is|are|was|were|be|being|been|do|did|done|go|gone|leave|left)\b/.test(lower);
    const hasPronoun = /\b(i|you|he|she|they|we)\b/.test(lower);
    let pos = "unknown";
    if (isVerb) pos = "verb";
    else if (hasPronoun) pos = "clause";
    else if (tokens.length === 1) pos = "noun";
    else pos = "phrase";

    let origin = null;
    let culturalLink = null;
    if (/swayze/.test(lower)) {
      origin = "Patrick Swayze — lead actor in *Ghost* (1989)";
      culturalLink = "‘Ghost’ means to disappear → ‘I'm Swayze’ = ‘I’m gone’";
    } else if (/ghost/.test(lower)) {
      origin = "African-American Vernacular English; popularized 1980s-1990s";
      culturalLink = "‘Ghost’ used metaphorically for leaving or vanishing";
    }

    const explanation = [];
    explanation.push(`When you say **${term}**, you mean **${meaning}**.`);
    if (pos === "verb")
      explanation.push(`You're using it as a **verb**, which shows *functional shift* (a word changing part-of-speech).`);
    else if (pos === "noun")
      explanation.push(`It’s acting as a **noun**, possibly reinterpreted or personified.`);
    else
      explanation.push(`It functions as a **${pos}**, blending grammatical roles.`);
    if (origin) explanation.push(`**Origin:** ${origin}.`);
    if (culturalLink) explanation.push(`**Cultural meaning:** ${culturalLink}.`);
    explanation.push(`**Formal translation:** ${meaning.charAt(0).toUpperCase() + meaning.slice(1)}.`);
    explanation.push(`**Summary:** this phrase collapses culture + grammar → new meaning. That’s linguistic innovation.`);

    return new Response(JSON.stringify({
      ok: true,
      term,
      meaning,
      grammar: { part_of_speech: pos },
      origin,
      culturalLink,
      explanation: explanation.join(" ")
    }), {
      headers: { "content-type": "application/json" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
