/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationStart, } from '@angular/router';
import { tap, map, filter } from 'rxjs/operators';
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
    /** @type {?|undefined} */
    IGuidedTour.prototype.dismissButtonText;
}
/**
 * @record
 */
export function IGuidedTourStep() { }
if (false) {
    /** @type {?|undefined} */
    IGuidedTourStep.prototype.routing;
}
/**
 *  Router enabled Shepherd tour
 */
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
            const tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps, guidedTour.finishButtonText, guidedTour.dismissButtonText)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bjb3ZhbGVudC9ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImd1aWRlZC10b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFHZCxlQUFlLEdBRWhCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBMkIsTUFBTSxlQUFlLENBQUM7Ozs7QUFFNUUsaUNBSUM7OztJQUhDLDRCQUF5Qjs7SUFDekIsdUNBQTBCOztJQUMxQix3Q0FBMkI7Ozs7O0FBRzdCLHFDQUtDOzs7SUFKQyxrQ0FHRTs7Ozs7QUFRSixNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCOzs7Ozs7SUFHL0QsWUFBb0IsT0FBZSxFQUFVLE1BQXNCLEVBQVUsV0FBdUI7UUFDbEcsS0FBSyxFQUFFLENBQUM7UUFEVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUY1RixjQUFTLEdBQTZCLElBQUksR0FBRyxFQUF1QixDQUFDO1FBSTNFLE9BQU8sQ0FBQyxNQUFNO2FBQ1gsSUFBSSxDQUNILE1BQU07Ozs7UUFBQyxDQUFDLEtBQXNCLEVBQUUsRUFBRSxDQUFDLEtBQUssWUFBWSxlQUFlLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLFVBQVUsRUFBQyxDQUMvRzthQUNBLFNBQVM7Ozs7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QyxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7OztZQXhHRixVQUFVOzs7O1lBOUJULE1BQU07WUFDTixjQUFjO1lBSFAsVUFBVTs7Ozs7OztJQWtDakIsOENBQTZFOzs7OztJQUVqRSw0Q0FBdUI7Ozs7O0lBQUUsMkNBQThCOzs7OztJQUFFLGdEQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBSb3V0ZXIsXG4gIEFjdGl2YXRlZFJvdXRlLFxuICBQYXJhbU1hcCxcbiAgTmF2aWdhdGlvbkV4dHJhcyxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCBhcyBOYXZpZ2F0aW9uRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGFwLCBtYXAsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENvdmFsZW50R3VpZGVkVG91ciwgSVRvdXJTdGVwLCBJVG91ck9wdGlvbnMgfSBmcm9tICcuL2d1aWRlZC50b3VyJztcblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91ciBleHRlbmRzIElUb3VyT3B0aW9ucyB7XG4gIHN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXTtcbiAgZmluaXNoQnV0dG9uVGV4dD86IHN0cmluZztcbiAgZGlzbWlzc0J1dHRvblRleHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUd1aWRlZFRvdXJTdGVwIGV4dGVuZHMgSVRvdXJTdGVwIHtcbiAgcm91dGluZz86IHtcbiAgICByb3V0ZTogc3RyaW5nO1xuICAgIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXM7XG4gIH07XG59XG5cbi8qKlxuICogIFJvdXRlciBlbmFibGVkIFNoZXBoZXJkIHRvdXJcbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ292YWxlbnRHdWlkZWRUb3VyU2VydmljZSBleHRlbmRzIENvdmFsZW50R3VpZGVkVG91ciB7XG4gIHByaXZhdGUgX3RvdXJzTWFwOiBNYXA8c3RyaW5nLCBJR3VpZGVkVG91cj4gPSBuZXcgTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgX3JvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0ICYmIGV2ZW50Lm5hdmlnYXRpb25UcmlnZ2VyID09PSAncG9wc3RhdGUnKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2hlcGhlcmRUb3VyLmlzQWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0ZXJUb3VyKHRvdXJOYW1lOiBzdHJpbmcsIHRvdXI6IElHdWlkZWRUb3VyIHwgc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0eXBlb2YgdG91ciA9PT0gJ3N0cmluZycgPyBhd2FpdCB0aGlzLl9sb2FkVG91cih0b3VyKSA6IHRvdXI7XG4gICAgdGhpcy5fdG91cnNNYXAuc2V0KHRvdXJOYW1lLCBndWlkZWRUb3VyKTtcbiAgfVxuXG4gIHN0YXJ0VG91cih0b3VyTmFtZTogc3RyaW5nKTogU2hlcGhlcmQuVG91ciB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0aGlzLl9nZXRUb3VyKHRvdXJOYW1lKTtcbiAgICB0aGlzLmZpbmlzaCgpO1xuICAgIGlmIChndWlkZWRUb3VyICYmIGd1aWRlZFRvdXIuc3RlcHMgJiYgZ3VpZGVkVG91ci5zdGVwcy5sZW5ndGgpIHtcbiAgICAgIC8vIHJlbW92ZSBzdGVwcyBmcm9tIHRvdXIgc2luY2Ugd2UgbmVlZCB0byBwcmVwcm9jZXNzIHRoZW0gZmlyc3RcbiAgICAgIHRoaXMubmV3VG91cihPYmplY3QuYXNzaWduKHt9LCBndWlkZWRUb3VyLCB7IHN0ZXBzOiB1bmRlZmluZWQgfSkpO1xuICAgICAgY29uc3QgdG91ckluc3RhbmNlOiBTaGVwaGVyZC5Ub3VyID0gdGhpcy5zaGVwaGVyZFRvdXIuYWRkU3RlcHMoXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZVJvdXRlc0ZvclN0ZXBzKFxuICAgICAgICAgIHRoaXMuX3ByZXBhcmVUb3VyKGd1aWRlZFRvdXIuc3RlcHMsIGd1aWRlZFRvdXIuZmluaXNoQnV0dG9uVGV4dCwgZ3VpZGVkVG91ci5kaXNtaXNzQnV0dG9uVGV4dCksXG4gICAgICAgICksXG4gICAgICApO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgcmV0dXJuIHRvdXJJbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgVG91ciAke3RvdXJOYW1lfSBkb2VzIG5vdCBleGlzdC4gUGxlYXNlIHRyeSBhbm90aGVyIHRvdXIuYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmluZHMgdGhlIHJpZ2h0IHJlZ2lzdGVyZWQgdG91ciBieSB1c2luZyBxdWVyeVBhcmFtc1xuICAvLyBmaW5pc2hlcyBhbnkgb3RoZXIgdG91ciBhbmQgc3RhcnRzIHRoZSBuZXcgb25lLlxuICBpbml0aWFsaXplT25RdWVyeVBhcmFtcyhxdWVyeVBhcmFtOiBzdHJpbmcgPSAndG91cicpOiBPYnNlcnZhYmxlPFBhcmFtTWFwPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdXRlLnF1ZXJ5UGFyYW1NYXAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgdGFwKChwYXJhbXM6IFBhcmFtTWFwKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdXJQYXJhbTogc3RyaW5nID0gcGFyYW1zLmdldChxdWVyeVBhcmFtKTtcbiAgICAgICAgaWYgKHRvdXJQYXJhbSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRUb3VyKHRvdXJQYXJhbSk7XG4gICAgICAgICAgLy8gZ2V0IGN1cnJlbnQgc2VhcmNoIHBhcmFtZXRlcnNcbiAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXM6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgLy8gZGVsZXRlIHRvdXIgcXVlcnlQYXJhbVxuICAgICAgICAgIHNlYXJjaFBhcmFtcy5kZWxldGUocXVlcnlQYXJhbSk7XG4gICAgICAgICAgLy8gYnVpbGQgbmV3IFVSTCBzdHJpbmcgd2l0aG91dCBpdFxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICBpZiAoc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVwbGFjZSBzdGF0ZSBpbiBoaXN0b3J5IHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5hdmlnYXRpb25cbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYXRoOiB1cmwgfSwgJycsIHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkVG91cih0b3VyVXJsOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IE9ic2VydmFibGU8b2JqZWN0PiA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHRvdXJVcmwpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKHJlc3VsdFNldDogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRTZXQpKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFRvdXIoa2V5OiBzdHJpbmcpOiBJR3VpZGVkVG91ciB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdXJzTWFwLmdldChrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uZmlndXJlUm91dGVzRm9yU3RlcHMocm91dGVkU3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdKTogSUd1aWRlZFRvdXJTdGVwW10ge1xuICAgIHJvdXRlZFN0ZXBzLmZvckVhY2goKHN0ZXA6IElHdWlkZWRUb3VyU3RlcCkgPT4ge1xuICAgICAgaWYgKHN0ZXAucm91dGluZykge1xuICAgICAgICBjb25zdCByb3V0ZTogc3RyaW5nID0gc3RlcC5yb3V0aW5nLnJvdXRlO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGJlZm9yZVNob3dQcm9taXNlLCB0aGVuIHdlIHNhdmUgaXQgYW5kIGNhbGwgaXQgYWZ0ZXIgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgaWYgKHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UpIHtcbiAgICAgICAgICBjb25zdCBiZWZvcmVTaG93UHJvbWlzZTogKCkgPT4gUHJvbWlzZTx2b2lkPiA9IHN0ZXAuYmVmb3JlU2hvd1Byb21pc2U7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwgc3RlcC5yb3V0aW5nLmV4dHJhcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBiZWZvcmVTaG93UHJvbWlzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVkU3RlcHM7XG4gIH1cbn1cbiJdfQ==