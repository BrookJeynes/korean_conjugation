import { beforeEach, describe, expect, test } from "bun:test";
import { Conjugator } from "./conjugator.js";

let conjugation: Conjugator;

beforeEach(() => {
    conjugation = new Conjugator();
});

test("merge", () => {
    expect(conjugation.merge("오", "아요")).toBe("와요");
    expect(conjugation.reasons).toEqual(["vowel contraction [ㅗ + ㅏ -> ㅘ] (오 + 아요 -> 와요)"]);
    expect(conjugation.merge("오", "아")).toBe("와");
    expect(conjugation.merge("갔", "면")).toBe("갔으면");
    expect(conjugation.merge("일어나", "면")).toBe("일어나면");
    expect(conjugation.merge("맡", "세요")).toBe("맡으세요");
});

describe("base", () => {
    test("base3", () => {
        expect(conjugation.base3("돕다")).toBe("도우");
    });

    test("past", () => {
        expect(conjugation.pastBase("하")).toBe("했");
        expect(conjugation.pastBase("가")).toBe("갔");
        expect(conjugation.pastBase("기다리")).toBe("기다렸");
        expect(conjugation.pastBase("기다리다")).toBe("기다렸");
        expect(conjugation.pastBase("마르다")).toBe("말랐");
        expect(conjugation.pastBase("드르다")).toBe("들렀");
    });

    test("future base", () => {
        expect(conjugation.futureBase("가다")).toBe("갈");
        expect(conjugation.futureBase("가늘다")).toBe("가늘");
        expect(conjugation.futureBase("좋다")).toBe("좋을");
        expect(conjugation.futureBase("뵙다")).toBe("뵐");
    });
});

