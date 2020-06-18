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
            progress.innerText = this.shepherdTour.currentStep.options.count + "/" + stepTotal;
            // insert into the footer before the first button
            footer.insertBefore(progress, footer.querySelector('.shepherd-button'));
        });
        /** @type {?} */
        var stepTotal = 0;
        /** @type {?} */
        var steps = originalSteps.map((/**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            var _a, _b, _c;
            /** @type {?} */
            var showProgress;
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
                showProgress = appendProgressFunc.bind(_this);
            }
            return Object.assign({}, step, {
                when: {
                    show: showProgress,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFnQixTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztJQU16RSxTQUFVLE9BQU87SUFDakIsZUFBZ0IsYUFBYTtJQUM3QixTQUFVLE9BQU87SUFDakIsU0FBVSxPQUFPO0lBQ2pCLFdBQVksU0FBUzs7Ozs7O0FBR3ZCLGtDQUdDOzs7SUFGQyxnQ0FBa0I7O0lBQ2xCLDZCQUFnQzs7Ozs7QUFHbEMseUNBR0M7OztJQUZDLDZDQUF3Qjs7SUFDeEIsdUNBQWtCOzs7OztBQUdwQixrQ0FBcUQ7Ozs7QUFFckQsa0NBRUM7OztJQURDLCtCQUF5Qjs7Ozs7QUFHM0IsOENBT0M7OztJQU5DLDZDQUFvQjs7SUFDcEIsMkNBQWlCOztJQUNqQixrREFBeUI7O0lBQ3pCLHdDQUFjOztJQUNkLDRDQUFrQjs7SUFDbEIscURBQTRCOzs7OztBQUc5Qix3Q0FBMkQ7Ozs7QUFFM0QsK0NBR0M7OztJQUZDLDJDQUFnQjs7SUFDaEIsZ0RBQXNCOzs7OztBQUd4QiwrQkFNQzs7O0lBTEMsb0NBQTJDOztJQUMzQyxxQ0FBNkM7O0lBQzdDLDhCQUE0RDs7SUFDNUQsNEJBQXlCOztJQUN6QiwwQkFBZTs7Ozs7QUFHakI7Ozs7SUFBQTtJQVFBLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDOzs7Ozs7SUFQQyxvREFBc0I7Ozs7O0lBRXRCLG9EQUFzQjs7Ozs7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b0JBQ3hCLENBQUMsRUFBQyxDQUFDO29CQUNILGlEQUFpRDtvQkFDakQsVUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2pGO2FBQ0Y7UUFDSCxDQUFDLEVBQUM7SUFDTixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBdGFELENBQXdDLGtCQUFrQixHQXNhekQ7Ozs7Ozs7SUFyYUMsOENBQXdDOztJQUV4QywwQ0FBNEI7O0lBQzVCLHlDQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGVwaGVyZCBmcm9tICdzaGVwaGVyZC5qcyc7XG5pbXBvcnQgeyB0aW1lciwgU3ViamVjdCwgQmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgU3Vic2NyaXB0aW9uLCBmcm9tRXZlbnQsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHNraXBXaGlsZSwgZmlsdGVyLCBza2lwLCBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IHR5cGUgVG91clN0ZXAgPSBTaGVwaGVyZC5TdGVwLlN0ZXBPcHRpb25zO1xuZXhwb3J0IHR5cGUgVG91clN0ZXBCdXR0b24gPSBTaGVwaGVyZC5TdGVwLlN0ZXBPcHRpb25zQnV0dG9uO1xuXG5leHBvcnQgZW51bSBJVG91ckV2ZW50IHtcbiAgJ2NsaWNrJyA9ICdjbGljaycsXG4gICdwb2ludGVyb3ZlcicgPSAncG9pbnRlcm92ZXInLFxuICAna2V5dXAnID0gJ2tleXVwJyxcbiAgJ2FkZGVkJyA9ICdhZGRlZCcsIC8vIGFkZGVkIHRvIERPTVxuICAncmVtb3ZlZCcgPSAncmVtb3ZlZCcsIC8vIHJlbW92ZWQgZnJvbSBET01cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ckV2ZW50T24ge1xuICBzZWxlY3Rvcj86IHN0cmluZzsgLy8gY3NzIHNlbGVjdG9yXG4gIGV2ZW50Pzoga2V5b2YgdHlwZW9mIElUb3VyRXZlbnQ7IC8vIGNsaWNrLCBwb2ludGVyb3Zlciwga2V5dXAsIGFkZGVkLCByZW1vdmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIHRpbWVCZWZvcmVTaG93PzogbnVtYmVyOyAvLyBkZWxheSBiZWZvcmUgc3RlcCBpcyBkaXNwbGF5ZWRcbiAgaW50ZXJ2YWw/OiBudW1iZXI7IC8vIHRpbWUgYmV0d2VlbiBzZWFyY2hlcyBmb3IgZWxlbWVudCwgZGVmYXVsdHMgdG8gNTAwbXNcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ckFib3J0T24gZXh0ZW5kcyBJVG91ckV2ZW50T24ge31cblxuZXhwb3J0IGludGVyZmFjZSBJVG91ck9wdGlvbnMgZXh0ZW5kcyBTaGVwaGVyZC5Ub3VyLlRvdXJPcHRpb25zIHtcbiAgYWJvcnRPbj86IElUb3VyQWJvcnRPbltdOyAvLyBldmVudHMgdG8gYWJvcnQgb25cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXBBdHRhY2hUb09wdGlvbnMgZXh0ZW5kcyBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAgaGlnaGxpZ2h0PzogYm9vbGVhbjtcbiAgcmV0cmllcz86IG51bWJlcjsgLy8gIyBudW0gb2YgYXR0ZW1wdHMgdG8gZmluZCBlbGVtZW50XG4gIHNraXBJZk5vdEZvdW5kPzogYm9vbGVhbjsgLy8gaWYgZWxlbWVudCBpcyBub3QgZm91bmQgYWZ0ZXIgbiByZXRyaWVzLCBtb3ZlIG9uIHRvIG5leHQgc3RlcFxuICBlbHNlPzogc3RyaW5nOyAvLyBpZiBlbGVtZW50IGlzIG5vdCBmb3VuZCwgZ28gdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgZ29CYWNrVG8/OiBzdHJpbmc7IC8vIGJhY2sgYnV0dG9uIGdvZXMgYmFjayB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBza2lwRnJvbVN0ZXBDb3VudD86IGJvb2xlYW47IC8vIHNob3cvaGlkZSBwcm9ncmVzcyBvbiBzdGVwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQWR2YW5jZU9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQWR2YW5jZU9uT3B0aW9ucyBleHRlbmRzIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICBqdW1wVG8/OiBzdHJpbmc7IC8vIG5leHQgYnV0dG9uIHdpbGwganVtcCB0byBzdGVwIHdpdGggdGhpcyBpZFxuICBhbGxvd0dvQmFjaz86IGJvb2xlYW47IC8vIGFsbG93IGJhY2sgd2l0aGluIHRoaXMgc3RlcFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcCBleHRlbmRzIFRvdXJTdGVwIHtcbiAgYXR0YWNoVG9PcHRpb25zPzogSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zO1xuICBhZHZhbmNlT25PcHRpb25zPzogSVRvdXJTdGVwQWR2YW5jZU9uT3B0aW9ucztcbiAgYWR2YW5jZU9uPzogSVRvdXJTdGVwQWR2YW5jZU9uW10gfCBJVG91clN0ZXBBZHZhbmNlT24gfCBhbnk7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTtcbiAgY291bnQ/OiBudW1iZXI7XG59XG5cbmFic3RyYWN0IGNsYXNzIFRvdXJCdXR0b25zQWN0aW9ucyB7XG4gIGFic3RyYWN0IG5leHQoKTogdm9pZDtcblxuICBhYnN0cmFjdCBiYWNrKCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgY2FuY2VsKCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgZmluaXNoKCk6IHZvaWQ7XG59XG5cbmNvbnN0IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XOiBudW1iZXIgPSAxMDA7XG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfSU5URVJWQUw6IG51bWJlciA9IDUwMDtcbmNvbnN0IFNIRVBIRVJEX0RFRkFVTFRfRklORF9BVFRFTVBUUzogbnVtYmVyID0gMjA7XG5cbmNvbnN0IG92ZXJyaWRkZW5FdmVudHM6IHN0cmluZ1tdID0gW1xuICBJVG91ckV2ZW50LmNsaWNrLFxuICBJVG91ckV2ZW50LnBvaW50ZXJvdmVyLFxuICBJVG91ckV2ZW50LnJlbW92ZWQsXG4gIElUb3VyRXZlbnQuYWRkZWQsXG4gIElUb3VyRXZlbnQua2V5dXAsXG5dO1xuXG5jb25zdCBrZXlFdmVudHM6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwPG51bWJlciwgc3RyaW5nPihbXG4gIFsxMywgJ2VudGVyJ10sXG4gIFsyNywgJ2VzYyddLFxuXSk7XG5cbmNvbnN0IGRlZmF1bHRTdGVwT3B0aW9uczogVG91clN0ZXAgPSB7XG4gIHNjcm9sbFRvOiB7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0sXG4gIGNhbmNlbEljb246IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICB9LFxufTtcblxuY29uc3QgTUFUX0lDT05fQlVUVE9OOiBzdHJpbmcgPSAnbWF0LWljb24tYnV0dG9uIG1hdGVyaWFsLWljb25zIG1hdC1idXR0b24tYmFzZSc7XG5jb25zdCBNQVRfQlVUVE9OOiBzdHJpbmcgPSAnbWF0LWJ1dHRvbi1iYXNlIG1hdC1idXR0b24nO1xuXG5leHBvcnQgY2xhc3MgQ292YWxlbnRHdWlkZWRUb3VyIGV4dGVuZHMgVG91ckJ1dHRvbnNBY3Rpb25zIHtcbiAgcHJpdmF0ZSBfZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+O1xuXG4gIHNoZXBoZXJkVG91cjogU2hlcGhlcmQuVG91cjtcbiAgc3RlcE9wdGlvbnM6IElUb3VyU3RlcDtcblxuICBjb25zdHJ1Y3RvcihzdGVwT3B0aW9uczogSVRvdXJTdGVwID0gZGVmYXVsdFN0ZXBPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RlcE9wdGlvbnMgPSBzdGVwT3B0aW9ucztcbiAgICB0aGlzLm5ld1RvdXIoKTtcbiAgfVxuXG4gIG5ld1RvdXIob3B0cz86IElUb3VyT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyID0gbmV3IFNoZXBoZXJkLlRvdXIoXG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgZGVmYXVsdFN0ZXBPcHRpb25zOiB0aGlzLnN0ZXBPcHRpb25zLFxuICAgICAgICB9LFxuICAgICAgICBvcHRzLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAvLyBsaXN0ZW4gdG8gY2FuY2VsIGFuZCBjb21wbGV0ZSB0byBjbGVhbiB1cCBhYm9ydE9uIGV2ZW50c1xuICAgIG1lcmdlKGZyb21FdmVudCh0aGlzLnNoZXBoZXJkVG91ciwgJ2NhbmNlbCcpLCBmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjb21wbGV0ZScpKVxuICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQubmV4dCgpO1xuICAgICAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gaWYgYWJvcnRPbiB3YXMgcGFzc2VkLCB3ZSBiaW5kIHRoZSBldmVudCBhbmQgZXhlY3V0ZSBjb21wbGV0ZVxuICAgIGlmIChvcHRzICYmIG9wdHMuYWJvcnRPbikge1xuICAgICAgY29uc3QgYWJvcnRBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgIG9wdHMuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgY29uc3QgYWJvcnRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICBhYm9ydEFyciQucHVzaChhYm9ydEV2ZW50JCk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCB0aGlzLl9kZXN0cm95ZWRFdmVudCQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFib3J0U3ViczogU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uYWJvcnRBcnIkKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgICAgICAgICBhYm9ydFN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gIH1cblxuICBjYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY2FuY2VsKCk7XG4gIH1cblxuICBuZXh0KCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgfVxuXG4gIGZpbmlzaCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICB9XG5cbiAgYWRkU3RlcHMoc3RlcHM6IElUb3VyU3RlcFtdKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYWRkU3RlcHModGhpcy5fcHJlcGFyZVRvdXIoc3RlcHMpKTtcbiAgfVxuXG4gIHN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLnN0YXJ0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ByZXBhcmVUb3VyKG9yaWdpbmFsU3RlcHM6IElUb3VyU3RlcFtdKTogSVRvdXJTdGVwW10ge1xuICAgIC8vIGNyZWF0ZSBTdWJqZWN0cyBmb3IgYmFjayBhbmQgZm9yd2FyZCBldmVudHNcbiAgICBjb25zdCBiYWNrRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBjb25zdCBmb3J3YXJkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBsZXQgX2JhY2tGbG93OiBib29sZWFuID0gZmFsc2U7XG4gICAgLy8gY3JlYXRlIFN1YmplY3QgZm9yIHlvdXIgZW5kXG4gICAgY29uc3QgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGhlIHN0ZXAgcHJvZ3Jlc3MgaW4gdGhlIGZvb3RlciBvZiB0aGUgc2hlcGhlcmQgdG9vbHRpcFxuICAgICAqL1xuICAgIGNvbnN0IGFwcGVuZFByb2dyZXNzRnVuYzogRnVuY3Rpb24gPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgICAvLyBnZXQgYWxsIHRoZSBmb290ZXJzIHRoYXQgYXJlIGF2YWlsYWJsZSBpbiB0aGUgRE9NXG4gICAgICBjb25zdCBmb290ZXJzOiBFbGVtZW50W10gPSBBcnJheS5mcm9tPEVsZW1lbnQ+KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGVwaGVyZC1mb290ZXInKSk7XG4gICAgICAvLyBnZXQgdGhlIGxhc3QgZm9vdGVyIHNpbmNlIFNoZXBoZXJkIGFsd2F5cyBwdXRzIHRoZSBhY3RpdmUgb25lIGF0IHRoZSBlbmRcbiAgICAgIGNvbnN0IGZvb3RlcjogRWxlbWVudCA9IGZvb3RlcnNbZm9vdGVycy5sZW5ndGggLSAxXTtcbiAgICAgIC8vIGdlbmVyYXRlIHN0ZXBzIGh0bWwgZWxlbWVudFxuICAgICAgY29uc3QgcHJvZ3Jlc3M6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHByb2dyZXNzLmNsYXNzTmFtZSA9ICdzaGVwaGVyZC1wcm9ncmVzcyc7XG4gICAgICBwcm9ncmVzcy5pbm5lclRleHQgPSBgJHt0aGlzLnNoZXBoZXJkVG91ci5jdXJyZW50U3RlcC5vcHRpb25zLmNvdW50fS8ke3N0ZXBUb3RhbH1gO1xuICAgICAgLy8gaW5zZXJ0IGludG8gdGhlIGZvb3RlciBiZWZvcmUgdGhlIGZpcnN0IGJ1dHRvblxuICAgICAgZm9vdGVyLmluc2VydEJlZm9yZShwcm9ncmVzcywgZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoJy5zaGVwaGVyZC1idXR0b24nKSk7XG4gICAgfTtcblxuICAgIGxldCBzdGVwVG90YWw6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc3RlcHM6IElUb3VyU3RlcFtdID0gb3JpZ2luYWxTdGVwcy5tYXAoKHN0ZXA6IElUb3VyU3RlcCkgPT4ge1xuICAgICAgbGV0IHNob3dQcm9ncmVzczogRnVuY3Rpb247XG4gICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnM/LnNraXBGcm9tU3RlcENvdW50ID09PSB0cnVlKSB7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICBzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IGZhbHNlXG4gICAgICApIHtcbiAgICAgICAgc3RlcC5jb3VudCA9ICsrc3RlcFRvdGFsO1xuICAgICAgICBzaG93UHJvZ3Jlc3MgPSBhcHBlbmRQcm9ncmVzc0Z1bmMuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGVwLCB7XG4gICAgICAgIHdoZW46IHtcbiAgICAgICAgICBzaG93OiBzaG93UHJvZ3Jlc3MsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaEJ1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICB0ZXh0OiAnZmluaXNoJyxcbiAgICAgIGFjdGlvbjogdGhpc1snZmluaXNoJ10uYmluZCh0aGlzKSxcbiAgICAgIGNsYXNzZXM6IE1BVF9CVVRUT04sXG4gICAgfTtcbiAgICBjb25zdCBkaXNtaXNzQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6ICdjYW5jZWwgdG91cicsXG4gICAgICBhY3Rpb246IHRoaXNbJ2NhbmNlbCddLmJpbmQodGhpcyksXG4gICAgICBjbGFzc2VzOiBNQVRfQlVUVE9OLFxuICAgIH07XG5cbiAgICAvLyBsaXN0ZW4gdG8gdGhlIGRlc3Ryb3llZCBldmVudCB0byBjbGVhbiB1cCBhbGwgdGhlIHN0cmVhbXNcbiAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgYmFja0V2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZm9yd2FyZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxTdGVwczogbnVtYmVyID0gc3RlcHMubGVuZ3RoO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXA6IElUb3VyU3RlcCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgLy8gY3JlYXRlIGJ1dHRvbnMgc3BlY2lmaWMgZm9yIHRoZSBzdGVwXG4gICAgICAvLyB0aGlzIGlzIGRvbmUgdG8gY3JlYXRlIG1vcmUgY29udHJvbCBvbiBldmVudHNcbiAgICAgIGNvbnN0IG5leHRCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgICB0ZXh0OiAnY2hldnJvbl9yaWdodCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgbmV4dCBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG4gICAgICBjb25zdCBiYWNrQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fbGVmdCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgYmFjayBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBiYWNrRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICBfYmFja0Zsb3cgPSB0cnVlO1xuICAgICAgICAgIC8vIGNoZWNrIGlmICdnb0JhY2tUbycgaXMgc2V0IHRvIGp1bXAgdG8gYSBwYXJ0aWN1bGFyIHN0ZXAsIGVsc2UganVzdCBnbyBiYWNrXG4gICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvKSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvLCBmYWxzZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG5cbiAgICAgIC8vIGNoZWNrIGlmIGhpZ2hsaWdodCB3YXMgcHJvdmlkZWQgZm9yIHRoZSBzdGVwLCBlbHNlIGZhbGxiYWNrIGludG8gc2hlcGhlcmRzIHVzYWdlXG4gICAgICBzdGVwLmhpZ2hsaWdodENsYXNzID1cbiAgICAgICAgc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaGlnaGxpZ2h0ID8gJ3NoZXBoZXJkLWhpZ2hsaWdodCcgOiBzdGVwLmhpZ2hsaWdodENsYXNzO1xuXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gZmlyc3Qgc3RlcFxuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbbmV4dEJ1dHRvbl07XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSB0b3RhbFN0ZXBzIC0gMSkge1xuICAgICAgICAvLyBsYXN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIGZpbmlzaEJ1dHRvbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbYmFja0J1dHRvbiwgbmV4dEJ1dHRvbl07XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrcyBcImFkdmFuY2VPblwiIHRvIG92ZXJyaWRlIGxpc3RlbmVyc1xuICAgICAgbGV0IGFkdmFuY2VPbjogSVRvdXJTdGVwQWR2YW5jZU9uW10gfCBJVG91clN0ZXBBZHZhbmNlT24gPSBzdGVwLmFkdmFuY2VPbjtcbiAgICAgIC8vIHJlbW92ZSB0aGUgc2hlcGhlcmQgXCJhZHZhbmNlT25cIiBpbmZhdm9yIG9mIG91cnMgaWYgdGhlIGV2ZW50IGlzIHBhcnQgb2Ygb3VyIGxpc3RcbiAgICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiBhZHZhbmNlT24gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSAmJlxuICAgICAgICAgIG92ZXJyaWRkZW5FdmVudHMuaW5kZXhPZihhZHZhbmNlT24uZXZlbnQuc3BsaXQoJy4nKVswXSkgPiAtMSkgfHxcbiAgICAgICAgYWR2YW5jZU9uIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICkge1xuICAgICAgICBzdGVwLmFkdmFuY2VPbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RlcC5idXR0b25zID1cbiAgICAgICAgICBzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmFsbG93R29CYWNrID8gW2JhY2tCdXR0b24sIGRpc21pc3NCdXR0b25dIDogW2Rpc21pc3NCdXR0b25dO1xuICAgICAgfVxuICAgICAgLy8gYWRkcyBhIGRlZmF1bHQgYmVmb3JlU2hvd1Byb21pc2UgZnVuY3Rpb25cbiAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxDYXBhYmlsaXRpZXNTZXR1cDogRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWR2YW5jZU9uICYmICFzdGVwLmFkdmFuY2VPbikge1xuICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSkge1xuICAgICAgICAgICAgICAgIGFkdmFuY2VPbiA9IFthZHZhbmNlT25dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgICAgICAgICBhZHZhbmNlT24uZm9yRWFjaCgoXzogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhZHZhbmNlQXJyJC5wdXNoKGFkdmFuY2VFdmVudCQpO1xuICAgICAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWR2YW5jZU9uW2ldLCBzdGVwLmFkdmFuY2VPbk9wdGlvbnMsIGFkdmFuY2VFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlU3ViczogU3Vic2NyaXB0aW9uID0gZm9ya0pvaW4oLi4uYWR2YW5jZUFyciQpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKGRlc3Ryb3llZEV2ZW50JCwgYmFja0V2ZW50JCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhZHZhbmNlIHRvIGEgc3BlY2lmaWMgc3RlcCwgZWxzZSBhZHZhbmNlIHRvIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYWR2YW5jZU9uT3B0aW9ucyAmJiBzdGVwLmFkdmFuY2VPbk9wdGlvbnMuanVtcFRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIGFkdmFuY2VTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCBvbiB0aGUgc3RlcCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICAgICAgICAgIGlmIChzdGVwLmFib3J0T24pIHtcbiAgICAgICAgICAgICAgY29uc3QgYWJvcnRBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgc3RlcC5hYm9ydE9uLmZvckVhY2goKGFib3J0T246IElUb3VyQWJvcnRPbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhYm9ydEFyciQucHVzaChhYm9ydEV2ZW50JCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFib3J0T24sIHVuZGVmaW5lZCwgYWJvcnRFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0U3ViczogU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uYWJvcnRBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQsIGZvcndhcmRFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhYm9ydFN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgX3N0b3BUaW1lciQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICAgIGNvbnN0IF9yZXRyaWVzUmVhY2hlZCQ6IFN1YmplY3Q8bnVtYmVyPiA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cnlBdHRlbXB0cyQ6IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KC0xKTtcblxuICAgICAgICAgIGxldCBpZDogc3RyaW5nO1xuICAgICAgICAgIC8vIGNoZWNrcyBpZiBcImF0dGFjaFRvXCIgaXMgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IHRvIGdldCB0aGUgaWQgb2YgYW4gZWxlbWVudFxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUbztcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdGVwLmF0dGFjaFRvID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RlcC5hdHRhY2hUby5lbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWQgPSBzdGVwLmF0dGFjaFRvLmVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYW4gaWQgYXMgYSBzdHJpbmcgaW4gZWl0aGVyIGNhc2UsIHdlIHVzZSBpdCAod2UgaWdub3JlIGl0IGlmIGl0cyBIVE1MRWxlbWVudClcbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIC8vIGlmIGN1cnJlbnQgc3RlcCBpcyB0aGUgZmlyc3Qgc3RlcCBvZiB0aGUgdG91ciwgd2Ugc2V0IHRoZSBidXR0b25zIHRvIGJlIG9ubHkgXCJuZXh0XCIgb3IgXCJkaXNtaXNzXCJcbiAgICAgICAgICAgIC8vIHdlIGhhZCB0byB1c2UgYGFueWAgc2luY2UgdGhlIHRvdXIgZG9lc250IGV4cG9zZSB0aGUgc3RlcHMgaW4gYW55IGZhc2hpb24gbm9yIGEgd2F5IHRvIGNoZWNrIGlmIHdlIGhhdmUgbW9kaWZpZWQgdGhlbSBhdCBhbGxcbiAgICAgICAgICAgIGlmICh0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpID09PSAoPGFueT50aGlzLnNoZXBoZXJkVG91cikuc3RlcHNbMF0pIHtcbiAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKS51cGRhdGVTdGVwT3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgYnV0dG9uczogb3JpZ2luYWxTdGVwc1tpbmRleF0uYWR2YW5jZU9uID8gW2Rpc21pc3NCdXR0b25dIDogW25leHRCdXR0b25dLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRvIHRoZSBhdHRlbXB0cyBvYnNlcnZhYmxlIHRvIG5vdGlmeSBkZWV2ZWxvcGVyIHdoZW4gbnVtYmVyIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJFxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBza2lwKDEpLFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbChtZXJnZShfc3RvcFRpbWVyJC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgc2tpcFdoaWxlKCh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgc3RlcC5hdHRhY2hUb09wdGlvbnMucmV0cmllcztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoYXR0ZW1wdHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRlbXB0cyBoYXZlIGJlZW4gcmVhY2hlZCwgd2UgY2hlY2sgXCJza2lwSWZOb3RGb3VuZFwiIHRvIG1vdmUgb24gdG8gdGhlIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5za2lwSWZOb3RGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZ2V0IHRvIHRoaXMgc3RlcCBjb21pbmcgYmFjayBmcm9tIGEgc3RlcCBhbmQgaXQgd2FzbnQgZm91bmRcbiAgICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgZWl0aGVyIGNoZWNrIGlmIGl0cyB0aGUgZmlyc3Qgc3RlcCBhbmQgdHJ5IGdvaW5nIGZvcndhcmRcbiAgICAgICAgICAgICAgICAgIC8vIG9yIHdlIGtlZXAgZ29pbmcgYmFjayB1bnRpbCB3ZSBmaW5kIGEgc3RlcCB0aGF0IGFjdHVhbGx5IGV4aXN0c1xuICAgICAgICAgICAgICAgICAgaWYgKF9iYWNrRmxvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzLmluZGV4T2YodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9iYWNrRmxvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVzdHJveXMgY3VycmVudCBzdGVwIGlmIHdlIG5lZWQgdG8gc2tpcCBpdCB0byByZW1vdmUgaXQgZnJvbSB0aGUgdG91clxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3RlcDogU2hlcGhlcmQuU3RlcCA9IHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5yZW1vdmVTdGVwKCg8U2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucz5jdXJyZW50U3RlcCkuaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgXCJza2lwSWZOb3RGb3VuZFwiIGlzIG5vdCB0cnVlLCB0aGVuIHdlIGNoZWNrIGlmIFwiZWxzZVwiIGhhcyBiZWVuIHNldCB0byBqdW1wIHRvIGEgc3BlY2lmaWMgc3RlcFxuICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5lbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgUmV0cmllcyByZWFjaGVkIHRyeWluZyB0byBmaW5kICR7aWR9LiBSZXRyaWVkICAke2F0dGVtcHRzfSB0aW1lcy5gKTtcbiAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugd2Ugc2hvdyB0aGUgc3RlcCByZWdhcmRsZXNzXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gd2Ugc3RhcnQgYSB0aW1lciBvZiBhdHRlbXB0cyB0byBmaW5kIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAvLyB0aGUgdGltZXIgd2lsbCBjb250aW51ZSBlaXRoZXIgdW50aWwgd2UgZmluZCB0aGUgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQsIF9yZXRyaWVzUmVhY2hlZCQsIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGJlZW4gZm91bmQsIHdlIHN0b3AgdGhlIHRpbWVyIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXAoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgX3JldHJ5QXR0ZW1wdHMkLm5leHQoX3JldHJ5QXR0ZW1wdHMkLnZhbHVlICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc3RvcCBmaW5kIGludGVydmFsIGlmIHVzZXIgc3RvcHMgdGhlIHRvdXJcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVzb2x2ZSBvYnNlcnZhYmxlIHVudGlsIHRoZSB0aW1lQmVmb3JlU2hvdyBoYXMgcGFzc3NlZCBvciB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQpKSlcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RlcHM7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnQoXG4gICAgZXZlbnRPbjogSVRvdXJFdmVudE9uLFxuICAgIGV2ZW50T25PcHRpb25zOiBJVG91ckV2ZW50T25PcHRpb25zLFxuICAgIGV2ZW50JDogU3ViamVjdDx2b2lkPixcbiAgICBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdG9yOiBzdHJpbmcgPSBldmVudE9uLnNlbGVjdG9yO1xuICAgIGNvbnN0IGV2ZW50OiBzdHJpbmcgPSBldmVudE9uLmV2ZW50O1xuICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICBjb25zdCB0aW1lclN1YnM6IFN1YnNjcmlwdGlvbiA9IHRpbWVyKFxuICAgICAgKGV2ZW50T25PcHRpb25zICYmIGV2ZW50T25PcHRpb25zLnRpbWVCZWZvcmVTaG93KSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVyxcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbChkZXN0cm95ZWRFdmVudCQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHRpbWVyU3Vicy51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgICAvLyBpZiBldmVudCBpcyBcIkFkZGVkXCIgdHJpZ2dlciBhIHNvb24gYXMgdGhpcyBpcyBhdHRhY2hlZC5cbiAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgZXZlbnQgPT09IElUb3VyRXZlbnQuY2xpY2sgfHxcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LnBvaW50ZXJvdmVyIHx8XG4gICAgICAgICAgICBldmVudC5pbmRleE9mKElUb3VyRXZlbnQua2V5dXApID4gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHdlIHVzZSBub3JtYWwgbGlzdGVuZXJzIGZvciBtb3VzZWV2ZW50c1xuICAgICAgICAgICAgY29uc3QgbWFpbkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc3ViRXZlbnQ6IHN0cmluZyA9IGV2ZW50LnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBmcm9tRXZlbnQoZWxlbWVudCwgbWFpbkV2ZW50KVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoZXZlbnQkLmFzT2JzZXJ2YWJsZSgpLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKCRldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBpZiB0aGUgZXZlbnQgaXMgYSBrZXlib2FyZCBldmVudCBhbmQgcGFydCBvZiBvdXQgbGlzdFxuICAgICAgICAgICAgICAgICAgaWYgKCRldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleUV2ZW50cy5nZXQoJGV2ZW50LmtleUNvZGUpID09PSBzdWJFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IElUb3VyRXZlbnQucmVtb3ZlZCkge1xuICAgICAgICAgICAgLy8gYW5kIHdlIHdpbGwgdXNlIE11dGF0aW9uT2JzZXJ2ZXIgZm9yIERPTSBldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgbGlzdGVuaW5pbmcgaWYgdG91ciBpcyBjbG9zZWRcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIG9ic2VydmUgZm9yIGFueSBET00gaW50ZXJhY3Rpb24gaW4gdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuIl19