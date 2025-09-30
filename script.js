// Navigation Functions
function showHome() {
    document.querySelectorAll('.cipher-page').forEach(page => page.classList.remove('active'));
    document.getElementById('home-page').style.display = 'block';
}

function showCipher(cipherName) {
    document.getElementById('home-page').style.display = 'none';
    document.querySelectorAll('.cipher-page').forEach(page => page.classList.remove('active'));
    document.getElementById(cipherName + '-page').classList.add('active');
}

// Caesar Cipher Functions
function caesarShift(text, shift, encrypt = true) {
    if (!encrypt) shift = -shift;
    return text.replace(/[a-zA-Z]/g, function(char) {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
    });
}

function caesarEncrypt() {
    const input = document.getElementById('caesar-input').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 0;
    const result = caesarShift(input, shift, true);
    document.getElementById('caesar-output').value = result;
}

function caesarDecrypt() {
    const input = document.getElementById('caesar-input').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 0;
    const result = caesarShift(input, shift, false);
    document.getElementById('caesar-output').value = result;
}

// ROT13 Functions
function rot13Transform() {
    const input = document.getElementById('rot13-input').value;
    const result = caesarShift(input, 13, true);
    document.getElementById('rot13-output').value = result;
}

// Vigenère Cipher Functions
function vigenereTransform(text, key, encrypt = true) {
    if (!key) return text;
    key = key.toLowerCase().replace(/[^a-z]/g, '');
    if (!key) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
            const start = char <= 'Z' ? 65 : 97;
            const keyShift = key.charCodeAt(keyIndex % key.length) - 97;
            const shift = encrypt ? keyShift : -keyShift;
            result += String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function vigenereEncrypt() {
    const input = document.getElementById('vigenere-input').value;
    const key = document.getElementById('vigenere-key').value;
    if (!key.trim()) {
        alert('Please enter a keyword');
        return;
    }
    const result = vigenereTransform(input, key, true);
    document.getElementById('vigenere-output').value = result;
}

function vigenereDecrypt() {
    const input = document.getElementById('vigenere-input').value;
    const key = document.getElementById('vigenere-key').value;
    if (!key.trim()) {
        alert('Please enter a keyword');
        return;
    }
    const result = vigenereTransform(input, key, false);
    document.getElementById('vigenere-output').value = result;
}

// Atbash Cipher Functions
function atbashTransform() {
    const input = document.getElementById('atbash-input').value;
    const result = input.replace(/[a-zA-Z]/g, function(char) {
        if (char <= 'Z') {
            return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        } else {
            return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
        }
    });
    document.getElementById('atbash-output').value = result;
}

// Monoalphabetic Substitution Functions
function monoalphabeticTransform(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    
    if (key.length !== 26 || new Set(key).size !== 26) {
        alert('Key must contain exactly 26 unique letters');
        return text;
    }

    return text.replace(/[a-zA-Z]/g, function(char) {
        const isUpper = char <= 'Z';
        const index = char.toUpperCase().charCodeAt(0) - 65;
        
        let result;
        if (encrypt) {
            result = key[index];
        } else {
            result = alphabet[key.indexOf(char.toUpperCase())];
        }
        
        return isUpper ? result : result.toLowerCase();
    });
}

function monoEncrypt() {
    const input = document.getElementById('mono-input').value;
    const key = document.getElementById('mono-key').value;
    if (!key.trim()) {
        alert('Please enter a substitution key');
        return;
    }
    const result = monoalphabeticTransform(input, key, true);
    document.getElementById('mono-output').value = result;
}

function monoDecrypt() {
    const input = document.getElementById('mono-input').value;
    const key = document.getElementById('mono-key').value;
    if (!key.trim()) {
        alert('Please enter a substitution key');
        return;
    }
    const result = monoalphabeticTransform(input, key, false);
    document.getElementById('mono-output').value = result;
}

// Transposition Cipher Functions
function getColumnOrder(key) {
    const keyChars = key.toUpperCase().split('').map((char, index) => ({ char, index }));
    keyChars.sort((a, b) => a.char.localeCompare(b.char));
    return keyChars.map(item => item.index);
}

function transpositionEncrypt() {
    const input = document.getElementById('trans-input').value;
    const key = document.getElementById('trans-key').value;
    
    if (!key.trim()) {
        alert('Please enter a key');
        return;
    }
    
    const text = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const keyLength = key.length;
    const columnOrder = getColumnOrder(key);
    
    // Pad text if necessary
    const paddedLength = Math.ceil(text.length / keyLength) * keyLength;
    const paddedText = text.padEnd(paddedLength, 'X');
    
    // Create grid
    const grid = [];
    for (let i = 0; i < paddedText.length; i += keyLength) {
        grid.push(paddedText.substr(i, keyLength).split(''));
    }
    
    // Read columns in order
    let result = '';
    for (let colIndex of columnOrder) {
        for (let row = 0; row < grid.length; row++) {
            if (grid[row][colIndex]) {
                result += grid[row][colIndex];
            }
        }
    }
    
    document.getElementById('trans-output').value = result;
}

function transpositionDecrypt() {
    const input = document.getElementById('trans-input').value;
    const key = document.getElementById('trans-key').value;
    
    if (!key.trim()) {
        alert('Please enter a key');
        return;
    }
    
    const text = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const keyLength = key.length;
    const columnOrder = getColumnOrder(key);
    const rows = Math.ceil(text.length / keyLength);
    
    // Create empty grid
    const grid = Array(rows).fill().map(() => Array(keyLength).fill(''));
    
    // Fill columns in order
    let textIndex = 0;
    for (let colIndex of columnOrder) {
        for (let row = 0; row < rows; row++) {
            if (textIndex < text.length) {
                grid[row][colIndex] = text[textIndex++];
            }
        }
    }
    
    // Read rows
    let result = '';
    for (let row = 0; row < rows; row++) {
        result += grid[row].join('');
    }
    
    document.getElementById('trans-output').value = result.replace(/X+$/, '');
}

// Initialize with home page when document loads
document.addEventListener('DOMContentLoaded', function() {
    showHome();
});