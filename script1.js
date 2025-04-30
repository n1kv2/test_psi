// Verifica autenticazione
if(!localStorage.getItem('authenticated') && window.location.pathname !== '/index.html') {
    window.location.href = 'index.html';
}


const config = {
    minDigits: 3,
    maxDigits: 12,
    attemptsPerLength: 2
};

// per calcolare il livello
function calcolalivello() {
    return currentLength - config.minDigits + 1;
}

// variabili gen
let currentLength = config.minDigits;
let currentAttempt = 1;
let testActive = false;
let currentSequence = [];
let voiceAvailable = false;
let speechSynthesis = window.speechSynthesis;
let isSpeaking = false;

// elementi del dominio
const testVoiceBtn = document.getElementById('testVoiceBtn');
const voiceTestResult = document.getElementById('voiceTestResult');
const startBtn = document.getElementById('startBtn');
const testContainer = document.getElementById('testContainer');
const testSection = document.getElementById('testSection');
const inputSection = document.getElementById('inputSection');
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
const progressDiv = document.getElementById('progress');
const finalResultDiv = document.getElementById('finalResult');
const finalScoreP = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// test della voce (tipo siri)
testVoiceBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance("Questa è una prova della voce. Se mi senti, clicca 'Inizia il test'.");
    utterance.lang = 'it-IT';
    utterance.rate = 0.7;
   
    //forzatura di accesso nel caso la voce si sentisse senza dare avvio
    const fallbackTimeout = setTimeout(() => {
        handleVoiceTestResult();
    }, 5000); // Timeout di sicurezza

    utterance.onend = () => {
        clearTimeout(fallbackTimeout);
        handleVoiceTestResult();
    };

    // Funzione separata per gestire il risultato
function handleVoiceTestResult() {
    voiceTestResult.textContent = "Hai sentito la voce? Se sì, puoi iniziare il test.";
    startBtn.classList.remove('hidden');
    voiceAvailable = true;
}

    utterance.onend = () => {
        voiceTestResult.textContent = "Hai sentito la voce? Se sì, puoi iniziare il test.";
        startBtn.classList.remove('hidden');
        voiceAvailable = true;
    };
    
    utterance.onerror = (event) => {
        voiceTestResult.textContent = "Errore nella sintesi vocale: " + event.error;
        voiceAvailable = false;
    };
    
    speechSynthesis.speak(utterance);
});

// inizia il test

startBtn.addEventListener('click', () => {
    if (!voiceAvailable) {
        alert("Per favore, verifica prima che la voce funzioni correttamente.");
        return;
    }
    
    document.getElementById('introSection').classList.add('hidden');
    testContainer.classList.remove('hidden');
    startTest();
});

//rRipristina il test, per iniziaere quello nuovo 
restartBtn.addEventListener('click', () => {
    finalResultDiv.classList.add('hidden');
    testContainer.classList.remove('hidden');
    currentLength = config.minDigits;
    currentAttempt = 1;
    startTest();
});

// invia la risposta di imput
submitBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function startTest() {
    testActive = true;
    currentSequence = generateSequence(currentLength);
    updateProgress();
    
    testSection.innerHTML = "<p>Preparati ...</p>";
    inputSection.classList.add('hidden');
    resultDiv.textContent = '';
    
    // aspetta un secondo prima di pronunciare la sequenza, per dare il giusto tempo
    setTimeout(() => {
        speakSequence(currentSequence);
    }, 1000);
}

function generateSequence(length) {
    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(Math.floor(Math.random() * 10));
    }
    return sequence;
}

function speakSequence(sequence) {
    testSection.innerHTML = "<p>Ascolta la sequenza...</p>";
    testSection.classList.add('speaking');
    isSpeaking = true;
    userInput.disabled = true; 

    let promises = [];
    
    sequence.forEach((num, index) => {
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.lang = 'it-IT';
        utterance.rate = 0.5;
        
        const delay = index * 1500;

        promises.push(new Promise(resolve => {
            utterance.onend = resolve;
            speechSynthesis.speak(utterance);
        }));
    });

    // solo quando tutti i numeri sono stati pronunciati
    Promise.all(promises).then(() => {
        testSection.classList.remove('speaking');
        setTimeout(() => {
            if (testActive) {
                isSpeaking = false;
                userInput.disabled = false; 
                testSection.innerHTML = "<p>Inserisci la sequenza che hai sentito</p>";
                
                inputSection.classList.remove('hidden');
                userInput.focus();
            }
        }, 1000);
    });
}


function checkAnswer() {
    if(isSpeaking) {
        alert("Attendi la fine della riproduzione prima di inserire i numeri!");
        return;
    }
    const userAnswer = userInput.value.trim();
    const correctAnswer = currentSequence.join('');
    
    if (userAnswer === correctAnswer) {
        resultDiv.innerHTML = `<p class="correct">Corretto! Hai ricordato la sequenza di ${currentLength} cifre.</p>`;
        
        
        if (currentLength < config.maxDigits) {
            currentLength++;
            currentAttempt = 1;
            setTimeout(startTest, 1500);
        } else {
            
            endTest(true);
        }
    } else {
        resultDiv.innerHTML = `<p class="incorrect">Non corretto. La sequenza era: ${correctAnswer}</p>`;
        
        // secondo tentativo
        if (currentAttempt < config.attemptsPerLength) {
            currentAttempt++;
            setTimeout(startTest, 1500);
        } else {
            // test fallito
            endTest(false);
        }
    }
    
    userInput.value = '';
}

function updateProgress() {
    document.getElementById('currentLevel').textContent = calcolalivello();
    document.getElementById('currentLengthValue').textContent = currentLength;
    document.getElementById('currentAttemptValue').textContent = currentAttempt;
}

function endTest(success) {
    testActive = false;
    testContainer.classList.add('hidden');
    finalResultDiv.classList.remove('hidden');
    
    if (success) {
        finalScoreP.textContent = `Complimenti! Hai completato con successo tutto il test, ricordando ${config.maxDigits} cifre.`;
    } else {
        finalScoreP.textContent = `Hai ricordato ${currentLength - 1} cifre.`;
    }
}

//nik