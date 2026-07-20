document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const progressBar = document.getElementById('progress-bar');
    const scoreText = document.getElementById('score-text');
    const feedbackStatus = document.getElementById('feedback-status');
    const warningBox = document.getElementById('warning-box');
    const warningText = document.getElementById('warning-text');
    const suggestionsList = document.getElementById('suggestions-list');
    const loadingState = document.getElementById('loading-state');

    let commonPasswords = new Set();

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });

    // Fetch the top 10k most common passwords
    async function loadCommonPasswords() {
        try {
            const response = await fetch('rockyou_truncated.txt');
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                lines.forEach(line => {
                    if (line.trim()) {
                        commonPasswords.add(line.trim());
                    }
                });
                loadingState.innerHTML = `<i class="fa-solid fa-check" style="color: var(--success)"></i> Common passwords loaded successfully!`;
                setTimeout(() => loadingState.classList.add('hidden'), 2000);
            } else {
                throw new Error('Failed to load');
            }
        } catch (error) {
            console.error("Could not load common passwords list:", error);
            loadingState.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color: var(--danger)"></i> Failed to load common passwords for local check.`;
        }
    }

    // Initialize fetching
    loadCommonPasswords();

    // Analyze password
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;

        if (password.length === 0) {
            resetUI();
            return;
        }

        // 1. Check against common passwords first (Instant fail if matched)
        const isCommon = commonPasswords.has(password);

        // 2. Use zxcvbn to get an initial score
        const analysis = zxcvbn(password);
        let finalScore = analysis.score * 25; // Map 0-4 to 0-100

        // Handle UI Updates
        warningBox.classList.add('hidden');
        suggestionsList.innerHTML = '';

        if (isCommon) {
            // Highly compromised password
            finalScore = 0;
            updateStatusText(finalScore);
            showWarning("CRITICAL: This is one of the top 10,000 most common passwords! It will be hacked instantly.");
        } else {
            // Normal analysis display
            updateStatusText(finalScore);
            
            if (analysis.feedback.warning) {
                showWarning(analysis.feedback.warning);
            }

            if (analysis.feedback.suggestions.length > 0) {
                analysis.feedback.suggestions.forEach(suggestion => {
                    const li = document.createElement('li');
                    li.textContent = suggestion;
                    suggestionsList.appendChild(li);
                });
            } else if (finalScore === 100) {
                const li = document.createElement('li');
                li.textContent = "Great job! Your password is very strong.";
                li.style.color = "var(--success)";
                suggestionsList.appendChild(li);
            }
        }

        // Check character mix explicitly for UI feedback even if not compromised
        checkCharacterMix(password);

        // Update progress bar
        updateProgressBar(finalScore);
    });

    function resetUI() {
        progressBar.style.width = '0%';
        scoreText.textContent = '0';
        feedbackStatus.textContent = 'Waiting for input...';
        feedbackStatus.style.color = 'var(--text-main)';
        warningBox.classList.add('hidden');
        suggestionsList.innerHTML = '';
    }

    function showWarning(text) {
        warningBox.classList.remove('hidden');
        warningText.textContent = text;
    }

    function updateProgressBar(score) {
        progressBar.style.width = `${score}%`;
        scoreText.textContent = score;

        if (score <= 25) {
            progressBar.style.backgroundColor = 'var(--danger)';
            scoreText.style.color = 'var(--danger)';
        } else if (score <= 50) {
            progressBar.style.backgroundColor = 'var(--warning)';
            scoreText.style.color = 'var(--warning)';
        } else if (score <= 75) {
            progressBar.style.backgroundColor = '#a3e635'; // Lime green
            scoreText.style.color = '#a3e635';
        } else {
            progressBar.style.backgroundColor = 'var(--success)';
            scoreText.style.color = 'var(--success)';
        }
    }

    function updateStatusText(score) {
        let status = "";
        let color = "";
        if (score === 0) {
            status = "Very Weak";
            color = "var(--danger)";
        } else if (score === 25) {
            status = "Weak";
            color = "var(--danger)";
        } else if (score === 50) {
            status = "Fair";
            color = "var(--warning)";
        } else if (score === 75) {
            status = "Good";
            color = "#a3e635";
        } else {
            status = "Strong";
            color = "var(--success)";
        }
        feedbackStatus.textContent = `Strength: ${status}`;
        feedbackStatus.style.color = color;
    }

    function checkCharacterMix(password) {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (!hasUpper && password.length > 0) {
            addSuggestion("Consider adding uppercase letters.");
        }
        if (!hasNumber && password.length > 0) {
            addSuggestion("Consider adding numbers.");
        }
        if (!hasSpecial && password.length > 0) {
            addSuggestion("Consider adding special characters (e.g., !, @, #).");
        }
    }

    function addSuggestion(text) {
        // Prevent duplicate suggestions
        const existing = Array.from(suggestionsList.children).map(li => li.textContent);
        if (!existing.includes(text)) {
            const li = document.createElement('li');
            li.textContent = text;
            suggestionsList.appendChild(li);
        }
    }
});
