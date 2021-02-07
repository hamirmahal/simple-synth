// This file exists to remove the "Property 'webkitAudioContext' does not exist on
// type 'Window & typeof globalThis'.ts(2339)" error that occurs with webkitAudioContext.
// https://github.com/microsoft/TypeScript/issues/31686#issuecomment-636257758
interface Window {
    webkitAudioContext: typeof AudioContext
}