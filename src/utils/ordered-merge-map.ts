/**
 * LICENSE: MIT
 * Copyright 2020  Ben Lesh <ben@benlesh.com>
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* eslint-disable */
import { Observable, Subscription } from "rxjs";

export function orderedMergeMap<T, R>(fn: (value: T) => Observable<R>) {
  return (source: Observable<T>) =>
    new Observable<R>((subscriber) => {
      const buffer: any[] = [];
      let isOuterComplete = false;

      /**
       * We need to check to see if we can complete the resulting
       * observable. If we have any active inner observables, there
       * will still be items in the buffer, which is why we check the
       * length here. The items are removed from the buffer in `checkFlush()`
       */
      const checkComplete = () => {
        if (isOuterComplete && buffer.length === 0) {
          subscriber.complete();
        }
      };

      /**
       * Here we are going to check to see if there any buffered values to flush
       * This needs to be called after any inner observable completes.
       */
      const checkFlush = () => {
        // Look through our buffer of contexts to see what we might need to flush
        // as we do this, we're going to remove any leading contexts that are
        // complete, this is because the related inner observable has given us
        // a value and has completed.
        while (buffer.length > 0 && buffer[0].isComplete) {
          const first = buffer.shift()!;
          for (const value of first.values) {
            subscriber.next(value);
          }
        }

        // Our first buffered context might not be complete, but it may
        // have buffered values we need to flush and send to our
        // consumer via subscribe.next. It's important that
        // we remove the values here, so they are not sent twice.
        if (buffer.length > 0) {
          const values = buffer[0].values;
          while (values.length > 0) {
            subscriber.next(values.shift()!);
          }
        }

        // Okay, now that we've checked our buffers, we need to check
        // to see if we're complete or not, since the buffer might now
        // finally be empty.
        checkComplete();
      };

      // The parent subscription. All subscriptions in this operator need
      // to be added to this. This will be returned as this result observable's
      // teardown.
      const subscription = new Subscription();

      subscription.add(
        source.subscribe({
          next: (value) => {
            let innerObservable: Observable<R>;

            // Our user could give us a callback that throws an error when
            // called. It's important that we catch any errors and send them
            // to the consumer via  `subscriber.error`.
            try {
              innerObservable = fn(value);
            } catch (err) {
              subscriber.error(err);
              return;
            }

            // This context will be used to track values that come from
            // our inner source in the event that it's not the "lead" inner
            // source, so we can emit those values when it's this inner source's
            // turn (after the ones before it complete).
            const context = {
              values: [] as R[],
              isComplete: false
            };
            buffer.push(context);

            // It's important to subscribe to our inner observable and add
            // that subscription to the parent subscription we're returning
            // as teardown.
            subscription.add(
              innerObservable.subscribe({
                next: (innerValue) => {
                  // If the current context happens to be the first one
                  // in the buffer, we know it is the "lead" inner subscription,
                  // and the one that should currently be emitting values.
                  // Otherwise, we can just push the value onto the context's buffer.
                  if (buffer[0] === context) {
                    subscriber.next(innerValue);
                  } else {
                    context.values.push(innerValue);
                  }
                },
                // Any error on an inner source constitutes an error
                // for the whole system.
                error: (err) => subscriber.error(err),
                complete: () => {
                  // Our inner is complete. Let's mark it so, and see what we might
                  // need to send to our consumer.
                  context.isComplete = true;
                  checkFlush();
                }
              })
            );
          },
          // Any error from our source should be passed along to our consumer.
          error: (err) => subscriber.error(err),
          complete: () => {
            // Our outer is complete, but that doesn't necessarily mean we're done.
            // We could still have inner sources active that we're waiting on to
            // complete.
            isOuterComplete = true;
            checkComplete();
          }
        })
      );

      // Return the main subscription as the "teardown".
      // This is roughly the same as `return () => subscription.unsubscribe()`.
      return subscription;
    });
}
