// 항저우 10개 성문터 데이터
const gates = [
    { id: 1, name: "청파문", lat: 30.2590, lng: 120.1634 },
    { id: 2, name: "용금문", lat: 30.2551, lng: 120.1701 },
    { id: 3, name: "전당문", lat: 30.2495, lng: 120.1748 },
    { id: 4, name: "무림문", lat: 30.2436, lng: 120.1757 },
    { id: 5, name: "양산문", lat: 30.2391, lng: 120.1718 },
    { id: 6, name: "경춘문", lat: 30.2377, lng: 120.1634 },
    { id: 7, name: "청태문", lat: 30.2409, lng: 120.1556 },
    { id: 8, name: "망강문", lat: 30.2469, lng: 120.1525 },
    { id: 9, name: "후조문", lat: 30.2533, lng: 120.1525 },
    { id: 10, name: "봉산문", lat: 30.2582, lng: 120.1570 }
];

let visitedGates = {};
let locationTrackingInterval;

// 로컬 스토리지에서 방문 데이터 로드
function loadVisitedGates() {
    const savedData = localStorage.getItem('visitedGates');
    if (savedData) {
        visitedGates = JSON.parse(savedData);
        updateGateList();
        updateProgressBar();
    }
}

// 로컬 스토리지에 방문 데이터 저장
function saveVisitedGates() {
    localStorage.setItem('visitedGates', JSON.stringify(visitedGates));
}

// 현재 위치를 가져오는 함수
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    });
}

// 두 지점 간의 거리를 계산하는 함수 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 성문 방문을 확인하는 함수
async function checkGateVisit() {
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        gates.forEach(gate => {
            const distance = calculateDistance(latitude, longitude, gate.lat, gate.lng);
            if (distance <= 0.05) { // 50미터 이내에 있으면 방문으로 인정
                if (!visitedGates[gate.id]) {
                    visitedGates[gate.id] = true;
                    updateGateList();
                    updateProgressBar();
                    saveVisitedGates();
                    showNotification(`${gate.name}을(를) 발견했습니다!`);
                }
            }
        });

        checkMissionComplete();
    } catch (error) {
        console.error("위치를 가져오는 데 실패했습니다:", error);
        updateStatus("위치 정보를 가져올 수 없습니다. GPS 설정을 확인해주세요.");
    }
}

// 성문 목록 업데이트 함수
function updateGateList() {
    const gateList = document.getElementById('gate-list');
    gateList.innerHTML = '';
    gates.forEach(gate => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${gate.name}</h3>
            <p>${visitedGates[gate.id] ? '발견 완료!' : '아직 발견되지 않음'}</p>
        `;
        if (visitedGates[gate.id]) {
            li.classList.add('discovered');
        }
        gateList.appendChild(li);
    });
}

// 진행 상황 바 업데이트 함수
function updateProgressBar() {
    const progressBar = document.querySelector('#progress-bar span');
    const progressText = document.getElementById('progress-text');
    const visitedCount = Object.values(visitedGates).filter(Boolean).length;
    const percentage = (visitedCount / gates.length) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${visitedCount} / ${gates.length} 발견`;
}

// 상태 메시지 업데이트 함수
function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

// 미션 완료 확인 함수
function checkMissionComplete() {
    const allVisited = gates.every(gate => visitedGates[gate.id]);
    if (allVisited) {
        document.getElementById('quest').style.display = 'none';
        document.getElementById('mission-complete').style.display = 'block';
        showNotification("축하합니다! 모든 성문터를 발견했습니다!");
        stopLocationTracking();
    }
}

// 알림 표시 함수
function showNotification(message) {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification("항저우 비밀의 문", { body: message });
            }
        });
    }
    
    // 페이지 내 알림 표시
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// 주기적으로 위치 확인
function startLocationTracking() {
    checkGateVisit();
    locationTrackingInterval = setInterval(checkGateVisit, 60000); // 1분마다 위치 확인
}

// 위치 추적 중지
function stopLocationTracking() {
    clearInterval(locationTrackingInterval);
}

// 모험 시작 함수
function startAdventure() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('quest').style.display = 'block';
    startLocationTracking();
}

// 첫 페이지로 돌아가는 함수
function returnToIntro() {
    document.getElementById('quest').style.display = 'none';
    document.getElementById('mission-complete').style.display = 'none';
    document.getElementById('intro').style.display = 'block';
    stopLocationTracking();
}

// 모험 재시작 함수
function restartAdventure() {
    visitedGates = {};
    saveVisitedGates();
    updateGateList();
    updateProgressBar();
    returnToIntro();
}

// 초기화 함수
function init() {
    loadVisitedGates();
    updateGateList();
    updateProgressBar();

    document.getElementById('start-adventure').addEventListener('click', startAdventure);
    document.getElementById('return-to-intro').addEventListener('click', returnToIntro);
    document.getElementById('complete-button').addEventListener('click', () => {
        window.location.href = 'https://forms.gle/your-google-form-link';
    });
    document.getElementById('restart-adventure').addEventListener('click', restartAdventure);
}

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}


// 앱 초기화
init();