describe("declarative present ", () => {
    test("informal low", () => {
        expect(conjugation.declarativePresentInformalLow("이르다", true), "일러");
        expect(conjugation.declarativePresentInformalLow("이르다"), "이르러");
        expect(conjugation.declarativePresentInformalLow("받다"), "받아");
        expect(conjugation.declarativePresentInformalLow("주고 받다"), "주고 받아");
        expect(conjugation.declarativePresentInformalLow("민주적이다"), "민주적이야");
        expect(conjugation.declarativePresentInformalHigh("민주적이다"), "민주적이에요");
        expect(conjugation.declarativePresentInformalLow("귯"), "규어");
        expect(conjugation.declarativePresentInformalLow("귯", true), "귯어");
        expect(conjugation.declarativePresentInformalLow("치르다"), "치러");
        expect(conjugation.declarativePresentInformalLow("줍다"), "주워");
        expect(conjugation.declarativePresentInformalLow("동트다"), "동터");
        expect(conjugation.declarativePresentInformalLow("농트다"), "농터");
        expect(conjugation.declarativePresentInformalLow("엇다"), "엇어");
        expect(conjugation.declarativePresentInformalLow("푸다"), "퍼");
        expect(conjugation.declarativePresentInformalLow("깃다"), "깃어");
        expect(conjugation.declarativePresentInformalLow("그러다"), "그래");
        expect(conjugation.declarativePresentInformalLow("애긋다"), "애긋어");
        expect(conjugation.declarativePresentInformalLow("되묻다"), "되물어");
        expect(conjugation.declarativePresentInformalLow("밧다"), "밧아");
        expect(conjugation.declarativePresentInformalLow("힘닿다"), "힘닿아");
        expect(conjugation.declarativePresentInformalLow("용솟다"), "용솟아");
        expect(conjugation.declarativePresentInformalLow("쌓다"), "쌓아");
        expect(conjugation.declarativePresentInformalLow("파묻다", true), "파묻어");
        expect(conjugation.declarativePresentInformalLow("부르걷다"), "부르걷어");
        expect(conjugation.declarativePresentInformalLow("되묻다", true), "되묻어");
        expect(conjugation.declarativePresentInformalLow("뵙다"), "봬");
        expect(conjugation.declarativePresentInformalLow("쏟다"), "쏟아");
        expect(conjugation.declarativePresentInformalLow("묻잡다"), "묻자와");
        expect(conjugation.declarativePresentInformalLow("가로닫다"), "가로달아");
        expect(conjugation.declarativePresentInformalLow("동트다"), "동터");
        expect(conjugation.declarativePresentInformalLow("농트다"), "농터");
        expect(conjugation.declarativePresentInformalLow("농트다"), "농터");
        expect(conjugation.declarativePresentInformalLow("엇다"), "엇어");
        expect(conjugation.declarativePresentInformalLow("푸다"), "퍼");
        expect(conjugation.declarativePresentInformalLow("깃다"), "깃어");
        expect(conjugation.declarativePresentInformalLow("그러다"), "그래");
        expect(conjugation.declarativePresentInformalLow("애긋다"), "애긋어");
        expect(conjugation.declarativePresentInformalLow("되묻다"), "되물어");
        expect(conjugation.declarativePresentInformalLow("밧다"), "밧아");
        expect(conjugation.declarativePresentInformalLow("힘닿다"), "힘닿아");
        expect(conjugation.declarativePresentInformalLow("용솟다"), "용솟아");
        expect(conjugation.declarativePresentInformalLow("쌓다"), "쌓아");
        expect(conjugation.declarativePresentInformalLow("파묻다", true), "파묻어");
        expect(conjugation.declarativePresentInformalLow("부르걷다"), "부르걷어");
        expect(conjugation.declarativePresentInformalLow("되묻다", true), "되묻어");
        expect(conjugation.declarativePresentInformalLow("뵙다"), "봬");
        expect(conjugation.declarativePresentInformalLow("놓다"), "놓아");
        expect(conjugation.declarativePresentInformalLow("요러다"), "요래");
        expect(conjugation.declarativePresentInformalLow("내솟다"), "내솟아");
        expect(conjugation.declarativePresentInformalLow("북돋다"), "북돋아");
        expect(conjugation.declarativePresentInformalLow("부르돋다"), "부르돋아");
        expect(conjugation.declarativePresentInformalLow("뒤묻다"), "뒤묻어");
        expect(conjugation.declarativePresentInformalLow("껴묻다"), "껴묻어");
        expect(conjugation.declarativePresentInformalLow("그러묻다"), "그러묻어");
        expect(conjugation.declarativePresentInformalLow("겉묻다"), "겉묻어");
        expect(conjugation.declarativePresentInformalLow("손쓰다"), "손써");
        expect(conjugation.declarativePresentInformalLow("따르다"), "따라");
        expect(conjugation.declarativePresentInformalLow("악쓰다"), "악써");
        expect(conjugation.declarativePresentInformalLow("활걷다"), "활걷어");
        expect(conjugation.declarativePresentInformalLow("파묻다"), "파물어");
        expect(conjugation.declarativePresentInformalLow("캐묻다"), "캐물어");
        expect(conjugation.declarativePresentInformalLow("줄밑걷다"), "줄밑걷어");
        expect(conjugation.declarativePresentInformalLow("묻다"), "물어");
        expect(conjugation.declarativePresentInformalLow("예굽다"), "예굽어");
        expect(conjugation.declarativePresentInformalLow("에굽다"), "에굽어");
        expect(conjugation.declarativePresentInformalLow("치걷다"), "치걷어");
        expect(conjugation.declarativePresentInformalLow("욱걷다"), "욱걷어");
        expect(conjugation.declarativePresentInformalLow("설굳다"), "설굳어");
        expect(conjugation.declarativePresentInformalLow("내리벋다"), "내리벋어");
        expect(conjugation.declarativePresentInformalLow("내딛다"), "내딛어");
        expect(conjugation.declarativePresentInformalLow("굳다"), "굳어");
        expect(conjugation.declarativePresentInformalLow("흉업다"), "흉어워");
        expect(conjugation.declarativePresentInformalLow("빛접다"), "빛저워");
        expect(conjugation.declarativePresentInformalLow("바잡다"), "바자워");
        // expect(conjugation.declarativePresentInformalLow('허여멀겋다'), '허여멀게');
        expect(conjugation.declarativePresentInformalLow("켜다"), "켜");
        expect(conjugation.declarativePresentInformalLow("폐다"), "폐");
        expect(conjugation.declarativePresentInformalLow("서릊다"), "서릊어");
        expect(conjugation.declarativePresentInformalLow("홉뜨다"), "홉떠");
        expect(conjugation.declarativePresentInformalLow("접다"), "접어");
        expect(conjugation.declarativePresentInformalLow("업다"), "업어");
        expect(conjugation.declarativePresentInformalLow("뺏다"), "뺏어");
        expect(conjugation.declarativePresentInformalLow("겉약다"), "겉약아");
        expect(conjugation.declarativePresentInformalLow("흠뜯다"), "흠뜯어");
        expect(conjugation.declarativePresentInformalLow("수줍다"), "수줍어");
        expect(conjugation.declarativePresentInformalLow("이르다"), "이르러");
        expect(conjugation.declarativePresentInformalLow("엷푸르다"), "엷푸르러");
        expect(conjugation.declarativePresentInformalLow("덧묻다"), "덧묻어");
        expect(conjugation.declarativePresentInformalLow("묻다", true), "묻어");
        expect(conjugation.declarativePresentInformalLow("끄집다"), "끄집어");
        expect(conjugation.declarativePresentInformalLow("내리찧다"), "내리찧어");
        expect(conjugation.declarativePresentInformalLow("헐벗다"), "헐벗어");
        expect(conjugation.declarativePresentInformalLow("빼입다"), "빼입어");
        expect(conjugation.declarativePresentInformalLow("많다"), "많아");
        expect(conjugation.declarativePresentInformalLow("앗다"), "앗아");
        expect(conjugation.declarativePresentInformalLow("좋다"), "좋아");
        expect(conjugation.declarativePresentInformalLow("만들다"), "만들어");
        expect(conjugation.declarativePresentInformalLow("어떻다"), "어때");
        expect(conjugation.declarativePresentInformalLow("까맣다"), "까매");
        expect(conjugation.declarativePresentInformalLow("하얗다"), "하얘");
        expect(conjugation.declarativePresentInformalLow("잡"), "잡아");
        expect(conjugation.declarativePresentInformalLow("뽑"), "뽑아");
        expect(conjugation.declarativePresentInformalLow("입"), "입어");
        expect(conjugation.declarativePresentInformalLow("아프다"), "아파");
        expect(conjugation.declarativePresentInformalLow("하"), "해");
        expect(conjugation.declarativePresentInformalLow("가"), "가");
        expect(conjugation.declarativePresentInformalLow("오"), "와");
        expect(conjugation.declarativePresentInformalLow("피우"), "피워");
        expect(conjugation.declarativePresentInformalLow("듣"), "들어");
        expect(conjugation.declarativePresentInformalLow("춥"), "추워");
        expect(conjugation.declarativePresentInformalLow("낫"), "나아");
        expect(conjugation.declarativePresentInformalLow("알"), "알아");
        expect(conjugation.declarativePresentInformalLow("기다리"), "기다려");
        expect(conjugation.declarativePresentInformalLow("마르"), "말라");
        expect(conjugation.declarativePresentInformalLow("부르다"), "불러");
        expect(conjugation.declarativePresentInformalLow("되"), "돼");
        expect(conjugation.declarativePresentInformalLow("쓰"), "써");
        expect(conjugation.declarativePresentInformalLow("서"), "서");
        expect(conjugation.declarativePresentInformalLow("세"), "세");
        expect(conjugation.declarativePresentInformalLow("기다리다"), "기다려");
        expect(conjugation.declarativePresentInformalLow("굽다"), "구워");
        expect(conjugation.declarativePresentInformalLow("걷다"), "걸어");
        expect(conjugation.declarativePresentInformalLow("짓다"), "지어");
        expect(conjugation.declarativePresentInformalLow("웃다"), "웃어");
        expect(conjugation.declarativePresentInformalLow("걸다"), "걸어");
        expect(conjugation.declarativePresentInformalLow("깨닫다"), "깨달아");
        expect(conjugation.declarativePresentInformalLow("남다"), "남아");
        expect(conjugation.declarativePresentInformalLow("오르다"), "올라");
        expect(conjugation.declarativePresentInformalLow("돕다"), "도와");
        expect(conjugation.declarativePresentInformalLow("덥다"), "더워");
        expect(conjugation.declarativePresentInformalLow("푸르다"), "푸르러");
        expect(conjugation.declarativePresentInformalLow("번거롭다"), "번거로워");
    });

    test("informal high", () => {
        expect(conjugation.declarativePresentInformalHigh("굽다", true)).toBe("굽어요");
        expect(conjugation.declarativePresentInformalHigh("가다")).toBe("가요");
    });

    test("formal low", () => {
        expect(conjugation.declarativePresentFormalLow("가다")).toBe("간다");
        expect(conjugation.declarativePresentFormalLow("믿다")).toBe("믿는다");
        expect(conjugation.declarativePresentFormalLow("걷다")).toBe("걷는다");
        expect(conjugation.declarativePresentFormalLow("짓다")).toBe("짓는다");
        expect(conjugation.declarativePresentFormalLow("부르다")).toBe("부른다");
        expect(conjugation.declarativePresentFormalLow("살다")).toBe("산다");
        expect(conjugation.declarativePresentFormalLow("오르다")).toBe("오른다");
    });

    test("formal high", () => {
        expect(conjugation.declarativePresentFormalHigh("가다")).toBe("갑니다");
        expect(conjugation.declarativePresentFormalHigh("좋다")).toBe("좋습니다");
        expect(conjugation.declarativePresentFormalHigh("믿다")).toBe("믿습니다");
        expect(conjugation.declarativePresentFormalHigh("걸다")).toBe("겁니다");
        expect(conjugation.declarativePresentFormalHigh("깨닫다")).toBe("깨닫습니다");
        expect(conjugation.declarativePresentFormalHigh("알다")).toBe("압니다");
        expect(conjugation.declarativePresentFormalHigh("푸르다")).toBe("푸릅니다");
    });
});

