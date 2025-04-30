// Verifica autenticazione
if(!localStorage.getItem('authenticated') && window.location.pathname !== '/index.html') {
    window.location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', function() {
    // elementi principali del DOMINIO, rimangono invariati.
    // sono necessari per richiamare le azioni sucessivamente 
    const elements = {
        screens: {
            intro: document.getElementById('intro-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen')
        },
        buttons: {
            start: document.getElementById('start-btn'),
            reset: document.getElementById('reset-btn'),
            restart: document.getElementById('restart-btn'),
            next: document.getElementById('next-btn')
        },
        inputs: {
            subjectId: document.getElementById('subject-id')
        },
        displays: {
            taskNumber: document.getElementById('task-number'),
            attemptNumber: document.getElementById('attempt-number'),
            totalTimer: document.getElementById('total-timer'),
            execTimer: document.getElementById('exec-timer'),
            moveCounter: document.getElementById('move-counter'),
            violationCounter: document.getElementById('violation-counter'),
            completionMessage: document.getElementById('completion-message'),
            taskInstruction: document.getElementById('task-instruction')
        },
        containers: {
            goal: document.getElementById('goal-image-container'),
            results: document.getElementById('results-table')
        },
        towers: [
            document.getElementById('tower-0'),
            document.getElementById('tower-1'),
            document.getElementById('tower-2')
        ]
    };

// compiti (item). Configurazioni delle torri e mosse

    const tasks = [
        // Item 1 (2 mosse)
        {
            requiredMoves: 2,
            instruction: "Hai 2 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 1 }, 
                { color: 'blue', tower: 1, position: 0 },  
                { color: 'red', tower: 2, position: 0 }    
            ]
        },

        // Item 2 (2 mosse)
        {
            requiredMoves: 2,
            instruction: "Hai 2 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 0 }, 
                { color: 'blue', tower: 2, position: 0 }, 
                { color: 'red', tower: 1, position: 0 }   
            ]
        },
        // Item 3 (3 mosse)
        {
            requiredMoves: 3,
            instruction: "Hai 3 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 0 }, 
                { color: 'blue', tower: 0, position: 1 },  
                { color: 'red', tower: 1, position: 0 }    
            ]
        },

         // Item 4 (3 mosse)
         {
            requiredMoves: 3,
            instruction: "Hai 3 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 1 }, 
                { color: 'blue', tower: 1, position: 0 },  
                { color: 'red', tower: 0, position: 0 }    
            ]
        },

         // Item 5 (4 mosse)
         {
            requiredMoves: 4,
            instruction: "Hai 4 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 1 }, 
                { color: 'blue', tower: 1, position: 0 },  
                { color: 'red', tower: 0, position: 0 } 
            ]
        },

         // Item 6 (4 mosse)
         {
            requiredMoves: 4,
            instruction: "Hai 4 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 1 }, 
                { color: 'blue', tower: 0, position: 0 }, 
                { color: 'red', tower: 1, position: 0 }    
            ]
        },

         // Item 7 (4 mosse)
         {
            requiredMoves: 4,
            instruction: "Hai 4 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 2, position: 0 }, 
                { color: 'blue', tower: 0, position: 1 },  
                { color: 'red', tower: 0, position: 0 }   
            ]
        },

         // Item 8 (4 mosse)
         {
            requiredMoves: 4,
            instruction: "Hai 4 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 2, position: 0 },
                { color: 'blue', tower: 1, position: 1 },  
                { color: 'red', tower: 1, position: 0 }   
            ]
        },

         // Item 9 (5 mosse)
         {
            requiredMoves: 5,
            instruction: "Hai 5 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 1 }, 
                { color: 'blue', tower: 0, position: 2 }, 
                { color: 'red', tower: 0, position: 0 } 
            ]
        },

         // Item 10 (5 mosse)
         {
            requiredMoves: 5,
            instruction: "Hai 5 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 2 }, 
                { color: 'blue', tower: 0, position: 1 },  
                { color: 'red', tower: 0, position: 0 } 
            ]
        },

         // Item 11 (5 mosse)
         {
            requiredMoves: 5,
            instruction: "Hai 5 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 2, position: 0 },
                { color: 'blue', tower: 0, position: 0 }, 
                { color: 'red', tower: 1, position: 0 }  
            ]
        },

         // Item 12 (5 mosse)
         {
            requiredMoves: 5,
            instruction: "Hai 5 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 1 }, 
                { color: 'blue', tower: 0, position: 0 },  
                { color: 'red', tower: 1, position: 0 }   
            ]
        },

         // Item 13 (6 mosse)
         {
            requiredMoves: 6,
            instruction: "Hai 6 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 0, position: 1 }, 
                { color: 'blue', tower: 0, position: 0 },  
                { color: 'red', tower: 0, position: 2 }    
            ]
        },

         // Item 14 (6 mosse)
         {
            requiredMoves: 6,
            instruction: "Hai 6 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 0 }, 
                { color: 'blue', tower: 1, position: 1 },  
                { color: 'red', tower: 0, position: 0 }    
            ]
        },

         // Item 15 (7 mosse)
         {
            requiredMoves: 7,
            instruction: "Hai 7 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 0 }, 
                { color: 'blue', tower: 0, position: 0 },  
                { color: 'red', tower: 2, position: 0 }    
            ]
        },

         // Item 16 (7 mosse)
         {
            requiredMoves: 7,
            instruction: "Hai 7 mosse",
            initialState: [
                [{color: 'green'}, {color: 'red'}], // Torre 0
                [{color: 'blue'}],                  // Torre 1
                []                                  // Torre 2
            ],
            goal: [
                { color: 'green', tower: 1, position: 0 }, 
                { color: 'blue', tower: 0, position: 0 },  
                { color: 'red', tower: 1, position: 1 }    
            ]
        },

        
    ];

    // stato del test generale, con i parametri di indicazione
    const state = {
        currentTaskIndex: 0,
        attempts: 1,
        moveCount: 0,
        totalTime: 0,
        execTime: 0,
        timers: {
            total: null,
            exec: null
        },
        selectedBall: null,
        selectedTower: null,
        results: [],
        violations: 0,
        firstMoveMade: false
    };

    // resetta tutti gli elementi allo stato iniziale (item, tempo ecc)
    function init() {
        elements.buttons.start.addEventListener('click', inizioTest);
        elements.buttons.reset.addEventListener('click', resetCurrentTask);
        elements.buttons.restart.addEventListener('click', restartTest);
        elements.buttons.next.addEventListener('click', loadNextTask);
    }

    function inizioTest() {
        if (!elements.inputs.subjectId.value) {
            alert("Inserire il numero del soggetto!");
            return;
        }
        switchScreen('intro', 'test');
        loadTask(state.currentTaskIndex);
        startTimer('total');
    }

    function loadTask(taskIndex) {
        if (taskIndex >= tasks.length) {
            showResults();
            return;
        }
    
        resetTaskState();
        const task = tasks[taskIndex];
        
        updateDisplay({
            taskNumber: taskIndex + 1,
            attemptNumber: state.attempts,
            taskInstruction: task.instruction
        });
    
        renderGoalConfiguratione(task.goal);
        renderStatoIniziale(task.initialState); // usa lo stato iniziale specifico per evitare sovrapposizioni
    }

    function renderGoalConfiguratione(goalConfig) {
        elements.containers.goal.innerHTML = '';
        
        // crea le torri vuote
        const goalTowers = [
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        ];
        
        goalTowers.forEach((tower, i) => {
            tower.className = `goal-tower ${['large', 'medium', 'small'][i]}`;
            elements.containers.goal.appendChild(tower);
        });
        
        // ordina le palline dalla BASE (position: 0) alla CIMA (position: n)
        const sortedBalls = [...goalConfig].sort((a, b) => a.position - b.position);
        
        sortedBalls.forEach(ball => {
            const ballEl = document.createElement('div');
            ballEl.className = `goal-ball ${ball.color}`;
            ballEl.dataset.color = ball.color.charAt(0).toUpperCase();
            goalTowers[ball.tower].appendChild(ballEl);
        });
    }

    function renderStatoIniziale(initialConfig) {
        elements.towers.forEach((tower, i) => {
            tower.innerHTML = '';
            initialConfig[i].forEach(ball => {
                const ballEl = createBallElement(ball);
                tower.appendChild(ballEl);
            });
        });
        ConfigurazioneListeners();
    }

    function createBallElement(ball) {
        const ballEl = document.createElement('div');
        ballEl.className = `ball ${ball.color}`;
        ballEl.dataset.color = ball.color.charAt(0).toUpperCase();
        return ballEl;
    }

    function ConfigurazioneListeners() {
        // per rimuovere i listeners precedenti
        document.querySelectorAll('.ball').forEach(ball => {
            ball.removeEventListener('click', handleBallClick);
        });

        elements.towers.forEach(tower => {
            tower.removeEventListener('click', handleTowerClick);
        });

        // per aggiungere i nuovi listeners, cioè registra una funzione da eseguire quando un evento accade
        document.querySelectorAll('.ball').forEach(ball => {
            ball.addEventListener('click', handleBallClick);
        });

        elements.towers.forEach((tower, i) => {
            tower.addEventListener('click', function(e) {
                if (e.target === tower && state.selectedBall) {
                    handleTowerClick(i);
                }
            });
        });
    }

    function handleBallClick(e) {
        if (!state.firstMoveMade) {
            state.firstMoveMade = true;
            startTimer('exec');
        }

        const ball = e.target;
        const tower = ball.parentNode;
        
        // puoi prendere solo la pallina in cimaa
        if (ball === tower.lastElementChild) {
            if (state.selectedBall) {
                deselectBall();
            } else {
                selectBall(ball, Array.from(elements.towers).indexOf(tower));
            }
        }
    }

    function selectBall(ball, towerIndex) {
        state.selectedBall = ball;
        state.selectedTower = towerIndex;
        ball.classList.add('selected');
    }

    function deselectBall() {
        if (state.selectedBall) {
            state.selectedBall.classList.remove('selected');
            state.selectedBall = null;
            state.selectedTower = null;
        }
    }

