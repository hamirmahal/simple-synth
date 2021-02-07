const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext);
const oscillatorList: Array<Object> = [];
let mainGainNode: GainNode = null;

const keyboard: HTMLElement = document.querySelector(".keyboard");
const volumeControl: HTMLInputElement = document.querySelector("input[name='volume']");
const wavePicker: HTMLSelectElement = document.querySelector("select[name='waveform']");

let customWaveform: PeriodicWave = null;

/**
 * builds and returns an array that contains other arrays that themselves comprise
 * all of the notes in an octave.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 */
function createNoteTable(): number[][] {
    const noteFrequencies: number[][] = [];
    const numberOfOctaves: number = 8;

    for (let i: number = 0; i <= numberOfOctaves; i++)
        noteFrequencies[i] = [];
    
    noteFrequencies[0]["A"] = 27.500000000000000;
    noteFrequencies[0]["A#"] = 29.135235094880619;
    noteFrequencies[0]["B"] = 30.867706328507756;
    
    noteFrequencies[1]["C"] = 32.703195662574829;
    noteFrequencies[1]["C#"] = 34.647828872109012;
    noteFrequencies[1]["D"] = 36.708095989675945;
    noteFrequencies[1]["D#"] = 38.890872965260113;
    noteFrequencies[1]["E"] = 41.203444614108741;
    noteFrequencies[1]["F"] = 43.653528929125485;
    noteFrequencies[1]["F#"] = 46.249302838954299;
    noteFrequencies[1]["G"] = 48.999429497718661;
    noteFrequencies[1]["G#"] = 51.913087197493142;
    noteFrequencies[1]["A"] = 55.000000000000000;
    noteFrequencies[1]["A#"] = 58.270470189761239;
    noteFrequencies[1]["B"] = 61.735412657015513;

    noteFrequencies[2]["C"] = 65.41; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["C#"] = 69.30; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["D"] = 73.42; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["D#"] = 77.78; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["E"] = 82.41; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["F"] = 87.31; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["F#"] = 92.50; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["G"] = 98.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["G#"] = 103.83; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["A"] = 110.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["A#"] = 116.54; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[2]["B"] = 123.47; // https://pages.mtu.edu/~suits/notefreqs.html
    
    noteFrequencies[3]["C"] = 130.81; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["C#"] = 138.59; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["D"] = 146.83; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["D#"] = 155.56; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["E"] = 164.81; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["F"] = 174.61; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["F#"] = 185.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["G"] = 196.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["G#"] = 207.65; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["A"] = 220.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["A#"] = 233.08; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[3]["B"] = 246.94; // https://pages.mtu.edu/~suits/notefreqs.html

    noteFrequencies[4]["C"] = 261.63; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["C#"] = 277.18; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["D"] = 293.66; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["D#"] = 311.13; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["E"] = 329.63; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["F"] = 349.23; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["F#"] = 369.99; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["G"] = 392.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["G#"] = 415.30; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["A"] = 440.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["A#"] = 466.16; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[4]["B"] = 493.88; // https://pages.mtu.edu/~suits/notefreqs.html

    noteFrequencies[5]["C"] = 523.25; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["C#"] = 554.37; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["D"] = 587.33; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["D#"] = 622.25; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["E"] = 659.25; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["F"] = 698.46; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["F#"] = 739.99; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["G"] = 783.99; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["G#"] = 830.61; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["A"] = 880.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["A#"] = 932.33; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[5]["B"] = 987.77; // https://pages.mtu.edu/~suits/notefreqs.html

    noteFrequencies[6]["C"] = 1046.50; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["C#"] = 1108.73; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["D"] = 1174.66; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["D#"] = 1244.51; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["E"] = 1318.51; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["F"] = 1396.91; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["F#"] = 1479.98; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["G"] = 1567.98; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["G#"] = 1661.22; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["A"] = 1760.00; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["A#"] = 1864.66; // https://pages.mtu.edu/~suits/notefreqs.html
    noteFrequencies[6]["B"] = 1975.53; // https://pages.mtu.edu/~suits/notefreqs.html

    noteFrequencies[7]["C"] = 2093.004522404789077;
    noteFrequencies[7]["C#"] = 2217.461047814976769;
    noteFrequencies[7]["D"] = 2349.318143339260482;
    noteFrequencies[7]["D#"] = 2489.015869776647285;
    noteFrequencies[7]["E"] = 2637.020455302959437;
    noteFrequencies[7]["F"] = 2793.825851464031075;
    noteFrequencies[7]["F#"] = 2959.955381693075191;
    noteFrequencies[7]["G"] = 3135.963487853994352;
    noteFrequencies[7]["G#"] = 3322.437580639561108;
    noteFrequencies[7]["A"] = 3520.000000000000000;
    noteFrequencies[7]["A#"] = 3729.310092144719331;
    noteFrequencies[7]["B"] = 3951.066410048992894;

    noteFrequencies[8]["C"] = 4186.009044809578154;

    return noteFrequencies;
}