describe("declarative past ", () => {
    test("informal low", () => {
        expect(conjugation.declarativePastInformalLow("푸다")).toBe("펐어");
        expect(conjugation.declarativePastInformalLow("뵙다")).toBe("뵀어");
        expect(conjugation.declarativePastInformalLow("쬐다")).toBe("쬈어");
        expect(conjugation.declarativePastInformalLow("하")).toBe("했어");
        expect(conjugation.declarativePastInformalLow("가")).toBe("갔어");
        expect(conjugation.declarativePastInformalLow("먹")).toBe("먹었어");
        expect(conjugation.declarativePastInformalLow("오")).toBe("왔어");
    });

    test("informal high", () => {
        expect(conjugation.declarativePastInformalHigh("하다")).toBe("했어요");
        expect(conjugation.declarativePastInformalHigh("가다")).toBe("갔어요");
    });

    test("formal low", () => {
        expect(conjugation.declarativePastFormalLow("가다")).toBe("갔다");
    });

    test("formal high", () => {
        expect(conjugation.declarativePastFormalHigh("가다")).toBe("갔습니다");
    });
});


describe("declarative future ", () => {
    test("informal low", () => {
        expect(conjugation.declarativeFutureInformalLow("끌어넣다")).toBe("끌어넣을 거야");
        expect(conjugation.declarativeFutureInformalLow("좁디좁다")).toBe("좁디좁을 거야");
        expect(conjugation.declarativeFutureInformalLow("가다")).toBe("갈 거야");
        expect(conjugation.declarativeFutureInformalLow("믿다")).toBe("믿을 거야");
        expect(conjugation.declarativeFutureInformalLow("알다")).toBe("알 거야");
    });

    test("informal high", () => {
        expect(conjugation.declarativeFutureInformalHigh("하얗다")).toBe("하얄 거예요");
        expect(conjugation.declarativeFutureInformalHigh("가다")).toBe("갈 거예요");
        expect(conjugation.declarativeFutureInformalHigh("믿다")).toBe("믿을 거예요");
        expect(conjugation.declarativeFutureInformalHigh("걷다")).toBe("걸을 거예요");
        expect(conjugation.declarativeFutureInformalHigh("알다")).toBe("알 거예요");
    });

    test("formal low", () => {
        expect(conjugation.declarativeFutureFormalLow("가다")).toBe("갈 거다");
        expect(conjugation.declarativeFutureFormalLow("앉다")).toBe("앉을 거다");
        expect(conjugation.declarativeFutureFormalLow("알다")).toBe("알 거다");
    });

    test("formal high", () => {
        expect(conjugation.declarativeFutureFormalHigh("가다")).toBe("갈 겁니다");
        expect(conjugation.declarativeFutureFormalHigh("앉다")).toBe("앉을 겁니다");
        expect(conjugation.declarativeFutureFormalHigh("알다")).toBe("알 겁니다");
    });

    test("conditional informal low", () => {
        expect(conjugation.declarativeFutureConditionalInformalLow("가다")).toBe("가겠어");
    });

    test("conditional informal high", () => {
        expect(conjugation.declarativeFutureConditionalInformalHigh("가다")).toBe("가겠어요");
    });

    test("conditional formal low", () => {
        expect(conjugation.declarativeFutureConditionalFormalLow("가다")).toBe("가겠다");
    });

    test("conditional formal high", () => {
        expect(conjugation.declarativeFutureConditionalFormalHigh("가다")).toBe("가겠습니다");
    });
});

