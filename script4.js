const StroopTest = (() => {
    const colors = ['blu', 'rosso', 'verde'];
    const colorMap = {
        blu: '#4A90E2',
        rosso: '#FF4757',
        verde: '#2ED573'
    };

    let currentSubject = '';
    let times = { t1: 0, t2: 0, t3: 0 };
    let testData = {};
    let timerInterval;
    let startTime;

   
    const getRandomColor = (exclude = []) => {
        let available = colors.filter(c => !exclude.includes(c));
        
       
        if(available.length === 0) available = colors;
        
        return available[Math.floor(Math.random() * available.length)];
    };

    const generateTestData = () => {
       
        const part1 = Array.from({length: 30}, () => 
            colors[Math.floor(Math.random() * colors.length)]
        );

        // pallini con alternanza intelligente
        let prevColor2 = null;
        const part2 = Array.from({length: 30}, () => {
            const color = getRandomColor(prevColor2 ? [prevColor2] : []);
            prevColor2 = color;
            return color;
        });

        
        let prevColor3 = null;
        const part3 = [];
        for(let i = 0; i < 30; i++) {
            const word = getRandomColor();
            let exclude = [word];
            
            
            if(prevColor3) exclude.push(prevColor3);
            
            const color = getRandomColor(exclude);
            
            
            if(color === prevColor3) {
                exclude = [word, color];
                prevColor3 = getRandomColor(exclude);
            } else {
                prevColor3 = color;
            }
            
            part3.push({ word, color });
        }

        return { part1, part2, part3 };
    };

    const startTimer = () => {
        stopTimer();
        startTime = Date.now();
        timerInterval = setInterval(() => {
            document.getElementById('timer').textContent = 
                `${Math.floor((Date.now() - startTime) / 1000)}s`;
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
    };

    const saveTime = (part) => {
        if(startTime) {
            times[`t${part}`] = Math.floor((Date.now() - startTime) / 1000);
            stopTimer(); //ferma il timer dopo il salvataggio
        }
    };

    const renderElements = (part) => {
        switch(part) {
            case 1:
                document.getElementById('words1').innerHTML = 
                    testData.part1.map(word => `<div class="word-box">${word}</div>`).join('');
                break;
            case 2:
                document.getElementById('dots').innerHTML = 
                    testData.part2.map(color => `<div class="dot" style="background:${colorMap[color]}"></div>`).join('');
                break;
            case 3:
                document.getElementById('words3').innerHTML = 
                    testData.part3.map(({word, color}) => `<div class="word-box" style="color:${colorMap[color]}">${word}</div>`).join('');
                break;
        }
    };


    return {
        init() {
            testData = generateTestData();
        },

        startTest() {
            const subject = document.getElementById('subjectNumber').value.trim();
            if(!subject) return alert('Inserisci il numero del soggetto!');
            currentSubject = subject;
            this.init();
            this.nextPart(1);
        },

        nextPart(newPart) {
            const currentSection = document.querySelector('.section.active');
            if(currentSection) {
                const partNumber = parseInt(currentSection.id.replace('part', ''));
                if(partNumber > 0) {
                    saveTime(partNumber); // Salva il tempo della parte corrente
                }
                currentSection.classList.remove('active');
            }

            setTimeout(() => {
                startTimer(); // Riavvia il timer per la nuova parte
                document.getElementById(`part${newPart}`).classList.add('active');
                renderElements(newPart);
                window.scrollTo(0, 0);
            }, 300);
        },

        calculateResults() {
            // Leggi i valori degli errori correttamente
            const getErrorValue = (id) => {
                const element = document.getElementById(id);
                return element ? parseInt(element.value) || 0 : 0;
            };

            const E1 = getErrorValue('error1');
            const E2 = getErrorValue('error2');
            const E3 = getErrorValue('error3');
            
            
            const T = times.t3 - ((times.t1 + times.t2) / 2);
            const E = E3 - ((E1 + E2) / 2);

            
            document.getElementById('finalTime').textContent = T.toFixed(1);
            document.getElementById('finalErrors').textContent = E.toFixed(1);
        },

        endTest() {
            saveTime(3); // salva il tempo della parte 3
            document.querySelector('.section.active').classList.remove('active');
            document.getElementById('results').classList.add('active');
            
            // Genera risultati SENZA valori precalcolati
            document.getElementById('resultsContent').innerHTML = `

                <div class="subject-id">Soggetto: ${currentSubject}</div>
                <div class="error-table">
                    <table>
                        <tr>
                            <th>Parte</th>
                            <th>Tempo</th>
                            <th>Errori</th>
                        </tr>
                        <tr>
                            <td>Parte 1</td>
                            <td>${times.t1}s</td>
                            <td><input type="number" id="error1" min="0" value="0" class="error-input"></td>
                        </tr>
                        <tr>
                            <td>Parte 2</td>
                            <td>${times.t2}s</td>
                            <td><input type="number" id="error2" min="0" value="0" class="error-input"></td>
                        </tr>
                        <tr>
                            <td>Parte 3</td>
                            <td>${times.t3}s</td>
                            <td><input type="number" id="error3" min="0" value="0" class="error-input"></td>
                        </tr>
                    </table>
                </div>
        
                <div class="final-results">
                    <h3>Risultato Finale</h3>
                    <p>Tempo: <span id="finalTime">0.0</span></p>
                    <p>Errori: <span id="finalErrors">0.0</span></p>
                    <button onclick="StroopTest.calculateResults()" class="btn primary">Calcola</button>
                </div>
            `;
        },

        resetTest() {
            stopTimer();
            times = { t1: 0, t2: 0, t3: 0 };
            currentSubject = '';
            document.getElementById('timer').textContent = '0s';
            document.getElementById('subjectNumber').value = '';
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById('part0').classList.add('active');
        },

        toggleCheatSheet() {
            const sheet = document.getElementById('cheatSheet');
            sheet.style.display = sheet.style.display === 'none' ? 'block' : 'none';
            document.getElementById('cheatContent').innerHTML = `
                <p><strong>PARTE 1 (Parole):</strong><br>${testData.part1.join(', ')}</p>
                <p><strong>PARTE 2 (Colori pallini):</strong><br>${testData.part2.join(', ')}</p>
                <p><strong>PARTE 3 (Parole/Colori):</strong><br>
                    ${testData.part3.map(i => 
                        `<span style="color:${colorMap[i.color]}">${i.word}</span> (${i.color})`
                    ).join(', ')}
                </p>
            `;
        }
    };
})();

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('subjectNumber').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') StroopTest.startTest();
    });
});