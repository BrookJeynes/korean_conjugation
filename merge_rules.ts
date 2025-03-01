import { Infinitive } from "./conjugator";
import { getLead, getPadchim, getVowel, hasHiddenPadchim, join, matchGeulja } from "./hangul";

type Rule = (x: Infinitive, y: Infinitive) => string[] | null;

/**
 * Helper function for defining common contractions between a character without
 * a padchim and a character that starts with 'ᄋ', e.g. ㅐ + ㅕ -> ㅐ when 
 * applied to 해 + 였 yields 했.
 *
 * @param {string} vowel1
 * @param {string} vowel2
 * @param {string} new_vowel
 * @returns {Rule} The created rule.
 */
function vowelContraction(vowel1: string, vowel2: string, new_vowel: string): Rule {
    function rule(x: Infinitive, y: Infinitive): string[] | null {
        if (matchGeulja(x[x.length - 1], undefined, vowel1, null) && matchGeulja(y[0], "ᄋ", vowel2, undefined)) {
            return [`vowel contraction [${vowel1} + ${vowel2} -> ${new_vowel}]`, x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), new_vowel, getPadchim(y[0])) + y.substring(1)];
        }
        return null;
    }
    return rule;
}

/**
 * Helper function for defining merges where a character will take the padchim    
 * of a merged character if the first character doesn't already have a padchim, 
 * .e.g. 습 -> 가 + 습니다 -> 갑니다.
 */
function noPadchimRule(geuljas: string[]): Rule {
    function rule(x: Infinitive, y: Infinitive): string[] | null {
        if (!getPadchim(x[x.length - 1]) && geuljas.includes(y[0])) {
            return ["borrow padchim", x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1]), getPadchim(y[0])) + y.substring(1)];
        }
        return null;
    }
    return rule;
}

export const merge_rules: Rule[] = [
    noPadchimRule(["을", "습", "읍", "는", "음"]),
    (x: Infinitive, y: Infinitive): string[] | null => {
        if (getPadchim(x[x.length - 1]) === "ᆯ" && y.startsWith("음")) {
            return ["ㄹ + ㅁ -> ᆱ", x.slice(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1]), "ᆱ")];
        }
        return null;
    },
    vowelContraction("ㅐ", "ㅓ", "ㅐ"),
    vowelContraction("ㅡ", "ㅓ", "ㅓ"),
    vowelContraction("ㅜ", "ㅓ", "ㅝ"),
    vowelContraction("ㅗ", "ㅏ", "ㅘ"),
    vowelContraction("ㅚ", "ㅓ", "ㅙ"),
    vowelContraction("ㅙ", "ㅓ", "ㅙ"),
    vowelContraction("ㅘ", "ㅓ", "ㅘ"),
    vowelContraction("ㅝ", "ㅓ", "ㅝ"),
    vowelContraction("ㅏ", "ㅏ", "ㅏ"),
    vowelContraction("ㅡ", "ㅏ", "ㅏ"),
    vowelContraction("ㅣ", "ㅓ", "ㅕ"),
    vowelContraction("ㅓ", "ㅓ", "ㅓ"),
    vowelContraction("ㅓ", "ㅣ", "ㅐ"),
    vowelContraction("ㅏ", "ㅣ", "ㅐ"),
    vowelContraction("ㅑ", "ㅣ", "ㅒ"),
    vowelContraction("ㅒ", "ㅓ", "ㅒ"),
    vowelContraction("ㅔ", "ㅓ", "ㅔ"),
    vowelContraction("ㅕ", "ㅓ", "ㅕ"),
    vowelContraction("ㅏ", "ㅕ", "ㅐ"),
    vowelContraction("ㅖ", "ㅓ", "ㅖ"),
    vowelContraction("ㅞ", "ㅓ", "ㅞ"),
    // Rule: Don't append 으 to ㄹ irregulars.
    (x: Infinitive, y: Infinitive): string[] | null => {
        if (getPadchim(x[x.length - 1]) === "ᆯ" && y.startsWith("면")) {
            return ["join", x.toString() + y.toString()];
        }
        return null;
    },
    // Rule: 으 insertion.
    (x: Infinitive, y: Infinitive): string[] | null => {
        const geuljas = ["면", "세", "십"];
        if ((hasHiddenPadchim(x[x.length - 1]) || getPadchim(x[x.length - 1])) && geuljas.includes(y[0])) {
            return ["padchim + consonant -> insert 으", x + "으" + y];
        }
        return null;
    },
    // Default rule: Just append the contents.
    (x: Infinitive, y: Infinitive): string[] => ["join", x.toString() + y.toString()],
];
