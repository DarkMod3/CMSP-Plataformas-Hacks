// ==UserScript==
// @name         Alura Destroyer
// @namespace    https://cursos.alura.com.br/
// @version      2024-09-23
// @description  Script Alura
// @author       marcos10pc
// @match        https://cursos.alura.com.br/course/*/task/*
// @icon         https://i.imgur.com/gP1LZq9.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const cookies = document.cookie;
    const actualUrl = window.location.href;

    const nextLessonButton = document.getElementsByClassName("bootcamp-next-button")[0];

    if (nextLessonButton) {
        const parts = actualUrl.split('/');
        const lessonName = parts[4];
        const lessonId = parts[6];

        fetch(`https://cursos.alura.com.br/course/${lessonName}/task/${lessonId}/mark-video`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });

        setTimeout(() => nextLessonButton.click(), 4000); // 4 segundos
    }
})();
