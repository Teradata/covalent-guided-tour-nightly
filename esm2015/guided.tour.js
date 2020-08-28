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
/** @type {?} */
const MAT_BUTTON_INVISIBLE = 'shepherd-void-button';
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
     * @return {?}
     */
    _prepareTour(originalSteps, finishLabel = 'finish') {
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
        const voidButton = {
            text: '',
            /**
             * @return {?}
             */
            action() {
                return;
            },
            classes: MAT_BUTTON_INVISIBLE,
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
                    step.advanceOnOptions && step.advanceOnOptions.allowGoBack ? [backButton, voidButton] : [voidButton];
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
                        // if current step is the first step of the tour, we set the buttons to be only "next"
                        // we had to use `any` since the tour doesnt expose the steps in any fashion nor a way to check if we have modified them at all
                        if (this.shepherdTour.getCurrentStep() === ((/** @type {?} */ (this.shepherdTour))).steps[0]) {
                            this.shepherdTour.getCurrentStep().updateStepOptions({
                                buttons: originalSteps[index].advanceOn ? [voidButton] : [nextButton],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWdCLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0lBTXpFLFNBQVUsT0FBTztJQUNqQixlQUFnQixhQUFhO0lBQzdCLFNBQVUsT0FBTztJQUNqQixTQUFVLE9BQU87SUFDakIsV0FBWSxTQUFTOzs7Ozs7QUFHdkIsa0NBR0M7OztJQUZDLGdDQUFrQjs7SUFDbEIsNkJBQWdDOzs7OztBQUdsQyx5Q0FHQzs7O0lBRkMsNkNBQXdCOztJQUN4Qix1Q0FBa0I7Ozs7O0FBR3BCLGtDQUFxRDs7OztBQUVyRCxrQ0FFQzs7O0lBREMsK0JBQXlCOzs7OztBQUczQiw4Q0FPQzs7O0lBTkMsNkNBQW9COztJQUNwQiwyQ0FBaUI7O0lBQ2pCLGtEQUF5Qjs7SUFDekIsd0NBQWM7O0lBQ2QsNENBQWtCOztJQUNsQixxREFBNEI7Ozs7O0FBRzlCLHdDQUEyRDs7OztBQUUzRCwrQ0FHQzs7O0lBRkMsMkNBQWdCOztJQUNoQixnREFBc0I7Ozs7O0FBR3hCLCtCQU1DOzs7SUFMQyxvQ0FBMkM7O0lBQzNDLHFDQUE2Qzs7SUFDN0MsOEJBQTREOztJQUM1RCw0QkFBeUI7O0lBQ3pCLDBCQUFlOzs7OztBQUdqQixNQUFlLGtCQUFrQjtDQVFoQzs7Ozs7O0lBUEMsb0RBQXNCOzs7OztJQUV0QixvREFBc0I7Ozs7O0lBRXRCLHNEQUF3Qjs7Ozs7SUFFeEIsc0RBQXdCOzs7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TUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNsQixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7eUJBQ3ZCO29CQUNILENBQUMsRUFBQztvQkFFRixxQ0FBcUM7b0JBQ3JDLGVBQWUsQ0FBQyxTQUFTOzs7b0JBQUMsR0FBRyxFQUFFO3dCQUM3QixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ3hCLENBQUMsRUFBQyxDQUFDO29CQUNILGlEQUFpRDtvQkFDakQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2pGO2FBQ0Y7UUFDSCxDQUFDLEVBQUM7SUFDTixDQUFDO0NBQ0Y7Ozs7OztJQXhhQyw4Q0FBd0M7O0lBRXhDLDBDQUE0Qjs7SUFDNUIseUNBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoZXBoZXJkIGZyb20gJ3NoZXBoZXJkLmpzJztcbmltcG9ydCB7IHRpbWVyLCBTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBTdWJzY3JpcHRpb24sIGZyb21FdmVudCwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgc2tpcFdoaWxlLCBmaWx0ZXIsIHNraXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgdHlwZSBUb3VyU3RlcCA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM7XG5leHBvcnQgdHlwZSBUb3VyU3RlcEJ1dHRvbiA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnNCdXR0b247XG5cbmV4cG9ydCBlbnVtIElUb3VyRXZlbnQge1xuICAnY2xpY2snID0gJ2NsaWNrJyxcbiAgJ3BvaW50ZXJvdmVyJyA9ICdwb2ludGVyb3ZlcicsXG4gICdrZXl1cCcgPSAna2V5dXAnLFxuICAnYWRkZWQnID0gJ2FkZGVkJywgLy8gYWRkZWQgdG8gRE9NXG4gICdyZW1vdmVkJyA9ICdyZW1vdmVkJywgLy8gcmVtb3ZlZCBmcm9tIERPTVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbiB7XG4gIHNlbGVjdG9yPzogc3RyaW5nOyAvLyBjc3Mgc2VsZWN0b3JcbiAgZXZlbnQ/OiBrZXlvZiB0eXBlb2YgSVRvdXJFdmVudDsgLy8gY2xpY2ssIHBvaW50ZXJvdmVyLCBrZXl1cCwgYWRkZWQsIHJlbW92ZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAgdGltZUJlZm9yZVNob3c/OiBudW1iZXI7IC8vIGRlbGF5IGJlZm9yZSBzdGVwIGlzIGRpc3BsYXllZFxuICBpbnRlcnZhbD86IG51bWJlcjsgLy8gdGltZSBiZXR3ZWVuIHNlYXJjaGVzIGZvciBlbGVtZW50LCBkZWZhdWx0cyB0byA1MDBtc1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyQWJvcnRPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyT3B0aW9ucyBleHRlbmRzIFNoZXBoZXJkLlRvdXIuVG91ck9wdGlvbnMge1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107IC8vIGV2ZW50cyB0byBhYm9ydCBvblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucyBleHRlbmRzIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xuICByZXRyaWVzPzogbnVtYmVyOyAvLyAjIG51bSBvZiBhdHRlbXB0cyB0byBmaW5kIGVsZW1lbnRcbiAgc2tpcElmTm90Rm91bmQ/OiBib29sZWFuOyAvLyBpZiBlbGVtZW50IGlzIG5vdCBmb3VuZCBhZnRlciBuIHJldHJpZXMsIG1vdmUgb24gdG8gbmV4dCBzdGVwXG4gIGVsc2U/OiBzdHJpbmc7IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kLCBnbyB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBnb0JhY2tUbz86IHN0cmluZzsgLy8gYmFjayBidXR0b24gZ29lcyBiYWNrIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIHNraXBGcm9tU3RlcENvdW50PzogYm9vbGVhbjsgLy8gc2hvdy9oaWRlIHByb2dyZXNzIG9uIHN0ZXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT24gZXh0ZW5kcyBJVG91ckV2ZW50T24ge31cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGp1bXBUbz86IHN0cmluZzsgLy8gbmV4dCBidXR0b24gd2lsbCBqdW1wIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGFsbG93R29CYWNrPzogYm9vbGVhbjsgLy8gYWxsb3cgYmFjayB3aXRoaW4gdGhpcyBzdGVwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwIGV4dGVuZHMgVG91clN0ZXAge1xuICBhdHRhY2hUb09wdGlvbnM/OiBJVG91clN0ZXBBdHRhY2hUb09wdGlvbnM7XG4gIGFkdmFuY2VPbk9wdGlvbnM/OiBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zO1xuICBhZHZhbmNlT24/OiBJVG91clN0ZXBBZHZhbmNlT25bXSB8IElUb3VyU3RlcEFkdmFuY2VPbiB8IGFueTtcbiAgYWJvcnRPbj86IElUb3VyQWJvcnRPbltdO1xuICBjb3VudD86IG51bWJlcjtcbn1cblxuYWJzdHJhY3QgY2xhc3MgVG91ckJ1dHRvbnNBY3Rpb25zIHtcbiAgYWJzdHJhY3QgbmV4dCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcblxuICBhYnN0cmFjdCBjYW5jZWwoKTogdm9pZDtcblxuICBhYnN0cmFjdCBmaW5pc2goKTogdm9pZDtcbn1cblxuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1c6IG51bWJlciA9IDEwMDtcbmNvbnN0IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTDogbnVtYmVyID0gNTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTOiBudW1iZXIgPSAyMDtcblxuY29uc3Qgb3ZlcnJpZGRlbkV2ZW50czogc3RyaW5nW10gPSBbXG4gIElUb3VyRXZlbnQuY2xpY2ssXG4gIElUb3VyRXZlbnQucG9pbnRlcm92ZXIsXG4gIElUb3VyRXZlbnQucmVtb3ZlZCxcbiAgSVRvdXJFdmVudC5hZGRlZCxcbiAgSVRvdXJFdmVudC5rZXl1cCxcbl07XG5cbmNvbnN0IGtleUV2ZW50czogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KFtcbiAgWzEzLCAnZW50ZXInXSxcbiAgWzI3LCAnZXNjJ10sXG5dKTtcblxuY29uc3QgZGVmYXVsdFN0ZXBPcHRpb25zOiBUb3VyU3RlcCA9IHtcbiAgc2Nyb2xsVG86IHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicgfSxcbiAgY2FuY2VsSWNvbjoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gIH0sXG59O1xuXG5jb25zdCBNQVRfSUNPTl9CVVRUT046IHN0cmluZyA9ICdtYXQtaWNvbi1idXR0b24gbWF0ZXJpYWwtaWNvbnMgbWF0LWJ1dHRvbi1iYXNlJztcbmNvbnN0IE1BVF9CVVRUT046IHN0cmluZyA9ICdtYXQtYnV0dG9uLWJhc2UgbWF0LWJ1dHRvbic7XG5jb25zdCBNQVRfQlVUVE9OX0lOVklTSUJMRTogc3RyaW5nID0gJ3NoZXBoZXJkLXZvaWQtYnV0dG9uJztcblxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91ciBleHRlbmRzIFRvdXJCdXR0b25zQWN0aW9ucyB7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPjtcblxuICBzaGVwaGVyZFRvdXI6IFNoZXBoZXJkLlRvdXI7XG4gIHN0ZXBPcHRpb25zOiBJVG91clN0ZXA7XG5cbiAgY29uc3RydWN0b3Ioc3RlcE9wdGlvbnM6IElUb3VyU3RlcCA9IGRlZmF1bHRTdGVwT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0ZXBPcHRpb25zID0gc3RlcE9wdGlvbnM7XG4gICAgdGhpcy5uZXdUb3VyKCk7XG4gIH1cblxuICBuZXdUb3VyKG9wdHM/OiBJVG91ck9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ciA9IG5ldyBTaGVwaGVyZC5Ub3VyKFxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgIGRlZmF1bHRTdGVwT3B0aW9uczogdGhpcy5zdGVwT3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0cyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgLy8gbGlzdGVuIHRvIGNhbmNlbCBhbmQgY29tcGxldGUgdG8gY2xlYW4gdXAgYWJvcnRPbiBldmVudHNcbiAgICBtZXJnZShmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjYW5jZWwnKSwgZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY29tcGxldGUnKSlcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICBpZiAob3B0cyAmJiBvcHRzLmFib3J0T24pIHtcbiAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICBvcHRzLmFib3J0T24uZm9yRWFjaCgoYWJvcnRPbjogSVRvdXJBYm9ydE9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWJvcnRPbiwgdW5kZWZpbmVkLCBhYm9ydEV2ZW50JCwgdGhpcy5fZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICB9XG5cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gIH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFkZFN0ZXBzKHN0ZXBzOiBJVG91clN0ZXBbXSk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKHRoaXMuX3ByZXBhcmVUb3VyKHN0ZXBzKSk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5zdGFydCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcmVwYXJlVG91cihvcmlnaW5hbFN0ZXBzOiBJVG91clN0ZXBbXSwgZmluaXNoTGFiZWw6IHN0cmluZyA9ICdmaW5pc2gnKTogSVRvdXJTdGVwW10ge1xuICAgIC8vIGNyZWF0ZSBTdWJqZWN0cyBmb3IgYmFjayBhbmQgZm9yd2FyZCBldmVudHNcbiAgICBjb25zdCBiYWNrRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBjb25zdCBmb3J3YXJkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBsZXQgX2JhY2tGbG93OiBib29sZWFuID0gZmFsc2U7XG4gICAgLy8gY3JlYXRlIFN1YmplY3QgZm9yIHlvdXIgZW5kXG4gICAgY29uc3QgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGhlIHN0ZXAgcHJvZ3Jlc3MgaW4gdGhlIGZvb3RlciBvZiB0aGUgc2hlcGhlcmQgdG9vbHRpcFxuICAgICAqL1xuICAgIGNvbnN0IGFwcGVuZFByb2dyZXNzRnVuYzogRnVuY3Rpb24gPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgICAvLyBnZXQgYWxsIHRoZSBmb290ZXJzIHRoYXQgYXJlIGF2YWlsYWJsZSBpbiB0aGUgRE9NXG4gICAgICBjb25zdCBmb290ZXJzOiBFbGVtZW50W10gPSBBcnJheS5mcm9tPEVsZW1lbnQ+KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGVwaGVyZC1mb290ZXInKSk7XG4gICAgICAvLyBnZXQgdGhlIGxhc3QgZm9vdGVyIHNpbmNlIFNoZXBoZXJkIGFsd2F5cyBwdXRzIHRoZSBhY3RpdmUgb25lIGF0IHRoZSBlbmRcbiAgICAgIGNvbnN0IGZvb3RlcjogRWxlbWVudCA9IGZvb3RlcnNbZm9vdGVycy5sZW5ndGggLSAxXTtcbiAgICAgIC8vIGdlbmVyYXRlIHN0ZXBzIGh0bWwgZWxlbWVudFxuICAgICAgY29uc3QgcHJvZ3Jlc3M6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHByb2dyZXNzLmNsYXNzTmFtZSA9ICdzaGVwaGVyZC1wcm9ncmVzcyc7XG4gICAgICBwcm9ncmVzcy5pbm5lclRleHQgPSBgJHt0aGlzLnNoZXBoZXJkVG91ci5jdXJyZW50U3RlcC5vcHRpb25zLmNvdW50fS8ke3N0ZXBUb3RhbH1gO1xuICAgICAgLy8gaW5zZXJ0IGludG8gdGhlIGZvb3RlciBiZWZvcmUgdGhlIGZpcnN0IGJ1dHRvblxuICAgICAgZm9vdGVyLmluc2VydEJlZm9yZShwcm9ncmVzcywgZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoJy5zaGVwaGVyZC1idXR0b24nKSk7XG4gICAgfTtcblxuICAgIGxldCBzdGVwVG90YWw6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc3RlcHM6IElUb3VyU3RlcFtdID0gb3JpZ2luYWxTdGVwcy5tYXAoKHN0ZXA6IElUb3VyU3RlcCkgPT4ge1xuICAgICAgbGV0IHNob3dQcm9ncmVzczogRnVuY3Rpb247XG4gICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnM/LnNraXBGcm9tU3RlcENvdW50ID09PSB0cnVlKSB7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICBzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IGZhbHNlXG4gICAgICApIHtcbiAgICAgICAgc3RlcC5jb3VudCA9ICsrc3RlcFRvdGFsO1xuICAgICAgICBzaG93UHJvZ3Jlc3MgPSBhcHBlbmRQcm9ncmVzc0Z1bmMuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGVwLCB7XG4gICAgICAgIHdoZW46IHtcbiAgICAgICAgICBzaG93OiBzaG93UHJvZ3Jlc3MsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaEJ1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICB0ZXh0OiBmaW5pc2hMYWJlbCxcbiAgICAgIGFjdGlvbjogdGhpc1snZmluaXNoJ10uYmluZCh0aGlzKSxcbiAgICAgIGNsYXNzZXM6IE1BVF9CVVRUT04sXG4gICAgfTtcblxuICAgIGNvbnN0IHZvaWRCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgdGV4dDogJycsXG4gICAgICBhY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0sXG4gICAgICBjbGFzc2VzOiBNQVRfQlVUVE9OX0lOVklTSUJMRSxcbiAgICB9O1xuXG4gICAgLy8gbGlzdGVuIHRvIHRoZSBkZXN0cm95ZWQgZXZlbnQgdG8gY2xlYW4gdXAgYWxsIHRoZSBzdHJlYW1zXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGJhY2tFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGZvcndhcmRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICBkZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsU3RlcHM6IG51bWJlciA9IHN0ZXBzLmxlbmd0aDtcbiAgICBzdGVwcy5mb3JFYWNoKChzdGVwOiBJVG91clN0ZXAsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIC8vIGNyZWF0ZSBidXR0b25zIHNwZWNpZmljIGZvciB0aGUgc3RlcFxuICAgICAgLy8gdGhpcyBpcyBkb25lIHRvIGNyZWF0ZSBtb3JlIGNvbnRyb2wgb24gZXZlbnRzXG4gICAgICBjb25zdCBuZXh0QnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fcmlnaHQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIG5leHQgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuICAgICAgY29uc3QgYmFja0J1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICAgIHRleHQ6ICdjaGV2cm9uX2xlZnQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIGJhY2sgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgYmFja0V2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgX2JhY2tGbG93ID0gdHJ1ZTtcbiAgICAgICAgICAvLyBjaGVjayBpZiAnZ29CYWNrVG8nIGlzIHNldCB0byBqdW1wIHRvIGEgcGFydGljdWxhciBzdGVwLCBlbHNlIGp1c3QgZ28gYmFja1xuICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbykge1xuICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbywgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuXG4gICAgICAvLyBjaGVjayBpZiBoaWdobGlnaHQgd2FzIHByb3ZpZGVkIGZvciB0aGUgc3RlcCwgZWxzZSBmYWxsYmFjayBpbnRvIHNoZXBoZXJkcyB1c2FnZVxuICAgICAgc3RlcC5oaWdobGlnaHRDbGFzcyA9XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmhpZ2hsaWdodCA/ICdzaGVwaGVyZC1oaWdobGlnaHQnIDogc3RlcC5oaWdobGlnaHRDbGFzcztcblxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIC8vIGZpcnN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW25leHRCdXR0b25dO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdG90YWxTdGVwcyAtIDEpIHtcbiAgICAgICAgLy8gbGFzdCBzdGVwXG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtiYWNrQnV0dG9uLCBmaW5pc2hCdXR0b25dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIG5leHRCdXR0b25dO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGVja3MgXCJhZHZhbmNlT25cIiB0byBvdmVycmlkZSBsaXN0ZW5lcnNcbiAgICAgIGxldCBhZHZhbmNlT246IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uID0gc3RlcC5hZHZhbmNlT247XG4gICAgICAvLyByZW1vdmUgdGhlIHNoZXBoZXJkIFwiYWR2YW5jZU9uXCIgaW5mYXZvciBvZiBvdXJzIGlmIHRoZSBldmVudCBpcyBwYXJ0IG9mIG91ciBsaXN0XG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgYWR2YW5jZU9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikgJiZcbiAgICAgICAgICBvdmVycmlkZGVuRXZlbnRzLmluZGV4T2YoYWR2YW5jZU9uLmV2ZW50LnNwbGl0KCcuJylbMF0pID4gLTEpIHx8XG4gICAgICAgIGFkdmFuY2VPbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICApIHtcbiAgICAgICAgc3RlcC5hZHZhbmNlT24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9XG4gICAgICAgICAgc3RlcC5hZHZhbmNlT25PcHRpb25zICYmIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5hbGxvd0dvQmFjayA/IFtiYWNrQnV0dG9uLCB2b2lkQnV0dG9uXSA6IFt2b2lkQnV0dG9uXTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZHMgYSBkZWZhdWx0IGJlZm9yZVNob3dQcm9taXNlIGZ1bmN0aW9uXG4gICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXA6IEZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFkdmFuY2VPbiAmJiAhc3RlcC5hZHZhbmNlT24pIHtcbiAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlT24gPSBbYWR2YW5jZU9uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgYWR2YW5jZU9uLmZvckVhY2goKF86IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWR2YW5jZUFyciQucHVzaChhZHZhbmNlRXZlbnQkKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFkdmFuY2VPbltpXSwgc3RlcC5hZHZhbmNlT25PcHRpb25zLCBhZHZhbmNlRXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZVN1YnM6IFN1YnNjcmlwdGlvbiA9IGZvcmtKb2luKC4uLmFkdmFuY2VBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYWR2YW5jZSB0byBhIHNwZWNpZmljIHN0ZXAsIGVsc2UgYWR2YW5jZSB0byBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5qdW1wVG8pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBhZHZhbmNlU3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQgb24gdGhlIHN0ZXAsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgICAgICAgICBpZiAoc3RlcC5hYm9ydE9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICAgICAgICAgIHN0ZXAuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkLCBiYWNrRXZlbnQkLCBmb3J3YXJkRXZlbnQkKSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IF9zdG9wVGltZXIkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cmllc1JlYWNoZWQkOiBTdWJqZWN0PG51bWJlcj4gPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gICAgICAgICAgY29uc3QgX3JldHJ5QXR0ZW1wdHMkOiBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigtMSk7XG5cbiAgICAgICAgICBsZXQgaWQ6IHN0cmluZztcbiAgICAgICAgICAvLyBjaGVja3MgaWYgXCJhdHRhY2hUb1wiIGlzIGEgc3RyaW5nIG9yIGFuIG9iamVjdCB0byBnZXQgdGhlIGlkIG9mIGFuIGVsZW1lbnRcbiAgICAgICAgICBpZiAodHlwZW9mIHN0ZXAuYXR0YWNoVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZCA9IHN0ZXAuYXR0YWNoVG87XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0ZXAuYXR0YWNoVG8uZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUby5lbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFuIGlkIGFzIGEgc3RyaW5nIGluIGVpdGhlciBjYXNlLCB3ZSB1c2UgaXQgKHdlIGlnbm9yZSBpdCBpZiBpdHMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAvLyBpZiBjdXJyZW50IHN0ZXAgaXMgdGhlIGZpcnN0IHN0ZXAgb2YgdGhlIHRvdXIsIHdlIHNldCB0aGUgYnV0dG9ucyB0byBiZSBvbmx5IFwibmV4dFwiXG4gICAgICAgICAgICAvLyB3ZSBoYWQgdG8gdXNlIGBhbnlgIHNpbmNlIHRoZSB0b3VyIGRvZXNudCBleHBvc2UgdGhlIHN0ZXBzIGluIGFueSBmYXNoaW9uIG5vciBhIHdheSB0byBjaGVjayBpZiB3ZSBoYXZlIG1vZGlmaWVkIHRoZW0gYXQgYWxsXG4gICAgICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSA9PT0gKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzWzBdKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkudXBkYXRlU3RlcE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IG9yaWdpbmFsU3RlcHNbaW5kZXhdLmFkdmFuY2VPbiA/IFt2b2lkQnV0dG9uXSA6IFtuZXh0QnV0dG9uXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWdpc3RlciB0byB0aGUgYXR0ZW1wdHMgb2JzZXJ2YWJsZSB0byBub3RpZnkgZGVldmVsb3BlciB3aGVuIG51bWJlciBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICBfcmV0cnlBdHRlbXB0cyRcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQuYXNPYnNlcnZhYmxlKCksIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICAgIHNraXBXaGlsZSgodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA8IHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXM7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGF0dGVtcHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0ZW1wdHMgaGF2ZSBiZWVuIHJlYWNoZWQsIHdlIGNoZWNrIFwic2tpcElmTm90Rm91bmRcIiB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuc2tpcElmTm90Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGdldCB0byB0aGlzIHN0ZXAgY29taW5nIGJhY2sgZnJvbSBhIHN0ZXAgYW5kIGl0IHdhc250IGZvdW5kXG4gICAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIGVpdGhlciBjaGVjayBpZiBpdHMgdGhlIGZpcnN0IHN0ZXAgYW5kIHRyeSBnb2luZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgICAvLyBvciB3ZSBrZWVwIGdvaW5nIGJhY2sgdW50aWwgd2UgZmluZCBhIHN0ZXAgdGhhdCBhY3R1YWxseSBleGlzdHNcbiAgICAgICAgICAgICAgICAgIGlmIChfYmFja0Zsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCg8YW55PnRoaXMuc2hlcGhlcmRUb3VyKS5zdGVwcy5pbmRleE9mKHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYmFja0Zsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3lzIGN1cnJlbnQgc3RlcCBpZiB3ZSBuZWVkIHRvIHNraXAgaXQgdG8gcmVtb3ZlIGl0IGZyb20gdGhlIHRvdXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFN0ZXA6IFNoZXBoZXJkLlN0ZXAgPSB0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RlcC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIucmVtb3ZlU3RlcCgoPFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM+Y3VycmVudFN0ZXApLmlkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIFwic2tpcElmTm90Rm91bmRcIiBpcyBub3QgdHJ1ZSwgdGhlbiB3ZSBjaGVjayBpZiBcImVsc2VcIiBoYXMgYmVlbiBzZXQgdG8ganVtcCB0byBhIHNwZWNpZmljIHN0ZXBcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFJldHJpZXMgcmVhY2hlZCB0cnlpbmcgdG8gZmluZCAke2lkfS4gUmV0cmllZCAgJHthdHRlbXB0c30gdGltZXMuYCk7XG4gICAgICAgICAgICAgICAgICAvLyBlbHNlIHdlIHNob3cgdGhlIHN0ZXAgcmVnYXJkbGVzc1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gdGhlIHRpbWVyIHdpbGwgY29udGludWUgZWl0aGVyIHVudGlsIHdlIGZpbmQgdGhlIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBhdHRlbXB0cyBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKF9zdG9wVGltZXIkLCBfcmV0cmllc1JlYWNoZWQkLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENhcGFiaWxpdGllc1NldHVwKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJC5uZXh0KF9yZXRyeUF0dGVtcHRzJC52YWx1ZSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgZmluZCBpbnRlcnZhbCBpZiB1c2VyIHN0b3BzIHRoZSB0b3VyXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgX3N0b3BUaW1lciQubmV4dCgpO1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlc29sdmUgb2JzZXJ2YWJsZSB1bnRpbCB0aGUgdGltZUJlZm9yZVNob3cgaGFzIHBhc3NzZWQgb3IgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkKSkpXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0ZXBzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50KFxuICAgIGV2ZW50T246IElUb3VyRXZlbnRPbixcbiAgICBldmVudE9uT3B0aW9uczogSVRvdXJFdmVudE9uT3B0aW9ucyxcbiAgICBldmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICAgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3Rvcjogc3RyaW5nID0gZXZlbnRPbi5zZWxlY3RvcjtcbiAgICBjb25zdCBldmVudDogc3RyaW5nID0gZXZlbnRPbi5ldmVudDtcbiAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgY29uc3QgdGltZXJTdWJzOiBTdWJzY3JpcHRpb24gPSB0aW1lcihcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAoZXZlbnRPbk9wdGlvbnMgJiYgZXZlbnRPbk9wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwoZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgYmVlbiBmb3VuZCwgd2Ugc3RvcCB0aGUgdGltZXIgYW5kIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aW1lclN1YnMudW5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIGlmIChldmVudCA9PT0gSVRvdXJFdmVudC5hZGRlZCkge1xuICAgICAgICAgICAgLy8gaWYgZXZlbnQgaXMgXCJBZGRlZFwiIHRyaWdnZXIgYSBzb29uIGFzIHRoaXMgaXMgYXR0YWNoZWQuXG4gICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LmNsaWNrIHx8XG4gICAgICAgICAgICBldmVudCA9PT0gSVRvdXJFdmVudC5wb2ludGVyb3ZlciB8fFxuICAgICAgICAgICAgZXZlbnQuaW5kZXhPZihJVG91ckV2ZW50LmtleXVwKSA+IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB3ZSB1c2Ugbm9ybWFsIGxpc3RlbmVycyBmb3IgbW91c2VldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG1haW5FdmVudDogc3RyaW5nID0gZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsIG1haW5FdmVudClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKGV2ZW50JC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgkZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBvbmx5IHRyaWdnZXIgaWYgdGhlIGV2ZW50IGlzIGEga2V5Ym9hcmQgZXZlbnQgYW5kIHBhcnQgb2Ygb3V0IGxpc3RcbiAgICAgICAgICAgICAgICAgIGlmICgkZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlFdmVudHMuZ2V0KCRldmVudC5rZXlDb2RlKSA9PT0gc3ViRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICAgIC8vIGFuZCB3ZSB3aWxsIHVzZSBNdXRhdGlvbk9ic2VydmVyIGZvciBET00gZXZlbnRzXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGxpc3RlbmluaW5nIGlmIHRvdXIgaXMgY2xvc2VkXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBvYnNlcnZlIGZvciBhbnkgRE9NIGludGVyYWN0aW9uIGluIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==