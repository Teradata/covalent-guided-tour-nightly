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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bjb3ZhbGVudC9ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImd1aWRlZC10b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFHZCxlQUFlLEdBRWhCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBMkIsTUFBTSxlQUFlLENBQUM7Ozs7QUFFNUUsaUNBRUM7OztJQURDLDRCQUF5Qjs7Ozs7QUFHM0IscUNBS0M7OztJQUpDLGtDQUdFOzs7OztBQVFKLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxrQkFBa0I7Ozs7OztJQUcvRCxZQUFvQixPQUFlLEVBQVUsTUFBc0IsRUFBVSxXQUF1QjtRQUNsRyxLQUFLLEVBQUUsQ0FBQztRQURVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBRjVGLGNBQVMsR0FBNkIsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFJM0UsT0FBTyxDQUFDLE1BQU07YUFDWCxJQUFJLENBQ0gsTUFBTTs7OztRQUFDLENBQUMsS0FBc0IsRUFBRSxFQUFFLENBQUMsS0FBSyxZQUFZLGVBQWUsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssVUFBVSxFQUFDLENBQy9HO2FBQ0EsU0FBUzs7OztRQUFDLENBQUMsS0FBc0IsRUFBRSxFQUFFO1lB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LENBQUM7SUFDckIsQ0FBQzs7O1lBdEdGLFVBQVU7Ozs7WUE1QlQsTUFBTTtZQUNOLGNBQWM7WUFIUCxVQUFVOzs7Ozs7O0lBZ0NqQiw4Q0FBNkU7Ozs7O0lBRWpFLDRDQUF1Qjs7Ozs7SUFBRSwyQ0FBOEI7Ozs7O0lBQUUsZ0RBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7XG4gIFJvdXRlcixcbiAgQWN0aXZhdGVkUm91dGUsXG4gIFBhcmFtTWFwLFxuICBOYXZpZ2F0aW9uRXh0cmFzLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50IGFzIE5hdmlnYXRpb25FdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCBTaGVwaGVyZCBmcm9tICdzaGVwaGVyZC5qcyc7XG5pbXBvcnQgeyB0YXAsIG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ292YWxlbnRHdWlkZWRUb3VyLCBJVG91clN0ZXAsIElUb3VyT3B0aW9ucyB9IGZyb20gJy4vZ3VpZGVkLnRvdXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyIGV4dGVuZHMgSVRvdXJPcHRpb25zIHtcbiAgc3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyU3RlcCBleHRlbmRzIElUb3VyU3RlcCB7XG4gIHJvdXRpbmc/OiB7XG4gICAgcm91dGU6IHN0cmluZztcbiAgICBleHRyYXM/OiBOYXZpZ2F0aW9uRXh0cmFzO1xuICB9O1xufVxuXG4vKipcbiAqICBSb3V0ZXIgZW5hYmxlZCBTaGVwaGVyZCB0b3VyXG4gKi9cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91clNlcnZpY2UgZXh0ZW5kcyBDb3ZhbGVudEd1aWRlZFRvdXIge1xuICBwcml2YXRlIF90b3Vyc01hcDogTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+ID0gbmV3IE1hcDxzdHJpbmcsIElHdWlkZWRUb3VyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgX2h0dHBDbGllbnQ6IEh0dHBDbGllbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIF9yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChldmVudDogTmF2aWdhdGlvbkV2ZW50KSA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCAmJiBldmVudC5uYXZpZ2F0aW9uVHJpZ2dlciA9PT0gJ3BvcHN0YXRlJyksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogTmF2aWdhdGlvbkV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnNoZXBoZXJkVG91ci5pc0FjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyVG91cih0b3VyTmFtZTogc3RyaW5nLCB0b3VyOiBJR3VpZGVkVG91ciB8IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGd1aWRlZFRvdXI6IElHdWlkZWRUb3VyID0gdHlwZW9mIHRvdXIgPT09ICdzdHJpbmcnID8gYXdhaXQgdGhpcy5fbG9hZFRvdXIodG91cikgOiB0b3VyO1xuICAgIHRoaXMuX3RvdXJzTWFwLnNldCh0b3VyTmFtZSwgZ3VpZGVkVG91cik7XG4gIH1cblxuICBzdGFydFRvdXIodG91ck5hbWU6IHN0cmluZyk6IFNoZXBoZXJkLlRvdXIge1xuICAgIGNvbnN0IGd1aWRlZFRvdXI6IElHdWlkZWRUb3VyID0gdGhpcy5fZ2V0VG91cih0b3VyTmFtZSk7XG4gICAgdGhpcy5maW5pc2goKTtcbiAgICBpZiAoZ3VpZGVkVG91ciAmJiBndWlkZWRUb3VyLnN0ZXBzICYmIGd1aWRlZFRvdXIuc3RlcHMubGVuZ3RoKSB7XG4gICAgICAvLyByZW1vdmUgc3RlcHMgZnJvbSB0b3VyIHNpbmNlIHdlIG5lZWQgdG8gcHJlcHJvY2VzcyB0aGVtIGZpcnN0XG4gICAgICB0aGlzLm5ld1RvdXIoT2JqZWN0LmFzc2lnbih7fSwgZ3VpZGVkVG91ciwgeyBzdGVwczogdW5kZWZpbmVkIH0pKTtcbiAgICAgIGNvbnN0IHRvdXJJbnN0YW5jZTogU2hlcGhlcmQuVG91ciA9IHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKFxuICAgICAgICB0aGlzLl9jb25maWd1cmVSb3V0ZXNGb3JTdGVwcyh0aGlzLl9wcmVwYXJlVG91cihndWlkZWRUb3VyLnN0ZXBzKSksXG4gICAgICApO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgcmV0dXJuIHRvdXJJbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgVG91ciAke3RvdXJOYW1lfSBkb2VzIG5vdCBleGlzdC4gUGxlYXNlIHRyeSBhbm90aGVyIHRvdXIuYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmluZHMgdGhlIHJpZ2h0IHJlZ2lzdGVyZWQgdG91ciBieSB1c2luZyBxdWVyeVBhcmFtc1xuICAvLyBmaW5pc2hlcyBhbnkgb3RoZXIgdG91ciBhbmQgc3RhcnRzIHRoZSBuZXcgb25lLlxuICBpbml0aWFsaXplT25RdWVyeVBhcmFtcyhxdWVyeVBhcmFtOiBzdHJpbmcgPSAndG91cicpOiBPYnNlcnZhYmxlPFBhcmFtTWFwPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdXRlLnF1ZXJ5UGFyYW1NYXAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgdGFwKChwYXJhbXM6IFBhcmFtTWFwKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdXJQYXJhbTogc3RyaW5nID0gcGFyYW1zLmdldChxdWVyeVBhcmFtKTtcbiAgICAgICAgaWYgKHRvdXJQYXJhbSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRUb3VyKHRvdXJQYXJhbSk7XG4gICAgICAgICAgLy8gZ2V0IGN1cnJlbnQgc2VhcmNoIHBhcmFtZXRlcnNcbiAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXM6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgLy8gZGVsZXRlIHRvdXIgcXVlcnlQYXJhbVxuICAgICAgICAgIHNlYXJjaFBhcmFtcy5kZWxldGUocXVlcnlQYXJhbSk7XG4gICAgICAgICAgLy8gYnVpbGQgbmV3IFVSTCBzdHJpbmcgd2l0aG91dCBpdFxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICBpZiAoc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVwbGFjZSBzdGF0ZSBpbiBoaXN0b3J5IHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5hdmlnYXRpb25cbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYXRoOiB1cmwgfSwgJycsIHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkVG91cih0b3VyVXJsOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IE9ic2VydmFibGU8b2JqZWN0PiA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHRvdXJVcmwpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKHJlc3VsdFNldDogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRTZXQpKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFRvdXIoa2V5OiBzdHJpbmcpOiBJR3VpZGVkVG91ciB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdXJzTWFwLmdldChrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uZmlndXJlUm91dGVzRm9yU3RlcHMocm91dGVkU3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdKTogSUd1aWRlZFRvdXJTdGVwW10ge1xuICAgIHJvdXRlZFN0ZXBzLmZvckVhY2goKHN0ZXA6IElHdWlkZWRUb3VyU3RlcCkgPT4ge1xuICAgICAgaWYgKHN0ZXAucm91dGluZykge1xuICAgICAgICBjb25zdCByb3V0ZTogc3RyaW5nID0gc3RlcC5yb3V0aW5nLnJvdXRlO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGJlZm9yZVNob3dQcm9taXNlLCB0aGVuIHdlIHNhdmUgaXQgYW5kIGNhbGwgaXQgYWZ0ZXIgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgaWYgKHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UpIHtcbiAgICAgICAgICBjb25zdCBiZWZvcmVTaG93UHJvbWlzZTogKCkgPT4gUHJvbWlzZTx2b2lkPiA9IHN0ZXAuYmVmb3JlU2hvd1Byb21pc2U7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwgc3RlcC5yb3V0aW5nLmV4dHJhcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBiZWZvcmVTaG93UHJvbWlzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVkU3RlcHM7XG4gIH1cbn1cbiJdfQ==