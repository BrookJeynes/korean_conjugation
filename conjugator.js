import { Geulja, findVowelToAppend, getLead, getPadchim, getVowel, join } from "./hangul";
import { isHIrregular, isDIrregular, isLIrregular, isPIrregular, isSIrregular, isLEuIrregular } from "./irregulars.js"
import { merge_rules } from "./merge_rules";

export class Conjugation {
    tenses = {};
    tense_order = [];
    reasons = [];

    constructor() {
        this.tense_rules = [
            { name: "base", rule: this.base },
            { name: "base2", rule: this.base2 },
            { name: "base3", rule: this.base3 },
            { name: "declarative present informal low", rule: this.declarativePresentInformalLow },
            { name: "declarative present informal high", rule: this.declarativePresentInformalHigh },
            { name: "declarative present formal low", rule: this.declarativePresentFormalLow },
            { name: "declarative present formal high", rule: this.declarativePresentFormalHigh },
            { name: "past base", rule: this.pastBase },
            { name: "declarativePastInformalLow", rule: this.declarativePastInformalLow },
            { name: "declarativePastInformalHigh", rule: this.declarativePastInformalHigh },
            { name: "declarativePastFormalLow", rule: this.declarativePastFormalLow },
            { name: "declarativePastFormalHigh", rule: this.declarativePastFormalHigh },
            { name: "futureBase", rule: this.futureBase },
            { name: "declarativeFutureInformalLow", rule: this.declarativeFutureInformalLow },
            { name: "declarativeFutureInformalHigh", rule: this.declarativeFutureInformalHigh },
            { name: "declarativeFutureFormalLow", rule: this.declarativeFutureFormalLow },
            { name: "declarativeFutureFormalHigh", rule: this.declarativeFutureFormalHigh },
            { name: "declarativeFutureConditionalInformalLow", rule: this.declarativeFutureConditionalInformalLow },
            { name: "declarativeFutureConditionalInformalHigh", rule: this.declarativeFutureConditionalInformalHigh },
            { name: "declarativeFutureConditionalFormalLow", rule: this.declarativeFutureConditionalFormalLow },
            { name: "declarativeFutureConditionalFormalHigh", rule: this.declarativeFutureConditionalFormalHigh },
            { name: "inquisitivePresentInformalLow", rule: this.inquisitivePresentInformalLow },
            { name: "inquisitivePresentInformalHigh", rule: this.inquisitivePresentInformalHigh },
            { name: "inquisitivePresentFormalLow", rule: this.inquisitivePresentFormalLow },
            { name: "inquisitivePresentFormalHigh", rule: this.inquisitivePresentFormalHigh },
            { name: "inquisitivePastInformalLow", rule: this.inquisitivePastInformalLow },
            { name: "inquisitivePastInformalHigh", rule: this.inquisitivePastInformalHigh },
            { name: "inquisitivePastFormalLow", rule: this.inquisitivePastFormalLow },
            { name: "inquisitivePastFormalHigh", rule: this.inquisitivePastFormalHigh },
            { name: "imperativePresentInformalLow", rule: this.imperativePresentInformalLow },
            { name: "imperativePresentInformalHigh", rule: this.imperativePresentInformalHigh },
            { name: "imperativePresentFormalLow", rule: this.imperativePresentFormalLow },
            { name: "imperativePresentFormalHigh", rule: this.imperativePresentFormalHigh },
            { name: "propositivePresentInformalLow", rule: this.propositivePresentInformalLow },
            { name: "propositivePresentInformalHigh", rule: this.propositivePresentInformalHigh },
            { name: "propositivePresentFormalLow", rule: this.propositivePresentFormalLow },
            { name: "propositivePresentFormalHigh", rule: this.propositivePresentFormalHigh },
            { name: "connectiveIf", rule: this.connectiveIf },
            { name: "connectiveAnd", rule: this.connectiveAnd },
            { name: "nominalIng", rule: this.nominalIng },
        ];
    }

    perform(infinitive, regular = false) {
        const results = [];

        for (const tense of this.tense_rules) {
            this.reasons = [];
            const conjugation = tense.rule(infinitive, regular);
            results.push({ tense: tense.name, conjugation, reasons: this.reasons });
        }

        return results;
    }

