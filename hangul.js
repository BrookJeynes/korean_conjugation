/* Many of the calculations used within this file can be referenced back to
 * http://www.kfunigraz.ac.at/~katzer/korean_hangul_unicode.html 
 * 
 * Unfortunately, this site is now dead. I've gone ahead and archived a version
 * of it at ./resources/korean_hangul_syllabary_in_unicode_archive.html for
 * future reference.
*/

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
    value = "";
    hidden_padchim = false;
    original_padchim = null;

    constructor(value) {
        this.value = value;
        return new Proxy(this, {
            get: (obj, key) => {
                if (typeof (key) === "string" && (Number.isInteger(Number(key)))) {
                    const index = Number(key);
                    if (key < 0 || index >= obj.value.length) {
                        return undefined;
                    }
                    return obj.getItem(index);
                } else {
                    return obj[key];
                }
            },
        });
    }

    toString() {
        return this.value;
    }

    getItem(index) {
        const geulja = new Geulja(this.value.charAt(index));
        // Only keep the hidden padchim marker for the last item.
        if (index === this.length - 1) {
            geulja.hidden_padchim = this.hidden_padchim;
            geulja.original_padchim = this.original_padchim;
        }

        return geulja;
    }
}

/**
 * Determines whether a character is hangul or not.
 *
 * @param {string} character
 * @returns {bool}
 * @throws When the input is not of length 1.
 */
export function isHangul(character) {
    if (character.length !== 1) {
        throw new Error("isHangeul only checks characters with a length of 1");
    }

    const code = character.charCodeAt(0);
    return code >= hangulUnicodeRange.lower && code <= hangulUnicodeRange.upper;
}


export function findVowelToAppend(str) {
    const reversed = [...`${str}`].reverse();

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
 *
 * @param {string} lead
 * @param {string} vowel
 * @param {string | null} padchim
 * @returns {string} The geulja resulting from the assembly.
 */
export function join(lead, vowel, padchim = null) {
    const lead_offset = lead.charCodeAt(0) - hangulLeadUnicodeOffset;
    const vowel_offset = vowel.charCodeAt(0) - hangulVowelUnicodeOffset;
    const padchim_offset = padchim ? padchim.charCodeAt(0) - hangulTailUnicodeOffset : -1;

    return String.fromCharCode(
        padchim_offset + vowel_offset * 28 + lead_offset * 588 + hangulUnicodeRange.lower + 1
    );
}

/**
 * Get the consonant of a geulja.
 *
 * @param {string} geulja
 * @returns {string} The consonant of the provided geulja.
 */
export function getLead(geulja) {
    const character_code = `${geulja}`.charCodeAt(0);
    const relative_lead_code = Math.floor((character_code - hangulUnicodeRange.lower) / 588);
    const lead_code = (relative_lead_code + hangulLeadUnicodeOffset);
    return String.fromCharCode(lead_code);
}

/**
 * Get the vowel of a geulja.
 *
 * @param {string} geulja
 * @returns {string} The vowel of the provided geulja.
 */
export function getVowel(geulja) {
    // getPadchim() returns a character or True if there is a hidden padchim, 
    // but a hidden padchim doesn't make sense for this offset
    const padchim = getPadchim(geulja);
    const padchim_offset = padchim === true || padchim === null ? -1 : padchim.charCodeAt(0) - hangulTailUnicodeOffset;

    const character_code = `${geulja}`.charCodeAt(0);
    const relative_vowel_code = Math.floor(((character_code - hangulUnicodeRange.lower - padchim_offset) % 588) / 28);
    const vowel_code = (relative_vowel_code + hangulVowelUnicodeOffset);
    const vowel = String.fromCharCode(vowel_code);

    return vowel;
}

/**
 * Get the padchim of a geulja.
 *
 * @param {string} geulja
 * @returns {string | null} The padchim of the provided geulja.
 */
export function getPadchim(geulja) {
    if (geulja instanceof Geulja) {
        if (geulja.hidden_padchim) return true;
        if (geulja.original_padchim) return geulja.original_padchim;
    }

    const character_code = `${geulja}`.charCodeAt(0);
    const relative_tail_code = (character_code - hangulUnicodeRange.lower) % 28;
    const tail_code = (relative_tail_code + hangulTailUnicodeOffset) - 1;

    const padchim = String.fromCharCode(tail_code);
    return tail_code === hangulEmptyConsonant ? null : padchim;
}

/**
 * Determine whether a geulja matches a pattern.
 *
 * @param {string} geulja
 * @param {string | undefined} lead The lead patterm. Leaving undefined represents any pattern.
 * @param {string | undefined} vowel The vowel patterm. Leaving undefined represents any pattern.
 * @param {string | null | undefined} padchim The padchim patterm. Leaving undefined represents any pattern.
 * @returns {bool}
 */
export function matchGeulja(geulja, lead = undefined, vowel = undefined, padchim = undefined) {
    const matchesLead = lead !== undefined ? getLead(geulja) === lead : true;
    const matchesVowel = vowel !== undefined ? getVowel(geulja) === vowel : true;
    const matchesPadchim = padchim !== undefined ? getPadchim(geulja) === padchim : true;

    return matchesLead && matchesVowel && matchesPadchim;
}
