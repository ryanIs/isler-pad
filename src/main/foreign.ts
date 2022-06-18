
import { Buffer } from 'node:buffer';
var ffi = require('ffi-napi')


// todo: on change: https://stackoverflow.com/questions/4407631/is-there-windows-system-event-on-active-window-changed
// todo: needs to be ins eparate ts file

// Get top-focused application for profile switching (low priority but would be nice)

// var user32 = new ffi.Library('user32', {
//     // 'GetTopWindow': ['long', ['long']],

//     'GetActiveWindow': ['long', []],
//     // 'GetTopWindow ': ['long', ['long']],
//     // 'GetForegroundWindow': ['long', []],

//     'GetWindowTextA': ['int', ['long', 'string', 'int']],

//     'GetWindowModuleFileNameA': ['uint', ['long', 'string', 'uint']],
     

//     // 'GetWindowText': ['int', ['long', 'string', 'int']],
//     'FindWindowA': ['long', ['string', 'string']],
//     'SetActiveWindow': ['long', ['long']],
//     'SetForegroundWindow': ['bool', ['long']],
//     'BringWindowToTop': ['bool', ['long']],
//     'ShowWindow': ['bool', ['long', 'int']],
//     'SwitchToThisWindow': ['void', ['long', 'bool']],
//     'GetForegroundWindow': ['long', []],
//     'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
//     'GetWindowThreadProcessId': ['int', ['long', 'int']],
//     'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
//     'SetFocus': ['long', ['long']]
// });

// var kernel32 = new ffi.Library('Kernel32.dll', {
//     'GetCurrentThreadId': ['int', []],
//     // 'OpenProcess' :  ['long', ['long', 'bool', 'long']],
//     'OpenProcess' :  ['long', ['long', 'bool', 'long']], // maybe long should be int here (same as getwindowthreadproccesid)
//     // 'GetModuleFileNameExA' : ['long', ['long', 'long', 'string', 'long']],
//     'GetModuleFileNameA' : ['long', ['long', 'string', 'long']],
// });

// var winToSetOnTop = user32.FindWindowA(null, "calculator")
// var foregroundHWnd = user32.GetForegroundWindow()
// var currentThreadId = kernel32.GetCurrentThreadId()
// // var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)
// // var showWindow = user32.ShowWindow(winToSetOnTop, 9)
// // var setWindowPos1 = user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
// // var setWindowPos2 = user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
// // var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
// // var attachThreadInput = user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
// // var setFocus = user32.SetFocus(winToSetOnTop)
// // var setActiveWindow = user32.SetActiveWindow(winToSetOnTop)
 
// console.log("foregroundHWnd")
// console.log(foregroundHWnd)

// const lpStringPointer = Buffer.alloc(200);

// let myStr = ""
// let myCount = 0
// // var wwww = user32.GetWindowText(foregroundHWnd, myStr, myCount)
// // var wwww = kernel32.GetWindowText(foregroundHWnd)
// var activeHWnd = user32.GetActiveWindow()
// // var topHWnd = user32.GetTopWindow(0)
// var wwww = user32.GetWindowTextA(foregroundHWnd, lpStringPointer, 200)

// // GetActiveWindow
// setInterval(() => {
  


//   var __foregroundHWnd = user32.GetForegroundWindow()
//   const pszFileName = Buffer.alloc(200);
//   const lpdwProcessId = Buffer.alloc(16);
//   // var ttt = user32.GetWindowModuleFileNameA(topHWnd, pszFileName, 200)

// var __windowThreadProcessId = user32.GetWindowThreadProcessId(__foregroundHWnd, lpdwProcessId)

//   // dwordBuffer
//   console.log('lpdwProcessId: ', lpdwProcessId)
//   const dwordValue = lpdwProcessId.readInt32BE()
//   console.log('dwordValue: ', dwordValue)
  
//   // PROCESS_QUERY_INFORMATION  | PROCESS_VM_READ 
//   // const processHandle = kernel32.OpenProcess(0x1fffff | 0x0010 , false, __windowThreadProcessId )
//   const processHandle = kernel32.OpenProcess(0x1fffff | 0x0010 , false, dwordValue )