    dropL(x, y) {
        if (getPadchim(x[x.length - 1]) === "ᆯ") {
            this.reasons.push("drop ㄹ");
            return [x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1])) + y];
        }
    }

    dropLAndBorrowPadchim(x, y) {
        if (getPadchim(x[x.length - 1]) === "ᆯ") {
            this.reasons.push(`drop ${getPadchim(x[x.length - 1])} borrow padchim`);
            return [x.substring(0, x.length - 1) + join(getLead(x[x.length - 1]), getVowel(x[x.length - 1]), getPadchim(y[0])) + y.substring(1)];
        }
    }

    merge(x, y) {
        for (let i = 0; i < merge_rules.length; i++) {
            const rule = merge_rules[i];
            const output = rule(x, y);
            if (output) {
                this.reasons.push(`${output[0] && output[0] || ""} (${x} + ${y} -> ${output[1]})`);
                return output[1];
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    base(infinitive, _regular = false) {
        if (`${infinitive}`.endsWith("다")) {
            return infinitive.substring(0, infinitive.split("").length - 1);
        }

        return infinitive;
    }

    base2(infinitive, regular = false) {
        infinitive = this.base(infinitive, regular);

        if (infinitive === "아니") {
            const geulja = new Geulja("아니");
            geulja.hidden_padchim = true;
            return geulja;
        }

        if (infinitive === "뵙") return "뵈";
        if (infinitive === "푸") return "퍼";

        let new_infinitive = infinitive;
        if (isHIrregular(infinitive, regular)) {
            new_infinitive = this.merge(infinitive.substring(0, infinitive.length - 1) + join(getLead(infinitive[infinitive.length - 1]), getVowel(infinitive[infinitive.length - 1])), "이");
            this.reasons.push(`ㅎ irregular (${infinitive} -> ${new_infinitive})`);
        } else if (isPIrregular(infinitive, regular)) {
            let new_vowel = "";
            // only some verbs get ㅗ (highly irregular)
            if (["묻잡"].includes(infinitive) || ["돕", "곱"].includes(infinitive[infinitive.length - 1])) {
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

    base3(infinitive, regular = false) {
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

    declarativePresentInformalLow(infinitive, regular = false, further_use = false) {
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

    declarativePresentInformalHigh(infinitive, regular = false) {
        infinitive = this.base2(infinitive, regular);
        if ((infinitive[infinitive.length - 1] === "이" && !(infinitive instanceof Geulja)) || infinitive === "아니") {
            this.reasons.push("에요 irregular");
            return infinitive + "에요";
        }
        return this.merge(this.declarativePresentInformalLow(infinitive, regular, true), "요");
    }

    declarativePresentFormalLow(infinitive, regular = false) {
        if (isLIrregular(this.base(infinitive), regular)) {
            return this.dropLAndBorrowPadchim(this.base(infinitive, regular), "는다");
        }
        return this.merge(this.base(infinitive, regular), "는다");
    }

    declarativePresentFormalHigh(infinitive, regular = false) {
        if (isLIrregular(this.base(infinitive), regular)) {
            return this.dropLAndBorrowPadchim(this.base(infinitive, regular), "습니다");
        }
        return this.merge(this.base(infinitive, regular), "습니다");
    }

    pastBase(infinitive, regular = false) {
        const ps = this.declarativePresentInformalLow(infinitive, regular, true);
        if (findVowelToAppend(ps) == "아") {
            return this.merge(ps, "았");
        }
        return this.merge(ps, "었");
    }

    declarativePastInformalLow(infinitive, regular = false) {
        return this.merge(this.pastBase(infinitive, regular), "어");
    }

    declarativePastInformalHigh(infinitive, regular = false) {
        return this.merge(this.declarativePastInformalLow(infinitive, regular), "요");
    }

    declarativePastFormalLow(infinitive, regular = false) {
        return this.merge(this.pastBase(infinitive, regular), "다");
    }

    declarativePastFormalHigh(infinitive, regular = false) {
        return this.merge(this.pastBase(infinitive, regular), "습니다");
    }

    futureBase(infinitive, regular = false) {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropLAndBorrowPadchim(this.base3(infinitive, regular), "을");
        }
        return this.merge(this.base3(infinitive, regular), "을");
    }

    declarativeFutureInformalLow(infinitive, regular = false) {
        return this.merge(this.futureBase(infinitive, regular), " 거야");
    }

    declarativeFutureInformalHigh(infinitive, regular = false) {
        return this.merge(this.futureBase(infinitive, regular), " 거예요");
    }

    declarativeFutureFormalLow(infinitive, regular = false) {
        return this.merge(this.futureBase(infinitive, regular), " 거다");
    }

    declarativeFutureFormalHigh(infinitive, regular = false) {
        return this.merge(this.futureBase(infinitive, regular), " 겁니다");
    }

    declarativeFutureConditionalInformalLow(infinitive, regular = false) {
        return this.merge(this.base(infinitive, regular), "겠어");
    }

    declarativeFutureConditionalInformalHigh(infinitive, regular = false) {
        return this.merge(this.base(infinitive, regular), "겠어요");
    }

    declarativeFutureConditionalFormalLow(infinitive, regular = false) {
        return this.merge(this.base(infinitive, regular), "겠다");
    }

    declarativeFutureConditionalFormalHigh(infinitive, regular = false) {
        return this.merge(this.base(infinitive, regular), "겠습니다");
    }

    inquisitivePresentInformalLow(infinitive, regular = false) {
        return this.merge(this.declarativePresentInformalLow(infinitive, regular), "?");
    }


    inquisitivePresentInformalHigh(infinitive, regular = false) {
        return this.merge(this.declarativePresentInformalHigh(infinitive, regular), "?");
    }

    inquisitivePresentFormalLow(infinitive, regular = false) {
        infinitive = this.base(infinitive, regular);
        if (isLIrregular(infinitive, regular)) {
            return this.dropL(infinitive, "니?");
        }
        return this.merge(infinitive, "니?");
    }

    inquisitivePresentFormalHigh(infinitive, regular = false) {
        infinitive = this.base(infinitive, regular);
        if (isLIrregular(infinitive, regular)) {
            return this.dropLAndBorrowPadchim(infinitive, "습니까?");
        }
        return this.merge(infinitive, "습니까?");
    }

    inquisitivePastInformalLow(infinitive, regular = false) {
        return this.declarativePastInformalLow(infinitive, regular) + "?";
    }

    inquisitivePastInformalHigh(infinitive, regular = false) {
        return this.merge(this.declarativePastInformalHigh(infinitive, regular), "?");
    }

    inquisitivePastFormalLow(infinitive, regular = false) {
        return this.merge(this.pastBase(infinitive, regular), "니?");
    }

    inquisitivePastFormalHigh(infinitive, regular = false) {
        return this.merge(this.pastBase(infinitive, regular), "습니까?");
    }

    imperativePresentInformalLow(infinitive, regular = false) {
        return this.declarativePresentInformalLow(infinitive, regular);
    }

    imperativePresentInformalHigh(infinitive, regular = false) {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropL(this.base3(infinitive, regular), "세요");
        }
        return this.merge(this.base3(infinitive, regular), "세요");
    }

    imperativePresentFormalLow(infinitive, regular = false) {
        return this.merge(this.imperativePresentInformalLow(infinitive, regular), "라");
    }

    imperativePresentFormalHigh(infinitive, regular = false) {
        if (isLIrregular(this.base(infinitive, regular))) {
            return this.dropL(this.base3(infinitive, regular), "십시오");
        }
        return this.merge(this.base3(infinitive, regular), "십시오");
    }

    propositivePresentInformalLow(infinitive, regular = false) {
        return this.declarativePresentInformalLow(infinitive, regular);
    }

    propositivePresentInformalHigh(infinitive, regular = false) {
        return this.declarativePresentInformalHigh(infinitive, regular);
    }

    propositivePresentFormalLow(infinitive, regular = false) {
        return this.merge(this.base(infinitive, regular), "자");
    }

    propositivePresentFormalHigh(infinitive, regular = false) {
        infinitive = this.base(infinitive);
        if (isLIrregular(infinitive, regular)) {
            return this.dropLAndBorrowPadchim(this.base3(infinitive, regular), "읍시다");
        }
        return this.merge(this.base3(infinitive, regular), "읍시다");
    }

    connectiveIf(infinitive, regular = false) {
        return this.merge(this.base3(infinitive, regular), "면");
    }

    connectiveAnd(infinitive, regular = false) {
        infinitive = this.base(infinitive, regular);
        return this.merge(this.base(infinitive, regular), "고");
    }

    nominalIng(infinitive, regular = false) {
        return this.merge(this.base3(infinitive, regular), "음");
    }
}
