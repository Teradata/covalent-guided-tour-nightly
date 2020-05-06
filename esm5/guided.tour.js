/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __extends, __read, __spread } from "tslib";
import Shepherd from 'shepherd.js';
import { timer, Subject, BehaviorSubject, merge, fromEvent, forkJoin } from 'rxjs';
import { takeUntil, skipWhile, filter, skip, first } from 'rxjs/operators';
/** @enum {string} */
var ITourEvent = {
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
var /**
 * @abstract
 */
TourButtonsActions = /** @class */ (function () {
    function TourButtonsActions() {
    }
    return TourButtonsActions;
}());
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
var SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW = 100;
/** @type {?} */
var SHEPHERD_DEFAULT_FIND_INTERVAL = 500;
/** @type {?} */
var SHEPHERD_DEFAULT_FIND_ATTEMPTS = 20;
/** @type {?} */
var overriddenEvents = [
    ITourEvent.click,
    ITourEvent.pointerover,
    ITourEvent.removed,
    ITourEvent.added,
    ITourEvent.keyup,
];
/** @type {?} */
var keyEvents = new Map([
    [13, 'enter'],
    [27, 'esc'],
]);
/** @type {?} */
var defaultStepOptions = {
    scrollTo: { behavior: 'smooth', block: 'center' },
    cancelIcon: {
        enabled: true,
    },
};
/** @type {?} */
var MAT_ICON_BUTTON = 'mat-icon-button material-icons mat-button-base';
/** @type {?} */
var MAT_BUTTON = 'mat-button-base mat-button';
var CovalentGuidedTour = /** @class */ (function (_super) {
    __extends(CovalentGuidedTour, _super);
    function CovalentGuidedTour(stepOptions) {
        if (stepOptions === void 0) { stepOptions = defaultStepOptions; }
        var _this = _super.call(this) || this;
        _this.stepOptions = stepOptions;
        _this.newTour();
        return _this;
    }
    /**
     * @param {?=} opts
     * @return {?}
     */
    CovalentGuidedTour.prototype.newTour = /**
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        var _this = this;
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
        function () {
            _this._destroyedEvent$.next();
            _this._destroyedEvent$.complete();
        }));
        // if abortOn was passed, we bind the event and execute complete
        if (opts && opts.abortOn) {
            /** @type {?} */
            var abortArr$_1 = [];
            opts.abortOn.forEach((/**
             * @param {?} abortOn
             * @return {?}
             */
            function (abortOn) {
                /** @type {?} */
                var abortEvent$ = new Subject();
                abortArr$_1.push(abortEvent$);
                _this._bindEvent(abortOn, undefined, abortEvent$, _this._destroyedEvent$);
            }));
            /** @type {?} */
            var abortSubs_1 = merge.apply(void 0, __spread(abortArr$_1)).pipe(takeUntil(this._destroyedEvent$))
                .subscribe((/**
             * @return {?}
             */
            function () {
                _this.shepherdTour.complete();
                abortSubs_1.unsubscribe();
            }));
        }
    };
    /**
     * @return {?}
     */
    CovalentGuidedTour.prototype.back = /**
     * @return {?}
     */
    function () {
        this.shepherdTour.back();
    };
    /**
     * @return {?}
     */
    CovalentGuidedTour.prototype.cancel = /**
     * @return {?}
     */
    function () {
        this.shepherdTour.cancel();
    };
    /**
     * @return {?}
     */
    CovalentGuidedTour.prototype.next = /**
     * @return {?}
     */
    function () {
        this.shepherdTour.next();
    };
    /**
     * @return {?}
     */
    CovalentGuidedTour.prototype.finish = /**
     * @return {?}
     */
    function () {
        this.shepherdTour.complete();
    };
    /**
     * @param {?} steps
     * @return {?}
     */
    CovalentGuidedTour.prototype.addSteps = /**
     * @param {?} steps
     * @return {?}
     */
    function (steps) {
        this.shepherdTour.addSteps(this._prepareTour(steps));
    };
    /**
     * @return {?}
     */
    CovalentGuidedTour.prototype.start = /**
     * @return {?}
     */
    function () {
        this.shepherdTour.start();
    };
    /**
     * @protected
     * @param {?} originalSteps
     * @return {?}
     */
    CovalentGuidedTour.prototype._prepareTour = /**
     * @protected
     * @param {?} originalSteps
     * @return {?}
     */
    function (originalSteps) {
        var _this = this;
        // create Subjects for back and forward events
        /** @type {?} */
        var backEvent$ = new Subject();
        /** @type {?} */
        var forwardEvent$ = new Subject();
        /** @type {?} */
        var _backFlow = false;
        // create Subject for your end
        /** @type {?} */
        var destroyedEvent$ = new Subject();
        /**
         * This function adds the step progress in the footer of the shepherd tooltip
         * @type {?}
         */
        var appendProgressFunc = (/**
         * @return {?}
         */
        function () {
            // get step index of current step
            /** @type {?} */
            var stepIndex = this.shepherdTour.steps.indexOf(this.shepherdTour.currentStep);
            // get all the footers that are available in the DOM
            /** @type {?} */
            var footers = Array.from(document.querySelectorAll('.shepherd-footer'));
            // get the last footer since Shepherd always puts the active one at the end
            /** @type {?} */
            var footer = footers[footers.length - 1];
            // generate steps html element
            /** @type {?} */
            var progress = document.createElement('span');
            progress.className = 'shepherd-progress';
            progress.innerText = stepIndex + 1 + "/" + this.shepherdTour.steps.length;
            // insert into the footer before the first button
            footer.insertBefore(progress, footer.querySelector('.shepherd-button'));
        });
        /** @type {?} */
        var steps = originalSteps.map((/**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            return Object.assign({}, step, {
                when: {
                    show: appendProgressFunc.bind(_this),
                },
            });
        }));
        /** @type {?} */
        var finishButton = {
            text: 'finish',
            action: this['finish'].bind(this),
            classes: MAT_BUTTON,
        };
        /** @type {?} */
        var dismissButton = {
            text: 'cancel tour',
            action: this['cancel'].bind(this),
            classes: MAT_BUTTON,
        };
        // listen to the destroyed event to clean up all the streams
        this._destroyedEvent$.pipe(first()).subscribe((/**
         * @return {?}
         */
        function () {
            backEvent$.complete();
            forwardEvent$.complete();
            destroyedEvent$.next();
            destroyedEvent$.complete();
        }));
        /** @type {?} */
        var totalSteps = steps.length;
        steps.forEach((/**
         * @param {?} step
         * @param {?} index
         * @return {?}
         */
        function (step, index) {
            // create buttons specific for the step
            // this is done to create more control on events
            /** @type {?} */
            var nextButton = {
                text: 'chevron_right',
                action: (/**
                 * @return {?}
                 */
                function () {
                    // intercept the next action and trigger event
                    forwardEvent$.next();
                    _this.shepherdTour.next();
                }),
                classes: MAT_ICON_BUTTON,
            };
            /** @type {?} */
            var backButton = {
                text: 'chevron_left',
                action: (/**
                 * @return {?}
                 */
                function () {
                    // intercept the back action and trigger event
                    backEvent$.next();
                    _backFlow = true;
                    // check if 'goBackTo' is set to jump to a particular step, else just go back
                    if (step.attachToOptions && step.attachToOptions.goBackTo) {
                        _this.shepherdTour.show(step.attachToOptions.goBackTo, false);
                    }
                    else {
                        _this.shepherdTour.back();
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
            var advanceOn = step.advanceOn;
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
            function () {
                return new Promise((/**
                 * @param {?} resolve
                 * @return {?}
                 */
                function (resolve) {
                    /** @type {?} */
                    var additionalCapabilitiesSetup = (/**
                     * @return {?}
                     */
                    function () {
                        if (advanceOn && !step.advanceOn) {
                            if (!Array.isArray(advanceOn)) {
                                advanceOn = [advanceOn];
                            }
                            /** @type {?} */
                            var advanceArr$_1 = [];
                            advanceOn.forEach((/**
                             * @param {?} _
                             * @param {?} i
                             * @return {?}
                             */
                            function (_, i) {
                                /** @type {?} */
                                var advanceEvent$ = new Subject();
                                advanceArr$_1.push(advanceEvent$);
                                // we start a timer of attempts to find an element in the dom
                                _this._bindEvent(advanceOn[i], step.advanceOnOptions, advanceEvent$, destroyedEvent$);
                            }));
                            /** @type {?} */
                            var advanceSubs_1 = forkJoin.apply(void 0, __spread(advanceArr$_1)).pipe(takeUntil(merge(destroyedEvent$, backEvent$)))
                                .subscribe((/**
                             * @return {?}
                             */
                            function () {
                                // check if we need to advance to a specific step, else advance to next step
                                if (step.advanceOnOptions && step.advanceOnOptions.jumpTo) {
                                    _this.shepherdTour.show(step.advanceOnOptions.jumpTo);
                                }
                                else {
                                    _this.shepherdTour.next();
                                }
                                forwardEvent$.next();
                                advanceSubs_1.unsubscribe();
                            }));
                        }
                        // if abortOn was passed on the step, we bind the event and execute complete
                        if (step.abortOn) {
                            /** @type {?} */
                            var abortArr$_2 = [];
                            step.abortOn.forEach((/**
                             * @param {?} abortOn
                             * @return {?}
                             */
                            function (abortOn) {
                                /** @type {?} */
                                var abortEvent$ = new Subject();
                                abortArr$_2.push(abortEvent$);
                                _this._bindEvent(abortOn, undefined, abortEvent$, destroyedEvent$);
                            }));
                            /** @type {?} */
                            var abortSubs_2 = merge.apply(void 0, __spread(abortArr$_2)).pipe(takeUntil(merge(destroyedEvent$, backEvent$, forwardEvent$)))
                                .subscribe((/**
                             * @return {?}
                             */
                            function () {
                                _this.shepherdTour.complete();
                                abortSubs_2.unsubscribe();
                            }));
                        }
                    });
                    /** @type {?} */
                    var _stopTimer$ = new Subject();
                    /** @type {?} */
                    var _retriesReached$ = new Subject();
                    /** @type {?} */
                    var _retryAttempts$ = new BehaviorSubject(-1);
                    /** @type {?} */
                    var id;
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
                        if (_this.shepherdTour.getCurrentStep() === ((/** @type {?} */ (_this.shepherdTour))).steps[0]) {
                            _this.shepherdTour.getCurrentStep().updateStepOptions({
                                buttons: originalSteps[index].advanceOn ? [dismissButton] : [nextButton],
                            });
                        }
                        // register to the attempts observable to notify deeveloper when number has been reached
                        _retryAttempts$
                            .pipe(skip(1), takeUntil(merge(_stopTimer$.asObservable(), destroyedEvent$)), skipWhile((/**
                         * @param {?} val
                         * @return {?}
                         */
                        function (val) {
                            if (step.attachToOptions && step.attachToOptions.retries !== undefined) {
                                return val < step.attachToOptions.retries;
                            }
                            return val < SHEPHERD_DEFAULT_FIND_ATTEMPTS;
                        })))
                            .subscribe((/**
                         * @param {?} attempts
                         * @return {?}
                         */
                        function (attempts) {
                            _retriesReached$.next();
                            _retriesReached$.complete();
                            // if attempts have been reached, we check "skipIfNotFound" to move on to the next step
                            if (step.attachToOptions && step.attachToOptions.skipIfNotFound) {
                                // if we get to this step coming back from a step and it wasnt found
                                // then we either check if its the first step and try going forward
                                // or we keep going back until we find a step that actually exists
                                if (_backFlow) {
                                    if (((/** @type {?} */ (_this.shepherdTour))).steps.indexOf(_this.shepherdTour.getCurrentStep()) === 0) {
                                        _this.shepherdTour.next();
                                    }
                                    else {
                                        _this.shepherdTour.back();
                                    }
                                    _backFlow = false;
                                }
                                else {
                                    // destroys current step if we need to skip it to remove it from the tour
                                    /** @type {?} */
                                    var currentStep = _this.shepherdTour.getCurrentStep();
                                    currentStep.destroy();
                                    _this.shepherdTour.next();
                                    _this.shepherdTour.removeStep(((/** @type {?} */ (currentStep))).id);
                                }
                            }
                            else if (step.attachToOptions && step.attachToOptions.else) {
                                // if "skipIfNotFound" is not true, then we check if "else" has been set to jump to a specific step
                                _this.shepherdTour.show(step.attachToOptions.else);
                            }
                            else {
                                // tslint:disable-next-line:no-console
                                console.warn("Retries reached trying to find " + id + ". Retried  " + attempts + " times.");
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
                        function () {
                            /** @type {?} */
                            var element = document.querySelector(id);
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
                        function () {
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
                        function () {
                            resolve();
                        }));
                    }
                }));
            });
        }));
        return steps;
    };
    /**
     * @private
     * @param {?} eventOn
     * @param {?} eventOnOptions
     * @param {?} event$
     * @param {?} destroyedEvent$
     * @return {?}
     */
    CovalentGuidedTour.prototype._bindEvent = /**
     * @private
     * @param {?} eventOn
     * @param {?} eventOnOptions
     * @param {?} event$
     * @param {?} destroyedEvent$
     * @return {?}
     */
    function (eventOn, eventOnOptions, event$, destroyedEvent$) {
        /** @type {?} */
        var selector = eventOn.selector;
        /** @type {?} */
        var event = eventOn.event;
        // we start a timer of attempts to find an element in the dom
        /** @type {?} */
        var timerSubs = timer((eventOnOptions && eventOnOptions.timeBeforeShow) || SHEPHERD_DEFAULT_FIND_TIME_BEFORE_SHOW, (eventOnOptions && eventOnOptions.interval) || SHEPHERD_DEFAULT_FIND_INTERVAL)
            .pipe(takeUntil(destroyedEvent$))
            .subscribe((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var element = document.querySelector(selector);
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
                    var mainEvent = event.split('.')[0];
                    /** @type {?} */
                    var subEvent_1 = event.split('.')[1];
                    fromEvent(element, mainEvent)
                        .pipe(takeUntil(merge(event$.asObservable(), destroyedEvent$)), filter((/**
                     * @param {?} $event
                     * @return {?}
                     */
                    function ($event) {
                        // only trigger if the event is a keyboard event and part of out list
                        if ($event instanceof KeyboardEvent) {
                            if (keyEvents.get($event.keyCode) === subEvent_1) {
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
                    function () {
                        event$.next();
                        event$.complete();
                    }));
                }
                else if (event === ITourEvent.removed) {
                    // and we will use MutationObserver for DOM events
                    /** @type {?} */
                    var observer_1 = new MutationObserver((/**
                     * @return {?}
                     */
                    function () {
                        if (!document.body.contains(element)) {
                            event$.next();
                            event$.complete();
                            observer_1.disconnect();
                        }
                    }));
                    // stop listenining if tour is closed
                    destroyedEvent$.subscribe((/**
                     * @return {?}
                     */
                    function () {
                        observer_1.disconnect();
                    }));
                    // observe for any DOM interaction in the element
                    observer_1.observe(element, { childList: true, subtree: true, attributes: true });
                }
            }
        }));
    };
    return CovalentGuidedTour;
}(TourButtonsActions));
export { CovalentGuidedTour };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFnQixTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztJQU16RSxTQUFVLE9BQU87SUFDakIsZUFBZ0IsYUFBYTtJQUM3QixTQUFVLE9BQU87SUFDakIsU0FBVSxPQUFPO0lBQ2pCLFdBQVksU0FBUzs7Ozs7O0FBR3ZCLGtDQUdDOzs7SUFGQyxnQ0FBa0I7O0lBQ2xCLDZCQUFnQzs7Ozs7QUFHbEMseUNBR0M7OztJQUZDLDZDQUF3Qjs7SUFDeEIsdUNBQWtCOzs7OztBQUdwQixrQ0FBcUQ7Ozs7QUFFckQsa0NBRUM7OztJQURDLCtCQUF5Qjs7Ozs7QUFHM0IsOENBTUM7OztJQUxDLDZDQUFvQjs7SUFDcEIsMkNBQWlCOztJQUNqQixrREFBeUI7O0lBQ3pCLHdDQUFjOztJQUNkLDRDQUFrQjs7Ozs7QUFHcEIsd0NBQTJEOzs7O0FBRTNELCtDQUdDOzs7SUFGQywyQ0FBZ0I7O0lBQ2hCLGdEQUFzQjs7Ozs7QUFHeEIsK0JBS0M7OztJQUpDLG9DQUEyQzs7SUFDM0MscUNBQTZDOztJQUM3Qyw4QkFBNEQ7O0lBQzVELDRCQUF5Qjs7Ozs7QUFHM0I7Ozs7SUFBQTtJQVFBLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDOzs7Ozs7SUFQQyxvREFBc0I7Ozs7O0lBRXRCLG9EQUFzQjs7Ozs7SUFFdEIsc0RBQXdCOzs7OztJQUV4QixzREFB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QXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoZXBoZXJkIGZyb20gJ3NoZXBoZXJkLmpzJztcbmltcG9ydCB7IHRpbWVyLCBTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBTdWJzY3JpcHRpb24sIGZyb21FdmVudCwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgc2tpcFdoaWxlLCBmaWx0ZXIsIHNraXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgdHlwZSBUb3VyU3RlcCA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM7XG5leHBvcnQgdHlwZSBUb3VyU3RlcEJ1dHRvbiA9IFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnNCdXR0b247XG5cbmV4cG9ydCBlbnVtIElUb3VyRXZlbnQge1xuICAnY2xpY2snID0gJ2NsaWNrJyxcbiAgJ3BvaW50ZXJvdmVyJyA9ICdwb2ludGVyb3ZlcicsXG4gICdrZXl1cCcgPSAna2V5dXAnLFxuICAnYWRkZWQnID0gJ2FkZGVkJywgLy8gYWRkZWQgdG8gRE9NXG4gICdyZW1vdmVkJyA9ICdyZW1vdmVkJywgLy8gcmVtb3ZlZCBmcm9tIERPTVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbiB7XG4gIHNlbGVjdG9yPzogc3RyaW5nOyAvLyBjc3Mgc2VsZWN0b3JcbiAgZXZlbnQ/OiBrZXlvZiB0eXBlb2YgSVRvdXJFdmVudDsgLy8gY2xpY2ssIHBvaW50ZXJvdmVyLCBrZXl1cCwgYWRkZWQsIHJlbW92ZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAgdGltZUJlZm9yZVNob3c/OiBudW1iZXI7IC8vIGRlbGF5IGJlZm9yZSBzdGVwIGlzIGRpc3BsYXllZFxuICBpbnRlcnZhbD86IG51bWJlcjsgLy8gdGltZSBiZXR3ZWVuIHNlYXJjaGVzIGZvciBlbGVtZW50LCBkZWZhdWx0cyB0byA1MDBtc1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyQWJvcnRPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyT3B0aW9ucyBleHRlbmRzIFNoZXBoZXJkLlRvdXIuVG91ck9wdGlvbnMge1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107IC8vIGV2ZW50cyB0byBhYm9ydCBvblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucyBleHRlbmRzIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xuICByZXRyaWVzPzogbnVtYmVyOyAvLyAjIG51bSBvZiBhdHRlbXB0cyB0byBmaW5kIGVsZW1lbnRcbiAgc2tpcElmTm90Rm91bmQ/OiBib29sZWFuOyAvLyBpZiBlbGVtZW50IGlzIG5vdCBmb3VuZCBhZnRlciBuIHJldHJpZXMsIG1vdmUgb24gdG8gbmV4dCBzdGVwXG4gIGVsc2U/OiBzdHJpbmc7IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kLCBnbyB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBnb0JhY2tUbz86IHN0cmluZzsgLy8gYmFjayBidXR0b24gZ29lcyBiYWNrIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQWR2YW5jZU9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQWR2YW5jZU9uT3B0aW9ucyBleHRlbmRzIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICBqdW1wVG8/OiBzdHJpbmc7IC8vIG5leHQgYnV0dG9uIHdpbGwganVtcCB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBhbGxvd0dvQmFjaz86IGJvb2xlYW47IC8vIGFsbG93IGJhY2sgd2l0aGluIHRoaXMgc3RlcFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcCBleHRlbmRzIFRvdXJTdGVwIHtcbiAgYXR0YWNoVG9PcHRpb25zPzogSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zO1xuICBhZHZhbmNlT25PcHRpb25zPzogSVRvdXJTdGVwQWR2YW5jZU9uT3B0aW9ucztcbiAgYWR2YW5jZU9uPzogSVRvdXJTdGVwQWR2YW5jZU9uW10gfCBJVG91clN0ZXBBZHZhbmNlT24gfCBhbnk7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgVG91ckJ1dHRvbnNBY3Rpb25zIHtcbiAgYWJzdHJhY3QgbmV4dCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcblxuICBhYnN0cmFjdCBjYW5jZWwoKTogdm9pZDtcblxuICBhYnN0cmFjdCBmaW5pc2goKTogdm9pZDtcbn1cblxuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1c6IG51bWJlciA9IDEwMDtcbmNvbnN0IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTDogbnVtYmVyID0gNTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTOiBudW1iZXIgPSAyMDtcblxuY29uc3Qgb3ZlcnJpZGRlbkV2ZW50czogc3RyaW5nW10gPSBbXG4gIElUb3VyRXZlbnQuY2xpY2ssXG4gIElUb3VyRXZlbnQucG9pbnRlcm92ZXIsXG4gIElUb3VyRXZlbnQucmVtb3ZlZCxcbiAgSVRvdXJFdmVudC5hZGRlZCxcbiAgSVRvdXJFdmVudC5rZXl1cCxcbl07XG5cbmNvbnN0IGtleUV2ZW50czogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KFtcbiAgWzEzLCAnZW50ZXInXSxcbiAgWzI3LCAnZXNjJ10sXG5dKTtcblxuY29uc3QgZGVmYXVsdFN0ZXBPcHRpb25zOiBUb3VyU3RlcCA9IHtcbiAgc2Nyb2xsVG86IHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicgfSxcbiAgY2FuY2VsSWNvbjoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gIH0sXG59O1xuXG5jb25zdCBNQVRfSUNPTl9CVVRUT046IHN0cmluZyA9ICdtYXQtaWNvbi1idXR0b24gbWF0ZXJpYWwtaWNvbnMgbWF0LWJ1dHRvbi1iYXNlJztcbmNvbnN0IE1BVF9CVVRUT046IHN0cmluZyA9ICdtYXQtYnV0dG9uLWJhc2UgbWF0LWJ1dHRvbic7XG5cbmV4cG9ydCBjbGFzcyBDb3ZhbGVudEd1aWRlZFRvdXIgZXh0ZW5kcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBwcml2YXRlIF9kZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD47XG5cbiAgc2hlcGhlcmRUb3VyOiBTaGVwaGVyZC5Ub3VyO1xuICBzdGVwT3B0aW9uczogSVRvdXJTdGVwO1xuXG4gIGNvbnN0cnVjdG9yKHN0ZXBPcHRpb25zOiBJVG91clN0ZXAgPSBkZWZhdWx0U3RlcE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGVwT3B0aW9ucyA9IHN0ZXBPcHRpb25zO1xuICAgIHRoaXMubmV3VG91cigpO1xuICB9XG5cbiAgbmV3VG91cihvcHRzPzogSVRvdXJPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIgPSBuZXcgU2hlcGhlcmQuVG91cihcbiAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHtcbiAgICAgICAgICBkZWZhdWx0U3RlcE9wdGlvbnM6IHRoaXMuc3RlcE9wdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdHMsXG4gICAgICApLFxuICAgICk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8vIGxpc3RlbiB0byBjYW5jZWwgYW5kIGNvbXBsZXRlIHRvIGNsZWFuIHVwIGFib3J0T24gZXZlbnRzXG4gICAgbWVyZ2UoZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY2FuY2VsJyksIGZyb21FdmVudCh0aGlzLnNoZXBoZXJkVG91ciwgJ2NvbXBsZXRlJykpXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgaWYgKG9wdHMgJiYgb3B0cy5hYm9ydE9uKSB7XG4gICAgICBjb25zdCBhYm9ydEFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgb3B0cy5hYm9ydE9uLmZvckVhY2goKGFib3J0T246IElUb3VyQWJvcnRPbikgPT4ge1xuICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgIGFib3J0QXJyJC5wdXNoKGFib3J0RXZlbnQkKTtcbiAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFib3J0T24sIHVuZGVmaW5lZCwgYWJvcnRFdmVudCQsIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWJvcnRTdWJzOiBTdWJzY3JpcHRpb24gPSBtZXJnZSguLi5hYm9ydEFyciQpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWRFdmVudCQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgIGFib3J0U3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgfVxuXG4gIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5jYW5jZWwoKTtcbiAgfVxuXG4gIG5leHQoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICB9XG5cbiAgZmluaXNoKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBhZGRTdGVwcyhzdGVwczogSVRvdXJTdGVwW10pOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5hZGRTdGVwcyh0aGlzLl9wcmVwYXJlVG91cihzdGVwcykpO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuc3RhcnQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJlcGFyZVRvdXIob3JpZ2luYWxTdGVwczogSVRvdXJTdGVwW10pOiBJVG91clN0ZXBbXSB7XG4gICAgLy8gY3JlYXRlIFN1YmplY3RzIGZvciBiYWNrIGFuZCBmb3J3YXJkIGV2ZW50c1xuICAgIGNvbnN0IGJhY2tFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGNvbnN0IGZvcndhcmRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGxldCBfYmFja0Zsb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBjcmVhdGUgU3ViamVjdCBmb3IgeW91ciBlbmRcbiAgICBjb25zdCBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgc3RlcCBwcm9ncmVzcyBpbiB0aGUgZm9vdGVyIG9mIHRoZSBzaGVwaGVyZCB0b29sdGlwXG4gICAgICovXG4gICAgY29uc3QgYXBwZW5kUHJvZ3Jlc3NGdW5jOiBGdW5jdGlvbiA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgIC8vIGdldCBzdGVwIGluZGV4IG9mIGN1cnJlbnQgc3RlcFxuICAgICAgY29uc3Qgc3RlcEluZGV4OiBudW1iZXIgPSB0aGlzLnNoZXBoZXJkVG91ci5zdGVwcy5pbmRleE9mKHRoaXMuc2hlcGhlcmRUb3VyLmN1cnJlbnRTdGVwKTtcbiAgICAgIC8vIGdldCBhbGwgdGhlIGZvb3RlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGZvb3RlcnM6IEVsZW1lbnRbXSA9IEFycmF5LmZyb208RWxlbWVudD4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNoZXBoZXJkLWZvb3RlcicpKTtcbiAgICAgIC8vIGdldCB0aGUgbGFzdCBmb290ZXIgc2luY2UgU2hlcGhlcmQgYWx3YXlzIHB1dHMgdGhlIGFjdGl2ZSBvbmUgYXQgdGhlIGVuZFxuICAgICAgY29uc3QgZm9vdGVyOiBFbGVtZW50ID0gZm9vdGVyc1tmb290ZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gZ2VuZXJhdGUgc3RlcHMgaHRtbCBlbGVtZW50XG4gICAgICBjb25zdCBwcm9ncmVzczogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvZ3Jlc3MuY2xhc3NOYW1lID0gJ3NoZXBoZXJkLXByb2dyZXNzJztcbiAgICAgIHByb2dyZXNzLmlubmVyVGV4dCA9IGAke3N0ZXBJbmRleCArIDF9LyR7dGhpcy5zaGVwaGVyZFRvdXIuc3RlcHMubGVuZ3RofWA7XG4gICAgICAvLyBpbnNlcnQgaW50byB0aGUgZm9vdGVyIGJlZm9yZSB0aGUgZmlyc3QgYnV0dG9uXG4gICAgICBmb290ZXIuaW5zZXJ0QmVmb3JlKHByb2dyZXNzLCBmb290ZXIucXVlcnlTZWxlY3RvcignLnNoZXBoZXJkLWJ1dHRvbicpKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RlcHM6IElUb3VyU3RlcFtdID0gb3JpZ2luYWxTdGVwcy5tYXAoKHN0ZXA6IElUb3VyU3RlcCkgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0ZXAsIHtcbiAgICAgICAgd2hlbjoge1xuICAgICAgICAgIHNob3c6IGFwcGVuZFByb2dyZXNzRnVuYy5iaW5kKHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgdGV4dDogJ2ZpbmlzaCcsXG4gICAgICBhY3Rpb246IHRoaXNbJ2ZpbmlzaCddLmJpbmQodGhpcyksXG4gICAgICBjbGFzc2VzOiBNQVRfQlVUVE9OLFxuICAgIH07XG4gICAgY29uc3QgZGlzbWlzc0J1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICB0ZXh0OiAnY2FuY2VsIHRvdXInLFxuICAgICAgYWN0aW9uOiB0aGlzWydjYW5jZWwnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuXG4gICAgLy8gbGlzdGVuIHRvIHRoZSBkZXN0cm95ZWQgZXZlbnQgdG8gY2xlYW4gdXAgYWxsIHRoZSBzdHJlYW1zXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGJhY2tFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGZvcndhcmRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICBkZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsU3RlcHM6IG51bWJlciA9IHN0ZXBzLmxlbmd0aDtcbiAgICBzdGVwcy5mb3JFYWNoKChzdGVwOiBJVG91clN0ZXAsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIC8vIGNyZWF0ZSBidXR0b25zIHNwZWNpZmljIGZvciB0aGUgc3RlcFxuICAgICAgLy8gdGhpcyBpcyBkb25lIHRvIGNyZWF0ZSBtb3JlIGNvbnRyb2wgb24gZXZlbnRzXG4gICAgICBjb25zdCBuZXh0QnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fcmlnaHQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIG5leHQgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuICAgICAgY29uc3QgYmFja0J1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICAgIHRleHQ6ICdjaGV2cm9uX2xlZnQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIGJhY2sgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgYmFja0V2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgX2JhY2tGbG93ID0gdHJ1ZTtcbiAgICAgICAgICAvLyBjaGVjayBpZiAnZ29CYWNrVG8nIGlzIHNldCB0byBqdW1wIHRvIGEgcGFydGljdWxhciBzdGVwLCBlbHNlIGp1c3QgZ28gYmFja1xuICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbykge1xuICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbywgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuXG4gICAgICAvLyBjaGVjayBpZiBoaWdobGlnaHQgd2FzIHByb3ZpZGVkIGZvciB0aGUgc3RlcCwgZWxzZSBmYWxsYmFjayBpbnRvIHNoZXBoZXJkcyB1c2FnZVxuICAgICAgc3RlcC5oaWdobGlnaHRDbGFzcyA9XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmhpZ2hsaWdodCA/ICdzaGVwaGVyZC1oaWdobGlnaHQnIDogc3RlcC5oaWdobGlnaHRDbGFzcztcblxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIC8vIGZpcnN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW25leHRCdXR0b25dO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdG90YWxTdGVwcyAtIDEpIHtcbiAgICAgICAgLy8gbGFzdCBzdGVwXG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtiYWNrQnV0dG9uLCBmaW5pc2hCdXR0b25dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIG5leHRCdXR0b25dO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGVja3MgXCJhZHZhbmNlT25cIiB0byBvdmVycmlkZSBsaXN0ZW5lcnNcbiAgICAgIGxldCBhZHZhbmNlT246IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uID0gc3RlcC5hZHZhbmNlT247XG4gICAgICAvLyByZW1vdmUgdGhlIHNoZXBoZXJkIFwiYWR2YW5jZU9uXCIgaW5mYXZvciBvZiBvdXJzIGlmIHRoZSBldmVudCBpcyBwYXJ0IG9mIG91ciBsaXN0XG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgYWR2YW5jZU9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikgJiZcbiAgICAgICAgICBvdmVycmlkZGVuRXZlbnRzLmluZGV4T2YoYWR2YW5jZU9uLmV2ZW50LnNwbGl0KCcuJylbMF0pID4gLTEpIHx8XG4gICAgICAgIGFkdmFuY2VPbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICApIHtcbiAgICAgICAgc3RlcC5hZHZhbmNlT24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9XG4gICAgICAgICAgc3RlcC5hZHZhbmNlT25PcHRpb25zICYmIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5hbGxvd0dvQmFjayA/IFtiYWNrQnV0dG9uLCBkaXNtaXNzQnV0dG9uXSA6IFtkaXNtaXNzQnV0dG9uXTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZHMgYSBkZWZhdWx0IGJlZm9yZVNob3dQcm9taXNlIGZ1bmN0aW9uXG4gICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXA6IEZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFkdmFuY2VPbiAmJiAhc3RlcC5hZHZhbmNlT24pIHtcbiAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlT24gPSBbYWR2YW5jZU9uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgYWR2YW5jZU9uLmZvckVhY2goKF86IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWR2YW5jZUFyciQucHVzaChhZHZhbmNlRXZlbnQkKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFkdmFuY2VPbltpXSwgc3RlcC5hZHZhbmNlT25PcHRpb25zLCBhZHZhbmNlRXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZVN1YnM6IFN1YnNjcmlwdGlvbiA9IGZvcmtKb2luKC4uLmFkdmFuY2VBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYWR2YW5jZSB0byBhIHNwZWNpZmljIHN0ZXAsIGVsc2UgYWR2YW5jZSB0byBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5qdW1wVG8pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBhZHZhbmNlU3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQgb24gdGhlIHN0ZXAsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgICAgICAgICBpZiAoc3RlcC5hYm9ydE9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICAgICAgICAgIHN0ZXAuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkLCBiYWNrRXZlbnQkLCBmb3J3YXJkRXZlbnQkKSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IF9zdG9wVGltZXIkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cmllc1JlYWNoZWQkOiBTdWJqZWN0PG51bWJlcj4gPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gICAgICAgICAgY29uc3QgX3JldHJ5QXR0ZW1wdHMkOiBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigtMSk7XG5cbiAgICAgICAgICBsZXQgaWQ6IHN0cmluZztcbiAgICAgICAgICAvLyBjaGVja3MgaWYgXCJhdHRhY2hUb1wiIGlzIGEgc3RyaW5nIG9yIGFuIG9iamVjdCB0byBnZXQgdGhlIGlkIG9mIGFuIGVsZW1lbnRcbiAgICAgICAgICBpZiAodHlwZW9mIHN0ZXAuYXR0YWNoVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZCA9IHN0ZXAuYXR0YWNoVG87XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0ZXAuYXR0YWNoVG8uZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUby5lbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFuIGlkIGFzIGEgc3RyaW5nIGluIGVpdGhlciBjYXNlLCB3ZSB1c2UgaXQgKHdlIGlnbm9yZSBpdCBpZiBpdHMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAvLyBpZiBjdXJyZW50IHN0ZXAgaXMgdGhlIGZpcnN0IHN0ZXAgb2YgdGhlIHRvdXIsIHdlIHNldCB0aGUgYnV0dG9ucyB0byBiZSBvbmx5IFwibmV4dFwiIG9yIFwiZGlzbWlzc1wiXG4gICAgICAgICAgICAvLyB3ZSBoYWQgdG8gdXNlIGBhbnlgIHNpbmNlIHRoZSB0b3VyIGRvZXNudCBleHBvc2UgdGhlIHN0ZXBzIGluIGFueSBmYXNoaW9uIG5vciBhIHdheSB0byBjaGVjayBpZiB3ZSBoYXZlIG1vZGlmaWVkIHRoZW0gYXQgYWxsXG4gICAgICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSA9PT0gKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzWzBdKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkudXBkYXRlU3RlcE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IG9yaWdpbmFsU3RlcHNbaW5kZXhdLmFkdmFuY2VPbiA/IFtkaXNtaXNzQnV0dG9uXSA6IFtuZXh0QnV0dG9uXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWdpc3RlciB0byB0aGUgYXR0ZW1wdHMgb2JzZXJ2YWJsZSB0byBub3RpZnkgZGVldmVsb3BlciB3aGVuIG51bWJlciBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICBfcmV0cnlBdHRlbXB0cyRcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQuYXNPYnNlcnZhYmxlKCksIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICAgIHNraXBXaGlsZSgodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA8IHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXM7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGF0dGVtcHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0ZW1wdHMgaGF2ZSBiZWVuIHJlYWNoZWQsIHdlIGNoZWNrIFwic2tpcElmTm90Rm91bmRcIiB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuc2tpcElmTm90Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGdldCB0byB0aGlzIHN0ZXAgY29taW5nIGJhY2sgZnJvbSBhIHN0ZXAgYW5kIGl0IHdhc250IGZvdW5kXG4gICAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIGVpdGhlciBjaGVjayBpZiBpdHMgdGhlIGZpcnN0IHN0ZXAgYW5kIHRyeSBnb2luZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgICAvLyBvciB3ZSBrZWVwIGdvaW5nIGJhY2sgdW50aWwgd2UgZmluZCBhIHN0ZXAgdGhhdCBhY3R1YWxseSBleGlzdHNcbiAgICAgICAgICAgICAgICAgIGlmIChfYmFja0Zsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCg8YW55PnRoaXMuc2hlcGhlcmRUb3VyKS5zdGVwcy5pbmRleE9mKHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYmFja0Zsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3lzIGN1cnJlbnQgc3RlcCBpZiB3ZSBuZWVkIHRvIHNraXAgaXQgdG8gcmVtb3ZlIGl0IGZyb20gdGhlIHRvdXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFN0ZXA6IFNoZXBoZXJkLlN0ZXAgPSB0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RlcC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIucmVtb3ZlU3RlcCgoPFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM+Y3VycmVudFN0ZXApLmlkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIFwic2tpcElmTm90Rm91bmRcIiBpcyBub3QgdHJ1ZSwgdGhlbiB3ZSBjaGVjayBpZiBcImVsc2VcIiBoYXMgYmVlbiBzZXQgdG8ganVtcCB0byBhIHNwZWNpZmljIHN0ZXBcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFJldHJpZXMgcmVhY2hlZCB0cnlpbmcgdG8gZmluZCAke2lkfS4gUmV0cmllZCAgJHthdHRlbXB0c30gdGltZXMuYCk7XG4gICAgICAgICAgICAgICAgICAvLyBlbHNlIHdlIHNob3cgdGhlIHN0ZXAgcmVnYXJkbGVzc1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gdGhlIHRpbWVyIHdpbGwgY29udGludWUgZWl0aGVyIHVudGlsIHdlIGZpbmQgdGhlIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBhdHRlbXB0cyBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKF9zdG9wVGltZXIkLCBfcmV0cmllc1JlYWNoZWQkLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENhcGFiaWxpdGllc1NldHVwKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJC5uZXh0KF9yZXRyeUF0dGVtcHRzJC52YWx1ZSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgZmluZCBpbnRlcnZhbCBpZiB1c2VyIHN0b3BzIHRoZSB0b3VyXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgX3N0b3BUaW1lciQubmV4dCgpO1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlc29sdmUgb2JzZXJ2YWJsZSB1bnRpbCB0aGUgdGltZUJlZm9yZVNob3cgaGFzIHBhc3NzZWQgb3IgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkKSkpXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0ZXBzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50KFxuICAgIGV2ZW50T246IElUb3VyRXZlbnRPbixcbiAgICBldmVudE9uT3B0aW9uczogSVRvdXJFdmVudE9uT3B0aW9ucyxcbiAgICBldmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICAgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3Rvcjogc3RyaW5nID0gZXZlbnRPbi5zZWxlY3RvcjtcbiAgICBjb25zdCBldmVudDogc3RyaW5nID0gZXZlbnRPbi5ldmVudDtcbiAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgY29uc3QgdGltZXJTdWJzOiBTdWJzY3JpcHRpb24gPSB0aW1lcihcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAoZXZlbnRPbk9wdGlvbnMgJiYgZXZlbnRPbk9wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwoZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgYmVlbiBmb3VuZCwgd2Ugc3RvcCB0aGUgdGltZXIgYW5kIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aW1lclN1YnMudW5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIGlmIChldmVudCA9PT0gSVRvdXJFdmVudC5hZGRlZCkge1xuICAgICAgICAgICAgLy8gaWYgZXZlbnQgaXMgXCJBZGRlZFwiIHRyaWdnZXIgYSBzb29uIGFzIHRoaXMgaXMgYXR0YWNoZWQuXG4gICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LmNsaWNrIHx8XG4gICAgICAgICAgICBldmVudCA9PT0gSVRvdXJFdmVudC5wb2ludGVyb3ZlciB8fFxuICAgICAgICAgICAgZXZlbnQuaW5kZXhPZihJVG91ckV2ZW50LmtleXVwKSA+IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB3ZSB1c2Ugbm9ybWFsIGxpc3RlbmVycyBmb3IgbW91c2VldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG1haW5FdmVudDogc3RyaW5nID0gZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsIG1haW5FdmVudClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKGV2ZW50JC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgkZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBvbmx5IHRyaWdnZXIgaWYgdGhlIGV2ZW50IGlzIGEga2V5Ym9hcmQgZXZlbnQgYW5kIHBhcnQgb2Ygb3V0IGxpc3RcbiAgICAgICAgICAgICAgICAgIGlmICgkZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlFdmVudHMuZ2V0KCRldmVudC5rZXlDb2RlKSA9PT0gc3ViRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICAgIC8vIGFuZCB3ZSB3aWxsIHVzZSBNdXRhdGlvbk9ic2VydmVyIGZvciBET00gZXZlbnRzXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGxpc3RlbmluaW5nIGlmIHRvdXIgaXMgY2xvc2VkXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBvYnNlcnZlIGZvciBhbnkgRE9NIGludGVyYWN0aW9uIGluIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==