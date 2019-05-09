// let options = {
//             delay: 3,
//             beforeAddTicker: () => {
//                 console.log('ticker created');
//             },
//             incrementBy: 001,
//             updateTicker: (count) => {
//                 console.log('ticker updated');
//             },
//             onDestroy: () => {
//                 console.log('destroyed')
//             }
//         }
        export const selfExpiringTicker = (options) => {
            return new Promise((resolve, reject) => {
                let count = 0;
                let startTime = new Date();
                let ticker = new PIXI.ticker.Ticker();
                startTime.setSeconds(startTime.getSeconds() + options.delay);
                ticker.start()
                options.beforeAddTicker();
                ticker.add((delta) => {
                    let countdown = (startTime - Date.now()) / 1000;
                    count += options.incrementBy;
                    if(countdown >0) {
                        options.updateTicker(count);
                    }  else if(countdown <0) {
                        ticker.destroy();
                        resolve(options.onDestroy())
                    }
                    if (countdown < -5) {
                        reject('ticker problem shit');
                    }
        
                })
            })
        }