/**
 * is responsible for building the keyboard and preparing the app to play music.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 */
function setup(): void {
    mainGainNode = audioContext.createGain();
    mainGainNode.connect(audioContext.destination);
    mainGainNode.gain.value = parseFloat(volumeControl.value);

    const noteFrequencies: number[][] = createNoteTable();
    
    volumeControl.addEventListener("change", changeVolume, false);

    noteFrequencies.forEach(function(notesInAnOctave: Array<number>, octave: number) {
        const notesAndFrequencies = Object.entries(notesInAnOctave);

        const octaveEl = document.createElement("div");
        octaveEl.className = "octave";
        
        notesAndFrequencies.forEach(function([noteName, noteFreq]: [string, number]) {
            octaveEl.appendChild(createKey(noteName, noteFreq, octave));
        });

        keyboard.appendChild(octaveEl);
    })

    document.querySelector("div[data-note='C'][data-octave='8']").scrollIntoView(false);
    
    const sineTerms: Float32Array = new Float32Array([0, 0, 1, 0, 1]);
    const cosineTerms: Float32Array = new Float32Array(sineTerms.length);
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

    for (let i = 0; i < 9; i++)
        oscillatorList[i] = {};
}

setup(); // Displays all of the musical keys.

/**
 * creates an element that comprises a key and its label, adds some data
 * attributes to that element for later use, and assigns event handlers
 * for events that should cause a key to start or stop playing.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 * @param note name of the note to create
 * @param freq frequency of the note to create
 * @param octave octave of the note to create
 */
function createKey(note: string, freq: number, octave: number): HTMLDivElement {
    const keyElement: HTMLDivElement = document.createElement("div");
    const labelElement: HTMLDivElement = document.createElement("div");

    if (note.length === 1) keyElement.className = "naturalNote";
    if (note.length === 2) keyElement.className = `sharpOrFlatNote ${note}`;
    keyElement.dataset["frequency"] = freq.toString();
    keyElement.dataset["note"] = note;
    keyElement.dataset["octave"] = octave.toString();
    keyElement.id = `${note}${octave}`;

    labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
    keyElement.appendChild(labelElement);

    keyElement.addEventListener("mousedown", notePressed, false);
    keyElement.addEventListener("mouseup", noteReleased, false);
    keyElement.addEventListener("mouseover", notePressed, false);
    keyElement.addEventListener("mouseleave", noteReleased, false);

    window.addEventListener("keydown", notePressed, false); // Allows keyboard shortcuts
    window.addEventListener("keyup", noteReleased, false); // Allows keyboard shortcuts!

    return keyElement;
}

/**
 * plays a tone at the frequency `freq`.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 * @param freq the frequency of the tone to play
 */
