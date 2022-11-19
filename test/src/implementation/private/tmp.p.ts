
// import * as pl from "pareto-core-lib"

// res.$.createCachingResource(
//     {
//         contextPath: ["data", "cache"]
//     },
//     {
//         onReadError: ($) => {
//             pl.logDebugMessage(`${res.$.createReadFileErrorMessage($.error)} @ ${$.path}`)
//         },
//         onWriteError: ($) => {
//             pl.logDebugMessage(`${res.$.createWriteFileErrorMessage($.error)} @ ${$.path}`)
//         },
//         onMkdirError: ($) => {
//             pl.logDebugMessage(`${res.$.createMkdirErrorMessage($.error)} @ ${$.path}`)
//         },
//         source: res.$.createFileResource(
//             {
//                 contextPath: ["data", "source"]
//             },
//             {
//                 onError: ($) => {
//                     pl.logDebugMessage(`${res.$.createReadFileErrorMessage($.error)} @ ${$.path}`)
//                 }
//             }
//         )
//     },

    
// ).get(
//     {
//         id: ["tmp.txt"]
//     },
//     {
//         onFailed: () => {

//         },
//         onNotExists: () => {

//         },
//         init: () => {
//             return {
//                 onData: ($) => {
//                     pl.logDebugMessage($)
//                 },
//                 onEnd: () => {

//                 }
//             }
//         }
//     }
// ).execute(() => { })