import { matchGeulja, getPadchim } from "./hangul.js";

const not_p_irregular = { "털썩이잡": true, "넘겨잡": true, "우접": true, "입": true, "맞접": true, "문잡": true, "다잡": true, "까뒤집": true, "배좁": true, "목잡": true, "끄집": true, "잡": true, "옴켜잡": true, "검잡": true, "되순라잡": true, "내씹": true, "모집": true, "따잡": true, "엇잡": true, "까집": true, "겹집": true, "줄통뽑": true, "버르집": true, "지르잡": true, "추켜잡": true, "업": true, "되술래잡": true, "되접": true, "좁디좁": true, "더위잡": true, "말씹": true, "내뽑": true, "집": true, "걸머잡": true, "휘어잡": true, "꿰입": true, "황잡": true, "에굽": true, "내굽": true, "따라잡": true, "맞뒤집": true, "둘러업": true, "늘잡": true, "끄잡": true, "우그려잡": true, "어줍": true, "언걸입": true, "들이곱": true, "껴잡": true, "곱 접": true, "훔켜잡": true, "늦추잡": true, "갈아입": true, "친좁": true, "희짜뽑": true, "마음잡": true, "개미잡": true, "옴씹": true, "치잡": true, "그러잡": true, "움켜잡": true, "씹": true, "비집": true, "꼽": true, "살잡": true, "죄입": true, "졸잡": true, "가려잡": true, "뽑": true, "걷어잡": true, "헐잡": true, "돌라입": true, "덧잡": true, "얕잡": true, "낫잡": true, "부여잡": true, "맞붙잡": true, "걸입": true, "주름잡": true, "걷어입": true, "빌미잡": true, "개잡": true, "겉잡": true, "안쫑잡": true, "좁": true, "힘입": true, "걷잡": true, "바르집": true, "감씹": true, "짓씹": true, "손잡": true, "포집": true, "붙잡": true, "낮잡": true, "책잡": true, "곱잡": true, "흉잡": true, "뒤집": true, "땡잡": true, "어림잡": true, "덧껴입": true, "수줍": true, "뒤잡": true, "꼬집": true, "예굽": true, "덮쳐잡": true, "헛잡": true, "되씹": true, "낮추잡": true, "날파람잡": true, "틀어잡": true, "헤집": true, "남의달잡": true, "바로잡": true, "흠잡": true, "파잡": true, "얼추잡": true, "손꼽": true, "접": true, "차려입": true, "골라잡": true, "거머잡": true, "후려잡": true, "머줍": true, "넉장뽑": true, "사로잡": true, "덧입": true, "껴입": true, "얼입": true, "우집": true, "설잡": true, "늦잡": true, "비좁": true, "고르잡": true, "때려잡": true, "떼집": true, "되잡": true, "홈켜잡": true, "내곱": true, "곱씹": true, "빼입": true, "들이굽": true, "새잡": true, "이르집": true, "떨쳐입": true };
const not_s_irregular = { "내솟": true, "빗": true, "드솟": true, "비웃": true, "뺏": true, "샘솟": true, "벗": true, "들이웃": true, "솟": true, "되뺏": true, "빼앗": true, "밧": true, "애긋": true, "짜드라웃": true, "어그솟": true, "들솟": true, "씻": true, "빨가벗": true, "깃": true, "벌거벗": true, "엇": true, "되빼앗": true, "웃": true, "앗": true, "헐벗": true, "용솟": true, "덧솟": true, "발가벗": true, "뻘거벗": true, "날솟": true, "치솟": true };
const not_d_irregular = { "맞받": true, "내딛": true, "내리받": true, "벋": true, "뒤닫": true, "주고받": true, "공얻": true, "무뜯": true, "물어뜯": true, "여닫": true, "그러묻": true, "잇닫": true, "덧묻": true, "되받": true, "뻗": true, "올리닫": true, "헐뜯": true, "들이닫": true, "활걷": true, "겉묻": true, "닫": true, "창받": true, "건네받": true, "물손받": true, "들이받": true, "강요받": true, "내리벋": true, "받": true, "이어받": true, "부르걷": true, "응받": true, "검뜯": true, "인정받": true, "내려딛": true, "내쏟": true, "내리뻗": true, "너름받": true, "세받": true, "내 돋": true, "돌려받": true, "쥐어뜯": true, "껴묻": true, "본받": true, "뒤받": true, "강종받": true, "내리닫": true, "떠받": true, "테받": true, "내받": true, "흠뜯": true, "두남받": true, "치받": true, "부르돋": true, "대받": true, "설굳": true, "처닫": true, "얻": true, "들이돋": true, "돋": true, "죄받": true, "쏟": true, "씨받": true, "딱장받": true, "치걷": true, "믿": true, "치벋": true, "버림받": true, "북돋": true, "딛": true, "치고받": true, "욱걷": true, "물려받": true, "뜯": true, "줴뜯": true, "넘겨받": true, "안받": true, "내뻗": true, "내리쏟": true, "벋딛": true, "뒤묻": true, "뻗딛": true, "치뻗": true, "치닫": true, "줄밑걷": true, "굳": true, "내닫": true, "내림받": true };
const not_h_irregular = { "들이좋": true, "터놓": true, "접어놓": true, "좋": true, "풀어놓": true, "내쌓": true, "꼴좋": true, "치쌓": true, "물어넣": true, "잇닿": true, "끝닿": true, "그러넣": true, "뽕놓": true, "낳": true, "내리찧": true, "힘닿": true, "내려놓": true, "세놓": true, "둘러놓": true, "들놓": true, "맞찧": true, "잡아넣": true, "돌라쌓": true, "덧쌓": true, "갈라땋": true, "주놓": true, "갈라놓": true, "들이닿": true, "집어넣": true, "닿": true, "의좋": true, "막놓": true, "내놓": true, "들여놓": true, "사놓": true, "썰레놓": true, "짓찧": true, "벋놓": true, "찧": true, "침놓": true, "들이찧": true, "둘러쌓": true, "털어놓": true, "담쌓": true, "돌라놓": true, "되잡아넣": true, "끌어넣": true, "덧놓": true, "맞닿": true, "처넣": true, "빻": true, "뻥놓": true, "내리쌓": true, "곱놓": true, "설레발놓": true, "우겨넣": true, "놓": true, "수놓": true, "써넣": true, "널어놓": true, "덮쌓": true, "연닿": true, "헛놓": true, "돌려놓": true, "되쌓": true, "욱여넣": true, "앗아넣": true, "올려놓": true, "헛방놓": true, "날아놓": true, "뒤놓": true, "업수놓": true, "가로놓": true, "맞놓": true, "펴놓": true, "내켜놓": true, "쌓": true, "끙짜놓": true, "들이쌓": true, "겹쌓": true, "기추놓": true, "넣": true, "불어넣": true, "늘어놓": true, "긁어놓": true, "어긋놓": true, "앞넣": true, "눌러놓": true, "땋": true, "들여쌓": true, "빗놓": true, "사이좋": true, "되놓": true, "헛불놓": true, "몰아넣": true, "먹놓": true, "밀쳐놓": true, "살닿": true, "피새놓": true, "빼놓": true, "하차놓": true, "틀어넣": true };
const not_l_euh_irregular = { "우러르": true, "따르": true, "붙따르": true, "늦치르": true, "다다르": true, "잇따르": true, "치르": true };
const not_l_irregular = {};

