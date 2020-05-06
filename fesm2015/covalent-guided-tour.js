import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';
import { HttpClient } from '@angular/common/http';
import { NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { first, takeUntil, skip, skipWhile, filter, debounceTime, tap, map } from 'rxjs/operators';
import Shepherd from 'shepherd.js';
import { Subject, merge, fromEvent, forkJoin, BehaviorSubject, timer } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ITourEvent = {
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
class CovalentGuidedTour extends TourButtonsActions {
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
}
/**
 * @record
 */
function IGuidedTourStep() { }
if (false) {
    /** @type {?|undefined} */
    IGuidedTourStep.prototype.routing;
}
/**
 *  Router enabled Shepherd tour
 */
class CovalentGuidedTourService extends CovalentGuidedTour {
    /**
     * @param {?} _router
     * @param {?} _route
     * @param {?} _httpClient
     */
    constructor(_router, _route, _httpClient) {
        super();
        this._router = _router;
        this._route = _route;
        this._httpClient = _httpClient;
        this._toursMap = new Map();
        _router.events
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        (event) => event instanceof NavigationStart && event.navigationTrigger === 'popstate')))
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this.shepherdTour.isActive) {
                this.shepherdTour.cancel();
            }
        }));
    }
    /**
     * @param {?} tourName
     * @param {?} tour
     * @return {?}
     */
    registerTour(tourName, tour) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const guidedTour = typeof tour === 'string' ? yield this._loadTour(tour) : tour;
            this._toursMap.set(tourName, guidedTour);
        });
    }
    /**
     * @param {?} tourName
     * @return {?}
     */
    startTour(tourName) {
        /** @type {?} */
        const guidedTour = this._getTour(tourName);
        this.finish();
        if (guidedTour && guidedTour.steps && guidedTour.steps.length) {
            // remove steps from tour since we need to preprocess them first
            this.newTour(Object.assign({}, guidedTour, { steps: undefined }));
            /** @type {?} */
            const tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps)));
            this.start();
            return tourInstance;
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn(`Tour ${tourName} does not exist. Please try another tour.`);
        }
    }
    // Finds the right registered tour by using queryParams
    // finishes any other tour and starts the new one.
    /**
     * @param {?=} queryParam
     * @return {?}
     */
    initializeOnQueryParams(queryParam = 'tour') {
        return this._route.queryParamMap.pipe(debounceTime(100), tap((/**
         * @param {?} params
         * @return {?}
         */
        (params) => {
            /** @type {?} */
            const tourParam = params.get(queryParam);
            if (tourParam) {
                this.startTour(tourParam);
                // get current search parameters
                /** @type {?} */
                const searchParams = new URLSearchParams(window.location.search);
                // delete tour queryParam
                searchParams.delete(queryParam);
                // build new URL string without it
                /** @type {?} */
                let url = window.location.protocol + '//' + window.location.host + window.location.pathname;
                if (searchParams.toString()) {
                    url += '?' + searchParams.toString();
                }
                // replace state in history without triggering a navigation
                window.history.replaceState({ path: url }, '', url);
            }
        })));
    }
    /**
     * @private
     * @param {?} tourUrl
     * @return {?}
     */
    _loadTour(tourUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const request = this._httpClient.get(tourUrl);
            try {
                return yield request
                    .pipe(map((/**
                 * @param {?} resultSet
                 * @return {?}
                 */
                (resultSet) => {
                    return JSON.parse(JSON.stringify(resultSet));
                })))
                    .toPromise();
            }
            catch (_a) {
                return undefined;
            }
        });
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    _getTour(key) {
        return this._toursMap.get(key);
    }
    /**
     * @private
     * @param {?} routedSteps
     * @return {?}
     */
    _configureRoutesForSteps(routedSteps) {
        routedSteps.forEach((/**
         * @param {?} step
         * @return {?}
         */
        (step) => {
            if (step.routing) {
                /** @type {?} */
                const route = step.routing.route;
                // if there is a beforeShowPromise, then we save it and call it after the navigation
                if (step.beforeShowPromise) {
                    /** @type {?} */
                    const beforeShowPromise = step.beforeShowPromise;
                    step.beforeShowPromise = (/**
                     * @return {?}
                     */
                    () => {
                        return this._router.navigate([route], step.routing.extras).then((/**
                         * @return {?}
                         */
                        () => {
                            return beforeShowPromise();
                        }));
                    });
                }
                else {
                    step.beforeShowPromise = (/**
                     * @return {?}
                     */
                    () => this._router.navigate([route]));
                }
            }
        }));
        return routedSteps;
    }
}
CovalentGuidedTourService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CovalentGuidedTourService.ctorParameters = () => [
    { type: Router },
    { type: ActivatedRoute },
    { type: HttpClient }
];
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
class CovalentGuidedTourModule {
}
CovalentGuidedTourModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                providers: [CovalentGuidedTourService],
                declarations: [],
                exports: [],
            },] }
];

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

export { CovalentGuidedTour, CovalentGuidedTourModule, CovalentGuidedTourService, ITourEvent };
//# sourceMappingURL=covalent-guided-tour.js.map
