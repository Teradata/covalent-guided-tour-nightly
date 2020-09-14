import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __extends, __spread, __awaiter, __generator } from 'tslib';
import { HttpClient } from '@angular/common/http';
import { NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { first, takeUntil, skip, skipWhile, filter, debounceTime, tap, map } from 'rxjs/operators';
import { Subject, merge, fromEvent, forkJoin, BehaviorSubject, timer } from 'rxjs';
import Shepherd from 'shepherd.js';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var ITourEvent = {
    'click': 'click',
    'pointerover': 'pointerover',
    'keyup': 'keyup',
    'added': 'added',
    'removed': 'removed',
};
/**
 * @record
 */
function ITourEventOn() { }
if (false) {
    /** @type {?|undefined} */
    ITourEventOn.prototype.selector;
    /** @type {?|undefined} */
    ITourEventOn.prototype.event;
}
/**
 * @record
 */
function ITourEventOnOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourEventOnOptions.prototype.timeBeforeShow;
    /** @type {?|undefined} */
    ITourEventOnOptions.prototype.interval;
}
/**
 * @record
 */
function ITourAbortOn() { }
/**
 * @record
 */
function ITourOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourOptions.prototype.abortOn;
}
/**
 * @record
 */
function ITourStepAttachToOptions() { }
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
function ITourStepAdvanceOn() { }
/**
 * @record
 */
function ITourStepAdvanceOnOptions() { }
if (false) {
    /** @type {?|undefined} */
    ITourStepAdvanceOnOptions.prototype.jumpTo;
    /** @type {?|undefined} */
    ITourStepAdvanceOnOptions.prototype.allowGoBack;
}
/**
 * @record
 */
function ITourStep() { }
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
            var _a;
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
                classes: ((_a = step.advanceOnOptions) === null || _a === void 0 ? void 0 : _a.allowGoBack) === false ? MAT_BUTTON_INVISIBLE : MAT_ICON_BUTTON,
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IGuidedTour() { }
if (false) {
    /** @type {?} */
    IGuidedTour.prototype.steps;
    /** @type {?|undefined} */
    IGuidedTour.prototype.finishButtonText;
}
/**
 * @record
 */
function IGuidedTourStep() { }
if (false) {
    /** @type {?|undefined} */
    IGuidedTourStep.prototype.routing;
}
/** @enum {string} */
var TourEvents = {
    complete: 'complete',
    cancel: 'cancel',
    hide: 'hide',
    show: 'show',
    start: 'start',
    active: 'active',
    inactive: 'inactive',
};
/**
 * @record
 */
