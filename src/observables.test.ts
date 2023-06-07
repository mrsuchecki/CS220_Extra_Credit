import { Observable } from "../include/observable.js";
import { classifyObservables, obsStrCond, statefulObserver } from "./observables.js";

describe("classifyObservables", () => {
  it("classifies num observable", () => {
    const obs = new Observable<number>();

    const { number } = classifyObservables([obs]);
    const spy = jest.fn();
    number.subscribe(spy);

    obs.update(1);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  // More tests go here.
  it("classifies strng, num, and bool obs", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<number>();
    const o3 = new Observable<boolean>();

    const { string, number, boolean } = classifyObservables([o1, o2, o3]);

    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    o1.update("hello");
    expect(stringSpy).toHaveBeenCalledTimes(1);

    o2.update(42);
    expect(numberSpy).toHaveBeenCalledTimes(1);

    o3.update(true);
    expect(booleanSpy).toHaveBeenCalledTimes(1);

    o1.update("world");
    expect(stringSpy).toHaveBeenCalledTimes(2);
  });
});

describe("obsStrCond", () => {
  // More tests go here.
  it("updates returned obs when f returns t", () => {
    const obs = new Observable<string>();
    const xpctd = "world";

    const real = obsStrCond([s => "hello " + s, s => s.toUpperCase()], s => s === xpctd, obs);

    const spy = jest.fn();
    real.subscribe(spy);

    obs.update("world");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(xpctd);
  });

  it("updates the returned obs with the unchanged value when f returns f", () => {
    const o = new Observable<string>();
    const xpctd = "world";

    const real = obsStrCond([s => "hello " + s, s => s.toUpperCase()], s => s === xpctd, o);

    const spy = jest.fn();
    real.subscribe(spy);

    o.update("not expected value");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("not expected value");
  });
});

describe("statefulObserver", () => {
  // More tests go here.
  it("updates returned obs when divisible", () => {
    const obs = new Observable<number>();
    const xpctd = 6;

    const real = statefulObserver(obs);

    const spy = jest.fn();
    real.subscribe(spy);

    obs.update(2);
    expect(spy).toHaveBeenCalledTimes(0);

    obs.update(xpctd);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(xpctd);
  });

  it("doesn't update returned obs when not divisible", () => {
    const obs = new Observable<number>();
    const xpctd = 6;

    const real = statefulObserver(obs);

    const spy = jest.fn();
    real.subscribe(spy);

    obs.update(3);
    expect(spy).toHaveBeenCalledTimes(0);

    obs.update(xpctd + 1);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