//   // const moduleFileName = kernel32.GetModuleFileNameExA( processHandle, , null, pszFileName, 200 )
//   const moduleFileName = kernel32.GetModuleFileNameA( processHandle, pszFileName, 200 )

//   // var ttt = user32.GetWindowModuleFileNameA(__foregroundHWnd, pszFileName, 200)
  

//   console.log('__foregroundHWnd: ', __foregroundHWnd)
//   console.log(moduleFileName)
//   console.log(moduleFileName)
//   console.log(pszFileName)
//   console.log(pszFileName.toString('utf-8'))
  


// }, 1000);
// console.log(wwww)
// console.log(lpStringPointer)
// console.log(lpStringPointer.toString('utf-8'))











// // Get top-focused application for profile switching (low priority but would be nice)
// var ffi = require('ffi-napi')

// var user32 = new ffi.Library('user32', {
//     'GetTopWindow': ['long', ['long']],
//     'FindWindowA': ['long', ['string', 'string']],
//     'SetActiveWindow': ['long', ['long']],
//     'SetForegroundWindow': ['bool', ['long']],
//     'BringWindowToTop': ['bool', ['long']],
//     'ShowWindow': ['bool', ['long', 'int']],
//     'SwitchToThisWindow': ['void', ['long', 'bool']],
//     'GetForegroundWindow': ['long', []],
//     'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
//     'GetWindowThreadProcessId': ['int', ['long', 'int']],
//     'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
//     'SetFocus': ['long', ['long']]
// });

// var kernel32 = new ffi.Library('Kernel32.dll', {
//     'GetCurrentThreadId': ['int', []]
// });

// var winToSetOnTop = user32.FindWindowA(null, "calculator")
// var foregroundHWnd = user32.GetForegroundWindow()
// var currentThreadId = kernel32.GetCurrentThreadId()
// var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)
// var showWindow = user32.ShowWindow(winToSetOnTop, 9)
// var setWindowPos1 = user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
// var setWindowPos2 = user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
// var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
// var attachThreadInput = user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
// var setFocus = user32.SetFocus(winToSetOnTop)
// var setActiveWindow = user32.SetActiveWindow(winToSetOnTop)
 
// console.log("foregroundHWnd")
// console.log(foregroundHWnd)

const CHECK_FOR_NEW_HWND_TIMER_MS = 1000

export default class MainForeign {
  user32
  // kernel32
  onFocusedWindowChangeFunction
  foregroundHWnd
  focusedWindowTitle

  constructor() {
    this.onFocusedWindowChangeFunction = null

    this.user32 = new ffi.Library('user32', {
      'GetWindowTextA': ['int', ['long', 'string', 'int']],
      'GetForegroundWindow': ['long', []],
    });

    // var kernel32 = new ffi.Library('Kernel32.dll', {
    //   'GetCurrentThreadId': ['int', []],
    // });

    setInterval(() => {
      this.updateCurrentlyFocusedWindow()
      // console.log(this.focusedWindowTitle)
    }, CHECK_FOR_NEW_HWND_TIMER_MS);
    this.updateCurrentlyFocusedWindow()

    this.foregroundHWnd = -1
  }

  updateCurrentlyFocusedWindow() {
    let newForegroundHWnd = this.user32.GetForegroundWindow()
    const lpStringPointer = Buffer.alloc(200);
    let returnVal = this.user32.GetWindowTextA(newForegroundHWnd, lpStringPointer, 200)
    const newByte = lpStringPointer.slice(0, lpStringPointer.indexOf(0x00)) // trip extra 180 something 0x00 bytes
    this.focusedWindowTitle = newByte.toString('utf-8')
    this.focusedWindowTitle = this.focusedWindowTitle.trim()

    if(this.foregroundHWnd != newForegroundHWnd && this.onFocusedWindowChangeFunction != null) {
      this.onFocusedWindowChangeFunction(this.focusedWindowTitle)
    }

    this.foregroundHWnd = newForegroundHWnd
  }

  onFocusedWindowChange(myFunc) {
    if(myFunc != null) {
      // myFunc(newWindowTitle)
      this.onFocusedWindowChangeFunction = myFunc
    }
  }

  // initForeign() {

  // }

}
