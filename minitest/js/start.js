const main = document.querySelector("#main");
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");
const endPoint = 4;
const select = []; //사용자가 선택한 버튼이 어떤 것이었는지 저장해두는 배열. 사용자가 버튼을 선택할때마다 배열에 값을 추가하면 된다.

/*
function calResult() {
    const pointArray = [
        { name: '신숙주', value: 0, key: 0 },
        { name: '성삼문', value: 0, key: 1 },
        { name: '최항', value: 0, key: 2 },
        { name: '이석형', value: 0, key: 3 },
        { name: '김담', value: 0, key: 4 },
        { name: '정인지', value: 0, key: 5 },
        { name: '서거정', value: 0, key: 6 },
        { name: '유성원', value: 0, key: 7 },
        { name: '강희안', value: 0, key: 8 },
        { name: '하위지', value: 0, key: 9 },
        { name: '이개', value: 0, key: 10 },
        { name: '양성지', value: 0, key: 11 },
        { name: '박팽년', value: 0, key: 12 },
    ]

    for(let i = 0; i < endPoint; i++) {
        const target = qnaList[i].a[select[i]];
        for(let j = 0; j < target.type.length; j++) {
            for(let k = 0; k < pointArray.length; k++){
                if(target.type[j] === pointArray[k].name) {
                    pointArray[k].value += 1;
                }
            }
        }
    }

    const resultArray = pointArray.sort(function (a,b) {
        if (a.value > b.value) {
            return -1;
        }
        if (a.value <= b.value) {
            return 1;
        }
        return 0;
    });

    console.log(resultArray);
    let resultword = resultArray[0].key;
    return resultword;
}
*/

function calResult() {
    const pointArray = [
        { name: '신숙주', value: 0, key: 0 },
        { name: '성삼문', value: 0, key: 1 },
        { name: '최항', value: 0, key: 2 },
        { name: '이석형', value: 0, key: 3 },
        { name: '김담', value: 0, key: 4 },
        { name: '정인지', value: 0, key: 5 },
        { name: '서거정', value: 0, key: 6 },
        { name: '유성원', value: 0, key: 7 },
        { name: '강희안', value: 0, key: 8 },
        { name: '하위지', value: 0, key: 9 },
        { name: '이개', value: 0, key: 10 },
        { name: '양성지', value: 0, key: 11 },
        { name: '박팽년', value: 0, key: 12 },
    ];

    for (let i = 0; i < endPoint; i++) {
        const target = qnaList[i].a[select[i]];
        for (let j = 0; j < target.type.length; j++) {
            for (let k = 0; k < pointArray.length; k++) {
                if (target.type[j] === pointArray[k].name) {
                    pointArray[k].value += 1;
                }
            }
        }
    }

    const resultArray = pointArray.sort((a, b) => b.value - a.value);

    // 최고 점수를 갖는 결과들을 반환
    const topResults = resultArray.filter(result => result.value === resultArray[0].value);
    
    console.log(resultArray);
    let resultWords = topResults.map(result => result.key);
    return resultWords;
}

/*
function setResult() {
    let points = calResult();
    const resultNames = points.map(point => infoList[point].name);
    const resultName = document.querySelector('.resultName');
    resultName.innerHTML = resultNames.join(', ');

    const imgDiv = document.querySelector('#resultImg');
    imgDiv.innerHTML = ""; // 기존 이미지 삭제

    points.forEach(point => {
        const resultImg = document.createElement('img');
        const imgURL = 'img/image-' + point + '.png';
        resultImg.src = imgURL;
        resultImg.alt = point;
        resultImg.classList.add('img-fluid');
        imgDiv.appendChild(resultImg);
    });

    const resultContent = document.querySelector('.resultContent');
    resultContent.innerHTML = infoList[points[0]].content; // 여러 결과 중 첫 번째 결과의 내용을 표시
}
*/


function setResult() {
    let points = calResult();
    const resultContainer = document.querySelector('.resultContent');
    resultContainer.innerHTML = ""; // 기존 내용 삭제

    const resultCount = points.length;
    const resultIntro = document.createElement('p');
    resultIntro.innerHTML = `당신 안에 숨겨진 집현전 학사는 총 ${resultCount}명 입니다.`;
    resultContainer.appendChild(resultIntro);

    points.forEach(point => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('resultItem');

        const resultName = document.createElement('h3');
        resultName.innerHTML = infoList[point].name;
        resultItem.appendChild(resultName);

        const resultImg = document.createElement('img');
        const imgURL = 'img/image-' + point + '.png';
        resultImg.src = imgURL;
        resultImg.alt = point;
        resultImg.classList.add('img-fluid');
        resultItem.appendChild(resultImg);

        const resultContent = document.createElement('p');
        resultContent.innerHTML = infoList[point].content;
        resultItem.appendChild(resultContent);

        resultContainer.appendChild(resultItem);
    });
}




function goResult() {
    qna.style.WebkitAnimation = "fadeOut 1s";
    qna.style.animation = "fadeOut 1s";
    setTimeout(() => {
        result.style.WebkitAnimation = "fadeIn 1s";
        result.style.animation = "fadeIn 1s";
        setTimeout(() => {
            qna.style.display = "none";
            result.style.display = "block";
        }, 450);
    });

    console.log(select);
    setResult();
}



function addAnswer(answerText, qIdx, idx) {
    const a = document.querySelector('.answerBox');
    const answer = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('my-3');
    answer.classList.add('py-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');
    a.appendChild(answer);
    answer.innerHTML = answerText;

    answer.addEventListener("click", function () {
        const children = document.querySelectorAll('.answerList');
        for (let i = 0; i < children.length; i++) {
            children[i].disabled = true;

            children[i].style.WebkitAnimation = "fadeOut 0.5s";
            children[i].style.animation = "fadeOut 0.5s";

            children[i].style.display = 'none';
        }
        setTimeout(() => {
            select[qIdx] = idx;
            for (let i = 0; i < children.length; i++) {
                children[i].style.display = 'none';
            }
            goNext(++qIdx);
        }, 450);
    }, false);
}

function goNext(qIdx) {
    if (qIdx === endPoint) {
        goResult();
        return;
    }

    const q = document.querySelector('.qBox');
    q.innerHTML = qnaList[qIdx].q;

    for (let i in qnaList[qIdx].a) {
        addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
    }
    const status = document.querySelector('.statusBar');
    status.style.width = (100 / endPoint) * (qIdx + 1) + '%';
}



function begin() {
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";
    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadeIn 1s";
        setTimeout(() => {
            main.style.display = "none";
            qna.style.display = "block";
            let qIdx = 0;
            goNext(qIdx);
        }, 450);
    }, 450);
}
