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
            // get step index of current step
            /** @type {?} */
            const stepIndex = this.shepherdTour.steps.indexOf(this.shepherdTour.currentStep);
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
            progress.innerText = `${stepIndex + 1}/${this.shepherdTour.steps.length}`;
            // insert into the footer before the first button
            footer.insertBefore(progress, footer.querySelector('.shepherd-button'));
        });
        /** @type {?} */
        const steps = originalSteps.map((/**
         * @param {?} step
         * @return {?}
         */
        (step) => {
            return Object.assign({}, step, {
                when: {
                    show: appendProgressFunc.bind(this),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWdCLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0lBTXpFLFNBQVUsT0FBTztJQUNqQixlQUFnQixhQUFhO0lBQzdCLFNBQVUsT0FBTztJQUNqQixTQUFVLE9BQU87SUFDakIsV0FBWSxTQUFTOzs7Ozs7QUFHdkIsa0NBR0M7OztJQUZDLGdDQUFrQjs7SUFDbEIsNkJBQWdDOzs7OztBQUdsQyx5Q0FHQzs7O0lBRkMsNkNBQXdCOztJQUN4Qix1Q0FBa0I7Ozs7O0FBR3BCLGtDQUFxRDs7OztBQUVyRCxrQ0FFQzs7O0lBREMsK0JBQXlCOzs7OztBQUczQiw4Q0FNQzs7O0lBTEMsNkNBQW9COztJQUNwQiwyQ0FBaUI7O0lBQ2pCLGtEQUF5Qjs7SUFDekIsd0NBQWM7O0lBQ2QsNENBQWtCOzs7OztBQUdwQix3Q0FBMkQ7Ozs7QUFFM0QsK0NBR0M7OztJQUZDLDJDQUFnQjs7SUFDaEIsZ0RBQXNCOzs7OztBQUd4QiwrQkFLQzs7O0lBSkMsb0NBQTJDOztJQUMzQyxxQ0FBNkM7O0lBQzdDLDhCQUE0RDs7SUFDNUQsNEJBQXlCOzs7OztBQUczQixNQUFlLGtCQUFrQjtDQVFoQzs7Ozs7O0lBUEMsb0RBQXNCOzs7OztJQUV0QixvREFBc0I7Ozs7O0lBRXRCLHNEQUF3Qjs7Ozs7SUFFeEIsc0RBQXdCOzs7TUFHcEIsc0NBQXNDLEdBQVcsR0FBRzs7TUFD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SUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDakY7YUFDRjtRQUNILENBQUMsRUFBQztJQUNOLENBQUM7Q0FDRjs7Ozs7O0lBMVpDLDhDQUF3Qzs7SUFFeEMsMENBQTRCOztJQUM1Qix5Q0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGltZXIsIFN1YmplY3QsIEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50LCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBza2lwV2hpbGUsIGZpbHRlciwgc2tpcCwgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIFRvdXJTdGVwID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucztcbmV4cG9ydCB0eXBlIFRvdXJTdGVwQnV0dG9uID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9uc0J1dHRvbjtcblxuZXhwb3J0IGVudW0gSVRvdXJFdmVudCB7XG4gICdjbGljaycgPSAnY2xpY2snLFxuICAncG9pbnRlcm92ZXInID0gJ3BvaW50ZXJvdmVyJyxcbiAgJ2tleXVwJyA9ICdrZXl1cCcsXG4gICdhZGRlZCcgPSAnYWRkZWQnLCAvLyBhZGRlZCB0byBET01cbiAgJ3JlbW92ZWQnID0gJ3JlbW92ZWQnLCAvLyByZW1vdmVkIGZyb20gRE9NXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJFdmVudE9uIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7IC8vIGNzcyBzZWxlY3RvclxuICBldmVudD86IGtleW9mIHR5cGVvZiBJVG91ckV2ZW50OyAvLyBjbGljaywgcG9pbnRlcm92ZXIsIGtleXVwLCBhZGRlZCwgcmVtb3ZlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICB0aW1lQmVmb3JlU2hvdz86IG51bWJlcjsgLy8gZGVsYXkgYmVmb3JlIHN0ZXAgaXMgZGlzcGxheWVkXG4gIGludGVydmFsPzogbnVtYmVyOyAvLyB0aW1lIGJldHdlZW4gc2VhcmNoZXMgZm9yIGVsZW1lbnQsIGRlZmF1bHRzIHRvIDUwMG1zXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJBYm9ydE9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJPcHRpb25zIGV4dGVuZHMgU2hlcGhlcmQuVG91ci5Ub3VyT3B0aW9ucyB7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTsgLy8gZXZlbnRzIHRvIGFib3J0IG9uXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGhpZ2hsaWdodD86IGJvb2xlYW47XG4gIHJldHJpZXM/OiBudW1iZXI7IC8vICMgbnVtIG9mIGF0dGVtcHRzIHRvIGZpbmQgZWxlbWVudFxuICBza2lwSWZOb3RGb3VuZD86IGJvb2xlYW47IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kIGFmdGVyIG4gcmV0cmllcywgbW92ZSBvbiB0byBuZXh0IHN0ZXBcbiAgZWxzZT86IHN0cmluZzsgLy8gaWYgZWxlbWVudCBpcyBub3QgZm91bmQsIGdvIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGdvQmFja1RvPzogc3RyaW5nOyAvLyBiYWNrIGJ1dHRvbiBnb2VzIGJhY2sgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT24gZXh0ZW5kcyBJVG91ckV2ZW50T24ge31cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGp1bXBUbz86IHN0cmluZzsgLy8gbmV4dCBidXR0b24gd2lsbCBqdW1wIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGFsbG93R29CYWNrPzogYm9vbGVhbjsgLy8gYWxsb3cgYmFjayB3aXRoaW4gdGhpcyBzdGVwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwIGV4dGVuZHMgVG91clN0ZXAge1xuICBhdHRhY2hUb09wdGlvbnM/OiBJVG91clN0ZXBBdHRhY2hUb09wdGlvbnM7XG4gIGFkdmFuY2VPbk9wdGlvbnM/OiBJVG91clN0ZXBBZHZhbmNlT25PcHRpb25zO1xuICBhZHZhbmNlT24/OiBJVG91clN0ZXBBZHZhbmNlT25bXSB8IElUb3VyU3RlcEFkdmFuY2VPbiB8IGFueTtcbiAgYWJvcnRPbj86IElUb3VyQWJvcnRPbltdO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBhYnN0cmFjdCBuZXh0KCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgYmFjaygpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGNhbmNlbCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGZpbmlzaCgpOiB2b2lkO1xufVxuXG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVzogbnVtYmVyID0gMTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMOiBudW1iZXIgPSA1MDA7XG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM6IG51bWJlciA9IDIwO1xuXG5jb25zdCBvdmVycmlkZGVuRXZlbnRzOiBzdHJpbmdbXSA9IFtcbiAgSVRvdXJFdmVudC5jbGljayxcbiAgSVRvdXJFdmVudC5wb2ludGVyb3ZlcixcbiAgSVRvdXJFdmVudC5yZW1vdmVkLFxuICBJVG91ckV2ZW50LmFkZGVkLFxuICBJVG91ckV2ZW50LmtleXVwLFxuXTtcblxuY29uc3Qga2V5RXZlbnRzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oW1xuICBbMTMsICdlbnRlciddLFxuICBbMjcsICdlc2MnXSxcbl0pO1xuXG5jb25zdCBkZWZhdWx0U3RlcE9wdGlvbnM6IFRvdXJTdGVwID0ge1xuICBzY3JvbGxUbzogeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9LFxuICBjYW5jZWxJY29uOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IE1BVF9JQ09OX0JVVFRPTjogc3RyaW5nID0gJ21hdC1pY29uLWJ1dHRvbiBtYXRlcmlhbC1pY29ucyBtYXQtYnV0dG9uLWJhc2UnO1xuY29uc3QgTUFUX0JVVFRPTjogc3RyaW5nID0gJ21hdC1idXR0b24tYmFzZSBtYXQtYnV0dG9uJztcblxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91ciBleHRlbmRzIFRvdXJCdXR0b25zQWN0aW9ucyB7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPjtcblxuICBzaGVwaGVyZFRvdXI6IFNoZXBoZXJkLlRvdXI7XG4gIHN0ZXBPcHRpb25zOiBJVG91clN0ZXA7XG5cbiAgY29uc3RydWN0b3Ioc3RlcE9wdGlvbnM6IElUb3VyU3RlcCA9IGRlZmF1bHRTdGVwT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0ZXBPcHRpb25zID0gc3RlcE9wdGlvbnM7XG4gICAgdGhpcy5uZXdUb3VyKCk7XG4gIH1cblxuICBuZXdUb3VyKG9wdHM/OiBJVG91ck9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ciA9IG5ldyBTaGVwaGVyZC5Ub3VyKFxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgIGRlZmF1bHRTdGVwT3B0aW9uczogdGhpcy5zdGVwT3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0cyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgLy8gbGlzdGVuIHRvIGNhbmNlbCBhbmQgY29tcGxldGUgdG8gY2xlYW4gdXAgYWJvcnRPbiBldmVudHNcbiAgICBtZXJnZShmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjYW5jZWwnKSwgZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY29tcGxldGUnKSlcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICBpZiAob3B0cyAmJiBvcHRzLmFib3J0T24pIHtcbiAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICBvcHRzLmFib3J0T24uZm9yRWFjaCgoYWJvcnRPbjogSVRvdXJBYm9ydE9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWJvcnRPbiwgdW5kZWZpbmVkLCBhYm9ydEV2ZW50JCwgdGhpcy5fZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICB9XG5cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gIH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFkZFN0ZXBzKHN0ZXBzOiBJVG91clN0ZXBbXSk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKHRoaXMuX3ByZXBhcmVUb3VyKHN0ZXBzKSk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5zdGFydCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcmVwYXJlVG91cihvcmlnaW5hbFN0ZXBzOiBJVG91clN0ZXBbXSk6IElUb3VyU3RlcFtdIHtcbiAgICAvLyBjcmVhdGUgU3ViamVjdHMgZm9yIGJhY2sgYW5kIGZvcndhcmQgZXZlbnRzXG4gICAgY29uc3QgYmFja0V2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgY29uc3QgZm9yd2FyZEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgbGV0IF9iYWNrRmxvdzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8vIGNyZWF0ZSBTdWJqZWN0IGZvciB5b3VyIGVuZFxuICAgIGNvbnN0IGRlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHRoZSBzdGVwIHByb2dyZXNzIGluIHRoZSBmb290ZXIgb2YgdGhlIHNoZXBoZXJkIHRvb2x0aXBcbiAgICAgKi9cbiAgICBjb25zdCBhcHBlbmRQcm9ncmVzc0Z1bmM6IEZ1bmN0aW9uID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgICAgLy8gZ2V0IHN0ZXAgaW5kZXggb2YgY3VycmVudCBzdGVwXG4gICAgICBjb25zdCBzdGVwSW5kZXg6IG51bWJlciA9IHRoaXMuc2hlcGhlcmRUb3VyLnN0ZXBzLmluZGV4T2YodGhpcy5zaGVwaGVyZFRvdXIuY3VycmVudFN0ZXApO1xuICAgICAgLy8gZ2V0IGFsbCB0aGUgZm9vdGVycyB0aGF0IGFyZSBhdmFpbGFibGUgaW4gdGhlIERPTVxuICAgICAgY29uc3QgZm9vdGVyczogRWxlbWVudFtdID0gQXJyYXkuZnJvbTxFbGVtZW50Pihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hlcGhlcmQtZm9vdGVyJykpO1xuICAgICAgLy8gZ2V0IHRoZSBsYXN0IGZvb3RlciBzaW5jZSBTaGVwaGVyZCBhbHdheXMgcHV0cyB0aGUgYWN0aXZlIG9uZSBhdCB0aGUgZW5kXG4gICAgICBjb25zdCBmb290ZXI6IEVsZW1lbnQgPSBmb290ZXJzW2Zvb3RlcnMubGVuZ3RoIC0gMV07XG4gICAgICAvLyBnZW5lcmF0ZSBzdGVwcyBodG1sIGVsZW1lbnRcbiAgICAgIGNvbnN0IHByb2dyZXNzOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBwcm9ncmVzcy5jbGFzc05hbWUgPSAnc2hlcGhlcmQtcHJvZ3Jlc3MnO1xuICAgICAgcHJvZ3Jlc3MuaW5uZXJUZXh0ID0gYCR7c3RlcEluZGV4ICsgMX0vJHt0aGlzLnNoZXBoZXJkVG91ci5zdGVwcy5sZW5ndGh9YDtcbiAgICAgIC8vIGluc2VydCBpbnRvIHRoZSBmb290ZXIgYmVmb3JlIHRoZSBmaXJzdCBidXR0b25cbiAgICAgIGZvb3Rlci5pbnNlcnRCZWZvcmUocHJvZ3Jlc3MsIGZvb3Rlci5xdWVyeVNlbGVjdG9yKCcuc2hlcGhlcmQtYnV0dG9uJykpO1xuICAgIH07XG5cbiAgICBjb25zdCBzdGVwczogSVRvdXJTdGVwW10gPSBvcmlnaW5hbFN0ZXBzLm1hcCgoc3RlcDogSVRvdXJTdGVwKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RlcCwge1xuICAgICAgICB3aGVuOiB7XG4gICAgICAgICAgc2hvdzogYXBwZW5kUHJvZ3Jlc3NGdW5jLmJpbmQodGhpcyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaEJ1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICB0ZXh0OiAnZmluaXNoJyxcbiAgICAgIGFjdGlvbjogdGhpc1snZmluaXNoJ10uYmluZCh0aGlzKSxcbiAgICAgIGNsYXNzZXM6IE1BVF9CVVRUT04sXG4gICAgfTtcbiAgICBjb25zdCBkaXNtaXNzQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6ICdjYW5jZWwgdG91cicsXG4gICAgICBhY3Rpb246IHRoaXNbJ2NhbmNlbCddLmJpbmQodGhpcyksXG4gICAgICBjbGFzc2VzOiBNQVRfQlVUVE9OLFxuICAgIH07XG5cbiAgICAvLyBsaXN0ZW4gdG8gdGhlIGRlc3Ryb3llZCBldmVudCB0byBjbGVhbiB1cCBhbGwgdGhlIHN0cmVhbXNcbiAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgYmFja0V2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZm9yd2FyZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxTdGVwczogbnVtYmVyID0gc3RlcHMubGVuZ3RoO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXA6IElUb3VyU3RlcCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgLy8gY3JlYXRlIGJ1dHRvbnMgc3BlY2lmaWMgZm9yIHRoZSBzdGVwXG4gICAgICAvLyB0aGlzIGlzIGRvbmUgdG8gY3JlYXRlIG1vcmUgY29udHJvbCBvbiBldmVudHNcbiAgICAgIGNvbnN0IG5leHRCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgICB0ZXh0OiAnY2hldnJvbl9yaWdodCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgbmV4dCBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG4gICAgICBjb25zdCBiYWNrQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fbGVmdCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgYmFjayBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBiYWNrRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICBfYmFja0Zsb3cgPSB0cnVlO1xuICAgICAgICAgIC8vIGNoZWNrIGlmICdnb0JhY2tUbycgaXMgc2V0IHRvIGp1bXAgdG8gYSBwYXJ0aWN1bGFyIHN0ZXAsIGVsc2UganVzdCBnbyBiYWNrXG4gICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvKSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvLCBmYWxzZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG5cbiAgICAgIC8vIGNoZWNrIGlmIGhpZ2hsaWdodCB3YXMgcHJvdmlkZWQgZm9yIHRoZSBzdGVwLCBlbHNlIGZhbGxiYWNrIGludG8gc2hlcGhlcmRzIHVzYWdlXG4gICAgICBzdGVwLmhpZ2hsaWdodENsYXNzID1cbiAgICAgICAgc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaGlnaGxpZ2h0ID8gJ3NoZXBoZXJkLWhpZ2hsaWdodCcgOiBzdGVwLmhpZ2hsaWdodENsYXNzO1xuXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gZmlyc3Qgc3RlcFxuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbbmV4dEJ1dHRvbl07XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSB0b3RhbFN0ZXBzIC0gMSkge1xuICAgICAgICAvLyBsYXN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIGZpbmlzaEJ1dHRvbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbYmFja0J1dHRvbiwgbmV4dEJ1dHRvbl07XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrcyBcImFkdmFuY2VPblwiIHRvIG92ZXJyaWRlIGxpc3RlbmVyc1xuICAgICAgbGV0IGFkdmFuY2VPbjogSVRvdXJTdGVwQWR2YW5jZU9uW10gfCBJVG91clN0ZXBBZHZhbmNlT24gPSBzdGVwLmFkdmFuY2VPbjtcbiAgICAgIC8vIHJlbW92ZSB0aGUgc2hlcGhlcmQgXCJhZHZhbmNlT25cIiBpbmZhdm9yIG9mIG91cnMgaWYgdGhlIGV2ZW50IGlzIHBhcnQgb2Ygb3VyIGxpc3RcbiAgICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiBhZHZhbmNlT24gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSAmJlxuICAgICAgICAgIG92ZXJyaWRkZW5FdmVudHMuaW5kZXhPZihhZHZhbmNlT24uZXZlbnQuc3BsaXQoJy4nKVswXSkgPiAtMSkgfHxcbiAgICAgICAgYWR2YW5jZU9uIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICkge1xuICAgICAgICBzdGVwLmFkdmFuY2VPbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RlcC5idXR0b25zID1cbiAgICAgICAgICBzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmFsbG93R29CYWNrID8gW2JhY2tCdXR0b24sIGRpc21pc3NCdXR0b25dIDogW2Rpc21pc3NCdXR0b25dO1xuICAgICAgfVxuICAgICAgLy8gYWRkcyBhIGRlZmF1bHQgYmVmb3JlU2hvd1Byb21pc2UgZnVuY3Rpb25cbiAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxDYXBhYmlsaXRpZXNTZXR1cDogRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWR2YW5jZU9uICYmICFzdGVwLmFkdmFuY2VPbikge1xuICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSkge1xuICAgICAgICAgICAgICAgIGFkdmFuY2VPbiA9IFthZHZhbmNlT25dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgICAgICAgICBhZHZhbmNlT24uZm9yRWFjaCgoXzogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhZHZhbmNlQXJyJC5wdXNoKGFkdmFuY2VFdmVudCQpO1xuICAgICAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWR2YW5jZU9uW2ldLCBzdGVwLmFkdmFuY2VPbk9wdGlvbnMsIGFkdmFuY2VFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlU3ViczogU3Vic2NyaXB0aW9uID0gZm9ya0pvaW4oLi4uYWR2YW5jZUFyciQpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKGRlc3Ryb3llZEV2ZW50JCwgYmFja0V2ZW50JCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhZHZhbmNlIHRvIGEgc3BlY2lmaWMgc3RlcCwgZWxzZSBhZHZhbmNlIHRvIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYWR2YW5jZU9uT3B0aW9ucyAmJiBzdGVwLmFkdmFuY2VPbk9wdGlvbnMuanVtcFRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIGFkdmFuY2VTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCBvbiB0aGUgc3RlcCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICAgICAgICAgIGlmIChzdGVwLmFib3J0T24pIHtcbiAgICAgICAgICAgICAgY29uc3QgYWJvcnRBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgc3RlcC5hYm9ydE9uLmZvckVhY2goKGFib3J0T246IElUb3VyQWJvcnRPbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhYm9ydEFyciQucHVzaChhYm9ydEV2ZW50JCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFib3J0T24sIHVuZGVmaW5lZCwgYWJvcnRFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0U3ViczogU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uYWJvcnRBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQsIGZvcndhcmRFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhYm9ydFN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgX3N0b3BUaW1lciQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICAgIGNvbnN0IF9yZXRyaWVzUmVhY2hlZCQ6IFN1YmplY3Q8bnVtYmVyPiA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cnlBdHRlbXB0cyQ6IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KC0xKTtcblxuICAgICAgICAgIGxldCBpZDogc3RyaW5nO1xuICAgICAgICAgIC8vIGNoZWNrcyBpZiBcImF0dGFjaFRvXCIgaXMgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IHRvIGdldCB0aGUgaWQgb2YgYW4gZWxlbWVudFxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUbztcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdGVwLmF0dGFjaFRvID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RlcC5hdHRhY2hUby5lbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWQgPSBzdGVwLmF0dGFjaFRvLmVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYW4gaWQgYXMgYSBzdHJpbmcgaW4gZWl0aGVyIGNhc2UsIHdlIHVzZSBpdCAod2UgaWdub3JlIGl0IGlmIGl0cyBIVE1MRWxlbWVudClcbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIC8vIGlmIGN1cnJlbnQgc3RlcCBpcyB0aGUgZmlyc3Qgc3RlcCBvZiB0aGUgdG91ciwgd2Ugc2V0IHRoZSBidXR0b25zIHRvIGJlIG9ubHkgXCJuZXh0XCIgb3IgXCJkaXNtaXNzXCJcbiAgICAgICAgICAgIC8vIHdlIGhhZCB0byB1c2UgYGFueWAgc2luY2UgdGhlIHRvdXIgZG9lc250IGV4cG9zZSB0aGUgc3RlcHMgaW4gYW55IGZhc2hpb24gbm9yIGEgd2F5IHRvIGNoZWNrIGlmIHdlIGhhdmUgbW9kaWZpZWQgdGhlbSBhdCBhbGxcbiAgICAgICAgICAgIGlmICh0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpID09PSAoPGFueT50aGlzLnNoZXBoZXJkVG91cikuc3RlcHNbMF0pIHtcbiAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKS51cGRhdGVTdGVwT3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgYnV0dG9uczogb3JpZ2luYWxTdGVwc1tpbmRleF0uYWR2YW5jZU9uID8gW2Rpc21pc3NCdXR0b25dIDogW25leHRCdXR0b25dLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRvIHRoZSBhdHRlbXB0cyBvYnNlcnZhYmxlIHRvIG5vdGlmeSBkZWV2ZWxvcGVyIHdoZW4gbnVtYmVyIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJFxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBza2lwKDEpLFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbChtZXJnZShfc3RvcFRpbWVyJC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgc2tpcFdoaWxlKCh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgc3RlcC5hdHRhY2hUb09wdGlvbnMucmV0cmllcztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoYXR0ZW1wdHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRlbXB0cyBoYXZlIGJlZW4gcmVhY2hlZCwgd2UgY2hlY2sgXCJza2lwSWZOb3RGb3VuZFwiIHRvIG1vdmUgb24gdG8gdGhlIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5za2lwSWZOb3RGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZ2V0IHRvIHRoaXMgc3RlcCBjb21pbmcgYmFjayBmcm9tIGEgc3RlcCBhbmQgaXQgd2FzbnQgZm91bmRcbiAgICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgZWl0aGVyIGNoZWNrIGlmIGl0cyB0aGUgZmlyc3Qgc3RlcCBhbmQgdHJ5IGdvaW5nIGZvcndhcmRcbiAgICAgICAgICAgICAgICAgIC8vIG9yIHdlIGtlZXAgZ29pbmcgYmFjayB1bnRpbCB3ZSBmaW5kIGEgc3RlcCB0aGF0IGFjdHVhbGx5IGV4aXN0c1xuICAgICAgICAgICAgICAgICAgaWYgKF9iYWNrRmxvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzLmluZGV4T2YodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9iYWNrRmxvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVzdHJveXMgY3VycmVudCBzdGVwIGlmIHdlIG5lZWQgdG8gc2tpcCBpdCB0byByZW1vdmUgaXQgZnJvbSB0aGUgdG91clxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3RlcDogU2hlcGhlcmQuU3RlcCA9IHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5yZW1vdmVTdGVwKCg8U2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucz5jdXJyZW50U3RlcCkuaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgXCJza2lwSWZOb3RGb3VuZFwiIGlzIG5vdCB0cnVlLCB0aGVuIHdlIGNoZWNrIGlmIFwiZWxzZVwiIGhhcyBiZWVuIHNldCB0byBqdW1wIHRvIGEgc3BlY2lmaWMgc3RlcFxuICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5lbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgUmV0cmllcyByZWFjaGVkIHRyeWluZyB0byBmaW5kICR7aWR9LiBSZXRyaWVkICAke2F0dGVtcHRzfSB0aW1lcy5gKTtcbiAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugd2Ugc2hvdyB0aGUgc3RlcCByZWdhcmRsZXNzXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gd2Ugc3RhcnQgYSB0aW1lciBvZiBhdHRlbXB0cyB0byBmaW5kIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAvLyB0aGUgdGltZXIgd2lsbCBjb250aW51ZSBlaXRoZXIgdW50aWwgd2UgZmluZCB0aGUgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQsIF9yZXRyaWVzUmVhY2hlZCQsIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGJlZW4gZm91bmQsIHdlIHN0b3AgdGhlIHRpbWVyIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXAoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgX3JldHJ5QXR0ZW1wdHMkLm5leHQoX3JldHJ5QXR0ZW1wdHMkLnZhbHVlICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc3RvcCBmaW5kIGludGVydmFsIGlmIHVzZXIgc3RvcHMgdGhlIHRvdXJcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVzb2x2ZSBvYnNlcnZhYmxlIHVudGlsIHRoZSB0aW1lQmVmb3JlU2hvdyBoYXMgcGFzc3NlZCBvciB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQpKSlcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RlcHM7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnQoXG4gICAgZXZlbnRPbjogSVRvdXJFdmVudE9uLFxuICAgIGV2ZW50T25PcHRpb25zOiBJVG91ckV2ZW50T25PcHRpb25zLFxuICAgIGV2ZW50JDogU3ViamVjdDx2b2lkPixcbiAgICBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdG9yOiBzdHJpbmcgPSBldmVudE9uLnNlbGVjdG9yO1xuICAgIGNvbnN0IGV2ZW50OiBzdHJpbmcgPSBldmVudE9uLmV2ZW50O1xuICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICBjb25zdCB0aW1lclN1YnM6IFN1YnNjcmlwdGlvbiA9IHRpbWVyKFxuICAgICAgKGV2ZW50T25PcHRpb25zICYmIGV2ZW50T25PcHRpb25zLnRpbWVCZWZvcmVTaG93KSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVyxcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbChkZXN0cm95ZWRFdmVudCQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHRpbWVyU3Vicy51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgICAvLyBpZiBldmVudCBpcyBcIkFkZGVkXCIgdHJpZ2dlciBhIHNvb24gYXMgdGhpcyBpcyBhdHRhY2hlZC5cbiAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgZXZlbnQgPT09IElUb3VyRXZlbnQuY2xpY2sgfHxcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LnBvaW50ZXJvdmVyIHx8XG4gICAgICAgICAgICBldmVudC5pbmRleE9mKElUb3VyRXZlbnQua2V5dXApID4gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHdlIHVzZSBub3JtYWwgbGlzdGVuZXJzIGZvciBtb3VzZWV2ZW50c1xuICAgICAgICAgICAgY29uc3QgbWFpbkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc3ViRXZlbnQ6IHN0cmluZyA9IGV2ZW50LnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBmcm9tRXZlbnQoZWxlbWVudCwgbWFpbkV2ZW50KVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoZXZlbnQkLmFzT2JzZXJ2YWJsZSgpLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKCRldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBpZiB0aGUgZXZlbnQgaXMgYSBrZXlib2FyZCBldmVudCBhbmQgcGFydCBvZiBvdXQgbGlzdFxuICAgICAgICAgICAgICAgICAgaWYgKCRldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleUV2ZW50cy5nZXQoJGV2ZW50LmtleUNvZGUpID09PSBzdWJFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IElUb3VyRXZlbnQucmVtb3ZlZCkge1xuICAgICAgICAgICAgLy8gYW5kIHdlIHdpbGwgdXNlIE11dGF0aW9uT2JzZXJ2ZXIgZm9yIERPTSBldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgbGlzdGVuaW5pbmcgaWYgdG91ciBpcyBjbG9zZWRcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIG9ic2VydmUgZm9yIGFueSBET00gaW50ZXJhY3Rpb24gaW4gdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuIl19