/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import Shepherd from 'shepherd.js';
import { timer, Subject, BehaviorSubject, merge, fromEvent, forkJoin } from 'rxjs';
import { takeUntil, skipWhile, filter, skip, first } from 'rxjs/operators';
/** @enum {string} */
const ITourEvent = {
    'click': 'click',
    'pointerover': 'pointerover',
    'keyup': 'keyup',
    'added': 'added',
    'removed': 'removed',
};
export { ITourEvent };
/**
 * @record
 */
export function ITourEventOn() { }
if (false) {
    /** @type {?|undefined} */
    ITourEventOn.prototype.selector;
    /** @type {?|undefined} */
    ITourEventOn.prototype.event;
}
/**
 * @record
 */
export function ITourEventOnOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourEventOnOptions.prototype.timeBeforeShow;
    /** @type {?|undefined} */
    ITourEventOnOptions.prototype.interval;
}
/**
 * @record
 */
export function ITourAbortOn() { }
/**
 * @record
 */
export function ITourOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourOptions.prototype.abortOn;
}
/**
 * @record
 */
export function ITourStepAttachToOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.highlight;
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.retries;
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.skipIfNotFound;
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.else;
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.goBackTo;
    /** @type {?|undefined} */
    ITourStepAttachToOptions.prototype.skipFromStepCount;
}
/**
 * @record
 */
export function ITourStepAdvanceOn() { }
/**
 * @record
 */
export function ITourStepAdvanceOnOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourStepAdvanceOnOptions.prototype.jumpTo;
    /** @type {?|undefined} */
    ITourStepAdvanceOnOptions.prototype.allowGoBack;
}
/**
 * @record
 */
export function ITourStep() { }
if (false) {
    /** @type {?|undefined} */
    ITourStep.prototype.attachToOptions;
    /** @type {?|undefined} */
    ITourStep.prototype.advanceOnOptions;
    /** @type {?|undefined} */
    ITourStep.prototype.advanceOn;
    /** @type {?|undefined} */
    ITourStep.prototype.abortOn;
    /** @type {?|undefined} */
    ITourStep.prototype.count;
}
/**
 * @abstract
 */