function IGuidedTourEvent() { }
if (false) {
    /** @type {?} */
    IGuidedTourEvent.prototype.step;
    /** @type {?} */
    IGuidedTourEvent.prototype.previous;
    /** @type {?} */
    IGuidedTourEvent.prototype.tour;
}
var CovalentGuidedTourService = /** @class */ (function (_super) {
    __extends(CovalentGuidedTourService, _super);
    function CovalentGuidedTourService(_router, _route, _httpClient) {
        var _this = _super.call(this) || this;
        _this._router = _router;
        _this._route = _route;
        _this._httpClient = _httpClient;
        _this._toursMap = new Map();
        _this._tourStepURLs = new Map();
        _router.events
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return event instanceof NavigationStart && event.navigationTrigger === 'popstate'; })))
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (_this.shepherdTour.isActive) {
                _this.shepherdTour.cancel();
            }
        }));
        return _this;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    CovalentGuidedTourService.prototype.tourEvent$ = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return fromEvent(this.shepherdTour, str);
    };
    /**
     * @param {?} tourName
     * @param {?} tour
     * @return {?}
     */
    CovalentGuidedTourService.prototype.registerTour = /**
     * @param {?} tourName
     * @param {?} tour
     * @return {?}
     */
    function (tourName, tour) {
        return __awaiter(this, void 0, void 0, function () {
            var guidedTour, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof tour === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._loadTour(tour)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = tour;
                        _b.label = 3;
                    case 3:
                        guidedTour = _a;
                        this._toursMap.set(tourName, guidedTour);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} tourName
     * @return {?}
     */
    CovalentGuidedTourService.prototype.startTour = /**
     * @param {?} tourName
     * @return {?}
     */
    function (tourName) {
        var _this = this;
        /** @type {?} */
        var guidedTour = this._getTour(tourName);
        this.finish();
        if (guidedTour && guidedTour.steps && guidedTour.steps.length) {
            // remove steps from tour since we need to preprocess them first
            this.newTour(Object.assign({}, guidedTour, { steps: undefined }));
            /** @type {?} */
            var tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps, guidedTour.finishButtonText)));
            // init route transition if step URL is different then the current location.
            this.tourEvent$(TourEvents.show).subscribe((/**
             * @param {?} tourEvent
             * @return {?}
             */
            function (tourEvent) {
                /** @type {?} */
                var currentURL = _this._router.url.split(/[?#]/)[0];
                var _a = tourEvent.step, id = _a.id, options = _a.options;
                if (_this._tourStepURLs.has(id)) {
                    /** @type {?} */
                    var stepRoute = _this._tourStepURLs.get(id);
                    if (stepRoute !== currentURL) {
                        _this._router.navigate([stepRoute]);
                    }
                }
                else {
                    if (options && options.routing) {
                        _this._tourStepURLs.set(id, options.routing.route);
                    }
                    else {
                        _this._tourStepURLs.set(id, currentURL);
                    }
                }
            }));
            this.start();
            return tourInstance;
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn("Tour " + tourName + " does not exist. Please try another tour.");
        }
    };
    // Finds the right registered tour by using queryParams
    // finishes any other tour and starts the new one.
    // Finds the right registered tour by using queryParams
    // finishes any other tour and starts the new one.
    /**
     * @param {?=} queryParam
     * @return {?}
     */
    CovalentGuidedTourService.prototype.initializeOnQueryParams = 
    // Finds the right registered tour by using queryParams
    // finishes any other tour and starts the new one.
    /**
     * @param {?=} queryParam
     * @return {?}
     */
    function (queryParam) {
        var _this = this;
        if (queryParam === void 0) { queryParam = 'tour'; }
        return this._route.queryParamMap.pipe(debounceTime(100), tap((/**
         * @param {?} params
         * @return {?}
         */
        function (params) {
            /** @type {?} */
            var tourParam = params.get(queryParam);
            if (tourParam) {
                _this.startTour(tourParam);
                // get current search parameters
                /** @type {?} */
                var searchParams = new URLSearchParams(window.location.search);
                // delete tour queryParam
                searchParams.delete(queryParam);
                // build new URL string without it
                /** @type {?} */
                var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
                if (searchParams.toString()) {
                    url += '?' + searchParams.toString();
                }
                // replace state in history without triggering a navigation
                window.history.replaceState({ path: url }, '', url);
            }
        })));
    };
    /**
     * @private
     * @param {?} tourUrl
     * @return {?}
     */
    CovalentGuidedTourService.prototype._loadTour = /**
     * @private
     * @param {?} tourUrl
     * @return {?}
     */
    function (tourUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var request, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        request = this._httpClient.get(tourUrl);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request
                                .pipe(map((/**
                             * @param {?} resultSet
                             * @return {?}
                             */
                            function (resultSet) {
                                return JSON.parse(JSON.stringify(resultSet));
                            })))
                                .toPromise()];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    CovalentGuidedTourService.prototype._getTour = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._toursMap.get(key);
    };
    /**
     * @private
     * @param {?} routedSteps
     * @return {?}
     */
    CovalentGuidedTourService.prototype._configureRoutesForSteps = /**
     * @private
     * @param {?} routedSteps
     * @return {?}
     */
    function (routedSteps) {
        var _this = this;
        routedSteps.forEach((/**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            if (step.routing) {
                /** @type {?} */
                var route_1 = step.routing.route;
                // if there is a beforeShowPromise, then we save it and call it after the navigation
                if (step.beforeShowPromise) {
                    /** @type {?} */
                    var beforeShowPromise_1 = step.beforeShowPromise;
                    step.beforeShowPromise = (/**
                     * @return {?}
                     */
                    function () {
                        return _this._router.navigate([route_1], step.routing.extras).then((/**
                         * @return {?}
                         */
                        function () {
                            return beforeShowPromise_1();
                        }));
                    });
                }
                else {
                    step.beforeShowPromise = (/**
                     * @return {?}
                     */
                    function () { return _this._router.navigate([route_1]); });
                }
            }
        }));
        return routedSteps;
    };
    CovalentGuidedTourService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CovalentGuidedTourService.ctorParameters = function () { return [
        { type: Router },
        { type: ActivatedRoute },
        { type: HttpClient }
    ]; };
    return CovalentGuidedTourService;
}(CovalentGuidedTour));
if (false) {
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTourService.prototype._toursMap;
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTourService.prototype._tourStepURLs;
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTourService.prototype._router;
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTourService.prototype._route;
    /**
     * @type {?}
     * @private
     */
    CovalentGuidedTourService.prototype._httpClient;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CovalentGuidedTourModule = /** @class */ (function () {
    function CovalentGuidedTourModule() {
    }
    CovalentGuidedTourModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    providers: [CovalentGuidedTourService],
                    declarations: [],
                    exports: [],
                },] }
    ];
    return CovalentGuidedTourModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { CovalentGuidedTour, CovalentGuidedTourModule, CovalentGuidedTourService, ITourEvent, TourEvents };
//# sourceMappingURL=covalent-guided-tour.js.map