function playTone(freq: number): OscillatorNode {
    const oscillator: OscillatorNode = audioContext.createOscillator();
    oscillator.connect(mainGainNode);

    const waveType
        = wavePicker.options[wavePicker.selectedIndex].value as OscillatorType;
    
    if (waveType === "custom") oscillator.setPeriodicWave(customWaveform);
    else oscillator.type = waveType;
    
    oscillator.frequency.value = freq;
    oscillator.start();

    return oscillator;
}

/**
 * handles events that could cause a key to play.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 * @param event might cause a key to play
 */
function notePressed(event: MouseEvent | KeyboardEvent): void {

    if ((event as MouseEvent).buttons & 1 || event instanceof KeyboardEvent) {

        const eventTarget: HTMLElement =
            getHTMLElementForKeyboardEventCode((event as KeyboardEvent).code) ||
            event.target as HTMLElement;
        
        const { className, dataset }: { className: string, dataset: DOMStringMap }
            = eventTarget;
        
        // If the note is already playing, or eventTarget is not a note, return.
        if (className.includes("active") || !className.includes("Note")) return;
        
        eventTarget.className += " active"; // Style the key so that it looks pressed
        const octave: number = +dataset["octave"];  // The note wasn't already playing
        oscillatorList[octave][dataset["note"]] = playTone(+(dataset["frequency"]));
    }
}

/**
 * is an event handler called when an action that should stop playing a note occurs.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
 * @param event lifting a key or the mouse, or moving the mouse off a key
 */
function noteReleased(event: KeyboardEvent): void {
    const eventTarget: HTMLElement 
        = getHTMLElementForKeyboardEventCode(event.code) || event.target as HTMLElement;
    const dataset: DOMStringMap = eventTarget.dataset;
    
    if (dataset && eventTarget.className.includes("active")) {
        eventTarget.className = eventTarget.className.replace(" active", "");
        const octave: number = +dataset["octave"];
        const keysOscillator: OscillatorNode = oscillatorList[octave][dataset["note"]];
        keysOscillator.stop();
        delete oscillatorList[octave][dataset["note"]];
    }
}

/**
 * changes the gain value on the main gain node.
 * See the section "Changing the master volume" just above
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth#result.
 * @param event the change event on the volume slider
 */
function changeVolume(event: Event) {
    mainGainNode.gain.value = parseFloat(volumeControl.value);
}

/**
 * grabs the `HTMLElement` this function mapped to `code`.
 * @param code a `KeyboardEvent.code`
 */
function getHTMLElementForKeyboardEventCode(code: string): HTMLElement {
    switch (code) {
        case "KeyQ":
            return document.getElementById("C4");
    
        case "Digit2":
            return document.getElementById("C#4");
        
        case "KeyW":
            return document.getElementById("D4");
    
        case "Digit3":
            return document.getElementById("D#4");
        
        case "KeyE": // Nice! They actually match
            return document.getElementById("E4");
            
        case "KeyR":
            return document.getElementById("F4");
        
        case "Digit5":
            return document.getElementById("F#4");
        
        case "KeyT":
            return document.getElementById("G4");
        
        case "Digit6":
            return document.getElementById("G#4");
        
        case "KeyY":
            return document.getElementById("A4");
        
        case "Digit7":
            return document.getElementById("A#4");
        
        case "KeyU":
            return document.getElementById("B4");
        
        case "KeyI":
            return document.getElementById("C5");
    
        case "Digit9":
            return document.getElementById("C#5");
        
        case "KeyO":
            return document.getElementById("D5");
    
        case "Digit0":
            return document.getElementById("D#5");
        
        case "KeyP":
            return document.getElementById("E5");
            
        case "BracketLeft":
            return document.getElementById("F5");
        
        case "Equal":
            return document.getElementById("F#5");
        
        case "BracketRight":
            return document.getElementById("G5");
        
        case "Backspace":
            return document.getElementById("G#5");
        
        case "Backslash":
            return document.getElementById("A5");
    }
}