function afterLastSpace(infinitive) {
    const split = infinitive.split(" ");
    return split[split.length - 1];
}

export function isSIrregular(infinitive, regular = false) {
    if (regular) return false;
    return matchGeulja(infinitive[infinitive.length - 1], undefined, undefined, "ᆺ") && (!not_s_irregular[afterLastSpace(infinitive)] || false);
}

export function isLIrregular(infinitive, regular = false) {
    if (regular) return false;
    return matchGeulja(infinitive[infinitive.length - 1], undefined, undefined, "ᆯ") && (!not_l_irregular[afterLastSpace(infinitive)] || false);
}

export function isLEuIrregular(infinitive, regular = false) {
    if (regular) return false;
    return matchGeulja(infinitive[infinitive.length - 1], "ᄅ", "ㅡ", null) && (!not_l_euh_irregular[afterLastSpace(infinitive)] || false);
}

export function isHIrregular(infinitive, regular = false) {
    if (regular) return false;
    return (getPadchim(infinitive[infinitive.length - 1]) == "ᇂ" || infinitive[infinitive.length - 1] == "러") && (!not_h_irregular[afterLastSpace(infinitive)] || false);
}

export function isPIrregular(infinitive, regular = false) {
    if (regular) return false;
    return matchGeulja(infinitive[infinitive.length - 1], undefined, undefined, "ᆸ") && (!not_p_irregular[afterLastSpace(infinitive)] || false);
}

export function isDIrregular(infinitive, regular = false) {
    if (regular) return false;
    return matchGeulja(infinitive[infinitive.length - 1], undefined, undefined, "ᆮ") && (!not_d_irregular[afterLastSpace(infinitive)] || false);
}

