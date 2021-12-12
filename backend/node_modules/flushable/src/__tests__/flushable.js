// @flow
import flushable from "../index";

jest.useFakeTimers();

test("works like setTimeout by default", () => {
  const fn = jest.fn();
  flushable(fn, 100);
  jest.runTimersToTime(100);
  expect(fn).toHaveBeenCalledWith(false);
});

test("can be cancelled", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.cancel();
  jest.runTimersToTime(100);
  expect(fn).not.toHaveBeenCalled();
});

test("can be flushed", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.flush();
  expect(fn).toHaveBeenCalledWith(true);
});

test("can only be flushed once", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.flush();
  operation.flush();
  operation.flush();
  expect(fn).toHaveBeenCalledTimes(1);
});

test("can't be flushed after cancel is called", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.cancel();
  operation.flush();
  jest.runTimersToTime(100);
  expect(fn).toHaveBeenCalledTimes(0);
});

test("is pending before timeout", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  expect(operation.pending()).toBe(true);
  jest.runTimersToTime(100);
  expect(operation.pending()).toBe(false);
});

test("is not pending after cancel", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.cancel();
  expect(operation.pending()).toBe(false);
});

test("is not pending after flush", () => {
  const fn = jest.fn();
  const operation = flushable(fn, 100);
  operation.flush();
  expect(operation.pending()).toBe(false);
});
