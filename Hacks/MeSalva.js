// ==UserScript==
// @name         Me Salva!
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  Me Salva! Script questões
// @author       marcos10pc
// @match        https://www.mesalva.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain_url=mesalva.com
// @grant        none
// ==/UserScript==

let notificationCount = 0;

function abacate(originalUrl) {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    const exerciseId = pathParts[pathParts.length - 1];
    const newPath = `/app/_next/data/eotWR84n2AGZWHLCKUcH5/exercicio/${exerciseId}.json`;
    const params = new URLSearchParams(url.search);
    params.append('content', exerciseId);
    return `https://www.mesalva.com${newPath}?${params.toString()}`;
}

(async function() {
    'use strict';

    const exerciseUrlPattern = /^https:\/\/www\.mesalva\.com\/app\/exercicio\/[a-z0-9\-]+(\?contexto=[^&]+&lista=[^&]+&modulo=[^&]+)?$/;
    let previousUrl = document.location.href;

    const observer = new MutationObserver(async () => {
        if (previousUrl !== document.location.href) {
            previousUrl = document.location.href;

            if (exerciseUrlPattern.test(previousUrl)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const answerUrl = abacate(previousUrl);

                try {
                    const response = await fetch(answerUrl);
                    if (!response.ok) return;

                    const data = await response.json();
                    const answers = data.pageProps.content.children[0].list;
                    const correctAnswer = answers.find(answer => answer.isCorrect);

                    if (correctAnswer) {
                        const buttons = document.querySelectorAll('.exercise-answer__button');
                        buttons.forEach(button => {
                            const letterElement = button.querySelector('.exercise-answer__letter');
                            if (letterElement && letterElement.textContent.trim() === correctAnswer.letter) {
                                button.click();
                            }
                        });

                        const submitButton = document.querySelector('.submit-button');
                        if (submitButton) {
                            submitButton.click();

                            await new Promise(resolve => setTimeout(resolve, 1000));
                            const nextButton = document.querySelector('.btn--primary');
                            if (nextButton) nextButton.click();
                        }
                    }
                } catch (error) {
                    console.error('Erro no fetch:', error);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
