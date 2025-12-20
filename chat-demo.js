/**
 * ChatDemo Animation
 * Typewriter animation for educational chat demonstration
 */

(function() {
    'use strict';

    // Demo questions array - order: CPC 25, CPC 00, CPC 27
    const DEMO_QUESTIONS = [
        {
            user: "O que é um passivo contingente segundo o CPC?",
            ai: "Segundo o CPC 25, um passivo contingente é uma possível obrigação que surge de fatos passados, mas cuja confirmação depende de eventos futuros incertos.\n\nNa prática, isso significa que a empresa ainda não tem certeza se precisará pagar esse valor. Por isso, o passivo contingente não é reconhecido no balanço, mas pode precisar ser explicado em notas explicativas, caso exista a possibilidade de saída de recursos."
        },
        {
            user: "O que é um ativo segundo o CPC?",
            ai: "Segundo o CPC 00, um ativo é um recurso econômico presente controlado pela entidade, resultante de eventos passados, do qual se espera que fluam benefícios econômicos futuros.\n\nEm termos práticos, trata-se de algo que a empresa controla e que tem potencial de gerar valor no futuro."
        },
        {
            user: "Quando um bem deve ser reconhecido como ativo imobilizado?",
            ai: "De acordo com o CPC 27, um bem deve ser reconhecido como ativo imobilizado quando for provável que benefícios econômicos futuros associados a ele fluam para a entidade e quando seu custo puder ser mensurado de forma confiável.\n\nAlém disso, o ativo deve ser utilizado na produção, fornecimento de bens ou serviços, ou para fins administrativos, e não para revenda no curso normal das operações."
        }
    ];

    const TYPEWRITER_SPEED = 12; // milliseconds per character
    const PAUSE_BETWEEN_MESSAGES = 800; // milliseconds
    const PAUSE_BEFORE_RESTART = 2000; // milliseconds

    let chatDemoContainer;
    let userMessageEl;
    let aiMessageEl;
    let isAnimating = false;
    let animationTimeout;
    let currentQuestionIndex = 0;

    /**
     * Typewriter effect for text
     */
    function typeWriter(element, text, callback) {
        if (!element) return;
        
        element.innerHTML = '';
        element.classList.add('typing');
        let index = 0;
        let displayText = '';
        
        function type() {
            if (index < text.length) {
                const char = text[index];
                displayText += char === '\n' ? '<br>' : char;
                element.innerHTML = displayText;
                index++;
                animationTimeout = setTimeout(type, TYPEWRITER_SPEED);
            } else {
                element.classList.remove('typing');
                if (callback) {
                    callback();
                }
            }
        }
        
        type();
    }

    /**
     * Animate the chat demo
     */
    function animateChat() {
        if (isAnimating || !userMessageEl || !aiMessageEl) return;
        
        isAnimating = true;
        
        // Get current question from array
        const currentQuestion = DEMO_QUESTIONS[currentQuestionIndex];
        if (!currentQuestion) {
            // Reset to first question if index is out of bounds
            currentQuestionIndex = 0;
            isAnimating = false;
            setTimeout(animateChat, PAUSE_BEFORE_RESTART);
            return;
        }
        
        // Clear any existing content
        userMessageEl.textContent = '';
        aiMessageEl.textContent = '';
        
        // Type user message
        typeWriter(userMessageEl, currentQuestion.user, () => {
            // After user message, wait then type AI response
            setTimeout(() => {
                typeWriter(aiMessageEl, currentQuestion.ai, () => {
                    // After AI message completes, move to next question or restart
                    setTimeout(() => {
                        currentQuestionIndex++;
                        
                        // If we've shown all questions, reset to first
                        if (currentQuestionIndex >= DEMO_QUESTIONS.length) {
                            currentQuestionIndex = 0;
                        }
                        
                        isAnimating = false;
                        setTimeout(animateChat, PAUSE_BEFORE_RESTART);
                    }, PAUSE_BETWEEN_MESSAGES);
                });
            }, PAUSE_BETWEEN_MESSAGES);
        });
    }

    /**
     * Initialize chat demo
     */
    function initChatDemo() {
        chatDemoContainer = document.getElementById('chat-demo');
        if (!chatDemoContainer) return;

        userMessageEl = chatDemoContainer.querySelector('.chat-message-user .chat-message-text');
        aiMessageEl = chatDemoContainer.querySelector('.chat-message-ai .chat-message-text');

        if (!userMessageEl || !aiMessageEl) return;

        // Start animation after a short delay
        setTimeout(() => {
            animateChat();
        }, 500);
    }

    /**
     * Clean up animation on page unload
     */
    function cleanup() {
        if (animationTimeout) {
            clearTimeout(animationTimeout);
        }
        isAnimating = false;
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatDemo);
    } else {
        initChatDemo();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Handle visibility change (pause/resume when tab is hidden/visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanup();
        } else {
            // Restart animation when page becomes visible
            setTimeout(() => {
                if (!isAnimating) {
                    initChatDemo();
                }
            }, 500);
        }
    });
})();

