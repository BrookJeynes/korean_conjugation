import { expect, describe, test } from "bun:test";
import { isHangul, hangulUnicodeRange, findVowelToAppend, join, getLead, getVowel, getPadchim, matchGeulja } from "./hangul.js";
import { Geulja } from "./hangul.js";

const validHangulRange = Array.from(
    { length: hangulUnicodeRange.upper - hangulUnicodeRange.lower },
    (_, i) => hangulUnicodeRange.lower + i
);

describe("valid hangul", () => {
    const invalidHangulUpperRange = Array.from(
        { length: 65535 - (hangulUnicodeRange.upper + 1) },
        (_, i) => (hangulUnicodeRange.upper + 1) + i
    );

    const invalidHangulLowerRange = Array.from(
        { length: hangulUnicodeRange.lower },
        (_, i) => i
    );

    test.each(validHangulRange)("%p should be valid hangul", (codepoint) => {
        expect(isHangul(String.fromCharCode(codepoint))).toBeTrue();
    });

    test.each(invalidHangulUpperRange)("%p should be invalid hangul upper", (codepoint) => {
        expect(isHangul(String.fromCharCode(codepoint))).toBeFalse();
    });

    test.each(invalidHangulLowerRange)("%p should be invalid hangul lower", (codepoint) => {
        expect(isHangul(String.fromCharCode(codepoint))).toBeFalse();
    });
});

test("find vowel to append", () => {
    expect(findVowelToAppend('아프')).toBe('아');
    expect(findVowelToAppend('흐르')).toBe('어');
    expect(findVowelToAppend('태우')).toBe('어');
    expect(findVowelToAppend('만들')).toBe('어');
    expect(findVowelToAppend('앗')).toBe('아');
});

describe("join", () => {
    test("manual join", () => {
        expect(join('ᄀ', 'ㅏ')).toBe('가');
        expect(join('ᄆ', 'ㅕ', 'ᆫ')).toBe('면');
        expect(join('ᄈ', 'ㅙ', 'ᆶ')).toBe('뾇');
    });

    test.each(validHangulRange)("%p should be a valid join", (codepoint) => {
        const character = String.fromCharCode(codepoint);
        expect(join(getLead(character), getVowel(character), getPadchim(character))).toBe(character);
    });
});

test("lead", () => {
    expect(getLead('가')).toBe('ᄀ')
    expect(getLead('만')).toBe('ᄆ')
    expect(getLead('짉')).toBe('ᄌ')
});

test("vowel", () => {
    expect(getVowel('갓')).toBe('ㅏ')
    expect(getVowel('빩')).toBe('ㅏ')
    expect(getVowel('법')).toBe('ㅓ')
    expect(getVowel('가')).toBe('ㅏ')
});

test("match", () => {
    expect(matchGeulja('아', undefined, 'ㅏ')).toBeTrue();
    expect(matchGeulja('왅', undefined, 'ㅏ')).toBeFalse()
    expect(matchGeulja('아', 'ᄋ', 'ㅏ')).toBeTrue();
    expect(matchGeulja('아', 'ᄋ', 'ㅏ', null)).toBeTrue();
    expect(matchGeulja('읽', undefined, undefined, 'ᆰ')).toBeTrue();
    expect(matchGeulja('읽', undefined, undefined, null)).toBeFalse();

    const infinitive_one = new Geulja('나');
    infinitive_one.hidden_padchim = true;
    expect(matchGeulja(infinitive_one, undefined, undefined, null)).toBeFalse();

    const infinitive_two = new Geulja('나');
    infinitive_two.hidden_padchim = false;
    expect(matchGeulja(infinitive_two, undefined, undefined, null)).toBeTrue();
});
