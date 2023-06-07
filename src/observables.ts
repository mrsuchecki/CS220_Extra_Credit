import { Observable } from "../include/observable.js";

// Extra Credit Functions

export function classifyObservables(obsArr: (Observable<string> | Observable<number> | Observable<boolean>)[]): {
  string: Observable<string>;
  number: Observable<number>;
  boolean: Observable<boolean>;
} {
  const result = {
    string: new Observable<string>(),
    number: new Observable<number>(),
    boolean: new Observable<boolean>(),
  };

  obsArr.forEach(obsrvr => {
    if (obsrvr instanceof Observable) {
      obsrvr.subscribe(v => {
        if (typeof v === "string") {
          result.string.update(v);
        } else if (typeof v === "number") {
          result.number.update(v);
        } else if (typeof v === "boolean") {
          result.boolean.update(v);
        }
      });
    }
  });

  return result;
}

export function obsStrCond(
  funcArr: ((arg1: string) => string)[],
  f: (arg1: string) => boolean,
  o: Observable<string>
): Observable<string> {
  const result = new Observable<string>();

  o.subscribe(v => {
    const cmpsd = funcArr.reduce((acc, now) => now(acc), v);
    if (f(cmpsd)) {
      result.update(cmpsd);
    } else {
      result.update(v);
    }
  });

  return result;
}

export function statefulObserver(o: Observable<number>): Observable<number> {
  const result = new Observable<number>();
  let previous = 0;

  o.subscribe(v => {
    if (v % previous === 0) {
      result.update(v);
    }
    previous = v;
  });

  return result;
}

// // Optional Additional Practice

// export function mergeMax(o1: Observable<number>, o2: Observable<number>): Observable<{ obs: number; v: number }> {
//   // TODO: Implement this function
//   return new Observable();
// }

// export function merge(o1: Observable<string>, o2: Observable<string>): Observable<string> {
//   // TODO: Implement this function
//   return new Observable();
// }

// export class GreaterAvgObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   greaterAvg(): Observable<number> {
//     // TODO: Implement this method
//     return new Observable();
//   }
// }

// export class SignChangeObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   signChange(): Observable<number> {
//     // TODO: Implement this method
//     return new Observable();
//   }
// }

// /**
//  * This function shows how the class you created above could be used.
//  * @param numArr Array of numbers
//  * @param f Observer function
//  */
// export function usingSignChange(numArr: number[], f: Observer<number>) {
//   // TODO: Implement this function
// }
