// Verifica autenticazione
if(!localStorage.getItem('authenticated') && window.location.pathname !== '/index.html') {
    window.location.href = 'index.html';
}

let currentTest = null;       
let currentPhase = 'A';       
let startTime = null;         
let currentStep = 0;          
let errors = 0;               
let sequence = [];            
let positions = [];           
let timerInterval = null;     
let subjectCode = "";         
let isCompleteTest = false;   
const results = {             
    A: { time: 0, errors: 0 }, 
    B: { time: 0, errors: 0 }
};
const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

// FUNZIONI BASE 
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function resetTest() {
    clearInterval(timerInterval);
    showScreen('home');
    results.A = { time: 0, errors: 0 };
    results.B = { time: 0, errors: 0 };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// AVVIO TEST
function startTest(testType) {
    currentTest = testType;
    isCompleteTest = false;
    initializeTest();
}

function startCompleteTest() {
    const code = document.getElementById('subject-code').value.trim();
    if(!code) return alert("Inserire codice soggetto");
    subjectCode = code;
    isCompleteTest = true;
    currentPhase = 'A';
    currentTest = 'A';
    initializeTest();
}

// INIZIALIZZAZIONE TEST
function initializeTest() {
    showScreen('test-screen');
    setupCanvas();
    resetTestState();
    createCircles();
    startTimer();
}

function resetTestState() {
    currentStep = 0;
    errors = 0;
    positions = [];
    sequence = generateSequence();
    document.getElementById('testContainer').innerHTML = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('errorCount').textContent = '0';
}

function generateSequence() {
    if(isCompleteTest) {
        return currentPhase === 'A' ? 
            Array.from({length: 25}, (_, i) => i + 1) :
            Array.from({length: 26}, (_, i) => 
                i % 2 ? String.fromCharCode(65 + (i-1)/2) : (i/2 + 1)
            );
    }
    if(currentTest === 'SIMPLE') {
        return currentPhase === 'A' ? 
            [1, 2, 3, 4] : 
            [1, 'A', 2, 'B'];
    }
    if(currentTest === 'A') return Array.from({length: 25}, (_, i) => i + 1);
    if(currentTest === 'B') return Array.from({length: 26}, (_, i) => 
        i % 2 ? String.fromCharCode(65 + (i-1)/2) : (i/2 + 1)
    );
    return [];
}

// GESTIONE ELEMENTI 
function setupCanvas() {
    canvas.width = 800;
    canvas.height = 600;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#e74c3c';
    ctx.fillStyle = '#e74c3c'; 
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

function createCircles() {
    sequence.forEach(value => {
        const circle = document.createElement('div');
        circle.className = `circle ${typeof value === 'number' ? 'number' : 'letter'}`;
        circle.textContent = value;
        
        const pos = getValidPosition();
        circle.style.left = `${pos.x}px`;
        circle.style.top = `${pos.y}px`;
        
        circle.addEventListener('click', () => handleClick(value, circle, pos));
        document.getElementById('testContainer').appendChild(circle);
        positions.push(pos);
    });
}

function getValidPosition() {
    let pos;
    let isValid = false;
    
    do {
        pos = {
            x: Math.random() * (canvas.width - 40), // regola per i margini
            y: Math.random() * (canvas.height - 40)
        };
        
        isValid = positions.every(existing => {
            return Math.hypot(existing.x - pos.x, existing.y - pos.y) > 80;
        });
    } while(!isValid);
    
    return pos;
}

// LOGICA DI GIOCO 
function handleClick(value, element, pos) {
    const expected = sequence[currentStep];
    
    if(value === expected) {
        element.classList.add('correct');
        drawLine(pos);
        currentStep++;
        
        if(currentStep === sequence.length) finishPhase();
    } else {
        errors++;
        document.getElementById('errorCount').textContent = errors;
        element.classList.add('wrong');
        setTimeout(() => element.classList.remove('wrong'), 500);
    }
}

function drawLine(pos) {
    // Disegna solo se non è il primo elemento
    if(currentStep > 0) {
        const prevPos = positions[currentStep - 1];
        ctx.beginPath();
        ctx.moveTo(prevPos.x + 20, prevPos.y + 20);
        ctx.lineTo(pos.x + 20, pos.y + 20);
        ctx.stroke();
    }
    
   
    ctx.beginPath();
    ctx.arc(pos.x + 20, pos.y + 20, 3, 0, Math.PI*2);
    ctx.fill();
}

// FINE TEST 
function finishPhase() {
    const time = (Date.now() - startTime) / 1000;
    
    if(currentTest === 'SIMPLE') {
        results[currentPhase] = { time, errors };
        
        if(currentPhase === 'A') {
            currentPhase = 'B';
            initializeTest();
        } else {
            showResults();
        }
    } 
    else if(isCompleteTest) {
        results[currentPhase] = { time, errors };
        
        if(currentPhase === 'A') {
            currentPhase = 'B';
            currentTest = 'B';
            initializeTest();
        } else {
            showResults();
        }
    } 
    else {
        results[currentPhase] = { time, errors };
        showResults();
    }
}

function showResults() {
    showScreen('results');
    document.getElementById('result-code').textContent = subjectCode || "Test Singolo";
    
    const timeA = results.A.time.toFixed(1);
    const timeB = results.B.time.toFixed(1);
    const totalTime = (results.A.time + results.B.time).toFixed(1);
    const timeDifference = (results.B.time - results.A.time).toFixed(1);
    const totalErrors = results.A.errors + results.B.errors;

    document.getElementById('timeA').textContent = timeA;
    document.getElementById('errorsA').textContent = results.A.errors;
    document.getElementById('timeB').textContent = timeB;
    document.getElementById('errorsB').textContent = results.B.errors;
    document.getElementById('totalTime').textContent = totalTime;
    document.getElementById('totalErrors').textContent = totalErrors;
    document.getElementById('timeDifference').textContent = timeDifference;
}

// TIMER 
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const time = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = 
            `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
    }, 1000);
}

// RIPROVA TEST 
function retryTest() {
    if(isCompleteTest) startCompleteTest();
    else startTest(currentTest);
}

//nik