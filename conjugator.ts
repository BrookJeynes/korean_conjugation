// This TypeScript implementation is based on the Python project ["korean_conjugation" by Dan Bravender (2010).
// Original Python code licensed under AGPL-3.0: https://www.gnu.org/licenses/agpl-3.0.html
// Original Python code available here: https://github.com/max-christian/korean_conjugation/blob/master/korean/conjugator.py
// 
// Modified and re-implemented in TypeScript by Brook Jeynes in 2025.
// License: AGPL-3.0

import { Geulja, findVowelToAppend, getLead, getPadchim, getVowel, join } from "./hangul";
import { isDIrregular, isHIrregular, isLEuIrregular, isLIrregular, isPIrregular, isSIrregular } from "./irregulars.js";
import { merge_rules } from "./merge_rules";

interface TenseRule {
    name: string;
    rule: (infinitive: Infinitive, regular: boolean) => Infinitive;
}

export interface Conjugation {
    tense: string;
    conjugation: string;
    reasons: string[];
}

export type Infinitive = string | Geulja;

export class Conjugator {
    tense_rules: TenseRule[] = [];
    reasons: string[] = [];

    constructor() {
        this.tense_rules = [
            { name: "base", rule: (infinitive, regular) => this.base(infinitive, regular) },
            { name: "base2", rule: (infinitive, regular) => this.base2(infinitive, regular) },
            { name: "base3", rule: (infinitive, regular) => this.base3(infinitive, regular) },
            { name: "declarative present informal low", rule: (infinitive, regular) => this.declarativePresentInformalLow(infinitive, regular) },
            { name: "declarative present informal high", rule: (infinitive, regular) => this.declarativePresentInformalHigh(infinitive, regular) },
            { name: "declarative present formal low", rule: (infinitive, regular) => this.declarativePresentFormalLow(infinitive, regular) },
            { name: "declarative present formal high", rule: (infinitive, regular) => this.declarativePresentFormalHigh(infinitive, regular) },
            { name: "past base", rule: (infinitive, regular) => this.pastBase(infinitive, regular) },
            { name: "declarative past informal low", rule: (infinitive, regular) => this.declarativePastInformalLow(infinitive, regular) },
            { name: "declarative past informal high", rule: (infinitive, regular) => this.declarativePastInformalHigh(infinitive, regular) },
            { name: "declarative past formal low", rule: (infinitive, regular) => this.declarativePastFormalLow(infinitive, regular) },
            { name: "declarative past formal high", rule: (infinitive, regular) => this.declarativePastFormalHigh(infinitive, regular) },
            { name: "future base", rule: (infinitive, regular) => this.futureBase(infinitive, regular) },
            { name: "declarative future informal low", rule: (infinitive, regular) => this.declarativeFutureInformalLow(infinitive, regular) },
            { name: "declarative future informal high", rule: (infinitive, regular) => this.declarativeFutureInformalHigh(infinitive, regular) },
            { name: "declarative future formal low", rule: (infinitive, regular) => this.declarativeFutureFormalLow(infinitive, regular) },
            { name: "declarative future formal high", rule: (infinitive, regular) => this.declarativeFutureFormalHigh(infinitive, regular) },
            { name: "declarative future conditional informal low", rule: (infinitive, regular) => this.declarativeFutureConditionalInformalLow(infinitive, regular) },
            { name: "declarative future conditional informal high", rule: (infinitive, regular) => this.declarativeFutureConditionalInformalHigh(infinitive, regular) },
            { name: "declarative future conditional formal low", rule: (infinitive, regular) => this.declarativeFutureConditionalFormalLow(infinitive, regular) },
            { name: "declarative future conditional formal high", rule: (infinitive, regular) => this.declarativeFutureConditionalFormalHigh(infinitive, regular) },
            { name: "inquisitive present informal low", rule: (infinitive, regular) => this.inquisitivePresentInformalLow(infinitive, regular) },
            { name: "inquisitive present informal high", rule: (infinitive, regular) => this.inquisitivePresentInformalHigh(infinitive, regular) },
            { name: "inquisitive present formal low", rule: (infinitive, regular) => this.inquisitivePresentFormalLow(infinitive, regular) },
            { name: "inquisitive present formal high", rule: (infinitive, regular) => this.inquisitivePresentFormalHigh(infinitive, regular) },
            { name: "inquisitive past informal low", rule: (infinitive, regular) => this.inquisitivePastInformalLow(infinitive, regular) },
            { name: "inquisitive past informal high", rule: (infinitive, regular) => this.inquisitivePastInformalHigh(infinitive, regular) },
            { name: "inquisitive past formal low", rule: (infinitive, regular) => this.inquisitivePastFormalLow(infinitive, regular) },
            { name: "inquisitive past formal high", rule: (infinitive, regular) => this.inquisitivePastFormalHigh(infinitive, regular) },
            { name: "imperative present informal low", rule: (infinitive, regular) => this.imperativePresentInformalLow(infinitive, regular) },
            { name: "imperative present informal high", rule: (infinitive, regular) => this.imperativePresentInformalHigh(infinitive, regular) },
            { name: "imperative present formal low", rule: (infinitive, regular) => this.imperativePresentFormalLow(infinitive, regular) },
            { name: "imperative present formal high", rule: (infinitive, regular) => this.imperativePresentFormalHigh(infinitive, regular) },
            { name: "propositive present informal low", rule: (infinitive, regular) => this.propositivePresentInformalLow(infinitive, regular) },
            { name: "propositive present informal high", rule: (infinitive, regular) => this.propositivePresentInformalHigh(infinitive, regular) },
            { name: "propositive present formal low", rule: (infinitive, regular) => this.propositivePresentFormalLow(infinitive, regular) },
            { name: "propositive present formal high", rule: (infinitive, regular) => this.propositivePresentFormalHigh(infinitive, regular) },
            { name: "connective if", rule: (infinitive, regular) => this.connectiveIf(infinitive, regular) },
            { name: "connective and", rule: (infinitive, regular) => this.connectiveAnd(infinitive, regular) },
            { name: "nominal ing", rule: (infinitive, regular) => this.nominalIng(infinitive, regular) },
        ];
    }

