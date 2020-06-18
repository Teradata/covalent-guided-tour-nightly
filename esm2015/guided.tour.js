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
     * @return {?}
     */
    _prepareTour(originalSteps) {
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
            text: 'finish',
            action: this['finish'].bind(this),
            classes: MAT_BUTTON,
        };
        /** @type {?} */
        const dismissButton = {
            text: 'cancel tour',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWdCLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0lBTXpFLFNBQVUsT0FBTztJQUNqQixlQUFnQixhQUFhO0lBQzdCLFNBQVUsT0FBTztJQUNqQixTQUFVLE9BQU87SUFDakIsV0FBWSxTQUFTOzs7Ozs7QUFHdkIsa0NBR0M7OztJQUZDLGdDQUFrQjs7SUFDbEIsNkJBQWdDOzs7OztBQUdsQyx5Q0FHQzs7O0lBRkMsNkNBQXdCOztJQUN4Qix1Q0FBa0I7Ozs7O0FBR3BCLGtDQUFxRDs7OztBQUVyRCxrQ0FFQzs7O0lBREMsK0JBQXlCOzs7OztBQUczQiw4Q0FPQzs7O0lBTkMsNkNBQW9COztJQUNwQiwyQ0FBaUI7O0lBQ2pCLGtEQUF5Qjs7SUFDekIsd0NBQWM7O0lBQ2QsNENBQWtCOztJQUNsQixxREFBNEI7Ozs7O0FBRzlCLHdDQUEyRDs7OztBQUUzRCwrQ0FHQzs7O0lBRkMsMkNBQWdCOztJQUNoQixnREFBc0I7Ozs7O0FBR3hCLCtCQU1DOzs7SUFMQyxvQ0FBMkM7O0lBQzNDLHFDQUE2Qzs7SUFDN0MsOEJBQTREOztJQUM1RCw0QkFBeUI7O0lBQ3pCLDBCQUFlOzs7OztBQUdqQixNQUFlLGtCQUFrQjtDQVFoQzs7Ozs7O0lBUEMsb0RBQXNCOzs7OztJQUV0QixvREFBc0I7Ozs7O0lBRXRCLHNEQUF3Qjs7Ozs7SUFFeEIsc0RBQXdCOzs7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RSxDQUFDOzRCQUNsQixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7eUJBQ3ZCO29CQUNILENBQUMsRUFBQztvQkFFRixxQ0FBcUM7b0JBQ3JDLGVBQWUsQ0FBQyxTQUFTOzs7b0JBQUMsR0FBRyxFQUFFO3dCQUM3QixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ3hCLENBQUMsRUFBQyxDQUFDO29CQUNILGlEQUFpRDtvQkFDakQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2pGO2FBQ0Y7UUFDSCxDQUFDLEVBQUM7SUFDTixDQUFDO0NBQ0Y7Ozs7OztJQXJhQyw4Q0FBd0M7O0lBRXhDLDBDQUE0Qjs7SUFDNUIseUNBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoZXBoZXJkIGZyb20gJ3NoZXBoZXJkLmpzJztcbmltcG9ydCB7IHRpbWVyLCBTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBTdWJzY3JpcHRpb24sIGZyb21FdmVudCwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgc2tpcFdoaWxlLCBmaWx0ZXIsIHNraXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgdHlwZSBUb3VyU3RlcCA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM7XG5leHBvcnQgdHlwZSBUb3VyU3RlcEJ1dHRvbiA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnNCdXR0b247XG5cbmV4cG9ydCBlbnVtIElUb3VyRXZlbnQge1xuICAnY2xpY2snID0gJ2NsaWNrJyxcbiAgJ3BvaW50ZXJvdmVyJyA9ICdwb2ludGVyb3ZlcicsXG4gICdrZXl1cCcgPSAna2V5dXAnLFxuICAnYWRkZWQnID0gJ2FkZGVkJywgLy8gYWRkZWQgdG8gRE9NXG4gICdyZW1vdmVkJyA9ICdyZW1vdmVkJywgLy8gcmVtb3ZlZCBmcm9tIERPTVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbiB7XG4gIHNlbGVjdG9yPzogc3RyaW5nOyAvLyBjc3Mgc2VsZWN0b3JcbiAgZXZlbnQ/OiBrZXlvZiB0eXBlb2YgSVRvdXJFdmVudDsgLy8gY2xpY2ssIHBvaW50ZXJvdmVyLCBrZXl1cCwgYWRkZWQsIHJlbW92ZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAgdGltZUJlZm9yZVNob3c/OiBudW1iZXI7IC8vIGRlbGF5IGJlZm9yZSBzdGVwIGlzIGRpc3BsYXllZFxuICBpbnRlcnZhbD86IG51bWJlcjsgLy8gdGltZSBiZXR3ZWVuIHNlYXJjaGVzIGZvciBlbGVtZW50LCBkZWZhdWx0cyB0byA1MDBtc1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyQWJvcnRPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyT3B0aW9ucyBleHRlbmRzIFNoZXBoZXJkLlRvdXIuVG91ck9wdGlvbnMge1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107IC8vIGV2ZW50cyB0byBhYm9ydCBvblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucyBleHRlbmRzIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xuICByZXRyaWVzPzogbnVtYmVyOyAvLyAjIG51bSBvZiBhdHRlbXB0cyB0byBmaW5kIGVsZW1lbnRcbiAgc2tpcElmTm90Rm91bmQ/OiBib29sZWFuOyAvLyBpZiBlbGVtZW50IGlzIG5vdCBmb3VuZCBhZnRlciBuIHJldHJpZXMsIG1vdmUgb24gdG8gbmV4dCBzdGVwXG4gIGVsc2U/OiBzdHJpbmc7IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kLCBnbyB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBnb0JhY2tUbz86IHN0cmluZzsgLy8gYmFjayBidXR0b24gZ29lcyBiYWNrIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIHNraXBGcm9tU3RlcENvdW50PzogYm9vbGVhbjsgLy8gc2hvdy9oaWRlIHByb2dyZXNzIG9uIHN0ZXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT24gZXh0ZW5kcyBJVG91ckV2ZW50T24ge31cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGp1bXBUbz86IHN0cmluZzsgLy8gbmV4dCBidXR0b24gd2lsbCBqdW1wIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGFsbG93R29CYWNrPzogYm9vbGVhbjsgLy8gYWxsb3cgYmFjayB3aXRoaW4gdGhpcyBzdGVwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwIGV4dGVuZHMgVG91clN0ZXAge1xuICBhdHRhY2hUb09wdGlvbnM/OiBJVG91clN0ZXBBdHRhY2hUb09wdGlvbnM7XG4gIGFkdmFuY2VPbk9wdGlvbnM/OiBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zO1xuICBhZHZhbmNlT24/OiBJVG91clN0ZXBBZHZhbmNlT25bXSB8IElUb3VyU3RlcEFkdmFuY2VPbiB8IGFueTtcbiAgYWJvcnRPbj86IElUb3VyQWJvcnRPbltdO1xuICBjb3VudD86IG51bWJlcjtcbn1cblxuYWJzdHJhY3QgY2xhc3MgVG91ckJ1dHRvbnNBY3Rpb25zIHtcbiAgYWJzdHJhY3QgbmV4dCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcblxuICBhYnN0cmFjdCBjYW5jZWwoKTogdm9pZDtcblxuICBhYnN0cmFjdCBmaW5pc2goKTogdm9pZDtcbn1cblxuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1c6IG51bWJlciA9IDEwMDtcbmNvbnN0IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTDogbnVtYmVyID0gNTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTOiBudW1iZXIgPSAyMDtcblxuY29uc3Qgb3ZlcnJpZGRlbkV2ZW50czogc3RyaW5nW10gPSBbXG4gIElUb3VyRXZlbnQuY2xpY2ssXG4gIElUb3VyRXZlbnQucG9pbnRlcm92ZXIsXG4gIElUb3VyRXZlbnQucmVtb3ZlZCxcbiAgSVRvdXJFdmVudC5hZGRlZCxcbiAgSVRvdXJFdmVudC5rZXl1cCxcbl07XG5cbmNvbnN0IGtleUV2ZW50czogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KFtcbiAgWzEzLCAnZW50ZXInXSxcbiAgWzI3LCAnZXNjJ10sXG5dKTtcblxuY29uc3QgZGVmYXVsdFN0ZXBPcHRpb25zOiBUb3VyU3RlcCA9IHtcbiAgc2Nyb2xsVG86IHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicgfSxcbiAgY2FuY2VsSWNvbjoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gIH0sXG59O1xuXG5jb25zdCBNQVRfSUNPTl9CVVRUT046IHN0cmluZyA9ICdtYXQtaWNvbi1idXR0b24gbWF0ZXJpYWwtaWNvbnMgbWF0LWJ1dHRvbi1iYXNlJztcbmNvbnN0IE1BVF9CVVRUT046IHN0cmluZyA9ICdtYXQtYnV0dG9uLWJhc2UgbWF0LWJ1dHRvbic7XG5cbmV4cG9ydCBjbGFzcyBDb3ZhbGVudEd1aWRlZFRvdXIgZXh0ZW5kcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBwcml2YXRlIF9kZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD47XG5cbiAgc2hlcGhlcmRUb3VyOiBTaGVwaGVyZC5Ub3VyO1xuICBzdGVwT3B0aW9uczogSVRvdXJTdGVwO1xuXG4gIGNvbnN0cnVjdG9yKHN0ZXBPcHRpb25zOiBJVG91clN0ZXAgPSBkZWZhdWx0U3RlcE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGVwT3B0aW9ucyA9IHN0ZXBPcHRpb25zO1xuICAgIHRoaXMubmV3VG91cigpO1xuICB9XG5cbiAgbmV3VG91cihvcHRzPzogSVRvdXJPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIgPSBuZXcgU2hlcGhlcmQuVG91cihcbiAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHtcbiAgICAgICAgICBkZWZhdWx0U3RlcE9wdGlvbnM6IHRoaXMuc3RlcE9wdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdHMsXG4gICAgICApLFxuICAgICk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8vIGxpc3RlbiB0byBjYW5jZWwgYW5kIGNvbXBsZXRlIHRvIGNsZWFuIHVwIGFib3J0T24gZXZlbnRzXG4gICAgbWVyZ2UoZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY2FuY2VsJyksIGZyb21FdmVudCh0aGlzLnNoZXBoZXJkVG91ciwgJ2NvbXBsZXRlJykpXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgaWYgKG9wdHMgJiYgb3B0cy5hYm9ydE9uKSB7XG4gICAgICBjb25zdCBhYm9ydEFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgb3B0cy5hYm9ydE9uLmZvckVhY2goKGFib3J0T246IElUb3VyQWJvcnRPbikgPT4ge1xuICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgIGFib3J0QXJyJC5wdXNoKGFib3J0RXZlbnQkKTtcbiAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFib3J0T24sIHVuZGVmaW5lZCwgYWJvcnRFdmVudCQsIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWJvcnRTdWJzOiBTdWJzY3JpcHRpb24gPSBtZXJnZSguLi5hYm9ydEFyciQpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWRFdmVudCQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgIGFib3J0U3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgfVxuXG4gIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5jYW5jZWwoKTtcbiAgfVxuXG4gIG5leHQoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICB9XG5cbiAgZmluaXNoKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBhZGRTdGVwcyhzdGVwczogSVRvdXJTdGVwW10pOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5hZGRTdGVwcyh0aGlzLl9wcmVwYXJlVG91cihzdGVwcykpO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuc3RhcnQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJlcGFyZVRvdXIob3JpZ2luYWxTdGVwczogSVRvdXJTdGVwW10pOiBJVG91clN0ZXBbXSB7XG4gICAgLy8gY3JlYXRlIFN1YmplY3RzIGZvciBiYWNrIGFuZCBmb3J3YXJkIGV2ZW50c1xuICAgIGNvbnN0IGJhY2tFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGNvbnN0IGZvcndhcmRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGxldCBfYmFja0Zsb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBjcmVhdGUgU3ViamVjdCBmb3IgeW91ciBlbmRcbiAgICBjb25zdCBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgc3RlcCBwcm9ncmVzcyBpbiB0aGUgZm9vdGVyIG9mIHRoZSBzaGVwaGVyZCB0b29sdGlwXG4gICAgICovXG4gICAgY29uc3QgYXBwZW5kUHJvZ3Jlc3NGdW5jOiBGdW5jdGlvbiA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgIC8vIGdldCBhbGwgdGhlIGZvb3RlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGZvb3RlcnM6IEVsZW1lbnRbXSA9IEFycmF5LmZyb208RWxlbWVudD4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNoZXBoZXJkLWZvb3RlcicpKTtcbiAgICAgIC8vIGdldCB0aGUgbGFzdCBmb290ZXIgc2luY2UgU2hlcGhlcmQgYWx3YXlzIHB1dHMgdGhlIGFjdGl2ZSBvbmUgYXQgdGhlIGVuZFxuICAgICAgY29uc3QgZm9vdGVyOiBFbGVtZW50ID0gZm9vdGVyc1tmb290ZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gZ2VuZXJhdGUgc3RlcHMgaHRtbCBlbGVtZW50XG4gICAgICBjb25zdCBwcm9ncmVzczogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvZ3Jlc3MuY2xhc3NOYW1lID0gJ3NoZXBoZXJkLXByb2dyZXNzJztcbiAgICAgIHByb2dyZXNzLmlubmVyVGV4dCA9IGAke3RoaXMuc2hlcGhlcmRUb3VyLmN1cnJlbnRTdGVwLm9wdGlvbnMuY291bnR9LyR7c3RlcFRvdGFsfWA7XG4gICAgICAvLyBpbnNlcnQgaW50byB0aGUgZm9vdGVyIGJlZm9yZSB0aGUgZmlyc3QgYnV0dG9uXG4gICAgICBmb290ZXIuaW5zZXJ0QmVmb3JlKHByb2dyZXNzLCBmb290ZXIucXVlcnlTZWxlY3RvcignLnNoZXBoZXJkLWJ1dHRvbicpKTtcbiAgICB9O1xuXG4gICAgbGV0IHN0ZXBUb3RhbDogbnVtYmVyID0gMDtcbiAgICBjb25zdCBzdGVwczogSVRvdXJTdGVwW10gPSBvcmlnaW5hbFN0ZXBzLm1hcCgoc3RlcDogSVRvdXJTdGVwKSA9PiB7XG4gICAgICBsZXQgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcbiAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHRydWUpIHtcbiAgICAgICAgc2hvd1Byb2dyZXNzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gZmFsc2VcbiAgICAgICkge1xuICAgICAgICBzdGVwLmNvdW50ID0gKytzdGVwVG90YWw7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGFwcGVuZFByb2dyZXNzRnVuYy5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0ZXAsIHtcbiAgICAgICAgd2hlbjoge1xuICAgICAgICAgIHNob3c6IHNob3dQcm9ncmVzcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6ICdmaW5pc2gnLFxuICAgICAgYWN0aW9uOiB0aGlzWydmaW5pc2gnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuICAgIGNvbnN0IGRpc21pc3NCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgdGV4dDogJ2NhbmNlbCB0b3VyJyxcbiAgICAgIGFjdGlvbjogdGhpc1snY2FuY2VsJ10uYmluZCh0aGlzKSxcbiAgICAgIGNsYXNzZXM6IE1BVF9CVVRUT04sXG4gICAgfTtcblxuICAgIC8vIGxpc3RlbiB0byB0aGUgZGVzdHJveWVkIGV2ZW50IHRvIGNsZWFuIHVwIGFsbCB0aGUgc3RyZWFtc1xuICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JC5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBiYWNrRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICBmb3J3YXJkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICBkZXN0cm95ZWRFdmVudCQubmV4dCgpO1xuICAgICAgZGVzdHJveWVkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbFN0ZXBzOiBudW1iZXIgPSBzdGVwcy5sZW5ndGg7XG4gICAgc3RlcHMuZm9yRWFjaCgoc3RlcDogSVRvdXJTdGVwLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAvLyBjcmVhdGUgYnV0dG9ucyBzcGVjaWZpYyBmb3IgdGhlIHN0ZXBcbiAgICAgIC8vIHRoaXMgaXMgZG9uZSB0byBjcmVhdGUgbW9yZSBjb250cm9sIG9uIGV2ZW50c1xuICAgICAgY29uc3QgbmV4dEJ1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICAgIHRleHQ6ICdjaGV2cm9uX3JpZ2h0JyxcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgLy8gaW50ZXJjZXB0IHRoZSBuZXh0IGFjdGlvbiBhbmQgdHJpZ2dlciBldmVudFxuICAgICAgICAgIGZvcndhcmRFdmVudCQubmV4dCgpO1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NlczogTUFUX0lDT05fQlVUVE9OLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGJhY2tCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgICB0ZXh0OiAnY2hldnJvbl9sZWZ0JyxcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgLy8gaW50ZXJjZXB0IHRoZSBiYWNrIGFjdGlvbiBhbmQgdHJpZ2dlciBldmVudFxuICAgICAgICAgIGJhY2tFdmVudCQubmV4dCgpO1xuICAgICAgICAgIF9iYWNrRmxvdyA9IHRydWU7XG4gICAgICAgICAgLy8gY2hlY2sgaWYgJ2dvQmFja1RvJyBpcyBzZXQgdG8ganVtcCB0byBhIHBhcnRpY3VsYXIgc3RlcCwgZWxzZSBqdXN0IGdvIGJhY2tcbiAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuZ29CYWNrVG8pIHtcbiAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hdHRhY2hUb09wdGlvbnMuZ29CYWNrVG8sIGZhbHNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NlczogTUFUX0lDT05fQlVUVE9OLFxuICAgICAgfTtcblxuICAgICAgLy8gY2hlY2sgaWYgaGlnaGxpZ2h0IHdhcyBwcm92aWRlZCBmb3IgdGhlIHN0ZXAsIGVsc2UgZmFsbGJhY2sgaW50byBzaGVwaGVyZHMgdXNhZ2VcbiAgICAgIHN0ZXAuaGlnaGxpZ2h0Q2xhc3MgPVxuICAgICAgICBzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5oaWdobGlnaHQgPyAnc2hlcGhlcmQtaGlnaGxpZ2h0JyA6IHN0ZXAuaGlnaGxpZ2h0Q2xhc3M7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAvLyBmaXJzdCBzdGVwXG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtuZXh0QnV0dG9uXTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRvdGFsU3RlcHMgLSAxKSB7XG4gICAgICAgIC8vIGxhc3Qgc3RlcFxuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbYmFja0J1dHRvbiwgZmluaXNoQnV0dG9uXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtiYWNrQnV0dG9uLCBuZXh0QnV0dG9uXTtcbiAgICAgIH1cblxuICAgICAgLy8gY2hlY2tzIFwiYWR2YW5jZU9uXCIgdG8gb3ZlcnJpZGUgbGlzdGVuZXJzXG4gICAgICBsZXQgYWR2YW5jZU9uOiBJVG91clN0ZXBBZHZhbmNlT25bXSB8IElUb3VyU3RlcEFkdmFuY2VPbiA9IHN0ZXAuYWR2YW5jZU9uO1xuICAgICAgLy8gcmVtb3ZlIHRoZSBzaGVwaGVyZCBcImFkdmFuY2VPblwiIGluZmF2b3Igb2Ygb3VycyBpZiB0aGUgZXZlbnQgaXMgcGFydCBvZiBvdXIgbGlzdFxuICAgICAgaWYgKFxuICAgICAgICAodHlwZW9mIGFkdmFuY2VPbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAhQXJyYXkuaXNBcnJheShhZHZhbmNlT24pICYmXG4gICAgICAgICAgb3ZlcnJpZGRlbkV2ZW50cy5pbmRleE9mKGFkdmFuY2VPbi5ldmVudC5zcGxpdCgnLicpWzBdKSA+IC0xKSB8fFxuICAgICAgICBhZHZhbmNlT24gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgKSB7XG4gICAgICAgIHN0ZXAuYWR2YW5jZU9uID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGVwLmJ1dHRvbnMgPVxuICAgICAgICAgIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucyAmJiBzdGVwLmFkdmFuY2VPbk9wdGlvbnMuYWxsb3dHb0JhY2sgPyBbYmFja0J1dHRvbiwgZGlzbWlzc0J1dHRvbl0gOiBbZGlzbWlzc0J1dHRvbl07XG4gICAgICB9XG4gICAgICAvLyBhZGRzIGEgZGVmYXVsdCBiZWZvcmVTaG93UHJvbWlzZSBmdW5jdGlvblxuICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRkaXRpb25hbENhcGFiaWxpdGllc1NldHVwOiBGdW5jdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChhZHZhbmNlT24gJiYgIXN0ZXAuYWR2YW5jZU9uKSB7XG4gICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhZHZhbmNlT24pKSB7XG4gICAgICAgICAgICAgICAgYWR2YW5jZU9uID0gW2FkdmFuY2VPbl07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlQXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICAgICAgICAgIGFkdmFuY2VPbi5mb3JFYWNoKChfOiBhbnksIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICAgICAgICAgIGFkdmFuY2VBcnIkLnB1c2goYWR2YW5jZUV2ZW50JCk7XG4gICAgICAgICAgICAgICAgLy8gd2Ugc3RhcnQgYSB0aW1lciBvZiBhdHRlbXB0cyB0byBmaW5kIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRFdmVudChhZHZhbmNlT25baV0sIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucywgYWR2YW5jZUV2ZW50JCwgZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VTdWJzOiBTdWJzY3JpcHRpb24gPSBmb3JrSm9pbiguLi5hZHZhbmNlQXJyJClcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkLCBiYWNrRXZlbnQkKSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFkdmFuY2UgdG8gYSBzcGVjaWZpYyBzdGVwLCBlbHNlIGFkdmFuY2UgdG8gbmV4dCBzdGVwXG4gICAgICAgICAgICAgICAgICBpZiAoc3RlcC5hZHZhbmNlT25PcHRpb25zICYmIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5qdW1wVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmFkdmFuY2VPbk9wdGlvbnMuanVtcFRvKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGZvcndhcmRFdmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgYWR2YW5jZVN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgYWJvcnRPbiB3YXMgcGFzc2VkIG9uIHRoZSBzdGVwLCB3ZSBiaW5kIHRoZSBldmVudCBhbmQgZXhlY3V0ZSBjb21wbGV0ZVxuICAgICAgICAgICAgaWYgKHN0ZXAuYWJvcnRPbikge1xuICAgICAgICAgICAgICBjb25zdCBhYm9ydEFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgICAgICAgICBzdGVwLmFib3J0T24uZm9yRWFjaCgoYWJvcnRPbjogSVRvdXJBYm9ydE9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWJvcnRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICAgICAgICAgIGFib3J0QXJyJC5wdXNoKGFib3J0RXZlbnQkKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWJvcnRPbiwgdW5kZWZpbmVkLCBhYm9ydEV2ZW50JCwgZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgY29uc3QgYWJvcnRTdWJzOiBTdWJzY3JpcHRpb24gPSBtZXJnZSguLi5hYm9ydEFyciQpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKGRlc3Ryb3llZEV2ZW50JCwgYmFja0V2ZW50JCwgZm9yd2FyZEV2ZW50JCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgIGFib3J0U3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBfc3RvcFRpbWVyJDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgY29uc3QgX3JldHJpZXNSZWFjaGVkJDogU3ViamVjdDxudW1iZXI+ID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuICAgICAgICAgIGNvbnN0IF9yZXRyeUF0dGVtcHRzJDogQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oLTEpO1xuXG4gICAgICAgICAgbGV0IGlkOiBzdHJpbmc7XG4gICAgICAgICAgLy8gY2hlY2tzIGlmIFwiYXR0YWNoVG9cIiBpcyBhIHN0cmluZyBvciBhbiBvYmplY3QgdG8gZ2V0IHRoZSBpZCBvZiBhbiBlbGVtZW50XG4gICAgICAgICAgaWYgKHR5cGVvZiBzdGVwLmF0dGFjaFRvID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWQgPSBzdGVwLmF0dGFjaFRvO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0ZXAuYXR0YWNoVG8gPT09ICdvYmplY3QnICYmIHR5cGVvZiBzdGVwLmF0dGFjaFRvLmVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZCA9IHN0ZXAuYXR0YWNoVG8uZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gaWYgd2UgaGF2ZSBhbiBpZCBhcyBhIHN0cmluZyBpbiBlaXRoZXIgY2FzZSwgd2UgdXNlIGl0ICh3ZSBpZ25vcmUgaXQgaWYgaXRzIEhUTUxFbGVtZW50KVxuICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgLy8gaWYgY3VycmVudCBzdGVwIGlzIHRoZSBmaXJzdCBzdGVwIG9mIHRoZSB0b3VyLCB3ZSBzZXQgdGhlIGJ1dHRvbnMgdG8gYmUgb25seSBcIm5leHRcIiBvciBcImRpc21pc3NcIlxuICAgICAgICAgICAgLy8gd2UgaGFkIHRvIHVzZSBgYW55YCBzaW5jZSB0aGUgdG91ciBkb2VzbnQgZXhwb3NlIHRoZSBzdGVwcyBpbiBhbnkgZmFzaGlvbiBub3IgYSB3YXkgdG8gY2hlY2sgaWYgd2UgaGF2ZSBtb2RpZmllZCB0aGVtIGF0IGFsbFxuICAgICAgICAgICAgaWYgKHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkgPT09ICg8YW55PnRoaXMuc2hlcGhlcmRUb3VyKS5zdGVwc1swXSkge1xuICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpLnVwZGF0ZVN0ZXBPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBidXR0b25zOiBvcmlnaW5hbFN0ZXBzW2luZGV4XS5hZHZhbmNlT24gPyBbZGlzbWlzc0J1dHRvbl0gOiBbbmV4dEJ1dHRvbl0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdG8gdGhlIGF0dGVtcHRzIG9ic2VydmFibGUgdG8gbm90aWZ5IGRlZXZlbG9wZXIgd2hlbiBudW1iZXIgaGFzIGJlZW4gcmVhY2hlZFxuICAgICAgICAgICAgX3JldHJ5QXR0ZW1wdHMkXG4gICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHNraXAoMSksXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKF9zdG9wVGltZXIkLmFzT2JzZXJ2YWJsZSgpLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgICBza2lwV2hpbGUoKHZhbDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMucmV0cmllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPCBzdGVwLmF0dGFjaFRvT3B0aW9ucy5yZXRyaWVzO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9BVFRFTVBUUztcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKChhdHRlbXB0czogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGF0dGVtcHRzIGhhdmUgYmVlbiByZWFjaGVkLCB3ZSBjaGVjayBcInNraXBJZk5vdEZvdW5kXCIgdG8gbW92ZSBvbiB0byB0aGUgbmV4dCBzdGVwXG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnNraXBJZk5vdEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBnZXQgdG8gdGhpcyBzdGVwIGNvbWluZyBiYWNrIGZyb20gYSBzdGVwIGFuZCBpdCB3YXNudCBmb3VuZFxuICAgICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBlaXRoZXIgY2hlY2sgaWYgaXRzIHRoZSBmaXJzdCBzdGVwIGFuZCB0cnkgZ29pbmcgZm9yd2FyZFxuICAgICAgICAgICAgICAgICAgLy8gb3Igd2Uga2VlcCBnb2luZyBiYWNrIHVudGlsIHdlIGZpbmQgYSBzdGVwIHRoYXQgYWN0dWFsbHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgICBpZiAoX2JhY2tGbG93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoPGFueT50aGlzLnNoZXBoZXJkVG91cikuc3RlcHMuaW5kZXhPZih0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2JhY2tGbG93ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZXN0cm95cyBjdXJyZW50IHN0ZXAgaWYgd2UgbmVlZCB0byBza2lwIGl0IHRvIHJlbW92ZSBpdCBmcm9tIHRoZSB0b3VyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTdGVwOiBTaGVwaGVyZC5TdGVwID0gdGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0ZXAuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnJlbW92ZVN0ZXAoKDxTaGVwaGVyZC5TdGVwLlN0ZXBPcHRpb25zPmN1cnJlbnRTdGVwKS5pZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5lbHNlKSB7XG4gICAgICAgICAgICAgICAgICAvLyBpZiBcInNraXBJZk5vdEZvdW5kXCIgaXMgbm90IHRydWUsIHRoZW4gd2UgY2hlY2sgaWYgXCJlbHNlXCIgaGFzIGJlZW4gc2V0IHRvIGp1bXAgdG8gYSBzcGVjaWZpYyBzdGVwXG4gICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYXR0YWNoVG9PcHRpb25zLmVsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBSZXRyaWVzIHJlYWNoZWQgdHJ5aW5nIHRvIGZpbmQgJHtpZH0uIFJldHJpZWQgICR7YXR0ZW1wdHN9IHRpbWVzLmApO1xuICAgICAgICAgICAgICAgICAgLy8gZWxzZSB3ZSBzaG93IHRoZSBzdGVwIHJlZ2FyZGxlc3NcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgICAgICAgICB0aW1lcihcbiAgICAgICAgICAgICAgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnRpbWVCZWZvcmVTaG93KSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVyxcbiAgICAgICAgICAgICAgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmludGVydmFsKSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfSU5URVJWQUwsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIC8vIHRoZSB0aW1lciB3aWxsIGNvbnRpbnVlIGVpdGhlciB1bnRpbCB3ZSBmaW5kIHRoZSBlbGVtZW50IG9yIHRoZSBudW1iZXIgb2YgYXR0ZW1wdHMgaGFzIGJlZW4gcmVhY2hlZFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbChtZXJnZShfc3RvcFRpbWVyJCwgX3JldHJpZXNSZWFjaGVkJCwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKTtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgYmVlbiBmb3VuZCwgd2Ugc3RvcCB0aGUgdGltZXIgYW5kIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgX3N0b3BUaW1lciQubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgX3N0b3BUaW1lciQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDYXBhYmlsaXRpZXNTZXR1cCgpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfcmV0cnlBdHRlbXB0cyQubmV4dChfcmV0cnlBdHRlbXB0cyQudmFsdWUgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGZpbmQgaW50ZXJ2YWwgaWYgdXNlciBzdG9wcyB0aGUgdG91clxuICAgICAgICAgICAgZGVzdHJveWVkRXZlbnQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIF9zdG9wVGltZXIkLm5leHQoKTtcbiAgICAgICAgICAgICAgX3N0b3BUaW1lciQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5uZXh0KCk7XG4gICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyByZXNvbHZlIG9ic2VydmFibGUgdW50aWwgdGhlIHRpbWVCZWZvcmVTaG93IGhhcyBwYXNzc2VkIG9yIHVzZSBkZWZhdWx0XG4gICAgICAgICAgICB0aW1lcihcbiAgICAgICAgICAgICAgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnRpbWVCZWZvcmVTaG93KSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVyxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKGRlc3Ryb3llZEV2ZW50JCkpKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBzdGVwcztcbiAgfVxuXG4gIHByaXZhdGUgX2JpbmRFdmVudChcbiAgICBldmVudE9uOiBJVG91ckV2ZW50T24sXG4gICAgZXZlbnRPbk9wdGlvbnM6IElUb3VyRXZlbnRPbk9wdGlvbnMsXG4gICAgZXZlbnQkOiBTdWJqZWN0PHZvaWQ+LFxuICAgIGRlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPixcbiAgKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0b3I6IHN0cmluZyA9IGV2ZW50T24uc2VsZWN0b3I7XG4gICAgY29uc3QgZXZlbnQ6IHN0cmluZyA9IGV2ZW50T24uZXZlbnQ7XG4gICAgLy8gd2Ugc3RhcnQgYSB0aW1lciBvZiBhdHRlbXB0cyB0byBmaW5kIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICAgIGNvbnN0IHRpbWVyU3ViczogU3Vic2NyaXB0aW9uID0gdGltZXIoXG4gICAgICAoZXZlbnRPbk9wdGlvbnMgJiYgZXZlbnRPbk9wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgKGV2ZW50T25PcHRpb25zICYmIGV2ZW50T25PcHRpb25zLmludGVydmFsKSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfSU5URVJWQUwsXG4gICAgKVxuICAgICAgLnBpcGUodGFrZVVudGlsKGRlc3Ryb3llZEV2ZW50JCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGJlZW4gZm91bmQsIHdlIHN0b3AgdGhlIHRpbWVyIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgdGltZXJTdWJzLnVuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgICBpZiAoZXZlbnQgPT09IElUb3VyRXZlbnQuYWRkZWQpIHtcbiAgICAgICAgICAgIC8vIGlmIGV2ZW50IGlzIFwiQWRkZWRcIiB0cmlnZ2VyIGEgc29vbiBhcyB0aGlzIGlzIGF0dGFjaGVkLlxuICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBldmVudCA9PT0gSVRvdXJFdmVudC5jbGljayB8fFxuICAgICAgICAgICAgZXZlbnQgPT09IElUb3VyRXZlbnQucG9pbnRlcm92ZXIgfHxcbiAgICAgICAgICAgIGV2ZW50LmluZGV4T2YoSVRvdXJFdmVudC5rZXl1cCkgPiAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gd2UgdXNlIG5vcm1hbCBsaXN0ZW5lcnMgZm9yIG1vdXNlZXZlbnRzXG4gICAgICAgICAgICBjb25zdCBtYWluRXZlbnQ6IHN0cmluZyA9IGV2ZW50LnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBjb25zdCBzdWJFdmVudDogc3RyaW5nID0gZXZlbnQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGZyb21FdmVudChlbGVtZW50LCBtYWluRXZlbnQpXG4gICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbChtZXJnZShldmVudCQuYXNPYnNlcnZhYmxlKCksIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICAgIGZpbHRlcigoJGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gb25seSB0cmlnZ2VyIGlmIHRoZSBldmVudCBpcyBhIGtleWJvYXJkIGV2ZW50IGFuZCBwYXJ0IG9mIG91dCBsaXN0XG4gICAgICAgICAgICAgICAgICBpZiAoJGV2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5RXZlbnRzLmdldCgkZXZlbnQua2V5Q29kZSkgPT09IHN1YkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudCA9PT0gSVRvdXJFdmVudC5yZW1vdmVkKSB7XG4gICAgICAgICAgICAvLyBhbmQgd2Ugd2lsbCB1c2UgTXV0YXRpb25PYnNlcnZlciBmb3IgRE9NIGV2ZW50c1xuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc3RvcCBsaXN0ZW5pbmluZyBpZiB0b3VyIGlzIGNsb3NlZFxuICAgICAgICAgICAgZGVzdHJveWVkRXZlbnQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gb2JzZXJ2ZSBmb3IgYW55IERPTSBpbnRlcmFjdGlvbiBpbiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSwgYXR0cmlidXRlczogdHJ1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59XG4iXX0=