class TourButtonsActions {
}
if (false) {
    /**
     * @abstract
     * @return {?}
     */
    TourButtonsActions.prototype.next = function () { };
    /**
     * @abstract
     * @return {?}
     */
    TourButtonsActions.prototype.back = function () { };
    /**
     * @abstract
     * @return {?}
     */
    TourButtonsActions.prototype.cancel = function () { };
    /**
     * @abstract
     * @return {?}
     */
    TourButtonsActions.prototype.finish = function () { };
}
/** @type {?} */
const SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW = 100;
/** @type {?} */
const SHEPHERD_DEFAULT_FIND_INTERVAL = 500;
/** @type {?} */
const SHEPHERD_DEFAULT_FIND_ATTEMPTS = 20;
/** @type {?} */
const overriddenEvents = [
    ITourEvent.click,
    ITourEvent.pointerover,
    ITourEvent.removed,
    ITourEvent.added,
    ITourEvent.keyup,
];
/** @type {?} */
const keyEvents = new Map([
    [13, 'enter'],
    [27, 'esc'],
]);
/** @type {?} */
const defaultStepOptions = {
    scrollTo: { behavior: 'smooth', block: 'center' },
    cancelIcon: {
        enabled: true,
    },
};
/** @type {?} */
const MAT_ICON_BUTTON = 'mat-icon-button material-icons mat-button-base';
/** @type {?} */
const MAT_BUTTON = 'mat-button-base mat-button';
export class CovalentGuidedTour extends TourButtonsActions {
    /**
     * @param {?=} stepOptions
     */
    constructor(stepOptions = defaultStepOptions) {
        super();
        this.stepOptions = stepOptions;
        this.newTour();
    }
    /**
     * @param {?=} opts
     * @return {?}
     */
    newTour(opts) {
        this.shepherdTour = new Shepherd.Tour(Object.assign({
            defaultStepOptions: this.stepOptions,
        }, opts));
        this._destroyedEvent$ = new Subject();
        // listen to cancel and complete to clean up abortOn events
        merge(fromEvent(this.shepherdTour, 'cancel'), fromEvent(this.shepherdTour, 'complete'))
            .pipe(first())
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._destroyedEvent$.next();
            this._destroyedEvent$.complete();
        }));
        // if abortOn was passed, we bind the event and execute complete
        if (opts && opts.abortOn) {
            /** @type {?} */
            const abortArr$ = [];
            opts.abortOn.forEach((/**
             * @param {?} abortOn
             * @return {?}
             */
            (abortOn) => {
                /** @type {?} */
                const abortEvent$ = new Subject();
                abortArr$.push(abortEvent$);
                this._bindEvent(abortOn, undefined, abortEvent$, this._destroyedEvent$);
            }));
            /** @type {?} */
            const abortSubs = merge(...abortArr$)
                .pipe(takeUntil(this._destroyedEvent$))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this.shepherdTour.complete();
                abortSubs.unsubscribe();
            }));
        }
    }
    /**
     * @return {?}
     */
    back() {
        this.shepherdTour.back();
    }
    /**
     * @return {?}
     */
    cancel() {
        this.shepherdTour.cancel();
    }
    /**
     * @return {?}
     */
    next() {
        this.shepherdTour.next();
    }
    /**
     * @return {?}
     */
    finish() {
        this.shepherdTour.complete();
    }
    /**
     * @param {?} steps
     * @return {?}
     */
    addSteps(steps) {
        this.shepherdTour.addSteps(this._prepareTour(steps));
    }
    /**
     * @return {?}
     */
    start() {
        this.shepherdTour.start();
    }
    /**
     * @protected
     * @param {?} originalSteps
     * @param {?=} finishLabel
     * @param {?=} dismissLabel
     * @return {?}
     */
    _prepareTour(originalSteps, finishLabel = 'finish', dismissLabel = 'cancel tour') {
        // create Subjects for back and forward events
        /** @type {?} */
        const backEvent$ = new Subject();
        /** @type {?} */
        const forwardEvent$ = new Subject();
        /** @type {?} */
        let _backFlow = false;
        // create Subject for your end
        /** @type {?} */
        const destroyedEvent$ = new Subject();
        /**
         * This function adds the step progress in the footer of the shepherd tooltip
         * @type {?}
         */
        const appendProgressFunc = (/**
         * @return {?}
         */
        function () {
            // get all the footers that are available in the DOM
            /** @type {?} */
            const footers = Array.from(document.querySelectorAll('.shepherd-footer'));
            // get the last footer since Shepherd always puts the active one at the end
            /** @type {?} */
            const footer = footers[footers.length - 1];
            // generate steps html element
            /** @type {?} */
            const progress = document.createElement('span');
            progress.className = 'shepherd-progress';
            progress.innerText = `${this.shepherdTour.currentStep.options.count}/${stepTotal}`;
            // insert into the footer before the first button
            footer.insertBefore(progress, footer.querySelector('.shepherd-button'));
        });
        /** @type {?} */
        let stepTotal = 0;
        /** @type {?} */
        const steps = originalSteps.map((/**
         * @param {?} step
         * @return {?}
         */
        (step) => {
            var _a, _b, _c;
            /** @type {?} */
            let showProgress;
            if (((_a = step.attachToOptions) === null || _a === void 0 ? void 0 : _a.skipFromStepCount) === true) {
                showProgress = (/**
                 * @return {?}
                 */
                function () {
                    return;
                });
            }
            else if (((_b = step.attachToOptions) === null || _b === void 0 ? void 0 : _b.skipFromStepCount) === undefined ||
                ((_c = step.attachToOptions) === null || _c === void 0 ? void 0 : _c.skipFromStepCount) === false) {
                step.count = ++stepTotal;
                showProgress = appendProgressFunc.bind(this);
            }
            return Object.assign({}, step, {
                when: {
                    show: showProgress,
                },
            });
        }));
        /** @type {?} */
        const finishButton = {
            text: finishLabel,
            action: this['finish'].bind(this),
            classes: MAT_BUTTON,
        };
        /** @type {?} */
        const dismissButton = {
            text: dismissLabel,
            action: this['cancel'].bind(this),
            classes: MAT_BUTTON,
        };
        // listen to the destroyed event to clean up all the streams
        this._destroyedEvent$.pipe(first()).subscribe((/**
         * @return {?}
         */
        () => {
            backEvent$.complete();
            forwardEvent$.complete();
            destroyedEvent$.next();
            destroyedEvent$.complete();
        }));
        /** @type {?} */
        const totalSteps = steps.length;
        steps.forEach((/**
         * @param {?} step
         * @param {?} index
         * @return {?}
         */
        (step, index) => {
            // create buttons specific for the step
            // this is done to create more control on events
            /** @type {?} */
            const nextButton = {
                text: 'chevron_right',
                action: (/**
                 * @return {?}
                 */
                () => {
                    // intercept the next action and trigger event
                    forwardEvent$.next();
                    this.shepherdTour.next();
                }),
                classes: MAT_ICON_BUTTON,
            };
            /** @type {?} */
            const backButton = {
                text: 'chevron_left',
                action: (/**
                 * @return {?}
                 */
                () => {
                    // intercept the back action and trigger event
                    backEvent$.next();
                    _backFlow = true;
                    // check if 'goBackTo' is set to jump to a particular step, else just go back
                    if (step.attachToOptions && step.attachToOptions.goBackTo) {
                        this.shepherdTour.show(step.attachToOptions.goBackTo, false);
                    }
                    else {
                        this.shepherdTour.back();
                    }
                }),
                classes: MAT_ICON_BUTTON,
            };
            // check if highlight was provided for the step, else fallback into shepherds usage
            step.highlightClass =
                step.attachToOptions && step.attachToOptions.highlight ? 'shepherd-highlight' : step.highlightClass;
            if (index === 0) {
                // first step
                step.buttons = [nextButton];
            }
            else if (index === totalSteps - 1) {
                // last step
                step.buttons = [backButton, finishButton];
            }
            else {
                step.buttons = [backButton, nextButton];
            }
            // checks "advanceOn" to override listeners
            /** @type {?} */
            let advanceOn = step.advanceOn;
            // remove the shepherd "advanceOn" infavor of ours if the event is part of our list
            if ((typeof advanceOn === 'object' &&
                !Array.isArray(advanceOn) &&
                overriddenEvents.indexOf(advanceOn.event.split('.')[0]) > -1) ||
                advanceOn instanceof Array) {
                step.advanceOn = undefined;
                step.buttons =
                    step.advanceOnOptions && step.advanceOnOptions.allowGoBack ? [backButton, dismissButton] : [dismissButton];
            }
            // adds a default beforeShowPromise function
            step.beforeShowPromise = (/**
             * @return {?}
             */
            () => {
                return new Promise((/**
                 * @param {?} resolve
                 * @return {?}
                 */
                (resolve) => {
                    /** @type {?} */
                    const additionalCapabilitiesSetup = (/**
                     * @return {?}
                     */
                    () => {
                        if (advanceOn && !step.advanceOn) {
                            if (!Array.isArray(advanceOn)) {
                                advanceOn = [advanceOn];
                            }
                            /** @type {?} */
                            const advanceArr$ = [];
                            advanceOn.forEach((/**
                             * @param {?} _
                             * @param {?} i
                             * @return {?}
                             */
                            (_, i) => {
                                /** @type {?} */
                                const advanceEvent$ = new Subject();
                                advanceArr$.push(advanceEvent$);
                                // we start a timer of attempts to find an element in the dom
                                this._bindEvent(advanceOn[i], step.advanceOnOptions, advanceEvent$, destroyedEvent$);
                            }));
                            /** @type {?} */
                            const advanceSubs = forkJoin(...advanceArr$)
                                .pipe(takeUntil(merge(destroyedEvent$, backEvent$)))
                                .subscribe((/**
                             * @return {?}
                             */
                            () => {
                                // check if we need to advance to a specific step, else advance to next step
                                if (step.advanceOnOptions && step.advanceOnOptions.jumpTo) {
                                    this.shepherdTour.show(step.advanceOnOptions.jumpTo);
                                }
                                else {
                                    this.shepherdTour.next();
                                }
                                forwardEvent$.next();
                                advanceSubs.unsubscribe();
                            }));
                        }
                        // if abortOn was passed on the step, we bind the event and execute complete
                        if (step.abortOn) {
                            /** @type {?} */
                            const abortArr$ = [];
                            step.abortOn.forEach((/**
                             * @param {?} abortOn
                             * @return {?}
                             */
                            (abortOn) => {
                                /** @type {?} */
                                const abortEvent$ = new Subject();
                                abortArr$.push(abortEvent$);
                                this._bindEvent(abortOn, undefined, abortEvent$, destroyedEvent$);
                            }));
                            /** @type {?} */
                            const abortSubs = merge(...abortArr$)
                                .pipe(takeUntil(merge(destroyedEvent$, backEvent$, forwardEvent$)))
                                .subscribe((/**
                             * @return {?}
                             */
                            () => {
                                this.shepherdTour.complete();
                                abortSubs.unsubscribe();
                            }));
                        }
                    });
                    /** @type {?} */
                    const _stopTimer$ = new Subject();
                    /** @type {?} */
                    const _retriesReached$ = new Subject();
                    /** @type {?} */
                    const _retryAttempts$ = new BehaviorSubject(-1);
                    /** @type {?} */
                    let id;
                    // checks if "attachTo" is a string or an object to get the id of an element
                    if (typeof step.attachTo === 'string') {
                        id = step.attachTo;
                    }
                    else if (typeof step.attachTo === 'object' && typeof step.attachTo.element === 'string') {
                        id = step.attachTo.element;
                    }
                    // if we have an id as a string in either case, we use it (we ignore it if its HTMLElement)
                    if (id) {
                        // if current step is the first step of the tour, we set the buttons to be only "next" or "dismiss"
                        // we had to use `any` since the tour doesnt expose the steps in any fashion nor a way to check if we have modified them at all
                        if (this.shepherdTour.getCurrentStep() === ((/** @type {?} */ (this.shepherdTour))).steps[0]) {
                            this.shepherdTour.getCurrentStep().updateStepOptions({
                                buttons: originalSteps[index].advanceOn ? [dismissButton] : [nextButton],
                            });
                        }
                        // register to the attempts observable to notify deeveloper when number has been reached
                        _retryAttempts$
                            .pipe(skip(1), takeUntil(merge(_stopTimer$.asObservable(), destroyedEvent$)), skipWhile((/**
                         * @param {?} val
                         * @return {?}
                         */
                        (val) => {
                            if (step.attachToOptions && step.attachToOptions.retries !== undefined) {
                                return val < step.attachToOptions.retries;
                            }
                            return val < SHEPHERD_DEFAULT_FIND_ATTEMPTS;
                        })))
                            .subscribe((/**
                         * @param {?} attempts
                         * @return {?}
                         */
                        (attempts) => {
                            _retriesReached$.next();
                            _retriesReached$.complete();
                            // if attempts have been reached, we check "skipIfNotFound" to move on to the next step
                            if (step.attachToOptions && step.attachToOptions.skipIfNotFound) {
                                // if we get to this step coming back from a step and it wasnt found
                                // then we either check if its the first step and try going forward
                                // or we keep going back until we find a step that actually exists
                                if (_backFlow) {
                                    if (((/** @type {?} */ (this.shepherdTour))).steps.indexOf(this.shepherdTour.getCurrentStep()) === 0) {
                                        this.shepherdTour.next();
                                    }
                                    else {
                                        this.shepherdTour.back();
                                    }
                                    _backFlow = false;
                                }
                                else {
                                    // destroys current step if we need to skip it to remove it from the tour
                                    /** @type {?} */
                                    const currentStep = this.shepherdTour.getCurrentStep();
                                    currentStep.destroy();
                                    this.shepherdTour.next();
                                    this.shepherdTour.removeStep(((/** @type {?} */ (currentStep))).id);
                                }
                            }
                            else if (step.attachToOptions && step.attachToOptions.else) {
                                // if "skipIfNotFound" is not true, then we check if "else" has been set to jump to a specific step
                                this.shepherdTour.show(step.attachToOptions.else);
                            }
                            else {
                                // tslint:disable-next-line:no-console
                                console.warn(`Retries reached trying to find ${id}. Retried  ${attempts} times.`);
                                // else we show the step regardless
                                resolve();
                            }
                        }));
                        // we start a timer of attempts to find an element in the dom
                        timer((step.attachToOptions && step.attachToOptions.timeBeforeShow) || SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW, (step.attachToOptions && step.attachToOptions.interval) || SHEPHERD_DEFAULT_FIND_INTERVAL)
                            .pipe(
                        // the timer will continue either until we find the element or the number of attempts has been reached
                        takeUntil(merge(_stopTimer$, _retriesReached$, destroyedEvent$)))
                            .subscribe((/**
                         * @return {?}
                         */
                        () => {
                            /** @type {?} */
                            const element = document.querySelector(id);
                            // if the element has been found, we stop the timer and resolve the promise
                            if (element) {
                                _stopTimer$.next();
                                _stopTimer$.complete();
                                additionalCapabilitiesSetup();
                                resolve();
                            }
                            else {
                                _retryAttempts$.next(_retryAttempts$.value + 1);
                            }
                        }));
                        // stop find interval if user stops the tour
                        destroyedEvent$.subscribe((/**
                         * @return {?}
                         */
                        () => {
                            _stopTimer$.next();
                            _stopTimer$.complete();
                            _retriesReached$.next();
                            _retriesReached$.complete();
                        }));
                    }
                    else {
                        // resolve observable until the timeBeforeShow has passsed or use default
                        timer((step.attachToOptions && step.attachToOptions.timeBeforeShow) || SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW)
                            .pipe(takeUntil(merge(destroyedEvent$)))
                            .subscribe((/**
                         * @return {?}
                         */
                        () => {
                            resolve();
                        }));
                    }
                }));
            });
        }));
        return steps;
    }
    /**
     * @private
     * @param {?} eventOn
     * @param {?} eventOnOptions
     * @param {?} event$
     * @param {?} destroyedEvent$
     * @return {?}
     */
    _bindEvent(eventOn, eventOnOptions, event$, destroyedEvent$) {
        /** @type {?} */
        const selector = eventOn.selector;
        /** @type {?} */
        const event = eventOn.event;
        // we start a timer of attempts to find an element in the dom
        /** @type {?} */
        const timerSubs = timer((eventOnOptions && eventOnOptions.timeBeforeShow) || SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW, (eventOnOptions && eventOnOptions.interval) || SHEPHERD_DEFAULT_FIND_INTERVAL)
            .pipe(takeUntil(destroyedEvent$))
            .subscribe((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const element = document.querySelector(selector);
            // if the element has been found, we stop the timer and resolve the promise
            if (element) {
                timerSubs.unsubscribe();
                if (event === ITourEvent.added) {
                    // if event is "Added" trigger a soon as this is attached.
                    event$.next();
                    event$.complete();
                }
                else if (event === ITourEvent.click ||
                    event === ITourEvent.pointerover ||
                    event.indexOf(ITourEvent.keyup) > -1) {
                    // we use normal listeners for mouseevents
                    /** @type {?} */
                    const mainEvent = event.split('.')[0];
                    /** @type {?} */
                    const subEvent = event.split('.')[1];
                    fromEvent(element, mainEvent)
                        .pipe(takeUntil(merge(event$.asObservable(), destroyedEvent$)), filter((/**
                     * @param {?} $event
                     * @return {?}
                     */
                    ($event) => {
                        // only trigger if the event is a keyboard event and part of out list
                        if ($event instanceof KeyboardEvent) {
                            if (keyEvents.get($event.keyCode) === subEvent) {
                                return true;
                            }
                            return false;
                        }
                        else {
                            return true;
                        }
                    })))
                        .subscribe((/**
                     * @return {?}
                     */
                    () => {
                        event$.next();
                        event$.complete();
                    }));
                }
                else if (event === ITourEvent.removed) {
                    // and we will use MutationObserver for DOM events
                    /** @type {?} */
                    const observer = new MutationObserver((/**
                     * @return {?}
                     */
                    () => {
                        if (!document.body.contains(element)) {
                            event$.next();
                            event$.complete();
                            observer.disconnect();
                        }
                    }));
                    // stop listenining if tour is closed
                    destroyedEvent$.subscribe((/**
                     * @return {?}
                     */
                    () => {
                        observer.disconnect();
                    }));
                    // observe for any DOM interaction in the element
                    observer.observe(element, { childList: true, subtree: true, attributes: true });
                }
            }
        }));
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTour.prototype._destroyedEvent$;
    /** @type {?} */
    CovalentGuidedTour.prototype.shepherdTour;
    /** @type {?} */
    CovalentGuidedTour.prototype.stepOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWdCLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0lBTXpFLFNBQVUsT0FBTztJQUNqQixlQUFnQixhQUFhO0lBQzdCLFNBQVUsT0FBTztJQUNqQixTQUFVLE9BQU87SUFDakIsV0FBWSxTQUFTOzs7Ozs7QUFHdkIsa0NBR0M7OztJQUZDLGdDQUFrQjs7SUFDbEIsNkJBQWdDOzs7OztBQUdsQyx5Q0FHQzs7O0lBRkMsNkNBQXdCOztJQUN4Qix1Q0FBa0I7Ozs7O0FBR3BCLGtDQUFxRDs7OztBQUVyRCxrQ0FFQzs7O0lBREMsK0JBQXlCOzs7OztBQUczQiw4Q0FPQzs7O0lBTkMsNkNBQW9COztJQUNwQiwyQ0FBaUI7O0lBQ2pCLGtEQUF5Qjs7SUFDekIsd0NBQWM7O0lBQ2QsNENBQWtCOztJQUNsQixxREFBNEI7Ozs7O0FBRzlCLHdDQUEyRDs7OztBQUUzRCwrQ0FHQzs7O0lBRkMsMkNBQWdCOztJQUNoQixnREFBc0I7Ozs7O0FBR3hCLCtCQU1DOzs7SUFMQyxvQ0FBMkM7O0lBQzNDLHFDQUE2Qzs7SUFDN0MsOEJBQTREOztJQUM1RCw0QkFBeUI7O0lBQ3pCLDBCQUFlOzs7OztBQUdqQixNQUFlLGtCQUFrQjtDQVFoQzs7Ozs7O0lBUEMsb0RBQXNCOzs7OztJQUV0QixvREFBc0I7Ozs7O0lBRXRCLHNEQUF3Qjs7Ozs7SUFFeEIsc0RBQXdCOzs7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QUFJLEVBQUUsQ0FBQzs0QkFDZCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ2xCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt5QkFDdkI7b0JBQ0gsQ0FBQyxFQUFDO29CQUVGLHFDQUFxQztvQkFDckMsZUFBZSxDQUFDLFNBQVM7OztvQkFBQyxHQUFHLEVBQUU7d0JBQzdCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQyxFQUFDLENBQUM7b0JBQ0gsaURBQWlEO29CQUNqRCxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDakY7YUFDRjtRQUNILENBQUMsRUFBQztJQUNOLENBQUM7Q0FDRjs7Ozs7O0lBemFDLDhDQUF3Qzs7SUFFeEMsMENBQTRCOztJQUM1Qix5Q0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGltZXIsIFN1YmplY3QsIEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50LCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBza2lwV2hpbGUsIGZpbHRlciwgc2tpcCwgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIFRvdXJTdGVwID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucztcbmV4cG9ydCB0eXBlIFRvdXJTdGVwQnV0dG9uID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9uc0J1dHRvbjtcblxuZXhwb3J0IGVudW0gSVRvdXJFdmVudCB7XG4gICdjbGljaycgPSAnY2xpY2snLFxuICAncG9pbnRlcm92ZXInID0gJ3BvaW50ZXJvdmVyJyxcbiAgJ2tleXVwJyA9ICdrZXl1cCcsXG4gICdhZGRlZCcgPSAnYWRkZWQnLCAvLyBhZGRlZCB0byBET01cbiAgJ3JlbW92ZWQnID0gJ3JlbW92ZWQnLCAvLyByZW1vdmVkIGZyb20gRE9NXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJFdmVudE9uIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7IC8vIGNzcyBzZWxlY3RvclxuICBldmVudD86IGtleW9mIHR5cGVvZiBJVG91ckV2ZW50OyAvLyBjbGljaywgcG9pbnRlcm92ZXIsIGtleXVwLCBhZGRlZCwgcmVtb3ZlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICB0aW1lQmVmb3JlU2hvdz86IG51bWJlcjsgLy8gZGVsYXkgYmVmb3JlIHN0ZXAgaXMgZGlzcGxheWVkXG4gIGludGVydmFsPzogbnVtYmVyOyAvLyB0aW1lIGJldHdlZW4gc2VhcmNoZXMgZm9yIGVsZW1lbnQsIGRlZmF1bHRzIHRvIDUwMG1zXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJBYm9ydE9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJPcHRpb25zIGV4dGVuZHMgU2hlcGhlcmQuVG91ci5Ub3VyT3B0aW9ucyB7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTsgLy8gZXZlbnRzIHRvIGFib3J0IG9uXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGhpZ2hsaWdodD86IGJvb2xlYW47XG4gIHJldHJpZXM/OiBudW1iZXI7IC8vICMgbnVtIG9mIGF0dGVtcHRzIHRvIGZpbmQgZWxlbWVudFxuICBza2lwSWZOb3RGb3VuZD86IGJvb2xlYW47IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kIGFmdGVyIG4gcmV0cmllcywgbW92ZSBvbiB0byBuZXh0IHN0ZXBcbiAgZWxzZT86IHN0cmluZzsgLy8gaWYgZWxlbWVudCBpcyBub3QgZm91bmQsIGdvIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGdvQmFja1RvPzogc3RyaW5nOyAvLyBiYWNrIGJ1dHRvbiBnb2VzIGJhY2sgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgc2tpcEZyb21TdGVwQ291bnQ/OiBib29sZWFuOyAvLyBzaG93L2hpZGUgcHJvZ3Jlc3Mgb24gc3RlcFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnMgZXh0ZW5kcyBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAganVtcFRvPzogc3RyaW5nOyAvLyBuZXh0IGJ1dHRvbiB3aWxsIGp1bXAgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgYWxsb3dHb0JhY2s/OiBib29sZWFuOyAvLyBhbGxvdyBiYWNrIHdpdGhpbiB0aGlzIHN0ZXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXAgZXh0ZW5kcyBUb3VyU3RlcCB7XG4gIGF0dGFjaFRvT3B0aW9ucz86IElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucztcbiAgYWR2YW5jZU9uT3B0aW9ucz86IElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnM7XG4gIGFkdmFuY2VPbj86IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uIHwgYW55O1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107XG4gIGNvdW50PzogbnVtYmVyO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBhYnN0cmFjdCBuZXh0KCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgYmFjaygpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGNhbmNlbCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGZpbmlzaCgpOiB2b2lkO1xufVxuXG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVzogbnVtYmVyID0gMTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMOiBudW1iZXIgPSA1MDA7XG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM6IG51bWJlciA9IDIwO1xuXG5jb25zdCBvdmVycmlkZGVuRXZlbnRzOiBzdHJpbmdbXSA9IFtcbiAgSVRvdXJFdmVudC5jbGljayxcbiAgSVRvdXJFdmVudC5wb2ludGVyb3ZlcixcbiAgSVRvdXJFdmVudC5yZW1vdmVkLFxuICBJVG91ckV2ZW50LmFkZGVkLFxuICBJVG91ckV2ZW50LmtleXVwLFxuXTtcblxuY29uc3Qga2V5RXZlbnRzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oW1xuICBbMTMsICdlbnRlciddLFxuICBbMjcsICdlc2MnXSxcbl0pO1xuXG5jb25zdCBkZWZhdWx0U3RlcE9wdGlvbnM6IFRvdXJTdGVwID0ge1xuICBzY3JvbGxUbzogeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9LFxuICBjYW5jZWxJY29uOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IE1BVF9JQ09OX0JVVFRPTjogc3RyaW5nID0gJ21hdC1pY29uLWJ1dHRvbiBtYXRlcmlhbC1pY29ucyBtYXQtYnV0dG9uLWJhc2UnO1xuY29uc3QgTUFUX0JVVFRPTjogc3RyaW5nID0gJ21hdC1idXR0b24tYmFzZSBtYXQtYnV0dG9uJztcblxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91ciBleHRlbmRzIFRvdXJCdXR0b25zQWN0aW9ucyB7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPjtcblxuICBzaGVwaGVyZFRvdXI6IFNoZXBoZXJkLlRvdXI7XG4gIHN0ZXBPcHRpb25zOiBJVG91clN0ZXA7XG5cbiAgY29uc3RydWN0b3Ioc3RlcE9wdGlvbnM6IElUb3VyU3RlcCA9IGRlZmF1bHRTdGVwT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0ZXBPcHRpb25zID0gc3RlcE9wdGlvbnM7XG4gICAgdGhpcy5uZXdUb3VyKCk7XG4gIH1cblxuICBuZXdUb3VyKG9wdHM/OiBJVG91ck9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ciA9IG5ldyBTaGVwaGVyZC5Ub3VyKFxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgIGRlZmF1bHRTdGVwT3B0aW9uczogdGhpcy5zdGVwT3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0cyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgLy8gbGlzdGVuIHRvIGNhbmNlbCBhbmQgY29tcGxldGUgdG8gY2xlYW4gdXAgYWJvcnRPbiBldmVudHNcbiAgICBtZXJnZShmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjYW5jZWwnKSwgZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY29tcGxldGUnKSlcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICBpZiAob3B0cyAmJiBvcHRzLmFib3J0T24pIHtcbiAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICBvcHRzLmFib3J0T24uZm9yRWFjaCgoYWJvcnRPbjogSVRvdXJBYm9ydE9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWJvcnRPbiwgdW5kZWZpbmVkLCBhYm9ydEV2ZW50JCwgdGhpcy5fZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICB9XG5cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gIH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFkZFN0ZXBzKHN0ZXBzOiBJVG91clN0ZXBbXSk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKHRoaXMuX3ByZXBhcmVUb3VyKHN0ZXBzKSk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5zdGFydCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcmVwYXJlVG91cihcbiAgICBvcmlnaW5hbFN0ZXBzOiBJVG91clN0ZXBbXSxcbiAgICBmaW5pc2hMYWJlbDogc3RyaW5nID0gJ2ZpbmlzaCcsXG4gICAgZGlzbWlzc0xhYmVsOiBzdHJpbmcgPSAnY2FuY2VsIHRvdXInLFxuICApOiBJVG91clN0ZXBbXSB7XG4gICAgLy8gY3JlYXRlIFN1YmplY3RzIGZvciBiYWNrIGFuZCBmb3J3YXJkIGV2ZW50c1xuICAgIGNvbnN0IGJhY2tFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGNvbnN0IGZvcndhcmRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGxldCBfYmFja0Zsb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBjcmVhdGUgU3ViamVjdCBmb3IgeW91ciBlbmRcbiAgICBjb25zdCBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgc3RlcCBwcm9ncmVzcyBpbiB0aGUgZm9vdGVyIG9mIHRoZSBzaGVwaGVyZCB0b29sdGlwXG4gICAgICovXG4gICAgY29uc3QgYXBwZW5kUHJvZ3Jlc3NGdW5jOiBGdW5jdGlvbiA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgIC8vIGdldCBhbGwgdGhlIGZvb3RlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGZvb3RlcnM6IEVsZW1lbnRbXSA9IEFycmF5LmZyb208RWxlbWVudD4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNoZXBoZXJkLWZvb3RlcicpKTtcbiAgICAgIC8vIGdldCB0aGUgbGFzdCBmb290ZXIgc2luY2UgU2hlcGhlcmQgYWx3YXlzIHB1dHMgdGhlIGFjdGl2ZSBvbmUgYXQgdGhlIGVuZFxuICAgICAgY29uc3QgZm9vdGVyOiBFbGVtZW50ID0gZm9vdGVyc1tmb290ZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gZ2VuZXJhdGUgc3RlcHMgaHRtbCBlbGVtZW50XG4gICAgICBjb25zdCBwcm9ncmVzczogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvZ3Jlc3MuY2xhc3NOYW1lID0gJ3NoZXBoZXJkLXByb2dyZXNzJztcbiAgICAgIHByb2dyZXNzLmlubmVyVGV4dCA9IGAke3RoaXMuc2hlcGhlcmRUb3VyLmN1cnJlbnRTdGVwLm9wdGlvbnMuY291bnR9LyR7c3RlcFRvdGFsfWA7XG4gICAgICAvLyBpbnNlcnQgaW50byB0aGUgZm9vdGVyIGJlZm9yZSB0aGUgZmlyc3QgYnV0dG9uXG4gICAgICBmb290ZXIuaW5zZXJ0QmVmb3JlKHByb2dyZXNzLCBmb290ZXIucXVlcnlTZWxlY3RvcignLnNoZXBoZXJkLWJ1dHRvbicpKTtcbiAgICB9O1xuXG4gICAgbGV0IHN0ZXBUb3RhbDogbnVtYmVyID0gMDtcbiAgICBjb25zdCBzdGVwczogSVRvdXJTdGVwW10gPSBvcmlnaW5hbFN0ZXBzLm1hcCgoc3RlcDogSVRvdXJTdGVwKSA9PiB7XG4gICAgICBsZXQgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcbiAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHRydWUpIHtcbiAgICAgICAgc2hvd1Byb2dyZXNzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gZmFsc2VcbiAgICAgICkge1xuICAgICAgICBzdGVwLmNvdW50ID0gKytzdGVwVG90YWw7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGFwcGVuZFByb2dyZXNzRnVuYy5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0ZXAsIHtcbiAgICAgICAgd2hlbjoge1xuICAgICAgICAgIHNob3c6IHNob3dQcm9ncmVzcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6IGZpbmlzaExhYmVsLFxuICAgICAgYWN0aW9uOiB0aGlzWydmaW5pc2gnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuICAgIGNvbnN0IGRpc21pc3NCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgdGV4dDogZGlzbWlzc0xhYmVsLFxuICAgICAgYWN0aW9uOiB0aGlzWydjYW5jZWwnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuXG4gICAgLy8gbGlzdGVuIHRvIHRoZSBkZXN0cm95ZWQgZXZlbnQgdG8gY2xlYW4gdXAgYWxsIHRoZSBzdHJlYW1zXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGJhY2tFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGZvcndhcmRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICBkZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsU3RlcHM6IG51bWJlciA9IHN0ZXBzLmxlbmd0aDtcbiAgICBzdGVwcy5mb3JFYWNoKChzdGVwOiBJVG91clN0ZXAsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIC8vIGNyZWF0ZSBidXR0b25zIHNwZWNpZmljIGZvciB0aGUgc3RlcFxuICAgICAgLy8gdGhpcyBpcyBkb25lIHRvIGNyZWF0ZSBtb3JlIGNvbnRyb2wgb24gZXZlbnRzXG4gICAgICBjb25zdCBuZXh0QnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fcmlnaHQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIG5leHQgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuICAgICAgY29uc3QgYmFja0J1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICAgIHRleHQ6ICdjaGV2cm9uX2xlZnQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIGJhY2sgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgYmFja0V2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgX2JhY2tGbG93ID0gdHJ1ZTtcbiAgICAgICAgICAvLyBjaGVjayBpZiAnZ29CYWNrVG8nIGlzIHNldCB0byBqdW1wIHRvIGEgcGFydGljdWxhciBzdGVwLCBlbHNlIGp1c3QgZ28gYmFja1xuICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbykge1xuICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbywgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuXG4gICAgICAvLyBjaGVjayBpZiBoaWdobGlnaHQgd2FzIHByb3ZpZGVkIGZvciB0aGUgc3RlcCwgZWxzZSBmYWxsYmFjayBpbnRvIHNoZXBoZXJkcyB1c2FnZVxuICAgICAgc3RlcC5oaWdobGlnaHRDbGFzcyA9XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmhpZ2hsaWdodCA/ICdzaGVwaGVyZC1oaWdobGlnaHQnIDogc3RlcC5oaWdobGlnaHRDbGFzcztcblxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIC8vIGZpcnN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW25leHRCdXR0b25dO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdG90YWxTdGVwcyAtIDEpIHtcbiAgICAgICAgLy8gbGFzdCBzdGVwXG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtiYWNrQnV0dG9uLCBmaW5pc2hCdXR0b25dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIG5leHRCdXR0b25dO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGVja3MgXCJhZHZhbmNlT25cIiB0byBvdmVycmlkZSBsaXN0ZW5lcnNcbiAgICAgIGxldCBhZHZhbmNlT246IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uID0gc3RlcC5hZHZhbmNlT247XG4gICAgICAvLyByZW1vdmUgdGhlIHNoZXBoZXJkIFwiYWR2YW5jZU9uXCIgaW5mYXZvciBvZiBvdXJzIGlmIHRoZSBldmVudCBpcyBwYXJ0IG9mIG91ciBsaXN0XG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgYWR2YW5jZU9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikgJiZcbiAgICAgICAgICBvdmVycmlkZGVuRXZlbnRzLmluZGV4T2YoYWR2YW5jZU9uLmV2ZW50LnNwbGl0KCcuJylbMF0pID4gLTEpIHx8XG4gICAgICAgIGFkdmFuY2VPbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICApIHtcbiAgICAgICAgc3RlcC5hZHZhbmNlT24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9XG4gICAgICAgICAgc3RlcC5hZHZhbmNlT25PcHRpb25zICYmIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5hbGxvd0dvQmFjayA/IFtiYWNrQnV0dG9uLCBkaXNtaXNzQnV0dG9uXSA6IFtkaXNtaXNzQnV0dG9uXTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZHMgYSBkZWZhdWx0IGJlZm9yZVNob3dQcm9taXNlIGZ1bmN0aW9uXG4gICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXA6IEZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFkdmFuY2VPbiAmJiAhc3RlcC5hZHZhbmNlT24pIHtcbiAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlT24gPSBbYWR2YW5jZU9uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgYWR2YW5jZU9uLmZvckVhY2goKF86IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWR2YW5jZUFyciQucHVzaChhZHZhbmNlRXZlbnQkKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFkdmFuY2VPbltpXSwgc3RlcC5hZHZhbmNlT25PcHRpb25zLCBhZHZhbmNlRXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZVN1YnM6IFN1YnNjcmlwdGlvbiA9IGZvcmtKb2luKC4uLmFkdmFuY2VBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYWR2YW5jZSB0byBhIHNwZWNpZmljIHN0ZXAsIGVsc2UgYWR2YW5jZSB0byBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5qdW1wVG8pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBhZHZhbmNlU3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQgb24gdGhlIHN0ZXAsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgICAgICAgICBpZiAoc3RlcC5hYm9ydE9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICAgICAgICAgIHN0ZXAuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkLCBiYWNrRXZlbnQkLCBmb3J3YXJkRXZlbnQkKSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IF9zdG9wVGltZXIkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cmllc1JlYWNoZWQkOiBTdWJqZWN0PG51bWJlcj4gPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gICAgICAgICAgY29uc3QgX3JldHJ5QXR0ZW1wdHMkOiBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigtMSk7XG5cbiAgICAgICAgICBsZXQgaWQ6IHN0cmluZztcbiAgICAgICAgICAvLyBjaGVja3MgaWYgXCJhdHRhY2hUb1wiIGlzIGEgc3RyaW5nIG9yIGFuIG9iamVjdCB0byBnZXQgdGhlIGlkIG9mIGFuIGVsZW1lbnRcbiAgICAgICAgICBpZiAodHlwZW9mIHN0ZXAuYXR0YWNoVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZCA9IHN0ZXAuYXR0YWNoVG87XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0ZXAuYXR0YWNoVG8uZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUby5lbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFuIGlkIGFzIGEgc3RyaW5nIGluIGVpdGhlciBjYXNlLCB3ZSB1c2UgaXQgKHdlIGlnbm9yZSBpdCBpZiBpdHMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAvLyBpZiBjdXJyZW50IHN0ZXAgaXMgdGhlIGZpcnN0IHN0ZXAgb2YgdGhlIHRvdXIsIHdlIHNldCB0aGUgYnV0dG9ucyB0byBiZSBvbmx5IFwibmV4dFwiIG9yIFwiZGlzbWlzc1wiXG4gICAgICAgICAgICAvLyB3ZSBoYWQgdG8gdXNlIGBhbnlgIHNpbmNlIHRoZSB0b3VyIGRvZXNudCBleHBvc2UgdGhlIHN0ZXBzIGluIGFueSBmYXNoaW9uIG5vciBhIHdheSB0byBjaGVjayBpZiB3ZSBoYXZlIG1vZGlmaWVkIHRoZW0gYXQgYWxsXG4gICAgICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSA9PT0gKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzWzBdKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkudXBkYXRlU3RlcE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IG9yaWdpbmFsU3RlcHNbaW5kZXhdLmFkdmFuY2VPbiA/IFtkaXNtaXNzQnV0dG9uXSA6IFtuZXh0QnV0dG9uXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWdpc3RlciB0byB0aGUgYXR0ZW1wdHMgb2JzZXJ2YWJsZSB0byBub3RpZnkgZGVldmVsb3BlciB3aGVuIG51bWJlciBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICBfcmV0cnlBdHRlbXB0cyRcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQuYXNPYnNlcnZhYmxlKCksIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICAgIHNraXBXaGlsZSgodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA8IHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXM7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGF0dGVtcHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0ZW1wdHMgaGF2ZSBiZWVuIHJlYWNoZWQsIHdlIGNoZWNrIFwic2tpcElmTm90Rm91bmRcIiB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuc2tpcElmTm90Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGdldCB0byB0aGlzIHN0ZXAgY29taW5nIGJhY2sgZnJvbSBhIHN0ZXAgYW5kIGl0IHdhc250IGZvdW5kXG4gICAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIGVpdGhlciBjaGVjayBpZiBpdHMgdGhlIGZpcnN0IHN0ZXAgYW5kIHRyeSBnb2luZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgICAvLyBvciB3ZSBrZWVwIGdvaW5nIGJhY2sgdW50aWwgd2UgZmluZCBhIHN0ZXAgdGhhdCBhY3R1YWxseSBleGlzdHNcbiAgICAgICAgICAgICAgICAgIGlmIChfYmFja0Zsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCg8YW55PnRoaXMuc2hlcGhlcmRUb3VyKS5zdGVwcy5pbmRleE9mKHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYmFja0Zsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3lzIGN1cnJlbnQgc3RlcCBpZiB3ZSBuZWVkIHRvIHNraXAgaXQgdG8gcmVtb3ZlIGl0IGZyb20gdGhlIHRvdXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFN0ZXA6IFNoZXBoZXJkLlN0ZXAgPSB0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RlcC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIucmVtb3ZlU3RlcCgoPFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM+Y3VycmVudFN0ZXApLmlkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIFwic2tpcElmTm90Rm91bmRcIiBpcyBub3QgdHJ1ZSwgdGhlbiB3ZSBjaGVjayBpZiBcImVsc2VcIiBoYXMgYmVlbiBzZXQgdG8ganVtcCB0byBhIHNwZWNpZmljIHN0ZXBcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFJldHJpZXMgcmVhY2hlZCB0cnlpbmcgdG8gZmluZCAke2lkfS4gUmV0cmllZCAgJHthdHRlbXB0c30gdGltZXMuYCk7XG4gICAgICAgICAgICAgICAgICAvLyBlbHNlIHdlIHNob3cgdGhlIHN0ZXAgcmVnYXJkbGVzc1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gdGhlIHRpbWVyIHdpbGwgY29udGludWUgZWl0aGVyIHVudGlsIHdlIGZpbmQgdGhlIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBhdHRlbXB0cyBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKF9zdG9wVGltZXIkLCBfcmV0cmllc1JlYWNoZWQkLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENhcGFiaWxpdGllc1NldHVwKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJC5uZXh0KF9yZXRyeUF0dGVtcHRzJC52YWx1ZSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgZmluZCBpbnRlcnZhbCBpZiB1c2VyIHN0b3BzIHRoZSB0b3VyXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgX3N0b3BUaW1lciQubmV4dCgpO1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlc29sdmUgb2JzZXJ2YWJsZSB1bnRpbCB0aGUgdGltZUJlZm9yZVNob3cgaGFzIHBhc3NzZWQgb3IgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkKSkpXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0ZXBzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50KFxuICAgIGV2ZW50T246IElUb3VyRXZlbnRPbixcbiAgICBldmVudE9uT3B0aW9uczogSVRvdXJFdmVudE9uT3B0aW9ucyxcbiAgICBldmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICAgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3Rvcjogc3RyaW5nID0gZXZlbnRPbi5zZWxlY3RvcjtcbiAgICBjb25zdCBldmVudDogc3RyaW5nID0gZXZlbnRPbi5ldmVudDtcbiAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgY29uc3QgdGltZXJTdWJzOiBTdWJzY3JpcHRpb24gPSB0aW1lcihcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAoZXZlbnRPbk9wdGlvbnMgJiYgZXZlbnRPbk9wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwoZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgYmVlbiBmb3VuZCwgd2Ugc3RvcCB0aGUgdGltZXIgYW5kIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aW1lclN1YnMudW5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIGlmIChldmVudCA9PT0gSVRvdXJFdmVudC5hZGRlZCkge1xuICAgICAgICAgICAgLy8gaWYgZXZlbnQgaXMgXCJBZGRlZFwiIHRyaWdnZXIgYSBzb29uIGFzIHRoaXMgaXMgYXR0YWNoZWQuXG4gICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LmNsaWNrIHx8XG4gICAgICAgICAgICBldmVudCA9PT0gSVRvdXJFdmVudC5wb2ludGVyb3ZlciB8fFxuICAgICAgICAgICAgZXZlbnQuaW5kZXhPZihJVG91ckV2ZW50LmtleXVwKSA+IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB3ZSB1c2Ugbm9ybWFsIGxpc3RlbmVycyBmb3IgbW91c2VldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG1haW5FdmVudDogc3RyaW5nID0gZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsIG1haW5FdmVudClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKGV2ZW50JC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgkZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBvbmx5IHRyaWdnZXIgaWYgdGhlIGV2ZW50IGlzIGEga2V5Ym9hcmQgZXZlbnQgYW5kIHBhcnQgb2Ygb3V0IGxpc3RcbiAgICAgICAgICAgICAgICAgIGlmICgkZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlFdmVudHMuZ2V0KCRldmVudC5rZXlDb2RlKSA9PT0gc3ViRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICAgIC8vIGFuZCB3ZSB3aWxsIHVzZSBNdXRhdGlvbk9ic2VydmVyIGZvciBET00gZXZlbnRzXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGxpc3RlbmluaW5nIGlmIHRvdXIgaXMgY2xvc2VkXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBvYnNlcnZlIGZvciBhbnkgRE9NIGludGVyYWN0aW9uIGluIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==