    perform(infinitive: string, regular: boolean = false): Conjugation[] {
        const results: Conjugation[] = [];

        for (const tense of this.tense_rules) {
            this.reasons = [];
            const conjugation = tense.rule(infinitive, regular);
            results.push({
                tense: tense.name,
                conjugation: conjugation.toString(),
                reasons: this.reasons
            });
        }

        return results;
    }

    dropL(x: Infinitive, y: Infinitive): string {
        if (getPadchim(x[x.length - 1]) === "ᆯ") {
            this.reasons.push("drop ㄹ");
            return x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1])) + y;
        }
        throw new Error("Not an L padchim");
    }

    dropLAndBorrowPadchim(x: Infinitive, y: Infinitive): string {
        if (getPadchim(x[x.length - 1]) === "ᆯ") {
            this.reasons.push(`drop ${getPadchim(x[x.length - 1])} borrow padchim`);
            return x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1]), getPadchim(y[0])) + y.substring(1);
        }
        throw new Error("Not an L padchim");
    }

    merge(x: Infinitive, y: Infinitive): string {
        for (let i = 0; i < merge_rules.length; i++) {
            const rule = merge_rules[i];
            const output = rule(x, y);
            if (output) {
                this.reasons.push(`${output[0] && output[0] || ""} (${x} + ${y} -> ${output[1]})`);
                return output[1];
            }
        }
        throw new Error("Unable to match on rule");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    base(infinitive: Infinitive, _regular: boolean = false): Infinitive {
        if (infinitive.endsWith("다")) {
            return infinitive.substring(0, infinitive.split("").length - 1);
        }

        return infinitive;
    }

    base2(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive, regular);

        if (infinitive === "아니") {
            const geulja = new Geulja("아니");
            geulja.hidden_padchim = true;
            return geulja;
        }

        if (infinitive === "뵙") return "뵈";
        if (infinitive === "푸") return "퍼";

        let new_infinitive: Infinitive | null = infinitive;
        if (isHIrregular(infinitive, regular)) {
            new_infinitive = this.merge(infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1])), "이");
            this.reasons.push(`ㅎ irregular (${infinitive} -> ${new_infinitive})`);
        } else if (isPIrregular(infinitive, regular)) {
            let new_vowel = "";
            // only some verbs get ㅗ (highly irregular)
            if (["묻잡"].includes(infinitive.toString()) || ["돕", "곱"].includes(infinitive[infinitive.length - 1])) {
                new_vowel = "ㅗ";
            } else {
                new_vowel = "ㅜ";
            }

            new_infinitive = this.merge(infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1])), join("ᄋ", new_vowel));
            this.reasons.push(`ㅂ irregular (${infinitive} -> ${new_infinitive})`);
        } else if (isDIrregular(infinitive, regular)) {
            new_infinitive = new Geulja(infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1]), "ᆯ"));
            new_infinitive.original_padchim = "ᆮ";
            this.reasons.push(`ㄷ irregular (${infinitive} -> ${new_infinitive})`);
        } else if (isSIrregular(infinitive, regular)) {
            new_infinitive = new Geulja(infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1])));
            new_infinitive.hidden_padchim = true;
            this.reasons.push(`ㅅ irregular (${infinitive} -> ${new_infinitive} [hidden padchim])`);
        }

        return new_infinitive;
    }

    base3(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive, regular);
        if (infinitive === "아니") return "아니";
        if (infinitive == "푸") return "푸";
        if (infinitive == "뵙") return "뵈";
        if (isHIrregular(infinitive, regular)) {
            return infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1]));
        } else if (isPIrregular(infinitive, regular)) {
            return infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1])) + "우";
        } else {
            return this.base2(infinitive, regular);
        }
    }

    declarativePresentInformalLow(infinitive: Infinitive, regular: boolean = false, further_use: boolean = false): string {
        infinitive = this.base2(infinitive, regular);
        if (!further_use && ((infinitive[infinitive.length - 1] === "이" && !(infinitive instanceof Geulja)) || infinitive === "아니")) {
            this.reasons.push("야 irregular");
            return infinitive + "야";
        }

        // 르 irregular
        if (regular && infinitive === "이르") {
            return "일러";
        }

        if (isLEuIrregular(infinitive, regular)) {
            let new_base = infinitive.substring(0, infinitive.length - 2) + join(getLead(infinitive[infinitive.length - 2]), getVowel(infinitive[infinitive.length - 2]), "ᆯ");
            if (["푸르", "이르"].includes(infinitive.substring(infinitive.length - 2))) {
                new_base = new_base + join("ᄅ", getVowel(findVowelToAppend(new_base)));
                this.reasons.push(`irregular stem + ${infinitive} -> ${new_base}`);
                return infinitive + "러";
            } else if (findVowelToAppend(infinitive.substring(0, infinitive.length - 1)) === "아") {
                new_base += "라";
                this.reasons.push(`르 irregular stem change [${infinitive} -> ${new_base}]`);
                return new_base;
            } else {
                new_base += "러";
                this.reasons.push(`르 irregular stem change [${infinitive} -> ${new_base}]`);
                return new_base;
            }
        } else if (infinitive[infinitive.length - 1] === "하") {
            return this.merge(infinitive, "여");
        } else if (isHIrregular(infinitive, regular)) {
            return this.merge(infinitive, "이");
        }
        return this.merge(infinitive, findVowelToAppend(infinitive));
    }

    declarativePresentInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base2(infinitive, regular);
        if ((infinitive[infinitive.length - 1] === "이" && !(infinitive instanceof Geulja)) || infinitive === "아니") {
            this.reasons.push("에요 irregular");
            return infinitive + "에요";
        }
        return this.merge(this.declarativePresentInformalLow(infinitive, regular, true), "요");
    }

    declarativePresentFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        if (isLIrregular(this.base(infinitive), regular)) {
            return this.dropLAndBorrowPadchim(this.base(infinitive, regular), "는다");
        }
        return this.merge(this.base(infinitive, regular), "는다");
    }

    declarativePresentFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        if (isLIrregular(this.base(infinitive), regular)) {
            return this.dropLAndBorrowPadchim(this.base(infinitive, regular), "습니다");
        }
        return this.merge(this.base(infinitive, regular), "습니다");
    }

    pastBase(infinitive: Infinitive, regular: boolean = false): Infinitive {
        const ps = this.declarativePresentInformalLow(infinitive, regular, true);
        if (findVowelToAppend(ps) == "아") {
            return this.merge(ps, "았");
        }
        return this.merge(ps, "었");
    }

    declarativePastInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.pastBase(infinitive, regular), "어");
    }

    declarativePastInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.declarativePastInformalLow(infinitive, regular), "요");
    }

    declarativePastFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.pastBase(infinitive, regular), "다");
    }

    declarativePastFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.pastBase(infinitive, regular), "습니다");
    }

    futureBase(infinitive: Infinitive, regular: boolean = false): Infinitive {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropLAndBorrowPadchim(this.base3(infinitive, regular), "을");
        }
        return this.merge(this.base3(infinitive, regular), "을");
    }

    declarativeFutureInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.futureBase(infinitive, regular), " 거야");
    }

    declarativeFutureInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.futureBase(infinitive, regular), " 거예요");
    }

    declarativeFutureFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.futureBase(infinitive, regular), " 거다");
    }

    declarativeFutureFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.futureBase(infinitive, regular), " 겁니다");
    }

    declarativeFutureConditionalInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base(infinitive, regular), "겠어");
    }

    declarativeFutureConditionalInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base(infinitive, regular), "겠어요");
    }

    declarativeFutureConditionalFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base(infinitive, regular), "겠다");
    }

    declarativeFutureConditionalFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base(infinitive, regular), "겠습니다");
    }

    inquisitivePresentInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.declarativePresentInformalLow(infinitive, regular), "?");
    }


    inquisitivePresentInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.declarativePresentInformalHigh(infinitive, regular), "?");
    }

    inquisitivePresentFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive, regular);
        if (isLIrregular(infinitive, regular)) {
            return this.dropL(infinitive, "니?");
        }
        return this.merge(infinitive, "니?");
    }

    inquisitivePresentFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive, regular);
        if (isLIrregular(infinitive, regular)) {
            return this.dropLAndBorrowPadchim(infinitive, "습니까?");
        }
        return this.merge(infinitive, "습니까?");
    }

    inquisitivePastInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.declarativePastInformalLow(infinitive, regular) + "?";
    }

    inquisitivePastInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.declarativePastInformalHigh(infinitive, regular), "?");
    }

    inquisitivePastFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.pastBase(infinitive, regular), "니?");
    }

    inquisitivePastFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.pastBase(infinitive, regular), "습니까?");
    }

    imperativePresentInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.declarativePresentInformalLow(infinitive, regular);
    }

    imperativePresentInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropL(this.base3(infinitive, regular), "세요");
        }
        return this.merge(this.base3(infinitive, regular), "세요");
    }

    imperativePresentFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.imperativePresentInformalLow(infinitive, regular), "라");
    }

    imperativePresentFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropL(this.base3(infinitive, regular), "십시오");
        }
        return this.merge(this.base3(infinitive, regular), "십시오");
    }

    propositivePresentInformalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.declarativePresentInformalLow(infinitive, regular);
    }

    propositivePresentInformalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.declarativePresentInformalHigh(infinitive, regular);
    }

    propositivePresentFormalLow(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base(infinitive, regular), "자");
    }

    propositivePresentFormalHigh(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive);
        if (isLIrregular(infinitive, regular)) {
            return this.dropLAndBorrowPadchim(this.base3(infinitive, regular), "읍시다");
        }
        return this.merge(this.base3(infinitive, regular), "읍시다");
    }

    connectiveIf(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base3(infinitive, regular), "면");
    }

    connectiveAnd(infinitive: Infinitive, regular: boolean = false): Infinitive {
        infinitive = this.base(infinitive, regular);
        return this.merge(this.base(infinitive, regular), "고");
    }

    nominalIng(infinitive: Infinitive, regular: boolean = false): Infinitive {
        return this.merge(this.base3(infinitive, regular), "음");
    }
}
