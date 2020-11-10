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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wbGF0Zm9ybS9ndWlkZWQtdG91ci9ndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUdkLGVBQWUsR0FFaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QixPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRCxPQUFPLEVBQWMsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsa0JBQWtCLEVBQTJCLE1BQU0sZUFBZSxDQUFDOzs7O0FBRTVFLGlDQUdDOzs7SUFGQyw0QkFBeUI7O0lBQ3pCLHVDQUEwQjs7Ozs7QUFHNUIscUNBS0M7OztJQUpDLGtDQUdFOzs7QUFNSixNQUFZLFVBQVU7SUFDcEIsUUFBUSxZQUFhO0lBQ3JCLE1BQU0sVUFBVztJQUNqQixJQUFJLFFBQVM7SUFDYixJQUFJLFFBQVM7SUFDYixLQUFLLFNBQVU7SUFDZixNQUFNLFVBQVc7SUFDakIsUUFBUSxZQUFhO0VBQ3RCOzs7OztBQUVELHNDQUlDOzs7SUFIQyxnQ0FBVTs7SUFDVixvQ0FBYzs7SUFDZCxnQ0FBVTs7QUFJWixNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCOzs7Ozs7SUFHL0QsWUFBb0IsT0FBZSxFQUFVLE1BQXNCLEVBQVUsV0FBdUI7UUFDbEcsS0FBSyxFQUFFLENBQUM7UUFEVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUY1RixjQUFTLEdBQTZCLElBQUksR0FBRyxFQUF1QixDQUFDO1FBQ3JFLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO1FBR3JFLE9BQU8sQ0FBQyxNQUFNO2FBQ1gsSUFBSSxDQUNILE1BQU07Ozs7UUFBQyxDQUFDLEtBQXNCLEVBQUUsRUFBRSxDQUFDLEtBQUssWUFBWSxlQUFlLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLFVBQVUsRUFBQyxDQUMvRzthQUNBLFNBQVM7Ozs7UUFBQyxDQUFDLEtBQXNCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO2dCQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxHQUFlO1FBQ3hCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7Ozs7O0lBRUssWUFBWSxDQUFDLFFBQWdCLEVBQUUsSUFBMEI7OztrQkFDdkQsVUFBVSxHQUFnQixPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUM1RixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBOzs7OztJQUVELFNBQVMsQ0FBQyxRQUFnQjs7Y0FDbEIsVUFBVSxHQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQzdELGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2tCQUM1RCxZQUFZLEdBQWtCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUM1RCxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQ2hHO1lBQ0QsNEVBQTRFO1lBQzVFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVM7Ozs7WUFBQyxDQUFDLFNBQTJCLEVBQUUsRUFBRTs7c0JBQ25FLFVBQVUsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3NCQUN0RCxFQUNKLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FDdEIsR0FBRyxTQUFTO2dCQUNiLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7OzBCQUN4QixTQUFTLEdBQVcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUNwRCxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUU7d0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztxQkFDcEM7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTt3QkFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ25EO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDeEM7aUJBQ0Y7WUFDSCxDQUFDLEVBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sWUFBWSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLFFBQVEsMkNBQTJDLENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7Ozs7Ozs7SUFJRCx1QkFBdUIsQ0FBQyxhQUFxQixNQUFNO1FBQ2pELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNuQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQ2pCLEdBQUc7Ozs7UUFBQyxDQUFDLE1BQWdCLEVBQUUsRUFBRTs7a0JBQ2pCLFNBQVMsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUNoRCxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7c0JBRXBCLFlBQVksR0FBb0IsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pGLHlCQUF5QjtnQkFDekIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7O29CQUU1QixHQUFHLEdBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUTtnQkFDbkcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQzNCLEdBQUcsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN0QztnQkFDRCwyREFBMkQ7Z0JBQzNELE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNyRDtRQUNILENBQUMsRUFBQyxDQUNILENBQUM7SUFDSixDQUFDOzs7Ozs7SUFFYSxTQUFTLENBQUMsT0FBZTs7O2tCQUMvQixPQUFPLEdBQXVCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUNqRSxJQUFJO2dCQUNGLE9BQU8sTUFBTSxPQUFPO3FCQUNqQixJQUFJLENBQ0gsR0FBRzs7OztnQkFBQyxDQUFDLFNBQWMsRUFBRSxFQUFFO29CQUNyQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLEVBQUMsQ0FDSDtxQkFDQSxTQUFTLEVBQUUsQ0FBQzthQUNoQjtZQUFDLFdBQU07Z0JBQ04sT0FBTyxTQUFTLENBQUM7YUFDbEI7UUFDSCxDQUFDO0tBQUE7Ozs7OztJQUVPLFFBQVEsQ0FBQyxHQUFXO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Ozs7O0lBRU8sd0JBQXdCLENBQUMsV0FBOEI7UUFDN0QsV0FBVyxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLElBQXFCLEVBQUUsRUFBRTtZQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7O3NCQUNWLEtBQUssR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0JBQ3hDLG9GQUFvRjtnQkFDcEYsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7OzBCQUNwQixpQkFBaUIsR0FBd0IsSUFBSSxDQUFDLGlCQUFpQjtvQkFDckUsSUFBSSxDQUFDLGlCQUFpQjs7O29CQUFHLEdBQUcsRUFBRTt3QkFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSTs7O3dCQUFDLEdBQUcsRUFBRTs0QkFDbkUsT0FBTyxpQkFBaUIsRUFBRSxDQUFDO3dCQUM3QixDQUFDLEVBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUEsQ0FBQztpQkFDSDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsaUJBQWlCOzs7b0JBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7OztZQTdIRixVQUFVOzs7O1lBNUNULE1BQU07WUFDTixjQUFjO1lBSFAsVUFBVTs7Ozs7OztJQWdEakIsOENBQTZFOzs7OztJQUM3RSxrREFBdUU7Ozs7O0lBQzNELDRDQUF1Qjs7Ozs7SUFBRSwyQ0FBOEI7Ozs7O0lBQUUsZ0RBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7XG4gIFJvdXRlcixcbiAgQWN0aXZhdGVkUm91dGUsXG4gIFBhcmFtTWFwLFxuICBOYXZpZ2F0aW9uRXh0cmFzLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50IGFzIE5hdmlnYXRpb25FdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCBTaGVwaGVyZCBmcm9tICdzaGVwaGVyZC5qcyc7XG5pbXBvcnQgeyB0YXAsIG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDb3ZhbGVudEd1aWRlZFRvdXIsIElUb3VyU3RlcCwgSVRvdXJPcHRpb25zIH0gZnJvbSAnLi9ndWlkZWQudG91cic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUd1aWRlZFRvdXIgZXh0ZW5kcyBJVG91ck9wdGlvbnMge1xuICBzdGVwczogSUd1aWRlZFRvdXJTdGVwW107XG4gIGZpbmlzaEJ1dHRvblRleHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUd1aWRlZFRvdXJTdGVwIGV4dGVuZHMgSVRvdXJTdGVwIHtcbiAgcm91dGluZz86IHtcbiAgICByb3V0ZTogc3RyaW5nO1xuICAgIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXM7XG4gIH07XG59XG5cbi8qKlxuICogIFJvdXRlciBlbmFibGVkIFNoZXBoZXJkIHRvdXJcbiAqL1xuZXhwb3J0IGVudW0gVG91ckV2ZW50cyB7XG4gIGNvbXBsZXRlID0gJ2NvbXBsZXRlJyxcbiAgY2FuY2VsID0gJ2NhbmNlbCcsXG4gIGhpZGUgPSAnaGlkZScsXG4gIHNob3cgPSAnc2hvdycsXG4gIHN0YXJ0ID0gJ3N0YXJ0JyxcbiAgYWN0aXZlID0gJ2FjdGl2ZScsXG4gIGluYWN0aXZlID0gJ2luYWN0aXZlJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91ckV2ZW50IHtcbiAgc3RlcDogYW55O1xuICBwcmV2aW91czogYW55O1xuICB0b3VyOiBhbnk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb3ZhbGVudEd1aWRlZFRvdXJTZXJ2aWNlIGV4dGVuZHMgQ292YWxlbnRHdWlkZWRUb3VyIHtcbiAgcHJpdmF0ZSBfdG91cnNNYXA6IE1hcDxzdHJpbmcsIElHdWlkZWRUb3VyPiA9IG5ldyBNYXA8c3RyaW5nLCBJR3VpZGVkVG91cj4oKTtcbiAgcHJpdmF0ZSBfdG91clN0ZXBVUkxzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgX3JvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0ICYmIGV2ZW50Lm5hdmlnYXRpb25UcmlnZ2VyID09PSAncG9wc3RhdGUnKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2hlcGhlcmRUb3VyLmlzQWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgdG91ckV2ZW50JChzdHI6IFRvdXJFdmVudHMpOiBPYnNlcnZhYmxlPElHdWlkZWRUb3VyRXZlbnQ+IHtcbiAgICByZXR1cm4gZnJvbUV2ZW50KHRoaXMuc2hlcGhlcmRUb3VyLCBzdHIpO1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0ZXJUb3VyKHRvdXJOYW1lOiBzdHJpbmcsIHRvdXI6IElHdWlkZWRUb3VyIHwgc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0eXBlb2YgdG91ciA9PT0gJ3N0cmluZycgPyBhd2FpdCB0aGlzLl9sb2FkVG91cih0b3VyKSA6IHRvdXI7XG4gICAgdGhpcy5fdG91cnNNYXAuc2V0KHRvdXJOYW1lLCBndWlkZWRUb3VyKTtcbiAgfVxuXG4gIHN0YXJ0VG91cih0b3VyTmFtZTogc3RyaW5nKTogU2hlcGhlcmQuVG91ciB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0aGlzLl9nZXRUb3VyKHRvdXJOYW1lKTtcbiAgICB0aGlzLmZpbmlzaCgpO1xuICAgIGlmIChndWlkZWRUb3VyICYmIGd1aWRlZFRvdXIuc3RlcHMgJiYgZ3VpZGVkVG91ci5zdGVwcy5sZW5ndGgpIHtcbiAgICAgIC8vIHJlbW92ZSBzdGVwcyBmcm9tIHRvdXIgc2luY2Ugd2UgbmVlZCB0byBwcmVwcm9jZXNzIHRoZW0gZmlyc3RcbiAgICAgIHRoaXMubmV3VG91cihPYmplY3QuYXNzaWduKHt9LCBndWlkZWRUb3VyLCB7IHN0ZXBzOiB1bmRlZmluZWQgfSkpO1xuICAgICAgY29uc3QgdG91ckluc3RhbmNlOiBTaGVwaGVyZC5Ub3VyID0gdGhpcy5zaGVwaGVyZFRvdXIuYWRkU3RlcHMoXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZVJvdXRlc0ZvclN0ZXBzKHRoaXMuX3ByZXBhcmVUb3VyKGd1aWRlZFRvdXIuc3RlcHMsIGd1aWRlZFRvdXIuZmluaXNoQnV0dG9uVGV4dCkpLFxuICAgICAgKTtcbiAgICAgIC8vIGluaXQgcm91dGUgdHJhbnNpdGlvbiBpZiBzdGVwIFVSTCBpcyBkaWZmZXJlbnQgdGhlbiB0aGUgY3VycmVudCBsb2NhdGlvbi5cbiAgICAgIHRoaXMudG91ckV2ZW50JChUb3VyRXZlbnRzLnNob3cpLnN1YnNjcmliZSgodG91ckV2ZW50OiBJR3VpZGVkVG91ckV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRVUkw6IHN0cmluZyA9IHRoaXMuX3JvdXRlci51cmwuc3BsaXQoL1s/I10vKVswXTtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHN0ZXA6IHsgaWQsIG9wdGlvbnMgfSxcbiAgICAgICAgfSA9IHRvdXJFdmVudDtcbiAgICAgICAgaWYgKHRoaXMuX3RvdXJTdGVwVVJMcy5oYXMoaWQpKSB7XG4gICAgICAgICAgY29uc3Qgc3RlcFJvdXRlOiBzdHJpbmcgPSB0aGlzLl90b3VyU3RlcFVSTHMuZ2V0KGlkKTtcbiAgICAgICAgICBpZiAoc3RlcFJvdXRlICE9PSBjdXJyZW50VVJMKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3N0ZXBSb3V0ZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJvdXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvdXJTdGVwVVJMcy5zZXQoaWQsIG9wdGlvbnMucm91dGluZy5yb3V0ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RvdXJTdGVwVVJMcy5zZXQoaWQsIGN1cnJlbnRVUkwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICByZXR1cm4gdG91ckluc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBUb3VyICR7dG91ck5hbWV9IGRvZXMgbm90IGV4aXN0LiBQbGVhc2UgdHJ5IGFub3RoZXIgdG91ci5gKTtcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kcyB0aGUgcmlnaHQgcmVnaXN0ZXJlZCB0b3VyIGJ5IHVzaW5nIHF1ZXJ5UGFyYW1zXG4gIC8vIGZpbmlzaGVzIGFueSBvdGhlciB0b3VyIGFuZCBzdGFydHMgdGhlIG5ldyBvbmUuXG4gIGluaXRpYWxpemVPblF1ZXJ5UGFyYW1zKHF1ZXJ5UGFyYW06IHN0cmluZyA9ICd0b3VyJyk6IE9ic2VydmFibGU8UGFyYW1NYXA+IHtcbiAgICByZXR1cm4gdGhpcy5fcm91dGUucXVlcnlQYXJhbU1hcC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDEwMCksXG4gICAgICB0YXAoKHBhcmFtczogUGFyYW1NYXApID0+IHtcbiAgICAgICAgY29uc3QgdG91clBhcmFtOiBzdHJpbmcgPSBwYXJhbXMuZ2V0KHF1ZXJ5UGFyYW0pO1xuICAgICAgICBpZiAodG91clBhcmFtKSB7XG4gICAgICAgICAgdGhpcy5zdGFydFRvdXIodG91clBhcmFtKTtcbiAgICAgICAgICAvLyBnZXQgY3VycmVudCBzZWFyY2ggcGFyYW1ldGVyc1xuICAgICAgICAgIGNvbnN0IHNlYXJjaFBhcmFtczogVVJMU2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgICAgICAvLyBkZWxldGUgdG91ciBxdWVyeVBhcmFtXG4gICAgICAgICAgc2VhcmNoUGFyYW1zLmRlbGV0ZShxdWVyeVBhcmFtKTtcbiAgICAgICAgICAvLyBidWlsZCBuZXcgVVJMIHN0cmluZyB3aXRob3V0IGl0XG4gICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICAgIGlmIChzZWFyY2hQYXJhbXMudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgdXJsICs9ICc/JyArIHNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZXBsYWNlIHN0YXRlIGluIGhpc3Rvcnkgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmF2aWdhdGlvblxuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IHBhdGg6IHVybCB9LCAnJywgdXJsKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2xvYWRUb3VyKHRvdXJVcmw6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVxdWVzdDogT2JzZXJ2YWJsZTxvYmplY3Q+ID0gdGhpcy5faHR0cENsaWVudC5nZXQodG91clVybCk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCByZXF1ZXN0XG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIG1hcCgocmVzdWx0U2V0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdFNldCkpO1xuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICAgIC50b1Byb21pc2UoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VG91cihrZXk6IHN0cmluZyk6IElHdWlkZWRUb3VyIHtcbiAgICByZXR1cm4gdGhpcy5fdG91cnNNYXAuZ2V0KGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25maWd1cmVSb3V0ZXNGb3JTdGVwcyhyb3V0ZWRTdGVwczogSUd1aWRlZFRvdXJTdGVwW10pOiBJR3VpZGVkVG91clN0ZXBbXSB7XG4gICAgcm91dGVkU3RlcHMuZm9yRWFjaCgoc3RlcDogSUd1aWRlZFRvdXJTdGVwKSA9PiB7XG4gICAgICBpZiAoc3RlcC5yb3V0aW5nKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlOiBzdHJpbmcgPSBzdGVwLnJvdXRpbmcucm91dGU7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgYmVmb3JlU2hvd1Byb21pc2UsIHRoZW4gd2Ugc2F2ZSBpdCBhbmQgY2FsbCBpdCBhZnRlciB0aGUgbmF2aWdhdGlvblxuICAgICAgICBpZiAoc3RlcC5iZWZvcmVTaG93UHJvbWlzZSkge1xuICAgICAgICAgIGNvbnN0IGJlZm9yZVNob3dQcm9taXNlOiAoKSA9PiBQcm9taXNlPHZvaWQ+ID0gc3RlcC5iZWZvcmVTaG93UHJvbWlzZTtcbiAgICAgICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbcm91dGVdLCBzdGVwLnJvdXRpbmcuZXh0cmFzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVNob3dQcm9taXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByb3V0ZWRTdGVwcztcbiAgfVxufVxuIl19