function handleTowerClick(targetTowerIndex) {
    if (!state.selectedBall) return;
    
    const targetTower = elements.towers[targetTowerIndex];
    const towerCapacity = [3, 2, 1][targetTowerIndex];
    
    // capacità eella torre (+violation)
    if (targetTower.children.length >= towerCapacity) {
        state.violations++;
        updateDisplay({ violationCounter: state.violations });
        alert("Troppe palline in questa torre!");
        deselectBall();
        return;
    }

    // con questo si riesce a muovere la pallina
    targetTower.appendChild(state.selectedBall);
    state.moveCount++;
    updateDisplay({ moveCounter: state.moveCount });

    // Questo funge da controllo del numero di mosse
    const task = tasks[state.currentTaskIndex];
    if (state.moveCount > task.requiredMoves) {
        
        alert(`Hai superato il limite di ${task.requiredMoves} mosse! Tentativo annullato.`);
        resetCurrentTask();
        deselectBall();
        return;
    }

    checkSolution();
    deselectBall();
}

//semplifica la funzione checkSolution rimuovendo il controllo delle mosse
function checkSolution() {
    const currentConfig = getCurrentConfiguration();
    const task = tasks[state.currentTaskIndex];
    
    // verifica ogni torre obiettivo
    for (let i = 0; i < 3; i++) {
        const goalBalls = task.goal
            .filter(b => b.tower === i)
            .sort((a, b) => a.position - b.position); 
        
        const currentTower = currentConfig[i];
        
        // verifica ogni pallina dal basso verso l'alto, quindi 0 basso, 2 alto
        for (let j = 0; j < goalBalls.length; j++) {
            if (!currentTower[j] || currentTower[j].color !== goalBalls[j].color) {
                return false; 
            }
        }
    }
    
    // se tutte le verifiche (askCompleted 1)passano in TRUE
    taskCompleted();
    return true;
}