describe("inquisitive present", () => {
    test("informal low", () => {
        expect(conjugation.inquisitivePresentInformalLow("가다")).toBe("가?");
        expect(conjugation.inquisitivePresentInformalLow("하다")).toBe("해?");
    });

    test("informal high", () => {
        expect(conjugation.inquisitivePresentInformalHigh("가다")).toBe("가요?");
    });

    test("formal low", () => {
        expect(conjugation.inquisitivePresentFormalLow("가다")).toBe("가니?");
        expect(conjugation.inquisitivePresentFormalLow("알다")).toBe("아니?");
    });

    test("formal high", () => {
        expect(conjugation.inquisitivePresentFormalHigh("가다")).toBe("갑니까?");
        expect(conjugation.inquisitivePresentFormalHigh("까맣다")).toBe("까맣습니까?");
    });

    test("informal low", () => {
        expect(conjugation.inquisitivePastInformalLow("가다")).toBe("갔어?");
    });
});


describe("inquisitive past", () => {
    test("informal high", () => {
        expect(conjugation.inquisitivePastInformalHigh("가다")).toBe("갔어요?");
    });

    test("formal low", () => {
        expect(conjugation.inquisitivePastFormalLow("가다")).toBe("갔니?");
    });

    test("formal high", () => {
        expect(conjugation.inquisitivePastFormalHigh("가다")).toBe("갔습니까?");
    });
});


