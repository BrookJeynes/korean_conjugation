// This TypeScript implementation is based on the Python project ["korean_conjugation" by Dan Bravender (2010).
// Original Python code licensed under AGPL-3.0: https://www.gnu.org/licenses/agpl-3.0.html
// Original Python code available here: https://github.com/max-christian/korean_conjugation/blob/master/korean/hangeul.py
// 
// Modified and re-implemented in TypeScript by Brook Jeynes in 2025.
// License: AGPL-3.0

/* Many of the calculations used within this file can be referenced back to
 * http://www.kfunigraz.ac.at/~katzer/korean_hangul_unicode.html 
 * 
 * Unfortunately, this site is now dead. I've gone ahead and archived a version
 * of it at ./resources/korean_hangul_syllabary_in_unicode_archive.html for
 * future reference.
*/

import { Infinitive } from "./conjugator";

export const hangulUnicodeRange = {
    lower: 0xAC00,
    upper: 0xD7A3,
};

const hangulTailUnicodeOffset = 0x11A8;
const hangulVowelUnicodeOffset = 0x314f;
const hangulLeadUnicodeOffset = 0x1100;
const hangulEmptyConsonant = 0x11A7;

/* Used to track modifications that have been made to characters. It keeps 
 * track of characters' original padchims (for ㄷ -> ㄹ irregulars) and if the 
 * character has no padchim but should be treated as if it does (for ㅅ 
 * irregulars). When substrings are extracted the Geulja class keeps these 
 * markers for the last character only.
 */
export class Geulja {
    value: string = "";
    length: number = 0;
    hidden_padchim: boolean = false;
    original_padchim: string | null = null;

    constructor(value: string) {
        this.value = value;
        this.length = value.length;
        return new Proxy(this, {
            get: (obj, key) => {
                if (typeof (key) === "string" && (Number.isInteger(Number(key)))) {
                    const index = Number(key);
                    if (index < 0 || index >= obj.value.length) {
                        return undefined;
                    }
                    return obj.getItem(index);
                } else {
                    return obj[key];
                }
            },
        });
    }

    toString(): string {
        return this.value;
    }

    slice(start?: number, end?: number): string {
        return this.value.slice(start, end);
    }

    substring(start: number, end?: number): string {
        return this.value.substring(start, end);
    }

    split(separator: string | RegExp, limit?: number): string[] {
        return this.value.split(separator, limit);
    }

    endsWith(searchString: string): boolean {
        return this.value.endsWith(searchString);
    }

    startsWith(searchString: string, position?: number): boolean {
        return this.value.startsWith(searchString, position);
    }

    getItem(index: number): Geulja {
        const geulja = new Geulja(this.value.charAt(index));
        // Only keep the hidden padchim marker for the last item.
        if (index === this.value.length - 1) {
            geulja.hidden_padchim = this.hidden_padchim;
            geulja.original_padchim = this.original_padchim;
        }

        return geulja;
    }
}

export function isHangul(character: string): boolean {
    if (character.length !== 1) {
        throw new Error("isHangeul only checks characters with a length of 1");
    }

    const code = character.charCodeAt(0);
    return code >= hangulUnicodeRange.lower && code <= hangulUnicodeRange.upper;
}


export function findVowelToAppend(geulja: Infinitive): string {
    const reversed = [...`${geulja}`].reverse();

    for (const char of reversed) {
        if (["뜨", "쓰", "트"].includes(char)) {
            return "어";
        }

        if (getVowel(char) === "ㅡ" && !getPadchim(char)) {
            continue;
        }

        if (["ㅗ", "ㅏ", "ㅑ"].includes(getVowel(char))) {
            return "아";
        } else {
            return "어";
        }
    }

    return "어";
}

/**
 * Assembly a set of Jamo characters.
 */
export function join(lead: string, vowel: string, padchim: string | null = null): string {
    const lead_offset = lead.charCodeAt(0) - hangulLeadUnicodeOffset;
    const vowel_offset = vowel.charCodeAt(0) - hangulVowelUnicodeOffset;
    const padchim_offset = padchim ? padchim.charCodeAt(0) - hangulTailUnicodeOffset : -1;

    return String.fromCharCode(
        padchim_offset + vowel_offset * 28 + lead_offset * 588 + hangulUnicodeRange.lower + 1
    );
}

export function getLead(geulja: string): string {
    const character_code = `${geulja}`.charCodeAt(0);
    const relative_lead_code = Math.floor((character_code - hangulUnicodeRange.lower) / 588);
    const lead_code = (relative_lead_code + hangulLeadUnicodeOffset);
    return String.fromCharCode(lead_code);
}

export function getVowel(geulja: string): string {
    const padchim = getPadchim(geulja);
    const padchim_offset = padchim === null ? -1 : padchim.charCodeAt(0) - hangulTailUnicodeOffset;

    const character_code = `${geulja}`.charCodeAt(0);
    const relative_vowel_code = Math.floor(((character_code - hangulUnicodeRange.lower - padchim_offset) % 588) / 28);
    const vowel_code = (relative_vowel_code + hangulVowelUnicodeOffset);
    const vowel = String.fromCharCode(vowel_code);

    return vowel;
}

export function hasHiddenPadchim(geulja: Infinitive): boolean {
    if (geulja instanceof Geulja) {
        if (geulja.hidden_padchim) return true;
    }
    return false;
}

export function getPadchim(geulja: Infinitive): string | null {
    if (geulja instanceof Geulja) {
        if (geulja.original_padchim) return geulja.original_padchim;
    }

    const character_code = `${geulja}`.charCodeAt(0);
    const relative_tail_code = (character_code - hangulUnicodeRange.lower) % 28;
    const tail_code = (relative_tail_code + hangulTailUnicodeOffset) - 1;

    const padchim = String.fromCharCode(tail_code);
    return tail_code === hangulEmptyConsonant ? null : padchim;
}

export function matchGeulja(
    geulja: string,
    lead: string | undefined = undefined,
    vowel: string | undefined = undefined,
    padchim: string | null | undefined = undefined
): boolean {
    const matchesLead = lead !== undefined ? getLead(geulja) === lead : true;
    const matchesVowel = vowel !== undefined ? getVowel(geulja) === vowel : true;
    const matchesPadchim = padchim !== undefined ? (hasHiddenPadchim(geulja) || getPadchim(geulja)) === padchim : true;

    return matchesLead && matchesVowel && matchesPadchim;
}
