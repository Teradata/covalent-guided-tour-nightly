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
/** @type {?} */
var MAT_BUTTON_INVISIBLE = 'shepherd-void-button';
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
     * @return {?}
     */
    CovalentGuidedTour.prototype._prepareTour = /**
     * @protected
     * @param {?} originalSteps
     * @param {?=} finishLabel
     * @return {?}
     */
    function (originalSteps, finishLabel) {
        var _this = this;
        if (finishLabel === void 0) { finishLabel = 'finish'; }
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
        var voidButton = {
            text: '',
            action: /**
             * @return {?}
             */
            function () {
                return;
            },
            classes: MAT_BUTTON_INVISIBLE,
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
                    step.advanceOnOptions && step.advanceOnOptions.allowGoBack ? [backButton, voidButton] : [voidButton];
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
                        // if current step is the first step of the tour, we set the buttons to be only "next"
                        // we had to use `any` since the tour doesnt expose the steps in any fashion nor a way to check if we have modified them at all
                        if (_this.shepherdTour.getCurrentStep() === ((/** @type {?} */ (_this.shepherdTour))).steps[0]) {
                            _this.shepherdTour.getCurrentStep().updateStepOptions({
                                buttons: originalSteps[index].advanceOn ? [voidButton] : [nextButton],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLnRvdXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY292YWxlbnQvZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQudG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFnQixTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztJQU16RSxTQUFVLE9BQU87SUFDakIsZUFBZ0IsYUFBYTtJQUM3QixTQUFVLE9BQU87SUFDakIsU0FBVSxPQUFPO0lBQ2pCLFdBQVksU0FBUzs7Ozs7O0FBR3ZCLGtDQUdDOzs7SUFGQyxnQ0FBa0I7O0lBQ2xCLDZCQUFnQzs7Ozs7QUFHbEMseUNBR0M7OztJQUZDLDZDQUF3Qjs7SUFDeEIsdUNBQWtCOzs7OztBQUdwQixrQ0FBcUQ7Ozs7QUFFckQsa0NBRUM7OztJQURDLCtCQUF5Qjs7Ozs7QUFHM0IsOENBT0M7OztJQU5DLDZDQUFvQjs7SUFDcEIsMkNBQWlCOztJQUNqQixrREFBeUI7O0lBQ3pCLHdDQUFjOztJQUNkLDRDQUFrQjs7SUFDbEIscURBQTRCOzs7OztBQUc5Qix3Q0FBMkQ7Ozs7QUFFM0QsK0NBR0M7OztJQUZDLDJDQUFnQjs7SUFDaEIsZ0RBQXNCOzs7OztBQUd4QiwrQkFNQzs7O0lBTEMsb0NBQTJDOztJQUMzQyxxQ0FBNkM7O0lBQzdDLDhCQUE0RDs7SUFDNUQsNEJBQXlCOztJQUN6QiwwQkFBZTs7Ozs7QUFHakI7Ozs7SUFBQTtJQVFBLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDOzs7Ozs7SUFQQyxvREFBc0I7Ozs7O0lBRXRCLG9EQUFzQjs7Ozs7SUFFdEIsc0RBQXdCOzs7OztJQUV4QixzREFBd0I7OztJQUdwQixzQ0FBc0MsR0FBVyxHQUFHOztJQUNwRCw4QkFBOEIsR0FBVyxHQUFHOztJQUM1Qyw4QkFBOEIsR0FBVyxFQUFFOztJQUUzQyxnQkFBZ0IsR0FBYTtJQUNqQyxVQUFVLENBQUMsS0FBSztJQUNoQixVQUFVLENBQUMsV0FBVztJQUN0QixVQUFVLENBQUMsT0FBTztJQUNsQixVQUFVLENBQUMsS0FBSztJQUNoQixVQUFVLENBQUMsS0FBSztDQUNqQjs7SUFFSyxTQUFTLEdBQXdCLElBQUksR0FBRyxDQUFpQjtJQUM3RCxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUM7SUFDYixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7Q0FDWixDQUFDOztJQUVJLGtCQUFrQixHQUFhO0lBQ25DLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUNqRCxVQUFVLEVBQUU7UUFDVixPQUFPLEVBQUUsSUFBSTtLQUNkO0NBQ0Y7O0lBRUssZUFBZSxHQUFXLGdEQUFnRDs7SUFDMUUsVUFBVSxHQUFXLDRCQUE0Qjs7SUFDakQsb0JBQW9CLEdBQVcsc0JBQXNCO0FBRTNEO0lBQXdDLHNDQUFrQjtJQU14RCw0QkFBWSxXQUEyQztRQUEzQyw0QkFBQSxFQUFBLGdDQUEyQztRQUF2RCxZQUNFLGlCQUFPLFNBSVI7UUFGQyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O0lBQ2pCLENBQUM7Ozs7O0lBRUQsb0NBQU87Ozs7SUFBUCxVQUFRLElBQW1CO1FBQTNCLGlCQW1DQztRQWxDQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FDbkMsTUFBTSxDQUFDLE1BQU0sQ0FDWDtZQUNFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxXQUFXO1NBQ3JDLEVBQ0QsSUFBSSxDQUNMLENBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQzVDLDJEQUEyRDtRQUMzRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDcEYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2IsU0FBUzs7O1FBQUM7WUFDVCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDN0IsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25DLENBQUMsRUFBQyxDQUFDO1FBRUwsZ0VBQWdFO1FBQ2hFLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7O2dCQUNsQixXQUFTLEdBQW9CLEVBQUU7WUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPOzs7O1lBQUMsVUFBQyxPQUFxQjs7b0JBQ25DLFdBQVcsR0FBa0IsSUFBSSxPQUFPLEVBQVE7Z0JBQ3RELFdBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzVCLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUUsQ0FBQyxFQUFDLENBQUM7O2dCQUVHLFdBQVMsR0FBaUIsS0FBSyx3QkFBSSxXQUFTLEdBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ3RDLFNBQVM7OztZQUFDO2dCQUNULEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdCLFdBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMxQixDQUFDLEVBQUM7U0FDTDtJQUNILENBQUM7Ozs7SUFFRCxpQ0FBSTs7O0lBQUo7UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxtQ0FBTTs7O0lBQU47UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFRCxpQ0FBSTs7O0lBQUo7UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxtQ0FBTTs7O0lBQU47UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBRUQscUNBQVE7Ozs7SUFBUixVQUFTLEtBQWtCO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7O0lBRUQsa0NBQUs7OztJQUFMO1FBQ0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QixDQUFDOzs7Ozs7O0lBRVMseUNBQVk7Ozs7OztJQUF0QixVQUF1QixhQUEwQixFQUFFLFdBQThCO1FBQWpGLGlCQXNSQztRQXRSa0QsNEJBQUEsRUFBQSxzQkFBOEI7OztZQUV6RSxVQUFVLEdBQWtCLElBQUksT0FBTyxFQUFROztZQUMvQyxhQUFhLEdBQWtCLElBQUksT0FBTyxFQUFROztZQUNwRCxTQUFTLEdBQVksS0FBSzs7O1lBRXhCLGVBQWUsR0FBa0IsSUFBSSxPQUFPLEVBQVE7Ozs7O1lBSXBELGtCQUFrQjs7O1FBQWE7OztnQkFFN0IsT0FBTyxHQUFjLEtBQUssQ0FBQyxJQUFJLENBQVUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7OztnQkFFdkYsTUFBTSxHQUFZLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7O2dCQUU3QyxRQUFRLEdBQW9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ2hFLFFBQVEsQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7WUFDekMsUUFBUSxDQUFDLFNBQVMsR0FBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFJLFNBQVcsQ0FBQztZQUNuRixpREFBaUQ7WUFDakQsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFBOztZQUVHLFNBQVMsR0FBVyxDQUFDOztZQUNuQixLQUFLLEdBQWdCLGFBQWEsQ0FBQyxHQUFHOzs7O1FBQUMsVUFBQyxJQUFlOzs7Z0JBQ3ZELFlBQXNCO1lBQzFCLElBQUksT0FBQSxJQUFJLENBQUMsZUFBZSwwQ0FBRSxpQkFBaUIsTUFBSyxJQUFJLEVBQUU7Z0JBQ3BELFlBQVk7OztnQkFBRztvQkFDYixPQUFPO2dCQUNULENBQUMsQ0FBQSxDQUFDO2FBQ0g7aUJBQU0sSUFDTCxPQUFBLElBQUksQ0FBQyxlQUFlLDBDQUFFLGlCQUFpQixNQUFLLFNBQVM7Z0JBQ3JELE9BQUEsSUFBSSxDQUFDLGVBQWUsMENBQUUsaUJBQWlCLE1BQUssS0FBSyxFQUNqRDtnQkFDQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsU0FBUyxDQUFDO2dCQUN6QixZQUFZLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUU7Z0JBQzdCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsWUFBWTtpQkFDbkI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLEVBQUM7O1lBRUksWUFBWSxHQUFtQjtZQUNuQyxJQUFJLEVBQUUsV0FBVztZQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakMsT0FBTyxFQUFFLFVBQVU7U0FDcEI7O1lBRUssVUFBVSxHQUFtQjtZQUNqQyxJQUFJLEVBQUUsRUFBRTtZQUNSLE1BQU07OztZQUFOO2dCQUNFLE9BQU87WUFDVCxDQUFDO1lBQ0QsT0FBTyxFQUFFLG9CQUFvQjtTQUM5QjtRQUVELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUzs7O1FBQUM7WUFDNUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN6QixlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkIsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLENBQUMsRUFBQyxDQUFDOztZQUVHLFVBQVUsR0FBVyxLQUFLLENBQUMsTUFBTTtRQUN2QyxLQUFLLENBQUMsT0FBTzs7Ozs7UUFBQyxVQUFDLElBQWUsRUFBRSxLQUFhOzs7O2dCQUdyQyxVQUFVLEdBQW1CO2dCQUNqQyxJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTTs7O2dCQUFFO29CQUNOLDhDQUE4QztvQkFDOUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyQixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUE7Z0JBQ0QsT0FBTyxFQUFFLGVBQWU7YUFDekI7O2dCQUNLLFVBQVUsR0FBbUI7Z0JBQ2pDLElBQUksRUFBRSxjQUFjO2dCQUNwQixNQUFNOzs7Z0JBQUU7b0JBQ04sOENBQThDO29CQUM5QyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2xCLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLDZFQUE2RTtvQkFDN0UsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFO3dCQUN6RCxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDOUQ7eUJBQU07d0JBQ0wsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDMUI7Z0JBQ0gsQ0FBQyxDQUFBO2dCQUNELE9BQU8sRUFBRSxlQUFlO2FBQ3pCO1lBRUQsbUZBQW1GO1lBQ25GLElBQUksQ0FBQyxjQUFjO2dCQUNqQixJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUV0RyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsYUFBYTtnQkFDYixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxLQUFLLEtBQUssVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDbkMsWUFBWTtnQkFDWixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDekM7OztnQkFHRyxTQUFTLEdBQThDLElBQUksQ0FBQyxTQUFTO1lBQ3pFLG1GQUFtRjtZQUNuRixJQUNFLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUTtnQkFDNUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDekIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELFNBQVMsWUFBWSxLQUFLLEVBQzFCO2dCQUNBLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTztvQkFDVixJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDeEc7WUFDRCw0Q0FBNEM7WUFDNUMsSUFBSSxDQUFDLGlCQUFpQjs7O1lBQUc7Z0JBQ3ZCLE9BQU8sSUFBSSxPQUFPOzs7O2dCQUFDLFVBQUMsT0FBbUI7O3dCQUMvQiwyQkFBMkI7OztvQkFBYTt3QkFDNUMsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFOzRCQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQ0FDN0IsU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3pCOztnQ0FFSyxhQUFXLEdBQW9CLEVBQUU7NEJBQ3ZDLFNBQVMsQ0FBQyxPQUFPOzs7Ozs0QkFBQyxVQUFDLENBQU0sRUFBRSxDQUFTOztvQ0FDNUIsYUFBYSxHQUFrQixJQUFJLE9BQU8sRUFBUTtnQ0FDeEQsYUFBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQ0FDaEMsNkRBQTZEO2dDQUM3RCxLQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUN2RixDQUFDLEVBQUMsQ0FBQzs7Z0NBQ0csYUFBVyxHQUFpQixRQUFRLHdCQUFJLGFBQVcsR0FDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUNBQ25ELFNBQVM7Ozs0QkFBQztnQ0FDVCw0RUFBNEU7Z0NBQzVFLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7b0NBQ3pELEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQ0FDdEQ7cUNBQU07b0NBQ0wsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQ0FDMUI7Z0NBQ0QsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUNyQixhQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7NEJBQzVCLENBQUMsRUFBQzt5QkFDTDt3QkFFRCw0RUFBNEU7d0JBQzVFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs7Z0NBQ1YsV0FBUyxHQUFvQixFQUFFOzRCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Ozs7NEJBQUMsVUFBQyxPQUFxQjs7b0NBQ25DLFdBQVcsR0FBa0IsSUFBSSxPQUFPLEVBQVE7Z0NBQ3RELFdBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0NBQzVCLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7NEJBQ3BFLENBQUMsRUFBQyxDQUFDOztnQ0FFRyxXQUFTLEdBQWlCLEtBQUssd0JBQUksV0FBUyxHQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUNBQ2xFLFNBQVM7Ozs0QkFBQztnQ0FDVCxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dDQUM3QixXQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7NEJBQzFCLENBQUMsRUFBQzt5QkFDTDtvQkFDSCxDQUFDLENBQUE7O3dCQUVLLFdBQVcsR0FBa0IsSUFBSSxPQUFPLEVBQVE7O3dCQUNoRCxnQkFBZ0IsR0FBb0IsSUFBSSxPQUFPLEVBQVU7O3dCQUN6RCxlQUFlLEdBQTRCLElBQUksZUFBZSxDQUFTLENBQUMsQ0FBQyxDQUFDOzt3QkFFNUUsRUFBVTtvQkFDZCw0RUFBNEU7b0JBQzVFLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTt3QkFDckMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7cUJBQ3BCO3lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTt3QkFDekYsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO3FCQUM1QjtvQkFDRCwyRkFBMkY7b0JBQzNGLElBQUksRUFBRSxFQUFFO3dCQUNOLHNGQUFzRjt3QkFDdEYsK0hBQStIO3dCQUMvSCxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxtQkFBSyxLQUFJLENBQUMsWUFBWSxFQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQzVFLEtBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsaUJBQWlCLENBQUM7Z0NBQ25ELE9BQU8sRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQzs2QkFDdEUsQ0FBQyxDQUFDO3lCQUNKO3dCQUNELHdGQUF3Rjt3QkFDeEYsZUFBZTs2QkFDWixJQUFJLENBQ0gsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQzdELFNBQVM7Ozs7d0JBQUMsVUFBQyxHQUFXOzRCQUNwQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dDQUN0RSxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQzs2QkFDM0M7NEJBQ0QsT0FBTyxHQUFHLEdBQUcsOEJBQThCLENBQUM7d0JBQzlDLENBQUMsRUFBQyxDQUNIOzZCQUNBLFNBQVM7Ozs7d0JBQUMsVUFBQyxRQUFnQjs0QkFDMUIsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3hCLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUM1Qix1RkFBdUY7NEJBQ3ZGLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRTtnQ0FDL0Qsb0VBQW9FO2dDQUNwRSxtRUFBbUU7Z0NBQ25FLGtFQUFrRTtnQ0FDbEUsSUFBSSxTQUFTLEVBQUU7b0NBQ2IsSUFBSSxDQUFDLG1CQUFLLEtBQUksQ0FBQyxZQUFZLEVBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTt3Q0FDcEYsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQ0FDMUI7eUNBQU07d0NBQ0wsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQ0FDMUI7b0NBQ0QsU0FBUyxHQUFHLEtBQUssQ0FBQztpQ0FDbkI7cUNBQU07Ozt3Q0FFQyxXQUFXLEdBQWtCLEtBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFO29DQUNyRSxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7b0NBQ3RCLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ3pCLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsbUJBQTJCLFdBQVcsRUFBQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7aUNBQzNFOzZCQUNGO2lDQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRTtnQ0FDNUQsbUdBQW1HO2dDQUNuRyxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUNuRDtpQ0FBTTtnQ0FDTCxzQ0FBc0M7Z0NBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0NBQWtDLEVBQUUsbUJBQWMsUUFBUSxZQUFTLENBQUMsQ0FBQztnQ0FDbEYsbUNBQW1DO2dDQUNuQyxPQUFPLEVBQUUsQ0FBQzs2QkFDWDt3QkFDSCxDQUFDLEVBQUMsQ0FBQzt3QkFFTCw2REFBNkQ7d0JBQzdELEtBQUssQ0FDSCxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxzQ0FBc0MsRUFDdkcsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksOEJBQThCLENBQzFGOzZCQUNFLElBQUk7d0JBQ0gsc0dBQXNHO3dCQUN0RyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUNqRTs2QkFDQSxTQUFTOzs7d0JBQUM7O2dDQUNILE9BQU8sR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7NEJBQ3ZELDJFQUEyRTs0QkFDM0UsSUFBSSxPQUFPLEVBQUU7Z0NBQ1gsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUNuQixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7Z0NBQ3ZCLDJCQUEyQixFQUFFLENBQUM7Z0NBQzlCLE9BQU8sRUFBRSxDQUFDOzZCQUNYO2lDQUFNO2dDQUNMLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs2QkFDakQ7d0JBQ0gsQ0FBQyxFQUFDLENBQUM7d0JBRUwsNENBQTRDO3dCQUM1QyxlQUFlLENBQUMsU0FBUzs7O3dCQUFDOzRCQUN4QixXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ25CLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFDdkIsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3hCLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUM5QixDQUFDLEVBQUMsQ0FBQztxQkFDSjt5QkFBTTt3QkFDTCx5RUFBeUU7d0JBQ3pFLEtBQUssQ0FDSCxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxzQ0FBc0MsQ0FDeEc7NkJBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzs2QkFDdkMsU0FBUzs7O3dCQUFDOzRCQUNULE9BQU8sRUFBRSxDQUFDO3dCQUNaLENBQUMsRUFBQyxDQUFDO3FCQUNOO2dCQUNILENBQUMsRUFBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFBLENBQUM7UUFDSixDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7Ozs7O0lBRU8sdUNBQVU7Ozs7Ozs7O0lBQWxCLFVBQ0UsT0FBcUIsRUFDckIsY0FBbUMsRUFDbkMsTUFBcUIsRUFDckIsZUFBOEI7O1lBRXhCLFFBQVEsR0FBVyxPQUFPLENBQUMsUUFBUTs7WUFDbkMsS0FBSyxHQUFXLE9BQU8sQ0FBQyxLQUFLOzs7WUFFN0IsU0FBUyxHQUFpQixLQUFLLENBQ25DLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxzQ0FBc0MsRUFDM0YsQ0FBQyxjQUFjLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLDhCQUE4QixDQUM5RTthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDaEMsU0FBUzs7O1FBQUM7O2dCQUNILE9BQU8sR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDN0QsMkVBQTJFO1lBQzNFLElBQUksT0FBTyxFQUFFO2dCQUNYLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFFeEIsSUFBSSxLQUFLLEtBQUssVUFBVSxDQUFDLEtBQUssRUFBRTtvQkFDOUIsMERBQTBEO29CQUMxRCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2QsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUNuQjtxQkFBTSxJQUNMLEtBQUssS0FBSyxVQUFVLENBQUMsS0FBSztvQkFDMUIsS0FBSyxLQUFLLFVBQVUsQ0FBQyxXQUFXO29CQUNoQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDcEM7Ozt3QkFFTSxTQUFTLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O3dCQUN2QyxVQUFRLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO3lCQUMxQixJQUFJLENBQ0gsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFDeEQsTUFBTTs7OztvQkFBQyxVQUFDLE1BQWE7d0JBQ25CLHFFQUFxRTt3QkFDckUsSUFBSSxNQUFNLFlBQVksYUFBYSxFQUFFOzRCQUNuQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVEsRUFBRTtnQ0FDOUMsT0FBTyxJQUFJLENBQUM7NkJBQ2I7NEJBQ0QsT0FBTyxLQUFLLENBQUM7eUJBQ2Q7NkJBQU07NEJBQ0wsT0FBTyxJQUFJLENBQUM7eUJBQ2I7b0JBQ0gsQ0FBQyxFQUFDLENBQ0g7eUJBQ0EsU0FBUzs7O29CQUFDO3dCQUNULE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDZCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3BCLENBQUMsRUFBQyxDQUFDO2lCQUNOO3FCQUFNLElBQUksS0FBSyxLQUFLLFVBQVUsQ0FBQyxPQUFPLEVBQUU7Ozt3QkFFakMsVUFBUSxHQUFxQixJQUFJLGdCQUFnQjs7O29CQUFDO3dCQUN0RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ3BDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs0QkFDZCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ2xCLFVBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt5QkFDdkI7b0JBQ0gsQ0FBQyxFQUFDO29CQUVGLHFDQUFxQztvQkFDckMsZUFBZSxDQUFDLFNBQVM7OztvQkFBQzt3QkFDeEIsVUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUN4QixDQUFDLEVBQUMsQ0FBQztvQkFDSCxpREFBaUQ7b0JBQ2pELFVBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUNqRjthQUNGO1FBQ0gsQ0FBQyxFQUFDO0lBQ04sQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXphRCxDQUF3QyxrQkFBa0IsR0F5YXpEOzs7Ozs7O0lBeGFDLDhDQUF3Qzs7SUFFeEMsMENBQTRCOztJQUM1Qix5Q0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGltZXIsIFN1YmplY3QsIEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50LCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBza2lwV2hpbGUsIGZpbHRlciwgc2tpcCwgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIFRvdXJTdGVwID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucztcbmV4cG9ydCB0eXBlIFRvdXJTdGVwQnV0dG9uID0gU2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9uc0J1dHRvbjtcblxuZXhwb3J0IGVudW0gSVRvdXJFdmVudCB7XG4gICdjbGljaycgPSAnY2xpY2snLFxuICAncG9pbnRlcm92ZXInID0gJ3BvaW50ZXJvdmVyJyxcbiAgJ2tleXVwJyA9ICdrZXl1cCcsXG4gICdhZGRlZCcgPSAnYWRkZWQnLCAvLyBhZGRlZCB0byBET01cbiAgJ3JlbW92ZWQnID0gJ3JlbW92ZWQnLCAvLyByZW1vdmVkIGZyb20gRE9NXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJFdmVudE9uIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7IC8vIGNzcyBzZWxlY3RvclxuICBldmVudD86IGtleW9mIHR5cGVvZiBJVG91ckV2ZW50OyAvLyBjbGljaywgcG9pbnRlcm92ZXIsIGtleXVwLCBhZGRlZCwgcmVtb3ZlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyRXZlbnRPbk9wdGlvbnMge1xuICB0aW1lQmVmb3JlU2hvdz86IG51bWJlcjsgLy8gZGVsYXkgYmVmb3JlIHN0ZXAgaXMgZGlzcGxheWVkXG4gIGludGVydmFsPzogbnVtYmVyOyAvLyB0aW1lIGJldHdlZW4gc2VhcmNoZXMgZm9yIGVsZW1lbnQsIGRlZmF1bHRzIHRvIDUwMG1zXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJBYm9ydE9uIGV4dGVuZHMgSVRvdXJFdmVudE9uIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJPcHRpb25zIGV4dGVuZHMgU2hlcGhlcmQuVG91ci5Ub3VyT3B0aW9ucyB7XG4gIGFib3J0T24/OiBJVG91ckFib3J0T25bXTsgLy8gZXZlbnRzIHRvIGFib3J0IG9uXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRvdXJTdGVwQXR0YWNoVG9PcHRpb25zIGV4dGVuZHMgSVRvdXJFdmVudE9uT3B0aW9ucyB7XG4gIGhpZ2hsaWdodD86IGJvb2xlYW47XG4gIHJldHJpZXM/OiBudW1iZXI7IC8vICMgbnVtIG9mIGF0dGVtcHRzIHRvIGZpbmQgZWxlbWVudFxuICBza2lwSWZOb3RGb3VuZD86IGJvb2xlYW47IC8vIGlmIGVsZW1lbnQgaXMgbm90IGZvdW5kIGFmdGVyIG4gcmV0cmllcywgbW92ZSBvbiB0byBuZXh0IHN0ZXBcbiAgZWxzZT86IHN0cmluZzsgLy8gaWYgZWxlbWVudCBpcyBub3QgZm91bmQsIGdvIHRvIHN0ZXAgd2l0aCB0aGlzIGlkXG4gIGdvQmFja1RvPzogc3RyaW5nOyAvLyBiYWNrIGJ1dHRvbiBnb2VzIGJhY2sgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgc2tpcEZyb21TdGVwQ291bnQ/OiBib29sZWFuOyAvLyBzaG93L2hpZGUgcHJvZ3Jlc3Mgb24gc3RlcFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbiBleHRlbmRzIElUb3VyRXZlbnRPbiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnMgZXh0ZW5kcyBJVG91ckV2ZW50T25PcHRpb25zIHtcbiAganVtcFRvPzogc3RyaW5nOyAvLyBuZXh0IGJ1dHRvbiB3aWxsIGp1bXAgdG8gc3RlcCB3aXRoIHRoaXMgaWRcbiAgYWxsb3dHb0JhY2s/OiBib29sZWFuOyAvLyBhbGxvdyBiYWNrIHdpdGhpbiB0aGlzIHN0ZXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVG91clN0ZXAgZXh0ZW5kcyBUb3VyU3RlcCB7XG4gIGF0dGFjaFRvT3B0aW9ucz86IElUb3VyU3RlcEF0dGFjaFRvT3B0aW9ucztcbiAgYWR2YW5jZU9uT3B0aW9ucz86IElUb3VyU3RlcEFkdmFuY2VPbk9wdGlvbnM7XG4gIGFkdmFuY2VPbj86IElUb3VyU3RlcEFkdmFuY2VPbltdIHwgSVRvdXJTdGVwQWR2YW5jZU9uIHwgYW55O1xuICBhYm9ydE9uPzogSVRvdXJBYm9ydE9uW107XG4gIGNvdW50PzogbnVtYmVyO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBUb3VyQnV0dG9uc0FjdGlvbnMge1xuICBhYnN0cmFjdCBuZXh0KCk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgYmFjaygpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGNhbmNlbCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGZpbmlzaCgpOiB2b2lkO1xufVxuXG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVzogbnVtYmVyID0gMTAwO1xuY29uc3QgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMOiBudW1iZXIgPSA1MDA7XG5jb25zdCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM6IG51bWJlciA9IDIwO1xuXG5jb25zdCBvdmVycmlkZGVuRXZlbnRzOiBzdHJpbmdbXSA9IFtcbiAgSVRvdXJFdmVudC5jbGljayxcbiAgSVRvdXJFdmVudC5wb2ludGVyb3ZlcixcbiAgSVRvdXJFdmVudC5yZW1vdmVkLFxuICBJVG91ckV2ZW50LmFkZGVkLFxuICBJVG91ckV2ZW50LmtleXVwLFxuXTtcblxuY29uc3Qga2V5RXZlbnRzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oW1xuICBbMTMsICdlbnRlciddLFxuICBbMjcsICdlc2MnXSxcbl0pO1xuXG5jb25zdCBkZWZhdWx0U3RlcE9wdGlvbnM6IFRvdXJTdGVwID0ge1xuICBzY3JvbGxUbzogeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9LFxuICBjYW5jZWxJY29uOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IE1BVF9JQ09OX0JVVFRPTjogc3RyaW5nID0gJ21hdC1pY29uLWJ1dHRvbiBtYXRlcmlhbC1pY29ucyBtYXQtYnV0dG9uLWJhc2UnO1xuY29uc3QgTUFUX0JVVFRPTjogc3RyaW5nID0gJ21hdC1idXR0b24tYmFzZSBtYXQtYnV0dG9uJztcbmNvbnN0IE1BVF9CVVRUT05fSU5WSVNJQkxFOiBzdHJpbmcgPSAnc2hlcGhlcmQtdm9pZC1idXR0b24nO1xuXG5leHBvcnQgY2xhc3MgQ292YWxlbnRHdWlkZWRUb3VyIGV4dGVuZHMgVG91ckJ1dHRvbnNBY3Rpb25zIHtcbiAgcHJpdmF0ZSBfZGVzdHJveWVkRXZlbnQkOiBTdWJqZWN0PHZvaWQ+O1xuXG4gIHNoZXBoZXJkVG91cjogU2hlcGhlcmQuVG91cjtcbiAgc3RlcE9wdGlvbnM6IElUb3VyU3RlcDtcblxuICBjb25zdHJ1Y3RvcihzdGVwT3B0aW9uczogSVRvdXJTdGVwID0gZGVmYXVsdFN0ZXBPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RlcE9wdGlvbnMgPSBzdGVwT3B0aW9ucztcbiAgICB0aGlzLm5ld1RvdXIoKTtcbiAgfVxuXG4gIG5ld1RvdXIob3B0cz86IElUb3VyT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyID0gbmV3IFNoZXBoZXJkLlRvdXIoXG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgZGVmYXVsdFN0ZXBPcHRpb25zOiB0aGlzLnN0ZXBPcHRpb25zLFxuICAgICAgICB9LFxuICAgICAgICBvcHRzLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkRXZlbnQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAvLyBsaXN0ZW4gdG8gY2FuY2VsIGFuZCBjb21wbGV0ZSB0byBjbGVhbiB1cCBhYm9ydE9uIGV2ZW50c1xuICAgIG1lcmdlKGZyb21FdmVudCh0aGlzLnNoZXBoZXJkVG91ciwgJ2NhbmNlbCcpLCBmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsICdjb21wbGV0ZScpKVxuICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQubmV4dCgpO1xuICAgICAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gaWYgYWJvcnRPbiB3YXMgcGFzc2VkLCB3ZSBiaW5kIHRoZSBldmVudCBhbmQgZXhlY3V0ZSBjb21wbGV0ZVxuICAgIGlmIChvcHRzICYmIG9wdHMuYWJvcnRPbikge1xuICAgICAgY29uc3QgYWJvcnRBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgIG9wdHMuYWJvcnRPbi5mb3JFYWNoKChhYm9ydE9uOiBJVG91ckFib3J0T24pID0+IHtcbiAgICAgICAgY29uc3QgYWJvcnRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICBhYm9ydEFyciQucHVzaChhYm9ydEV2ZW50JCk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudChhYm9ydE9uLCB1bmRlZmluZWQsIGFib3J0RXZlbnQkLCB0aGlzLl9kZXN0cm95ZWRFdmVudCQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFib3J0U3ViczogU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uYWJvcnRBcnIkKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkRXZlbnQkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY29tcGxldGUoKTtcbiAgICAgICAgICBhYm9ydFN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5iYWNrKCk7XG4gIH1cblxuICBjYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuY2FuY2VsKCk7XG4gIH1cblxuICBuZXh0KCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLm5leHQoKTtcbiAgfVxuXG4gIGZpbmlzaCgpOiB2b2lkIHtcbiAgICB0aGlzLnNoZXBoZXJkVG91ci5jb21wbGV0ZSgpO1xuICB9XG5cbiAgYWRkU3RlcHMoc3RlcHM6IElUb3VyU3RlcFtdKTogdm9pZCB7XG4gICAgdGhpcy5zaGVwaGVyZFRvdXIuYWRkU3RlcHModGhpcy5fcHJlcGFyZVRvdXIoc3RlcHMpKTtcbiAgfVxuXG4gIHN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuc2hlcGhlcmRUb3VyLnN0YXJ0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ByZXBhcmVUb3VyKG9yaWdpbmFsU3RlcHM6IElUb3VyU3RlcFtdLCBmaW5pc2hMYWJlbDogc3RyaW5nID0gJ2ZpbmlzaCcpOiBJVG91clN0ZXBbXSB7XG4gICAgLy8gY3JlYXRlIFN1YmplY3RzIGZvciBiYWNrIGFuZCBmb3J3YXJkIGV2ZW50c1xuICAgIGNvbnN0IGJhY2tFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGNvbnN0IGZvcndhcmRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIGxldCBfYmFja0Zsb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBjcmVhdGUgU3ViamVjdCBmb3IgeW91ciBlbmRcbiAgICBjb25zdCBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgc3RlcCBwcm9ncmVzcyBpbiB0aGUgZm9vdGVyIG9mIHRoZSBzaGVwaGVyZCB0b29sdGlwXG4gICAgICovXG4gICAgY29uc3QgYXBwZW5kUHJvZ3Jlc3NGdW5jOiBGdW5jdGlvbiA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgIC8vIGdldCBhbGwgdGhlIGZvb3RlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGZvb3RlcnM6IEVsZW1lbnRbXSA9IEFycmF5LmZyb208RWxlbWVudD4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNoZXBoZXJkLWZvb3RlcicpKTtcbiAgICAgIC8vIGdldCB0aGUgbGFzdCBmb290ZXIgc2luY2UgU2hlcGhlcmQgYWx3YXlzIHB1dHMgdGhlIGFjdGl2ZSBvbmUgYXQgdGhlIGVuZFxuICAgICAgY29uc3QgZm9vdGVyOiBFbGVtZW50ID0gZm9vdGVyc1tmb290ZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gZ2VuZXJhdGUgc3RlcHMgaHRtbCBlbGVtZW50XG4gICAgICBjb25zdCBwcm9ncmVzczogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvZ3Jlc3MuY2xhc3NOYW1lID0gJ3NoZXBoZXJkLXByb2dyZXNzJztcbiAgICAgIHByb2dyZXNzLmlubmVyVGV4dCA9IGAke3RoaXMuc2hlcGhlcmRUb3VyLmN1cnJlbnRTdGVwLm9wdGlvbnMuY291bnR9LyR7c3RlcFRvdGFsfWA7XG4gICAgICAvLyBpbnNlcnQgaW50byB0aGUgZm9vdGVyIGJlZm9yZSB0aGUgZmlyc3QgYnV0dG9uXG4gICAgICBmb290ZXIuaW5zZXJ0QmVmb3JlKHByb2dyZXNzLCBmb290ZXIucXVlcnlTZWxlY3RvcignLnNoZXBoZXJkLWJ1dHRvbicpKTtcbiAgICB9O1xuXG4gICAgbGV0IHN0ZXBUb3RhbDogbnVtYmVyID0gMDtcbiAgICBjb25zdCBzdGVwczogSVRvdXJTdGVwW10gPSBvcmlnaW5hbFN0ZXBzLm1hcCgoc3RlcDogSVRvdXJTdGVwKSA9PiB7XG4gICAgICBsZXQgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcbiAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucz8uc2tpcEZyb21TdGVwQ291bnQgPT09IHRydWUpIHtcbiAgICAgICAgc2hvd1Byb2dyZXNzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHN0ZXAuYXR0YWNoVG9PcHRpb25zPy5za2lwRnJvbVN0ZXBDb3VudCA9PT0gZmFsc2VcbiAgICAgICkge1xuICAgICAgICBzdGVwLmNvdW50ID0gKytzdGVwVG90YWw7XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IGFwcGVuZFByb2dyZXNzRnVuYy5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0ZXAsIHtcbiAgICAgICAgd2hlbjoge1xuICAgICAgICAgIHNob3c6IHNob3dQcm9ncmVzcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgIHRleHQ6IGZpbmlzaExhYmVsLFxuICAgICAgYWN0aW9uOiB0aGlzWydmaW5pc2gnXS5iaW5kKHRoaXMpLFxuICAgICAgY2xhc3NlczogTUFUX0JVVFRPTixcbiAgICB9O1xuXG4gICAgY29uc3Qgdm9pZEJ1dHRvbjogVG91clN0ZXBCdXR0b24gPSB7XG4gICAgICB0ZXh0OiAnJyxcbiAgICAgIGFjdGlvbigpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSxcbiAgICAgIGNsYXNzZXM6IE1BVF9CVVRUT05fSU5WSVNJQkxFLFxuICAgIH07XG5cbiAgICAvLyBsaXN0ZW4gdG8gdGhlIGRlc3Ryb3llZCBldmVudCB0byBjbGVhbiB1cCBhbGwgdGhlIHN0cmVhbXNcbiAgICB0aGlzLl9kZXN0cm95ZWRFdmVudCQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgYmFja0V2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZm9yd2FyZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgZGVzdHJveWVkRXZlbnQkLm5leHQoKTtcbiAgICAgIGRlc3Ryb3llZEV2ZW50JC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxTdGVwczogbnVtYmVyID0gc3RlcHMubGVuZ3RoO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXA6IElUb3VyU3RlcCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgLy8gY3JlYXRlIGJ1dHRvbnMgc3BlY2lmaWMgZm9yIHRoZSBzdGVwXG4gICAgICAvLyB0aGlzIGlzIGRvbmUgdG8gY3JlYXRlIG1vcmUgY29udHJvbCBvbiBldmVudHNcbiAgICAgIGNvbnN0IG5leHRCdXR0b246IFRvdXJTdGVwQnV0dG9uID0ge1xuICAgICAgICB0ZXh0OiAnY2hldnJvbl9yaWdodCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgbmV4dCBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG4gICAgICBjb25zdCBiYWNrQnV0dG9uOiBUb3VyU3RlcEJ1dHRvbiA9IHtcbiAgICAgICAgdGV4dDogJ2NoZXZyb25fbGVmdCcsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIGludGVyY2VwdCB0aGUgYmFjayBhY3Rpb24gYW5kIHRyaWdnZXIgZXZlbnRcbiAgICAgICAgICBiYWNrRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICBfYmFja0Zsb3cgPSB0cnVlO1xuICAgICAgICAgIC8vIGNoZWNrIGlmICdnb0JhY2tUbycgaXMgc2V0IHRvIGp1bXAgdG8gYSBwYXJ0aWN1bGFyIHN0ZXAsIGVsc2UganVzdCBnbyBiYWNrXG4gICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvKSB7XG4gICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5zaG93KHN0ZXAuYXR0YWNoVG9PcHRpb25zLmdvQmFja1RvLCBmYWxzZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IE1BVF9JQ09OX0JVVFRPTixcbiAgICAgIH07XG5cbiAgICAgIC8vIGNoZWNrIGlmIGhpZ2hsaWdodCB3YXMgcHJvdmlkZWQgZm9yIHRoZSBzdGVwLCBlbHNlIGZhbGxiYWNrIGludG8gc2hlcGhlcmRzIHVzYWdlXG4gICAgICBzdGVwLmhpZ2hsaWdodENsYXNzID1cbiAgICAgICAgc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuaGlnaGxpZ2h0ID8gJ3NoZXBoZXJkLWhpZ2hsaWdodCcgOiBzdGVwLmhpZ2hsaWdodENsYXNzO1xuXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gZmlyc3Qgc3RlcFxuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbbmV4dEJ1dHRvbl07XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSB0b3RhbFN0ZXBzIC0gMSkge1xuICAgICAgICAvLyBsYXN0IHN0ZXBcbiAgICAgICAgc3RlcC5idXR0b25zID0gW2JhY2tCdXR0b24sIGZpbmlzaEJ1dHRvbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGVwLmJ1dHRvbnMgPSBbYmFja0J1dHRvbiwgbmV4dEJ1dHRvbl07XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrcyBcImFkdmFuY2VPblwiIHRvIG92ZXJyaWRlIGxpc3RlbmVyc1xuICAgICAgbGV0IGFkdmFuY2VPbjogSVRvdXJTdGVwQWR2YW5jZU9uW10gfCBJVG91clN0ZXBBZHZhbmNlT24gPSBzdGVwLmFkdmFuY2VPbjtcbiAgICAgIC8vIHJlbW92ZSB0aGUgc2hlcGhlcmQgXCJhZHZhbmNlT25cIiBpbmZhdm9yIG9mIG91cnMgaWYgdGhlIGV2ZW50IGlzIHBhcnQgb2Ygb3VyIGxpc3RcbiAgICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiBhZHZhbmNlT24gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSAmJlxuICAgICAgICAgIG92ZXJyaWRkZW5FdmVudHMuaW5kZXhPZihhZHZhbmNlT24uZXZlbnQuc3BsaXQoJy4nKVswXSkgPiAtMSkgfHxcbiAgICAgICAgYWR2YW5jZU9uIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICkge1xuICAgICAgICBzdGVwLmFkdmFuY2VPbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RlcC5idXR0b25zID1cbiAgICAgICAgICBzdGVwLmFkdmFuY2VPbk9wdGlvbnMgJiYgc3RlcC5hZHZhbmNlT25PcHRpb25zLmFsbG93R29CYWNrID8gW2JhY2tCdXR0b24sIHZvaWRCdXR0b25dIDogW3ZvaWRCdXR0b25dO1xuICAgICAgfVxuICAgICAgLy8gYWRkcyBhIGRlZmF1bHQgYmVmb3JlU2hvd1Byb21pc2UgZnVuY3Rpb25cbiAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxDYXBhYmlsaXRpZXNTZXR1cDogRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWR2YW5jZU9uICYmICFzdGVwLmFkdmFuY2VPbikge1xuICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWR2YW5jZU9uKSkge1xuICAgICAgICAgICAgICAgIGFkdmFuY2VPbiA9IFthZHZhbmNlT25dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgYWR2YW5jZUFyciQ6IFN1YmplY3Q8dm9pZD5bXSA9IFtdO1xuICAgICAgICAgICAgICBhZHZhbmNlT24uZm9yRWFjaCgoXzogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlRXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhZHZhbmNlQXJyJC5wdXNoKGFkdmFuY2VFdmVudCQpO1xuICAgICAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRXZlbnQoYWR2YW5jZU9uW2ldLCBzdGVwLmFkdmFuY2VPbk9wdGlvbnMsIGFkdmFuY2VFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb25zdCBhZHZhbmNlU3ViczogU3Vic2NyaXB0aW9uID0gZm9ya0pvaW4oLi4uYWR2YW5jZUFyciQpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKGRlc3Ryb3llZEV2ZW50JCwgYmFja0V2ZW50JCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhZHZhbmNlIHRvIGEgc3BlY2lmaWMgc3RlcCwgZWxzZSBhZHZhbmNlIHRvIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYWR2YW5jZU9uT3B0aW9ucyAmJiBzdGVwLmFkdmFuY2VPbk9wdGlvbnMuanVtcFRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLnNob3coc3RlcC5hZHZhbmNlT25PcHRpb25zLmp1bXBUbyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBmb3J3YXJkRXZlbnQkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIGFkdmFuY2VTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGFib3J0T24gd2FzIHBhc3NlZCBvbiB0aGUgc3RlcCwgd2UgYmluZCB0aGUgZXZlbnQgYW5kIGV4ZWN1dGUgY29tcGxldGVcbiAgICAgICAgICAgIGlmIChzdGVwLmFib3J0T24pIHtcbiAgICAgICAgICAgICAgY29uc3QgYWJvcnRBcnIkOiBTdWJqZWN0PHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgc3RlcC5hYm9ydE9uLmZvckVhY2goKGFib3J0T246IElUb3VyQWJvcnRPbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFib3J0RXZlbnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICAgICAgICAgICAgICBhYm9ydEFyciQucHVzaChhYm9ydEV2ZW50JCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEV2ZW50KGFib3J0T24sIHVuZGVmaW5lZCwgYWJvcnRFdmVudCQsIGRlc3Ryb3llZEV2ZW50JCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGFib3J0U3ViczogU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uYWJvcnRBcnIkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQsIGJhY2tFdmVudCQsIGZvcndhcmRFdmVudCQpKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhYm9ydFN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgX3N0b3BUaW1lciQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgICAgICAgIGNvbnN0IF9yZXRyaWVzUmVhY2hlZCQ6IFN1YmplY3Q8bnVtYmVyPiA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcbiAgICAgICAgICBjb25zdCBfcmV0cnlBdHRlbXB0cyQ6IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KC0xKTtcblxuICAgICAgICAgIGxldCBpZDogc3RyaW5nO1xuICAgICAgICAgIC8vIGNoZWNrcyBpZiBcImF0dGFjaFRvXCIgaXMgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IHRvIGdldCB0aGUgaWQgb2YgYW4gZWxlbWVudFxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RlcC5hdHRhY2hUbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlkID0gc3RlcC5hdHRhY2hUbztcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdGVwLmF0dGFjaFRvID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RlcC5hdHRhY2hUby5lbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWQgPSBzdGVwLmF0dGFjaFRvLmVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYW4gaWQgYXMgYSBzdHJpbmcgaW4gZWl0aGVyIGNhc2UsIHdlIHVzZSBpdCAod2UgaWdub3JlIGl0IGlmIGl0cyBIVE1MRWxlbWVudClcbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIC8vIGlmIGN1cnJlbnQgc3RlcCBpcyB0aGUgZmlyc3Qgc3RlcCBvZiB0aGUgdG91ciwgd2Ugc2V0IHRoZSBidXR0b25zIHRvIGJlIG9ubHkgXCJuZXh0XCJcbiAgICAgICAgICAgIC8vIHdlIGhhZCB0byB1c2UgYGFueWAgc2luY2UgdGhlIHRvdXIgZG9lc250IGV4cG9zZSB0aGUgc3RlcHMgaW4gYW55IGZhc2hpb24gbm9yIGEgd2F5IHRvIGNoZWNrIGlmIHdlIGhhdmUgbW9kaWZpZWQgdGhlbSBhdCBhbGxcbiAgICAgICAgICAgIGlmICh0aGlzLnNoZXBoZXJkVG91ci5nZXRDdXJyZW50U3RlcCgpID09PSAoPGFueT50aGlzLnNoZXBoZXJkVG91cikuc3RlcHNbMF0pIHtcbiAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKS51cGRhdGVTdGVwT3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgYnV0dG9uczogb3JpZ2luYWxTdGVwc1tpbmRleF0uYWR2YW5jZU9uID8gW3ZvaWRCdXR0b25dIDogW25leHRCdXR0b25dLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRvIHRoZSBhdHRlbXB0cyBvYnNlcnZhYmxlIHRvIG5vdGlmeSBkZWV2ZWxvcGVyIHdoZW4gbnVtYmVyIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgIF9yZXRyeUF0dGVtcHRzJFxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBza2lwKDEpLFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbChtZXJnZShfc3RvcFRpbWVyJC5hc09ic2VydmFibGUoKSwgZGVzdHJveWVkRXZlbnQkKSksXG4gICAgICAgICAgICAgICAgc2tpcFdoaWxlKCh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAuYXR0YWNoVG9PcHRpb25zICYmIHN0ZXAuYXR0YWNoVG9PcHRpb25zLnJldHJpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDwgc3RlcC5hdHRhY2hUb09wdGlvbnMucmV0cmllcztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfQVRURU1QVFM7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoYXR0ZW1wdHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRlbXB0cyBoYXZlIGJlZW4gcmVhY2hlZCwgd2UgY2hlY2sgXCJza2lwSWZOb3RGb3VuZFwiIHRvIG1vdmUgb24gdG8gdGhlIG5leHQgc3RlcFxuICAgICAgICAgICAgICAgIGlmIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5za2lwSWZOb3RGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZ2V0IHRvIHRoaXMgc3RlcCBjb21pbmcgYmFjayBmcm9tIGEgc3RlcCBhbmQgaXQgd2FzbnQgZm91bmRcbiAgICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgZWl0aGVyIGNoZWNrIGlmIGl0cyB0aGUgZmlyc3Qgc3RlcCBhbmQgdHJ5IGdvaW5nIGZvcndhcmRcbiAgICAgICAgICAgICAgICAgIC8vIG9yIHdlIGtlZXAgZ29pbmcgYmFjayB1bnRpbCB3ZSBmaW5kIGEgc3RlcCB0aGF0IGFjdHVhbGx5IGV4aXN0c1xuICAgICAgICAgICAgICAgICAgaWYgKF9iYWNrRmxvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKDxhbnk+dGhpcy5zaGVwaGVyZFRvdXIpLnN0ZXBzLmluZGV4T2YodGhpcy5zaGVwaGVyZFRvdXIuZ2V0Q3VycmVudFN0ZXAoKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9iYWNrRmxvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVzdHJveXMgY3VycmVudCBzdGVwIGlmIHdlIG5lZWQgdG8gc2tpcCBpdCB0byByZW1vdmUgaXQgZnJvbSB0aGUgdG91clxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3RlcDogU2hlcGhlcmQuU3RlcCA9IHRoaXMuc2hlcGhlcmRUb3VyLmdldEN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5yZW1vdmVTdGVwKCg8U2hlcGhlcmQuU3RlcC5TdGVwT3B0aW9ucz5jdXJyZW50U3RlcCkuaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcC5hdHRhY2hUb09wdGlvbnMgJiYgc3RlcC5hdHRhY2hUb09wdGlvbnMuZWxzZSkge1xuICAgICAgICAgICAgICAgICAgLy8gaWYgXCJza2lwSWZOb3RGb3VuZFwiIGlzIG5vdCB0cnVlLCB0aGVuIHdlIGNoZWNrIGlmIFwiZWxzZVwiIGhhcyBiZWVuIHNldCB0byBqdW1wIHRvIGEgc3BlY2lmaWMgc3RlcFxuICAgICAgICAgICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuc2hvdyhzdGVwLmF0dGFjaFRvT3B0aW9ucy5lbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgUmV0cmllcyByZWFjaGVkIHRyeWluZyB0byBmaW5kICR7aWR9LiBSZXRyaWVkICAke2F0dGVtcHRzfSB0aW1lcy5gKTtcbiAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugd2Ugc2hvdyB0aGUgc3RlcCByZWdhcmRsZXNzXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gd2Ugc3RhcnQgYSB0aW1lciBvZiBhdHRlbXB0cyB0byBmaW5kIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAvLyB0aGUgdGltZXIgd2lsbCBjb250aW51ZSBlaXRoZXIgdW50aWwgd2UgZmluZCB0aGUgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzIGhhcyBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoX3N0b3BUaW1lciQsIF9yZXRyaWVzUmVhY2hlZCQsIGRlc3Ryb3llZEV2ZW50JCkpLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGJlZW4gZm91bmQsIHdlIHN0b3AgdGhlIHRpbWVyIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2FwYWJpbGl0aWVzU2V0dXAoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgX3JldHJ5QXR0ZW1wdHMkLm5leHQoX3JldHJ5QXR0ZW1wdHMkLnZhbHVlICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc3RvcCBmaW5kIGludGVydmFsIGlmIHVzZXIgc3RvcHMgdGhlIHRvdXJcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBfc3RvcFRpbWVyJC5uZXh0KCk7XG4gICAgICAgICAgICAgIF9zdG9wVGltZXIkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIF9yZXRyaWVzUmVhY2hlZCQubmV4dCgpO1xuICAgICAgICAgICAgICBfcmV0cmllc1JlYWNoZWQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVzb2x2ZSBvYnNlcnZhYmxlIHVudGlsIHRoZSB0aW1lQmVmb3JlU2hvdyBoYXMgcGFzc3NlZCBvciB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgdGltZXIoXG4gICAgICAgICAgICAgIChzdGVwLmF0dGFjaFRvT3B0aW9ucyAmJiBzdGVwLmF0dGFjaFRvT3B0aW9ucy50aW1lQmVmb3JlU2hvdykgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX1RJTUVfQkVGT1JFX1NIT1csXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZShkZXN0cm95ZWRFdmVudCQpKSlcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RlcHM7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnQoXG4gICAgZXZlbnRPbjogSVRvdXJFdmVudE9uLFxuICAgIGV2ZW50T25PcHRpb25zOiBJVG91ckV2ZW50T25PcHRpb25zLFxuICAgIGV2ZW50JDogU3ViamVjdDx2b2lkPixcbiAgICBkZXN0cm95ZWRFdmVudCQ6IFN1YmplY3Q8dm9pZD4sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdG9yOiBzdHJpbmcgPSBldmVudE9uLnNlbGVjdG9yO1xuICAgIGNvbnN0IGV2ZW50OiBzdHJpbmcgPSBldmVudE9uLmV2ZW50O1xuICAgIC8vIHdlIHN0YXJ0IGEgdGltZXIgb2YgYXR0ZW1wdHMgdG8gZmluZCBhbiBlbGVtZW50IGluIHRoZSBkb21cbiAgICBjb25zdCB0aW1lclN1YnM6IFN1YnNjcmlwdGlvbiA9IHRpbWVyKFxuICAgICAgKGV2ZW50T25PcHRpb25zICYmIGV2ZW50T25PcHRpb25zLnRpbWVCZWZvcmVTaG93KSB8fCBTSEVQSEVSRF9ERUZBVUxUX0ZJTkRfVElNRV9CRUZPUkVfU0hPVyxcbiAgICAgIChldmVudE9uT3B0aW9ucyAmJiBldmVudE9uT3B0aW9ucy5pbnRlcnZhbCkgfHwgU0hFUEhFUkRfREVGQVVMVF9GSU5EX0lOVEVSVkFMLFxuICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbChkZXN0cm95ZWRFdmVudCQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGZvdW5kLCB3ZSBzdG9wIHRoZSB0aW1lciBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHRpbWVyU3Vicy51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50ID09PSBJVG91ckV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgICAvLyBpZiBldmVudCBpcyBcIkFkZGVkXCIgdHJpZ2dlciBhIHNvb24gYXMgdGhpcyBpcyBhdHRhY2hlZC5cbiAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICBldmVudCQuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgZXZlbnQgPT09IElUb3VyRXZlbnQuY2xpY2sgfHxcbiAgICAgICAgICAgIGV2ZW50ID09PSBJVG91ckV2ZW50LnBvaW50ZXJvdmVyIHx8XG4gICAgICAgICAgICBldmVudC5pbmRleE9mKElUb3VyRXZlbnQua2V5dXApID4gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHdlIHVzZSBub3JtYWwgbGlzdGVuZXJzIGZvciBtb3VzZWV2ZW50c1xuICAgICAgICAgICAgY29uc3QgbWFpbkV2ZW50OiBzdHJpbmcgPSBldmVudC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc3ViRXZlbnQ6IHN0cmluZyA9IGV2ZW50LnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBmcm9tRXZlbnQoZWxlbWVudCwgbWFpbkV2ZW50KVxuICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwobWVyZ2UoZXZlbnQkLmFzT2JzZXJ2YWJsZSgpLCBkZXN0cm95ZWRFdmVudCQpKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKCRldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBpZiB0aGUgZXZlbnQgaXMgYSBrZXlib2FyZCBldmVudCBhbmQgcGFydCBvZiBvdXQgbGlzdFxuICAgICAgICAgICAgICAgICAgaWYgKCRldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleUV2ZW50cy5nZXQoJGV2ZW50LmtleUNvZGUpID09PSBzdWJFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50JC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQkLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IElUb3VyRXZlbnQucmVtb3ZlZCkge1xuICAgICAgICAgICAgLy8gYW5kIHdlIHdpbGwgdXNlIE11dGF0aW9uT2JzZXJ2ZXIgZm9yIERPTSBldmVudHNcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBldmVudCQubmV4dCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50JC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgbGlzdGVuaW5pbmcgaWYgdG91ciBpcyBjbG9zZWRcbiAgICAgICAgICAgIGRlc3Ryb3llZEV2ZW50JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIG9ic2VydmUgZm9yIGFueSBET00gaW50ZXJhY3Rpb24gaW4gdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuIl19