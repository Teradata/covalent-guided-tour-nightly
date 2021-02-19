/**
 * @fileoverview added by tsickle
 * Generated from: guided-tour.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationStart, } from '@angular/router';
import { tap, map, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CovalentGuidedTour } from './guided.tour';
/**
 * @record
 */
export function IGuidedTour() { }
if (false) {
    /** @type {?} */
    IGuidedTour.prototype.steps;
    /** @type {?|undefined} */
    IGuidedTour.prototype.finishButtonText;
}
/**
 * @record
 */
export function IGuidedTourStep() { }
if (false) {
    /** @type {?|undefined} */
    IGuidedTourStep.prototype.routing;
}
/** @enum {string} */
const TourEvents = {
    complete: "complete",
    cancel: "cancel",
    hide: "hide",
    show: "show",
    start: "start",
    active: "active",
    inactive: "inactive",
};
export { TourEvents };
/**
 * @record
 */
export function IGuidedTourEvent() { }
if (false) {
    /** @type {?} */
    IGuidedTourEvent.prototype.step;
    /** @type {?} */
    IGuidedTourEvent.prototype.previous;
    /** @type {?} */
    IGuidedTourEvent.prototype.tour;
}
export class CovalentGuidedTourService extends CovalentGuidedTour {
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
        this._tourStepURLs = new Map();
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
     * @param {?} str
     * @return {?}
     */
    tourEvent$(str) {
        return fromEvent(this.shepherdTour, str);
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
            const tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps, guidedTour.finishButtonText)));
            // init route transition if step URL is different then the current location.
            this.tourEvent$(TourEvents.show).subscribe((/**
             * @param {?} tourEvent
             * @return {?}
             */
            (tourEvent) => {
                /** @type {?} */
                const currentURL = this._router.url.split(/[?#]/)[0];
                const { step: { id, options }, } = tourEvent;
                if (this._tourStepURLs.has(id)) {
                    /** @type {?} */
                    const stepRoute = this._tourStepURLs.get(id);
                    if (stepRoute !== currentURL) {
                        this._router.navigate([stepRoute]);
                    }
                }
                else {
                    if (options && options.routing) {
                        this._tourStepURLs.set(id, options.routing.route);
                    }
                    else {
                        this._tourStepURLs.set(id, currentURL);
                    }
                }
            }));
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
     * @param {?} stepId
     * @param {?} isDisabled
     * @return {?}
     */
    setNextBtnDisability(stepId, isDisabled) {
        if (this.shepherdTour.getById(stepId)) {
            /** @type {?} */
            const stepOptions = ((/** @type {?} */ (this.shepherdTour.getById(stepId)))).options;
            stepOptions.buttons.forEach((/**
             * @param {?} button
             * @return {?}
             */
            (button) => {
                if (button.text === 'chevron_right') {
                    button.disabled = isDisabled;
                }
            }));
            this.shepherdTour.getById(stepId).updateStepOptions(stepOptions);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvcGxhdGZvcm0vZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUdkLGVBQWUsR0FFaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QixPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRCxPQUFPLEVBQWMsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsa0JBQWtCLEVBQTJDLE1BQU0sZUFBZSxDQUFDOzs7O0FBRTVGLGlDQUdDOzs7SUFGQyw0QkFBeUI7O0lBQ3pCLHVDQUEwQjs7Ozs7QUFHNUIscUNBS0M7OztJQUpDLGtDQUdFOzs7QUFNSixNQUFZLFVBQVU7SUFDcEIsUUFBUSxZQUFhO0lBQ3JCLE1BQU0sVUFBVztJQUNqQixJQUFJLFFBQVM7SUFDYixJQUFJLFFBQVM7SUFDYixLQUFLLFNBQVU7SUFDZixNQUFNLFVBQVc7SUFDakIsUUFBUSxZQUFhO0VBQ3RCOzs7OztBQUVELHNDQUlDOzs7SUFIQyxnQ0FBVTs7SUFDVixvQ0FBYzs7SUFDZCxnQ0FBVTs7QUFJWixNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCOzs7Ozs7SUFHL0QsWUFBb0IsT0FBZSxFQUFVLE1BQXNCLEVBQVUsV0FBdUI7UUFDbEcsS0FBSyxFQUFFLENBQUM7UUFEVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsV0FBTSxHQUFOLE1B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LENBQUM7Ozs7OztJQUVPLHdCQUF3QixDQUFDLFdBQThCO1FBQzdELFdBQVcsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxJQUFxQixFQUFFLEVBQUU7WUFDNUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOztzQkFDVixLQUFLLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUN4QyxvRkFBb0Y7Z0JBQ3BGLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFOzswQkFDcEIsaUJBQWlCLEdBQXdCLElBQUksQ0FBQyxpQkFBaUI7b0JBQ3JFLElBQUksQ0FBQyxpQkFBaUI7OztvQkFBRyxHQUFHLEVBQUU7d0JBQzVCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUk7Ozt3QkFBQyxHQUFHLEVBQUU7NEJBQ25FLE9BQU8saUJBQWlCLEVBQUUsQ0FBQzt3QkFDN0IsQ0FBQyxFQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFBLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLGlCQUFpQjs7O29CQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDO2lCQUMvRDthQUNGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7WUF6SUYsVUFBVTs7OztZQTVDVCxNQUFNO1lBQ04sY0FBYztZQUhQLFVBQVU7Ozs7Ozs7SUFnRGpCLDhDQUE2RTs7Ozs7SUFDN0Usa0RBQXVFOzs7OztJQUMzRCw0Q0FBdUI7Ozs7O0lBQUUsMkNBQThCOzs7OztJQUFFLGdEQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBSb3V0ZXIsXG4gIEFjdGl2YXRlZFJvdXRlLFxuICBQYXJhbU1hcCxcbiAgTmF2aWdhdGlvbkV4dHJhcyxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCBhcyBOYXZpZ2F0aW9uRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGFwLCBtYXAsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ292YWxlbnRHdWlkZWRUb3VyLCBJVG91clN0ZXAsIElUb3VyT3B0aW9ucywgVG91clN0ZXBCdXR0b24gfSBmcm9tICcuL2d1aWRlZC50b3VyJztcblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91ciBleHRlbmRzIElUb3VyT3B0aW9ucyB7XG4gIHN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXTtcbiAgZmluaXNoQnV0dG9uVGV4dD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91clN0ZXAgZXh0ZW5kcyBJVG91clN0ZXAge1xuICByb3V0aW5nPzoge1xuICAgIHJvdXRlOiBzdHJpbmc7XG4gICAgZXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcztcbiAgfTtcbn1cblxuLyoqXG4gKiAgUm91dGVyIGVuYWJsZWQgU2hlcGhlcmQgdG91clxuICovXG5leHBvcnQgZW51bSBUb3VyRXZlbnRzIHtcbiAgY29tcGxldGUgPSAnY29tcGxldGUnLFxuICBjYW5jZWwgPSAnY2FuY2VsJyxcbiAgaGlkZSA9ICdoaWRlJyxcbiAgc2hvdyA9ICdzaG93JyxcbiAgc3RhcnQgPSAnc3RhcnQnLFxuICBhY3RpdmUgPSAnYWN0aXZlJyxcbiAgaW5hY3RpdmUgPSAnaW5hY3RpdmUnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyRXZlbnQge1xuICBzdGVwOiBhbnk7XG4gIHByZXZpb3VzOiBhbnk7XG4gIHRvdXI6IGFueTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91clNlcnZpY2UgZXh0ZW5kcyBDb3ZhbGVudEd1aWRlZFRvdXIge1xuICBwcml2YXRlIF90b3Vyc01hcDogTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+ID0gbmV3IE1hcDxzdHJpbmcsIElHdWlkZWRUb3VyPigpO1xuICBwcml2YXRlIF90b3VyU3RlcFVSTHM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9odHRwQ2xpZW50OiBIdHRwQ2xpZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICBfcm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQ6IE5hdmlnYXRpb25FdmVudCkgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgJiYgZXZlbnQubmF2aWdhdGlvblRyaWdnZXIgPT09ICdwb3BzdGF0ZScpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE5hdmlnYXRpb25FdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuaXNBY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICB0b3VyRXZlbnQkKHN0cjogVG91ckV2ZW50cyk6IE9ic2VydmFibGU8SUd1aWRlZFRvdXJFdmVudD4ge1xuICAgIHJldHVybiBmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsIHN0cik7XG4gIH1cblxuICBhc3luYyByZWdpc3RlclRvdXIodG91ck5hbWU6IHN0cmluZywgdG91cjogSUd1aWRlZFRvdXIgfCBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBndWlkZWRUb3VyOiBJR3VpZGVkVG91ciA9IHR5cGVvZiB0b3VyID09PSAnc3RyaW5nJyA/IGF3YWl0IHRoaXMuX2xvYWRUb3VyKHRvdXIpIDogdG91cjtcbiAgICB0aGlzLl90b3Vyc01hcC5zZXQodG91ck5hbWUsIGd1aWRlZFRvdXIpO1xuICB9XG5cbiAgc3RhcnRUb3VyKHRvdXJOYW1lOiBzdHJpbmcpOiBTaGVwaGVyZC5Ub3VyIHtcbiAgICBjb25zdCBndWlkZWRUb3VyOiBJR3VpZGVkVG91ciA9IHRoaXMuX2dldFRvdXIodG91ck5hbWUpO1xuICAgIHRoaXMuZmluaXNoKCk7XG4gICAgaWYgKGd1aWRlZFRvdXIgJiYgZ3VpZGVkVG91ci5zdGVwcyAmJiBndWlkZWRUb3VyLnN0ZXBzLmxlbmd0aCkge1xuICAgICAgLy8gcmVtb3ZlIHN0ZXBzIGZyb20gdG91ciBzaW5jZSB3ZSBuZWVkIHRvIHByZXByb2Nlc3MgdGhlbSBmaXJzdFxuICAgICAgdGhpcy5uZXdUb3VyKE9iamVjdC5hc3NpZ24oe30sIGd1aWRlZFRvdXIsIHsgc3RlcHM6IHVuZGVmaW5lZCB9KSk7XG4gICAgICBjb25zdCB0b3VySW5zdGFuY2U6IFNoZXBoZXJkLlRvdXIgPSB0aGlzLnNoZXBoZXJkVG91ci5hZGRTdGVwcyhcbiAgICAgICAgdGhpcy5fY29uZmlndXJlUm91dGVzRm9yU3RlcHModGhpcy5fcHJlcGFyZVRvdXIoZ3VpZGVkVG91ci5zdGVwcywgZ3VpZGVkVG91ci5maW5pc2hCdXR0b25UZXh0KSksXG4gICAgICApO1xuICAgICAgLy8gaW5pdCByb3V0ZSB0cmFuc2l0aW9uIGlmIHN0ZXAgVVJMIGlzIGRpZmZlcmVudCB0aGVuIHRoZSBjdXJyZW50IGxvY2F0aW9uLlxuICAgICAgdGhpcy50b3VyRXZlbnQkKFRvdXJFdmVudHMuc2hvdykuc3Vic2NyaWJlKCh0b3VyRXZlbnQ6IElHdWlkZWRUb3VyRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFVSTDogc3RyaW5nID0gdGhpcy5fcm91dGVyLnVybC5zcGxpdCgvWz8jXS8pWzBdO1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgc3RlcDogeyBpZCwgb3B0aW9ucyB9LFxuICAgICAgICB9ID0gdG91ckV2ZW50O1xuICAgICAgICBpZiAodGhpcy5fdG91clN0ZXBVUkxzLmhhcyhpZCkpIHtcbiAgICAgICAgICBjb25zdCBzdGVwUm91dGU6IHN0cmluZyA9IHRoaXMuX3RvdXJTdGVwVVJMcy5nZXQoaWQpO1xuICAgICAgICAgIGlmIChzdGVwUm91dGUgIT09IGN1cnJlbnRVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbc3RlcFJvdXRlXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucm91dGluZykge1xuICAgICAgICAgICAgdGhpcy5fdG91clN0ZXBVUkxzLnNldChpZCwgb3B0aW9ucy5yb3V0aW5nLnJvdXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdG91clN0ZXBVUkxzLnNldChpZCwgY3VycmVudFVSTCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIHJldHVybiB0b3VySW5zdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oYFRvdXIgJHt0b3VyTmFtZX0gZG9lcyBub3QgZXhpc3QuIFBsZWFzZSB0cnkgYW5vdGhlciB0b3VyLmApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmRzIHRoZSByaWdodCByZWdpc3RlcmVkIHRvdXIgYnkgdXNpbmcgcXVlcnlQYXJhbXNcbiAgLy8gZmluaXNoZXMgYW55IG90aGVyIHRvdXIgYW5kIHN0YXJ0cyB0aGUgbmV3IG9uZS5cbiAgaW5pdGlhbGl6ZU9uUXVlcnlQYXJhbXMocXVlcnlQYXJhbTogc3RyaW5nID0gJ3RvdXInKTogT2JzZXJ2YWJsZTxQYXJhbU1hcD4ge1xuICAgIHJldHVybiB0aGlzLl9yb3V0ZS5xdWVyeVBhcmFtTWFwLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgIHRhcCgocGFyYW1zOiBQYXJhbU1hcCkgPT4ge1xuICAgICAgICBjb25zdCB0b3VyUGFyYW06IHN0cmluZyA9IHBhcmFtcy5nZXQocXVlcnlQYXJhbSk7XG4gICAgICAgIGlmICh0b3VyUGFyYW0pIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0VG91cih0b3VyUGFyYW0pO1xuICAgICAgICAgIC8vIGdldCBjdXJyZW50IHNlYXJjaCBwYXJhbWV0ZXJzXG4gICAgICAgICAgY29uc3Qgc2VhcmNoUGFyYW1zOiBVUkxTZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgIC8vIGRlbGV0ZSB0b3VyIHF1ZXJ5UGFyYW1cbiAgICAgICAgICBzZWFyY2hQYXJhbXMuZGVsZXRlKHF1ZXJ5UGFyYW0pO1xuICAgICAgICAgIC8vIGJ1aWxkIG5ldyBVUkwgc3RyaW5nIHdpdGhvdXQgaXRcbiAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgaWYgKHNlYXJjaFBhcmFtcy50b1N0cmluZygpKSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlcGxhY2Ugc3RhdGUgaW4gaGlzdG9yeSB3aXRob3V0IHRyaWdnZXJpbmcgYSBuYXZpZ2F0aW9uXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgcGF0aDogdXJsIH0sICcnLCB1cmwpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgc2V0TmV4dEJ0bkRpc2FiaWxpdHkoc3RlcElkOiBzdHJpbmcsIGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuZ2V0QnlJZChzdGVwSWQpKSB7XG4gICAgICBjb25zdCBzdGVwT3B0aW9uczogSVRvdXJTdGVwID0gKHRoaXMuc2hlcGhlcmRUb3VyLmdldEJ5SWQoc3RlcElkKSBhcyBhbnkpLm9wdGlvbnM7XG4gICAgICBzdGVwT3B0aW9ucy5idXR0b25zLmZvckVhY2goKGJ1dHRvbjogVG91clN0ZXBCdXR0b24pID0+IHtcbiAgICAgICAgaWYgKGJ1dHRvbi50ZXh0ID09PSAnY2hldnJvbl9yaWdodCcpIHtcbiAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmdldEJ5SWQoc3RlcElkKS51cGRhdGVTdGVwT3B0aW9ucyhzdGVwT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbG9hZFRvdXIodG91clVybDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBPYnNlcnZhYmxlPG9iamVjdD4gPSB0aGlzLl9odHRwQ2xpZW50LmdldCh0b3VyVXJsKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHJlcXVlc3RcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgbWFwKChyZXN1bHRTZXQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0U2V0KSk7XG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgICAgLnRvUHJvbWlzZSgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRUb3VyKGtleTogc3RyaW5nKTogSUd1aWRlZFRvdXIge1xuICAgIHJldHVybiB0aGlzLl90b3Vyc01hcC5nZXQoa2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbmZpZ3VyZVJvdXRlc0ZvclN0ZXBzKHJvdXRlZFN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXSk6IElHdWlkZWRUb3VyU3RlcFtdIHtcbiAgICByb3V0ZWRTdGVwcy5mb3JFYWNoKChzdGVwOiBJR3VpZGVkVG91clN0ZXApID0+IHtcbiAgICAgIGlmIChzdGVwLnJvdXRpbmcpIHtcbiAgICAgICAgY29uc3Qgcm91dGU6IHN0cmluZyA9IHN0ZXAucm91dGluZy5yb3V0ZTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBiZWZvcmVTaG93UHJvbWlzZSwgdGhlbiB3ZSBzYXZlIGl0IGFuZCBjYWxsIGl0IGFmdGVyIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgIGlmIChzdGVwLmJlZm9yZVNob3dQcm9taXNlKSB7XG4gICAgICAgICAgY29uc3QgYmVmb3JlU2hvd1Byb21pc2U6ICgpID0+IFByb21pc2U8dm9pZD4gPSBzdGVwLmJlZm9yZVNob3dQcm9taXNlO1xuICAgICAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0sIHN0ZXAucm91dGluZy5leHRyYXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYmVmb3JlU2hvd1Byb21pc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbcm91dGVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlZFN0ZXBzO1xuICB9XG59XG4iXX0=