describe("imperative present", () => {
    test("informal low", () => {
        expect(conjugation.imperativePresentInformalLow("가다")).toBe("가");
    });

    test("informal high", () => {
        expect(conjugation.imperativePresentInformalHigh("가다")).toBe("가세요");
        expect(conjugation.imperativePresentInformalHigh("돕다")).toBe("도우세요");
        expect(conjugation.imperativePresentInformalHigh("걷다")).toBe("걸으세요");
        expect(conjugation.imperativePresentInformalHigh("눕다")).toBe("누우세요");
        expect(conjugation.imperativePresentInformalHigh("살다")).toBe("사세요");
        expect(conjugation.imperativePresentInformalHigh("걸다")).toBe("거세요");
    });

    test("formal low", () => {
        expect(conjugation.imperativePresentFormalLow("가다")).toBe("가라");
        expect(conjugation.imperativePresentFormalLow("굽다")).toBe("구워라");
        expect(conjugation.imperativePresentFormalLow("살다")).toBe("살아라");
        expect(conjugation.imperativePresentFormalLow("서")).toBe("서라");
        expect(conjugation.imperativePresentFormalLow("뵙다")).toBe("봬라");
    });

    test("formal high", () => {
        expect(conjugation.imperativePresentFormalHigh("가다")).toBe("가십시오");
        expect(conjugation.imperativePresentFormalHigh("걷다")).toBe("걸으십시오");
        expect(conjugation.imperativePresentFormalHigh("돕다")).toBe("도우십시오");
        expect(conjugation.imperativePresentFormalHigh("알다")).toBe("아십시오");
        expect(conjugation.imperativePresentFormalHigh("눕다")).toBe("누우십시오");
        expect(conjugation.imperativePresentFormalHigh("뵙다")).toBe("뵈십시오");
    });
});

describe("propositive present", () => {
    test("informal low", () => {
        expect(conjugation.propositivePresentInformalLow("가")).toBe("가");
    });

    test("informal high", () => {
        expect(conjugation.propositivePresentInformalHigh("가")).toBe("가요");
    });

    test("formal low", () => {
        expect(conjugation.propositivePresentFormalLow("가")).toBe("가자");
    });

    test("formal high", () => {
        expect(conjugation.propositivePresentFormalHigh("가")).toBe("갑시다");
        expect(conjugation.propositivePresentFormalHigh("살")).toBe("삽시다");
        expect(conjugation.propositivePresentFormalHigh("눕다")).toBe("누웁시다");
        expect(conjugation.propositivePresentFormalHigh("돕다")).toBe("도웁시다");
    });
});

describe("connectives", () => {
    test("connective if", () => {
        expect(conjugation.connectiveIf("낫")).toBe("나으면");
        expect(conjugation.connectiveIf("짓")).toBe("지으면");
        expect(conjugation.connectiveIf("짖")).toBe("짖으면");
        expect(conjugation.connectiveIf("가")).toBe("가면");
        expect(conjugation.connectiveIf("알")).toBe("알면");
        expect(conjugation.connectiveIf("살")).toBe("살면");
        expect(conjugation.connectiveIf("푸르다")).toBe("푸르면");
        expect(conjugation.connectiveIf("돕다")).toBe("도우면");
    });

    test("connective and", () => {
        expect(conjugation.connectiveAnd("가다")).toBe("가고");
    });

    test("nominal ing", () => {
        expect(conjugation.nominalIng("살다")).toBe("삶");
        expect(conjugation.nominalIng("걷다")).toBe("걸음");
        expect(conjugation.nominalIng("가져오다")).toBe("가져옴");
        expect(conjugation.nominalIng("걷다")).toBe("걸음");
        expect(conjugation.nominalIng("그렇다")).toBe("그럼");
        expect(conjugation.nominalIng("까맣다")).toBe("까맘");
        expect(conjugation.nominalIng("돕다")).toBe("도움");
    });
});