function checkSolution() {
    const currentConfig = getCurrentConfiguration();
    const task = tasks[state.currentTaskIndex];
    
    for (let i = 0; i < 3; i++) {
        const goalBalls = task.goal
            .filter(b => b.tower === i)
            .sort((a, b) => a.position - b.position); 
        
        const currentTower = currentConfig[i];
        
        // Verifica ogni pallina nella torre per capire se ci sono errori, se no restituire conf. errata
        for (let j = 0; j < goalBalls.length; j++) {
            if (!currentTower[j] || currentTower[j].color !== goalBalls[j].color) {
                return false; // configurazione errata
            }
        }
    }
    
    // Se tutte le verifiche (askCompleted 2) del sistema restituiscono TRUE: se no Va a dar via e ciap
    taskCompleted();
    return true; 
}

function taskCompleted() {
    stopTimer('exec'); // ferma solo il timer di esecuzione dio boia, se non ti fermi mi incazzo 
    showCompletionMessage();
    
    // sottrae il tempo precedente)
    const previousTotalTime = state.results.reduce((sum, res) => sum + res.totalTime, 0);
    const taskTotalTime = state.totalTime - previousTotalTime;
    
    state.results.push({
        task: state.currentTaskIndex + 1,
        attempts: state.attempts,
        totalTime: taskTotalTime, 
        execTime: state.execTime,
        moves: state.moveCount,
        violations: state.violations,
        completed: true
    });
}

    function loadNextTask() {
        hideCompletionMessage();
        state.currentTaskIndex++;
        state.attempts = 1;
        loadTask(state.currentTaskIndex);
    }

    function resetCurrentTask() {
        const previousTotalTime = state.results.reduce((sum, res) => sum + res.totalTime, 0);
        const taskTotalTime = state.totalTime - previousTotalTime;
        
        if (state.attempts >= 3) {
            state.results.push({
                task: state.currentTaskIndex + 1,
                attempts: state.attempts,
                totalTime: taskTotalTime,  
                execTime: state.execTime,
                moves: state.moveCount,
                violations: state.violations,
                completed: false
            });
            loadNextTask();
        } else {
            state.attempts++;
            loadTask(state.currentTaskIndex);
        }
    }

    // funzioni generali di funzionamento (selezione)
    function getCurrentConfiguration() {
        return elements.towers.map(tower => 
            Array.from(tower.children).map(ball => ({
                color: ball.className.replace('ball ', '').replace(' selected', '')
            }))
        );
    }

    function startTimer(type) {
        stopTimer(type);
        state.timers[type] = setInterval(() => {
            state[`${type}Time`]++;
            updateDisplay({ [`${type}Timer`]: state[`${type}Time`] });
        }, 1000);
    }

    function stopTimer(type) {
        if (state.timers[type]) {
            clearInterval(state.timers[type]);
            state.timers[type] = null;
        }
    }

    function stopTimers() {
        stopTimer('total');
        stopTimer('exec');
    }

    function showCompletionMessage() {
        elements.displays.completionMessage.style.display = 'block';
        elements.buttons.next.style.display = 'block';
        elements.buttons.reset.style.display = 'none';
    }

    function hideCompletionMessage() {
        elements.displays.completionMessage.style.display = 'none';
        elements.buttons.next.style.display = 'none';
        elements.buttons.reset.style.display = 'block';
    }

    function switchScreen(from, to) {
        elements.screens[from].classList.remove('active');
        elements.screens[to].classList.add('active');
    }

    function updateDisplay(updates) {
        Object.keys(updates).forEach(key => {
            if (elements.displays[key]) {
                elements.displays[key].textContent = updates[key];
            }
        });
    }

    function resetTaskState() {
        state.moveCount = 0;
        state.violations = 0;
        state.firstMoveMade = false;
        state.execTime = 0;
        updateDisplay({
            moveCounter: 0,
            violationCounter: 0,
            execTimer: 0
        });
        stopTimer('exec');
        hideCompletionMessage();
    }

    function showResults() {
        stopTimers();
        switchScreen('test', 'results');
        
        // Calcola i totali con dei riquadri messi in alto (Guarda il css nel caso) (Già corretti per ogni item)
        const totalExec = state.results.reduce((sum, res) => sum + res.execTime, 0);
        const totalTime = state.results.reduce((sum, res) => sum + res.totalTime, 0);
    
        let html = `
            <h3>Soggetto #${elements.inputs.subjectId.value}</h3>
            <div class="total-boxes">
                <div class="total-box">
                    <h4>Tempo esecuzione totale</h4>
                    <div class="total-value">${totalExec}s</div>
                </div>
                <div class="total-box">
                    <h4>Tempo totale impiegato</h4>
                    <div class="total-value">${totalTime}s</div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Completato</th>
                        <th>Tentativi</th>
                        <th>Tempo item</th>
                        <th>Tempo esecuzione</th>
                        <th>Mosse</th>
                        <th>Violazioni</th>
                    </tr>
                </thead>
                <tbody>`;
        
        state.results.forEach(res => {
            html += `
                <tr>
                    <td>${res.task}</td>
                    <td>${res.completed ? 'Sì' : 'No'}</td>
                    <td>${res.attempts}</td>
                    <td>${res.totalTime}s</td>
                    <td>${res.execTime}s</td>
                    <td>${res.moves}</td>
                    <td>${res.violations}</td>
                </tr>`;
        });
        
        html += `</tbody></table>`;
        elements.containers.results.innerHTML = html;
    }

    function restartTest() {
        state.currentTaskIndex = 0;
        state.attempts = 1;
        state.totalTime = 0;
        state.execTime = 0;
        state.violations = 0;
        state.firstMoveMade = false;
        state.results = [];
        stopTimers();
        elements.containers.results.innerHTML = '';
        elements.inputs.subjectId.value = '';
        switchScreen('results', 'intro');
    }

    init();
});

//di nik :)