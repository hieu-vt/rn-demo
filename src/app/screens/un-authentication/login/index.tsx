import { useEffect } from 'react';

export const Login = () => {
  // state

  const testPerfomance = () => {
    /**
- Emit 1 promise
- Run with promise.all
- Callback nao resolve truoc thi chay truoc
*/

    // Func emit like realtime
    const listPromise: Record<string, Promise<any>> = {};

    const listIndexMatchPromise: Record<string, Array<number>> = {};

    const newPromisePrice = (key: string, callback: (data: any) => void) => {
      return new Promise(resolveInner => {
        resolveInner(callback);
      });
    };

    const emitDataSymbol = (key: string, dataSymbol: any, i: number) => {
      const indexs = listIndexMatchPromise[key];

      const index = indexs[i];

      const promise = listPromise[key + index];

      if (promise) {
        promise.then(cb => {
          cb(dataSymbol);

          if (i <= indexs.length - 1) {
            emitDataSymbol(key, dataSymbol, i + 1);
          }
        });
      } else {
        if (i <= indexs.length - 1) {
          emitDataSymbol(key, dataSymbol, i + 1);
        }
      }
    };

    const sub = (key: string, promise: Promise<any>) => {
      let newKey = key + 0;
      const indexs = listIndexMatchPromise[key];

      if (indexs?.length > 0) {
        const lastIndex = indexs[indexs.length - 1];

        const newIndex = lastIndex + 1;

        listIndexMatchPromise[key].push(newIndex);

        newKey = key + newIndex;

        listPromise[newKey] = promise;

        return () => {
          delete listPromise[newKey];
        };
      }

      listIndexMatchPromise[key] = [0];

      listPromise[newKey] = promise;

      return () => {
        delete listPromise[newKey];
      };
    };

    // Fake data
    function getSymbolCode(length: number) {
      let result = '';
      const characters = 'ABC';

      const charactersLength = characters.length;

      let counter = 0;
      while (counter < length) {
        const character = characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );

        if (result.includes(character)) {
          continue;
        }

        result += character;

        counter += 1;
      }

      return result.toUpperCase();
    }

    const randomDataSymbol = () => {
      return {
        price: (Math.random() * 100).toFixed(2),
        symbol: getSymbolCode(3),
      };
    };

    let timeout1: any = null;
    let timeout3: any = null;

    const unSub1 = sub(
      'ABC',
      newPromisePrice('ABC', data => {
        if (timeout1) {
          clearTimeout(timeout1);
        }

        timeout1 = setTimeout(() => {
          console.log('Recevier data emit: 1', data);
        }, 4000);
      }),
    );

    sub(
      'ABC',
      newPromisePrice('ABC', data => {
        if (timeout3) {
          clearTimeout(timeout3);
        }

        timeout3 = setTimeout(() => {
          console.log('Recevier data emit: 2', data);
        }, 2000);
      }),
    );

    const unSub3 = sub(
      'ABC',
      newPromisePrice('ABC', data => {
        console.log('Recevier data emit: 3', data);
      }),
    );

    setTimeout(() => {
      unSub1();

      unSub3();

      console.log('Have been unSub 1, 3 subscrible', listPromise);
    }, 10000);

    setTimeout(() => {
      sub(
        'ABC',
        newPromisePrice('ABC', data => {
          console.log('Recevier data emit: 4', data);
        }),
      );
    }, 10000);

    setTimeout(() => {
      sub(
        'ABC',
        newPromisePrice('ABC', data => {
          console.log('Recevier data emit: 5', data);
        }),
      );
    }, 12000);

    setInterval(() => {
      const dataSymbol = randomDataSymbol();

      emitDataSymbol('ABC', dataSymbol, 0);
    }, 3000);
  };

  useEffect(() => {
    const timout = setTimeout(() => {
      testPerfomance();
    }, 1000);

    return () => {
      clearTimeout(timout);
    };
  }, []);

  // render
  return null;
};
