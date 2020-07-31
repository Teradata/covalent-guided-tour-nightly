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
     * @param {?=} finishLabel
     * @param {?=} dismissLabel
     * @return {?}
     */
    CovalentGuidedTour.prototype._prepareTour = /**
     * @protected
     * @param {?} originalSteps
     * @param {?=} finishLabel
     * @param {?=} dismissLabel
     * @return {?}
     */
    function (originalSteps, finishLabel, dismissLabel) {
        var _this = this;
        if (finishLabel === void 0) { finishLabel = 'finish'; }
        if (dismissLabel === void 0) { dismissLabel = 'cancel tour'; }
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
            text: finishLabel,
            action: this['finish'].bind(this),
            classes: MAT_BUTTON,
        };
        /** @type {?} */
        var dismissButton = {
            text: dismissLabel,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFnQixTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztJQU16RSxTQUFVLE9BQU87SUFDakIsZUFBZ0IsYUFBYTtJQUM3QixTQUFVLE9BQU87SUFDakIsU0FBVSxPQUFPO0lBQ2pCLFdBQVksU0FBUzs7Ozs7O0FBR3ZCLGtDQUdDOzs7SUFGQyxnQ0FBa0I7O0lBQ2xCLDZCQUFnQzs7Ozs7QUFHbEMseUNBR0M7OztJQUZDLDZDQUF3Qjs7SUFDeEIsdUNBQWtCOzs7OztBQUdwQixrQ0FBcUQ7Ozs7QUFFckQsa0NBRUM7OztJQURDLCtCQUF5Qjs7Ozs7QUFHM0IsOENBT0M7OztJQU5DLDZDQUFvQjs7SUFDcEIsMkNBQWlCOztJQUNqQixrREFBeUI7O0lBQ3pCLHdDQUFjOztJQUNkLDRDQUFrQjs7SUFDbEIscURBQTRCOzs7OztBQUc5Qix3Q0FBMkQ7Ozs7QUFFM0QsK0NBR0M7OztJQUZDLDJDQUFnQjs7SUFDaEIsZ0RBQXNCOzs7OztBQUd4QiwrQkFNQzs7O0lBTEMsb0NBQTJDOztJQUMzQyxxQ0FBNkM7O0lBQzdDLDhCQUE0RDs7SUFDNUQsNEJBQXlCOztJQUN6QiwwQkFBZTs7Ozs7QUFHakI7Ozs7SUFBQTtJQVFBLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDOzs7Ozs7SUFQQyxvREFBc0I7Ozs7O0lBRXRCLG9EQUFzQjs7Ozs7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O29CQUVGLHFDQUFxQztvQkFDckMsZUFBZSxDQUFDLFNBQVM7OztvQkFBQzt3QkFDeEIsVUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUN4QixDQUFDLEVBQUMsQ0FBQztvQkFDSCxpREFBaUQ7b0JBQ2pELFVBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUNqRjthQUNGO1FBQ0gsQ0FBQyxFQUFDO0lBQ04sQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTFhRCxDQUF3QyxrQkFBa0IsR0EwYXpEOzs7Ozs7O0lBemFDLDhDQUF3Qzs7SUFFeEMsMENBQTRCOztJQUM1Qix5Q0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGltZXIsIFN1YmplY3QsIEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50LCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBza2lwV2hpbGUsIGZpbHRlciwgc2tpcCwgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIFRvdXJTdGVwID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucztcbmV4cG9ydCB0eXBlIFRvdXJTdGVwQnV0dG9uID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9uc0J1dHRvbjtcblxuZXhwb3J0IGVudW0gSVRvdXJFdmVudCB7XG4gICdjbGljaycgPSAnY2xpY2snLFxuICAncG9pbnRlcm92ZXInID0gJ3BvaW50ZXJvdmVyJyxcbiAgJ2tleXVwJyA9ICdrZXl1cCcsXG4gICdhZGRlZCcgPSAnYWRkZWQnLCAvLyBhZGRlZCB0byBET01cbiAgJ3JlbW92ZWQnID0gJ3JlbW92ZWQnLCAvLyByZW1vdmVkIGZyb20gRE9NXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJFdmVudE9uIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7IC8vIGNzcyBzZWxlY3RvclxuICBldmVudD86IGtleW9mIHR5cGVvZiBJVG91ckV2ZW50OyAvLyBjbGljaywgcG9pbnRlcm92ZXIsIGtleXVwLCBhZGRlZCwgcmVtb3ZlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICB0aW1lQmVmb3JlU2hvdz86IG51bWJlcjsgLy8gZGVsYXkgYmVmb3JlIHN0ZXAgaXMgZGlzcGxheWVkXG4gIGludGVydmFsPzogbnVtYmVyOyAvLyB0aW1lIGJldHdlZW4gc2VhcmNoZXMgZm9yIGVsZW1lbnQsIGRlZmF1bHRzIHRvIDUwMG1zXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJBYm9ydE9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJPcHRpb25zIGV4dGVuZHMgU2hlcGhlcmQuVG91ci5Ub3VyT3B0aW9ucyB7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTsgLy8gZXZlbnRzIHRvIGFib3J0IG9uXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGhpZ2hsaWdodD86IGJvb2xlYW47XG4gIHJldHJpZXM/OiBudW1iZXI7IC8vICMgbnVtIG9mIGF0dGVtcHRzIHRvIGZpbmQgZWxlbWVudFxuICBza2lwSWZOb3RGb3VuZD86IGJvb2xlYW47IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kIGFmdGVyIG4gcmV0cmllcywgbW92ZSBvbiB0byBuZXh0IHN0ZXBcbiAgZWxzZT86IHN0cmluZzsgLy8gaWYgZWxlbWVudCBpcyBub3QgZm91bmQsIGdvIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGdvQmFja1RvPzogc3RyaW5nOyAvLyBiYWNrIGJ1dHRvbiBnb2VzIGJhY2sgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgc2tpcEZyb21TdGVwQ291bnQ/OiBib29sZWFuOyAvLyBzaG93L2hpZGUgcHJvZ3Jlc3Mgb24gc3RlcFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnMgZXh0ZW5kcyBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAganVtcFRvPzogc3RyaW5nOyAvLyBuZXh0IGJ1dHRvbiB3aWxsIGp1bXAgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgYWxsb3dHb0JhY2s/OiBib29sZWFuOyAvLyBhbGxvdyBiYWNrIHdpdGhpbiB0aGlzIHN0ZXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXAgZXh0ZW5kcyBUb3VyU3RlcCB7XG4gIGF0dGFjaFRvT3B0aW9ucz86IElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucztcbiAgYWR2YW5jZU9uT3B0aW9ucz86IElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnM7XG4gIGFkdmFuY2VPbj86IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uIHwgYW55O1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107XG4gIGNvdW50PzogbnVtYmVyO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBhYnN0cmFjdCBuZXh0KCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgYmFjaygpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGNhbmNlbCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGZpbmlzaCgpOiB2b2lkO1xufVxuXG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVzogbnVtYmVyID0gMTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMOiBudW1iZXIgPSA1MDA7XG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM6IG51bWJlciA9IDIwO1xuXG5jb25zdCBvdmVycmlkZGVuRXZlbnRzOiBzdHJpbmdbXSA9IFtcbiAgSVRvdXJFdmVudC5jbGljayxcbiAgSVRvdXJFdmVudC5wb2ludGVyb3ZlcixcbiAgSVRvdXJFdmVudC5yZW1vdmVkLFxuICBJVG91ckV2ZW50LmFkZGVkLFxuICBJVG91ckV2ZW50LmtleXVwLFxuXTtcblxuY29uc3Qga2V5RXZlbnRzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oW1xuICBbMTMsICdlbnRlciddLFxuICBbMjcsICdlc2MnXSxcbl0pO1xuXG5jb25zdCBkZWZhdWx0U3RlcE9wdGlvbnM6IFRvdXJTdGVwID0ge1xuICBzY3JvbGxUbzogeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9LFxuICBjYW5jZWxJY29uOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IE1BVF9JQ09OX0JVVFRPTjogc3RyaW5nID0gJ21hdC1pY29uLWJ1dHRvbiBtYXRlcmlhbC1pY29ucyBtYXQtYnV0dG9uLWJhc2UnO1xuY29uc3QgTUFUX0JVVFRPTjogc3RyaW5nID0gJ21hdC1idXR0b24tYmFzZSBtYXQtYnV0dG9uJztcblxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91ciBleHRlbmRzIFRvdXJCdXR0b25zQWN0aW9ucyB7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZEV2ZW50JDogU3ViamVjdDx2b2lkPjtcblxuICBzaGVwaGVyZFRvdXI6IFNoZXBoZXJkLlRvdXI7XG4gIHN0ZXBPcHRpb25zOiBJVG91clN0ZXA7XG5cbiAgY29uc3RydWN0b3Ioc3RlcE9wdGlvbnM6IElUb3VyU3RlcCA9IGRlZmF1bHRTdGVwT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0ZXBPcHRpb25zID0gc3RlcE9wdGlvbnM7XG4gICAgdGhpcy5uZXdUb3VyKCk7XG4gIH1cblxuICBuZXdUb3VyKG9wdHM/OiBJVG91ck9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ciA9IG5ldyBTaGVwaGVyZC5Ub3VyKFxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgIGRlZmF1bHRTdGVwT3B0aW9uczogdGhpcy5zdGVwT3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0cyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgLy8gbGlzdGVuIHRvIGNhbmNlbCBhbmQgY29tcGxldGUgdG8gY2xlYW4gdXAgYWJvcnRPbiBldmVudHNcbiAgICBtZXJnZShmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjYW5jZWwnKSwgZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCAnY29tcGxldGUnKSlcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICBpZiAob3B0cyAmJiBvcHRzLmFib3J0T24pIHtcbiAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICBvcHRzLmFib3J0T24uZm9yRWFjaCgoYWJvcnRPbjogSVRvdXJBYm9ydE9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWJvcnRPbiwgdW5kZWZpbmVkLCBhYm9ydEV2ZW50JCwgdGhpcy5fZGVzdHJveWVkRXZlbnQkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZEV2ZW50JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICB9XG5cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gIH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFkZFN0ZXBzKHN0ZXBzOiBJVG91clN0ZXBbXSk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKHRoaXMuX3ByZXBhcmVUb3VyKHN0ZXBzKSk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5zdGFydCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcmVwYXJlVG91cihcbiAgICBvcmlnaW5hbFN0ZXBzOiBJVG91clN0ZXBbXSxcbiAgICBmaW5pc2hMYWJlbDogc3RyaW5nID0gJ2ZpbmlzaCcsXG4gICAgZGlzbWlzc0xhYmVsOiBzdHJpbmcgPSAnY2FuY2VsIHRvdXInLFxuICApOiBJVG91clN0ZXBbXSB7XG4gICAgLy8gY3JlYXRlIFN1YmplY3RzIGZvciBiYWNrIGFuZCBmb3J3YXJkIGV2ZW50c1xuICAgIGNvbnN0IGJhY2tFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGNvbnN0IGZvcndhcmRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGxldCBfYmFja0Zsb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBjcmVhdGUgU3ViamVjdCBmb3IgeW91ciBlbmRcbiAgICBjb25zdCBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgc3RlcCBwcm9ncmVzcyBpbiB0aGUgZm9vdGVyIG9mIHRoZSBzaGVwaGVyZCB0b29sdGlwXG4gICAgICovXG4gICAgY29uc3QgYXBwZW5kUHJvZ3Jlc3NGdW5jOiBGdW5jdGlvbiA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgIC8vIGdldCBhbGwgdGhlIGZvb3RlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGZvb3RlcnM6IEVsZW1lbnRbXSA9IEFycmF5LmZyb208RWxlbWVudD4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNoZXBoZXJkLWZvb3RlcicpKTtcbiAgICAgIC8vIGdldCB0aGUgbGFzdCBmb290ZXIgc2luY2UgU2hlcGhlcmQgYWx3YXlzIHB1dHMgdGhlIGFjdGl2ZSBvbmUgYXQgdGhlIGVuZFxuICAgICAgY29uc3QgZm9vdGVyOiBFbGVtZW50ID0gZm9vdGVyc1tmb290ZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gZ2VuZXJhdGUgc3RlcHMgaHRtbCBlbGVtZW50XG4gICAgICBjb25zdCBwcm9ncmVzczogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvZ3Jlc3MuY2xhc3NOYW1lID0gJ3NoZXBoZXJkLXByb2dyZXNzJztcbiAgICAgIHByb2dyZXNzLmlubmVyVGV4dCA9IGAke3RoaXMuc2hlcGhlcmRUb3VyLmN1cnJlbnRTdGVwLm9wdGlvbnMuY291bnR9LyR7c3RlcFRvdGFsfWA7XG4gICAgICAvLyBpbnNlcnQgaW50byB0aGUgZm9vdGVyIGJlZm9yZSB0aGUgZmlyc3QgYnV0dG9uXG4gICAgICBmb290ZXIuaW5zZXJ0QmVmb3JlKHByb2dyZXNzLCBmb290ZXIucXVlcnlTZWxlY3RvcignLnNoZXBoZXJkLWJ1dHRvbicpKTtcbiAgICB9O1xuXG4gICAgbGV0IHN0ZXBUb3RhbDogbnVtYmVyID0gMDtcbiAgICBjb25zdCBzdGVwczogSVRvdXJTdGVwW10gPSBvcmlnaW5hbFN0ZXBzLm1hcCgoc3RlcDogSVRvdXJTdGVwKSA9PiB7XG4gICAgICBsZXQgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcbiAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHRydWUpIHtcbiAgICAgICAgc2hvd1Byb2dyZXNzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gZmFsc2VcbiAgICAgICkge1xuICAgICAgICBzdGVwLmNvdW50ID0gKytzdGVwVG90YWw7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGFwcGVuZFByb2dyZXNzRnVuYy5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0ZXAsIHtcbiAgICAgICAgd2hlbjoge1xuICAgICAgICAgIHNob3c6IHNob3dQcm9ncmVzcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6IGZpbmlzaExhYmVsLFxuICAgICAgYWN0aW9uOiB0aGlzWydmaW5pc2gnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuICAgIGNvbnN0IGRpc21pc3NCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgdGV4dDogZGlzbWlzc0xhYmVsLFxuICAgICAgYWN0aW9uOiB0aGlzWydjYW5jZWwnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuXG4gICAgLy8gbGlzdGVuIHRvIHRoZSBkZXN0cm95ZWQgZXZlbnQgdG8gY2xlYW4gdXAgYWxsIHRoZSBzdHJlYW1zXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGJhY2tFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGZvcndhcmRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5uZXh0KCk7XG4gICAgICBkZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsU3RlcHM6IG51bWJlciA9IHN0ZXBzLmxlbmd0aDtcbiAgICBzdGVwcy5mb3JFYWNoKChzdGVwOiBJVG91clN0ZXAsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIC8vIGNyZWF0ZSBidXR0b25zIHNwZWNpZmljIGZvciB0aGUgc3RlcFxuICAgICAgLy8gdGhpcyBpcyBkb25lIHRvIGNyZWF0ZSBtb3JlIGNvbnRyb2wgb24gZXZlbnRzXG4gICAgICBjb25zdCBuZXh0QnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fcmlnaHQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIG5leHQgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuICAgICAgY29uc3QgYmFja0J1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICAgIHRleHQ6ICdjaGV2cm9uX2xlZnQnLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBpbnRlcmNlcHQgdGhlIGJhY2sgYWN0aW9uIGFuZCB0cmlnZ2VyIGV2ZW50XG4gICAgICAgICAgYmFja0V2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgX2JhY2tGbG93ID0gdHJ1ZTtcbiAgICAgICAgICAvLyBjaGVjayBpZiAnZ29CYWNrVG8nIGlzIHNldCB0byBqdW1wIHRvIGEgcGFydGljdWxhciBzdGVwLCBlbHNlIGp1c3QgZ28gYmFja1xuICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbykge1xuICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5nb0JhY2tUbywgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiBNQVRfSUNPTl9CVVRUT04sXG4gICAgICB9O1xuXG4gICAgICAvLyBjaGVjayBpZiBoaWdobGlnaHQgd2FzIHByb3ZpZGVkIGZvciB0aGUgc3RlcCwgZWxzZSBmYWxsYmFjayBpbnRvIHNoZXBoZXJkcyB1c2FnZVxuICAgICAgc3RlcC5oaWdobGlnaHRDbGFzcyA9XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmhpZ2hsaWdodCA/ICdzaGVwaGVyZC1oaWdobGlnaHQnIDogc3RlcC5oaWdobGlnaHRDbGFzcztcblxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIC8vIGZpcnN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW25leHRCdXR0b25dO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdG90YWxTdGVwcyAtIDEpIHtcbiAgICAgICAgLy8gbGFzdCBzdGVwXG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9IFtiYWNrQnV0dG9uLCBmaW5pc2hCdXR0b25dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIG5leHRCdXR0b25dO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGVja3MgXCJhZHZhbmNlT25cIiB0byBvdmVycmlkZSBsaXN0ZW5lcnNcbiAgICAgIGxldCBhZHZhbmNlT246IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uID0gc3RlcC5hZHZhbmNlT247XG4gICAgICAvLyByZW1vdmUgdGhlIHNoZXBoZXJkIFwiYWR2YW5jZU9uXCIgaW5mYXZvciBvZiBvdXJzIGlmIHRoZSBldmVudCBpcyBwYXJ0IG9mIG91ciBsaXN0XG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgYWR2YW5jZU9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikgJiZcbiAgICAgICAgICBvdmVycmlkZGVuRXZlbnRzLmluZGV4T2YoYWR2YW5jZU9uLmV2ZW50LnNwbGl0KCcuJylbMF0pID4gLTEpIHx8XG4gICAgICAgIGFkdmFuY2VPbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICApIHtcbiAgICAgICAgc3RlcC5hZHZhbmNlT24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHN0ZXAuYnV0dG9ucyA9XG4gICAgICAgICAgc3RlcC5hZHZhbmNlT25PcHRpb25zICYmIHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5hbGxvd0dvQmFjayA/IFtiYWNrQnV0dG9uLCBkaXNtaXNzQnV0dG9uXSA6IFtkaXNtaXNzQnV0dG9uXTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZHMgYSBkZWZhdWx0IGJlZm9yZVNob3dQcm9taXNlIGZ1bmN0aW9uXG4gICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXA6IEZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFkdmFuY2VPbiAmJiAhc3RlcC5hZHZhbmNlT24pIHtcbiAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFkdmFuY2VPbikpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlT24gPSBbYWR2YW5jZU9uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgYWR2YW5jZU9uLmZvckVhY2goKF86IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWR2YW5jZUFyciQucHVzaChhZHZhbmNlRXZlbnQkKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFkdmFuY2VPbltpXSwgc3RlcC5hZHZhbmNlT25PcHRpb25zLCBhZHZhbmNlRXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZVN1YnM6IFN1YnNjcmlwdGlvbiA9IGZvcmtKb2luKC4uLmFkdmFuY2VBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYWR2YW5jZSB0byBhIHNwZWNpZmljIHN0ZXAsIGVsc2UgYWR2YW5jZSB0byBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYWR2YW5jZU9uT3B0aW9ucy5qdW1wVG8pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZm9yd2FyZEV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBhZHZhbmNlU3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBhYm9ydE9uIHdhcyBwYXNzZWQgb24gdGhlIHN0ZXAsIHdlIGJpbmQgdGhlIGV2ZW50IGFuZCBleGVjdXRlIGNvbXBsZXRlXG4gICAgICAgICAgICBpZiAoc3RlcC5hYm9ydE9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0QXJyJDogU3ViamVjdDx2b2lkPltdID0gW107XG4gICAgICAgICAgICAgIHN0ZXAuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhYm9ydEV2ZW50JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgICAgICAgICAgICAgYWJvcnRBcnIkLnB1c2goYWJvcnRFdmVudCQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCBkZXN0cm95ZWRFdmVudCQpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjb25zdCBhYm9ydFN1YnM6IFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLmFib3J0QXJyJClcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkLCBiYWNrRXZlbnQkLCBmb3J3YXJkRXZlbnQkKSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWJvcnRTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IF9zdG9wVGltZXIkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cmllc1JlYWNoZWQkOiBTdWJqZWN0PG51bWJlcj4gPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gICAgICAgICAgY29uc3QgX3JldHJ5QXR0ZW1wdHMkOiBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigtMSk7XG5cbiAgICAgICAgICBsZXQgaWQ6IHN0cmluZztcbiAgICAgICAgICAvLyBjaGVja3MgaWYgXCJhdHRhY2hUb1wiIGlzIGEgc3RyaW5nIG9yIGFuIG9iamVjdCB0byBnZXQgdGhlIGlkIG9mIGFuIGVsZW1lbnRcbiAgICAgICAgICBpZiAodHlwZW9mIHN0ZXAuYXR0YWNoVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZCA9IHN0ZXAuYXR0YWNoVG87XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0ZXAuYXR0YWNoVG8uZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUby5lbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFuIGlkIGFzIGEgc3RyaW5nIGluIGVpdGhlciBjYXNlLCB3ZSB1c2UgaXQgKHdlIGlnbm9yZSBpdCBpZiBpdHMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAvLyBpZiBjdXJyZW50IHN0ZXAgaXMgdGhlIGZpcnN0IHN0ZXAgb2YgdGhlIHRvdXIsIHdlIHNldCB0aGUgYnV0dG9ucyB0byBiZSBvbmx5IFwibmV4dFwiIG9yIFwiZGlzbWlzc1wiXG4gICAgICAgICAgICAvLyB3ZSBoYWQgdG8gdXNlIGBhbnlgIHNpbmNlIHRoZSB0b3VyIGRvZXNudCBleHBvc2UgdGhlIHN0ZXBzIGluIGFueSBmYXNoaW9uIG5vciBhIHdheSB0byBjaGVjayBpZiB3ZSBoYXZlIG1vZGlmaWVkIHRoZW0gYXQgYWxsXG4gICAgICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSA9PT0gKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzWzBdKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkudXBkYXRlU3RlcE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IG9yaWdpbmFsU3RlcHNbaW5kZXhdLmFkdmFuY2VPbiA/IFtkaXNtaXNzQnV0dG9uXSA6IFtuZXh0QnV0dG9uXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWdpc3RlciB0byB0aGUgYXR0ZW1wdHMgb2JzZXJ2YWJsZSB0byBub3RpZnkgZGVldmVsb3BlciB3aGVuIG51bWJlciBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICBfcmV0cnlBdHRlbXB0cyRcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQuYXNPYnNlcnZhYmxlKCksIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICAgIHNraXBXaGlsZSgodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA8IHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXM7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0FUVEVNUFRTO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGF0dGVtcHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0ZW1wdHMgaGF2ZSBiZWVuIHJlYWNoZWQsIHdlIGNoZWNrIFwic2tpcElmTm90Rm91bmRcIiB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuc2tpcElmTm90Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGdldCB0byB0aGlzIHN0ZXAgY29taW5nIGJhY2sgZnJvbSBhIHN0ZXAgYW5kIGl0IHdhc250IGZvdW5kXG4gICAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIGVpdGhlciBjaGVjayBpZiBpdHMgdGhlIGZpcnN0IHN0ZXAgYW5kIHRyeSBnb2luZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgICAvLyBvciB3ZSBrZWVwIGdvaW5nIGJhY2sgdW50aWwgd2UgZmluZCBhIHN0ZXAgdGhhdCBhY3R1YWxseSBleGlzdHNcbiAgICAgICAgICAgICAgICAgIGlmIChfYmFja0Zsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCg8YW55PnRoaXMuc2hlcGhlcmRUb3VyKS5zdGVwcy5pbmRleE9mKHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYmFja0Zsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3lzIGN1cnJlbnQgc3RlcCBpZiB3ZSBuZWVkIHRvIHNraXAgaXQgdG8gcmVtb3ZlIGl0IGZyb20gdGhlIHRvdXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFN0ZXA6IFNoZXBoZXJkLlN0ZXAgPSB0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RlcC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIucmVtb3ZlU3RlcCgoPFNoZXBoZXJkLlN0ZXAuU3RlcE9wdGlvbnM+Y3VycmVudFN0ZXApLmlkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmIFwic2tpcElmTm90Rm91bmRcIiBpcyBub3QgdHJ1ZSwgdGhlbiB3ZSBjaGVjayBpZiBcImVsc2VcIiBoYXMgYmVlbiBzZXQgdG8ganVtcCB0byBhIHNwZWNpZmljIHN0ZXBcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFJldHJpZXMgcmVhY2hlZCB0cnlpbmcgdG8gZmluZCAke2lkfS4gUmV0cmllZCAgJHthdHRlbXB0c30gdGltZXMuYCk7XG4gICAgICAgICAgICAgICAgICAvLyBlbHNlIHdlIHNob3cgdGhlIHN0ZXAgcmVnYXJkbGVzc1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gdGhlIHRpbWVyIHdpbGwgY29udGludWUgZWl0aGVyIHVudGlsIHdlIGZpbmQgdGhlIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBhdHRlbXB0cyBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKF9zdG9wVGltZXIkLCBfcmV0cmllc1JlYWNoZWQkLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENhcGFiaWxpdGllc1NldHVwKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJC5uZXh0KF9yZXRyeUF0dGVtcHRzJC52YWx1ZSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgZmluZCBpbnRlcnZhbCBpZiB1c2VyIHN0b3BzIHRoZSB0b3VyXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgX3N0b3BUaW1lciQubmV4dCgpO1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLm5leHQoKTtcbiAgICAgICAgICAgICAgX3JldHJpZXNSZWFjaGVkJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlc29sdmUgb2JzZXJ2YWJsZSB1bnRpbCB0aGUgdGltZUJlZm9yZVNob3cgaGFzIHBhc3NzZWQgb3IgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgIHRpbWVyKFxuICAgICAgICAgICAgICAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMudGltZUJlZm9yZVNob3cpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9USU1FX0JFRk9SRV9TSE9XLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoZGVzdHJveWVkRXZlbnQkKSkpXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0ZXBzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50KFxuICAgIGV2ZW50T246IElUb3VyRXZlbnRPbixcbiAgICBldmVudE9uT3B0aW9uczogSVRvdXJFdmVudE9uT3B0aW9ucyxcbiAgICBldmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICAgZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3Rvcjogc3RyaW5nID0gZXZlbnRPbi5zZWxlY3RvcjtcbiAgICBjb25zdCBldmVudDogc3RyaW5nID0gZXZlbnRPbi5ldmVudDtcbiAgICAvLyB3ZSBzdGFydCBhIHRpbWVyIG9mIGF0dGVtcHRzIHRvIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgZG9tXG4gICAgY29uc3QgdGltZXJTdWJzOiBTdWJzY3JpcHRpb24gPSB0aW1lcihcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAoZXZlbnRPbk9wdGlvbnMgJiYgZXZlbnRPbk9wdGlvbnMuaW50ZXJ2YWwpIHx8IFNIRVBIRVJEX0RFRkFVTFRfRklORF9JTlRFUlZBTCxcbiAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwoZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgYmVlbiBmb3VuZCwgd2Ugc3RvcCB0aGUgdGltZXIgYW5kIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aW1lclN1YnMudW5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIGlmIChldmVudCA9PT0gSVRvdXJFdmVudC5hZGRlZCkge1xuICAgICAgICAgICAgLy8gaWYgZXZlbnQgaXMgXCJBZGRlZFwiIHRyaWdnZXIgYSBzb29uIGFzIHRoaXMgaXMgYXR0YWNoZWQuXG4gICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LmNsaWNrIHx8XG4gICAgICAgICAgICBldmVudCA9PT0gSVRvdXJFdmVudC5wb2ludGVyb3ZlciB8fFxuICAgICAgICAgICAgZXZlbnQuaW5kZXhPZihJVG91ckV2ZW50LmtleXVwKSA+IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB3ZSB1c2Ugbm9ybWFsIGxpc3RlbmVycyBmb3IgbW91c2VldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG1haW5FdmVudDogc3RyaW5nID0gZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsIG1haW5FdmVudClcbiAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKGV2ZW50JC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgkZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBvbmx5IHRyaWdnZXIgaWYgdGhlIGV2ZW50IGlzIGEga2V5Ym9hcmQgZXZlbnQgYW5kIHBhcnQgb2Ygb3V0IGxpc3RcbiAgICAgICAgICAgICAgICAgIGlmICgkZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlFdmVudHMuZ2V0KCRldmVudC5rZXlDb2RlKSA9PT0gc3ViRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICAgIC8vIGFuZCB3ZSB3aWxsIHVzZSBNdXRhdGlvbk9ic2VydmVyIGZvciBET00gZXZlbnRzXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGxpc3RlbmluaW5nIGlmIHRvdXIgaXMgY2xvc2VkXG4gICAgICAgICAgICBkZXN0cm95ZWRFdmVudCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBvYnNlcnZlIGZvciBhbnkgRE9NIGludGVyYWN0aW9uIGluIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==