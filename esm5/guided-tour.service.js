/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter, __extends, __generator } from "tslib";
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
var TourEvents = {
    complete: 'complete',
    cancel: 'cancel',
    hide: 'hide',
    show: 'show',
    start: 'start',
    active: 'active',
    inactive: 'inactive',
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
export { CovalentGuidedTourService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bjb3ZhbGVudC9ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImd1aWRlZC10b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFHZCxlQUFlLEdBRWhCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGtCQUFrQixFQUEyQixNQUFNLGVBQWUsQ0FBQzs7OztBQUU1RSxpQ0FHQzs7O0lBRkMsNEJBQXlCOztJQUN6Qix1Q0FBMEI7Ozs7O0FBRzVCLHFDQUtDOzs7SUFKQyxrQ0FHRTs7OztJQU9GLFVBQVcsVUFBVTtJQUNyQixRQUFTLFFBQVE7SUFDakIsTUFBTyxNQUFNO0lBQ2IsTUFBTyxNQUFNO0lBQ2IsT0FBUSxPQUFPO0lBQ2YsUUFBUyxRQUFRO0lBQ2pCLFVBQVcsVUFBVTs7Ozs7O0FBR3ZCLHNDQUlDOzs7SUFIQyxnQ0FBVTs7SUFDVixvQ0FBYzs7SUFDZCxnQ0FBVTs7QUFHWjtJQUMrQyw2Q0FBa0I7SUFHL0QsbUNBQW9CLE9BQWUsRUFBVSxNQUFzQixFQUFVLFdBQXVCO1FBQXBHLFlBQ0UsaUJBQU8sU0FVUjtRQVhtQixhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUY1RixlQUFTLEdB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QUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSTs7O3dCQUFDOzRCQUM5RCxPQUFPLG1CQUFpQixFQUFFLENBQUM7d0JBQzdCLENBQUMsRUFBQyxDQUFDO29CQUNMLENBQUMsQ0FBQSxDQUFDO2lCQUNIO3FCQUFNO29CQUNMLElBQUksQ0FBQyxpQkFBaUI7OztvQkFBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFLLENBQUMsQ0FBQyxFQUE5QixDQUE4QixDQUFBLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7O2dCQTdIRixVQUFVOzs7O2dCQTVDVCxNQUFNO2dCQUNOLGNBQWM7Z0JBSFAsVUFBVTs7SUE0S25CLGdDQUFDO0NBQUEsQUE5SEQsQ0FDK0Msa0JBQWtCLEdBNkhoRTtTQTdIWSx5QkFBeUI7Ozs7OztJQUNwQyw4Q0FBNkU7Ozs7O0lBQzdFLGtEQUF1RTs7Ozs7SUFDM0QsNENBQXVCOzs7OztJQUFFLDJDQUE4Qjs7Ozs7SUFBRSxnREFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtcbiAgUm91dGVyLFxuICBBY3RpdmF0ZWRSb3V0ZSxcbiAgUGFyYW1NYXAsXG4gIE5hdmlnYXRpb25FeHRyYXMsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgRXZlbnQgYXMgTmF2aWdhdGlvbkV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IFNoZXBoZXJkIGZyb20gJ3NoZXBoZXJkLmpzJztcbmltcG9ydCB7IHRhcCwgbWFwLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENvdmFsZW50R3VpZGVkVG91ciwgSVRvdXJTdGVwLCBJVG91ck9wdGlvbnMgfSBmcm9tICcuL2d1aWRlZC50b3VyJztcblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91ciBleHRlbmRzIElUb3VyT3B0aW9ucyB7XG4gIHN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXTtcbiAgZmluaXNoQnV0dG9uVGV4dD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91clN0ZXAgZXh0ZW5kcyBJVG91clN0ZXAge1xuICByb3V0aW5nPzoge1xuICAgIHJvdXRlOiBzdHJpbmc7XG4gICAgZXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcztcbiAgfTtcbn1cblxuLyoqXG4gKiAgUm91dGVyIGVuYWJsZWQgU2hlcGhlcmQgdG91clxuICovXG5leHBvcnQgZW51bSBUb3VyRXZlbnRzIHtcbiAgY29tcGxldGUgPSAnY29tcGxldGUnLFxuICBjYW5jZWwgPSAnY2FuY2VsJyxcbiAgaGlkZSA9ICdoaWRlJyxcbiAgc2hvdyA9ICdzaG93JyxcbiAgc3RhcnQgPSAnc3RhcnQnLFxuICBhY3RpdmUgPSAnYWN0aXZlJyxcbiAgaW5hY3RpdmUgPSAnaW5hY3RpdmUnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyRXZlbnQge1xuICBzdGVwOiBhbnk7XG4gIHByZXZpb3VzOiBhbnk7XG4gIHRvdXI6IGFueTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91clNlcnZpY2UgZXh0ZW5kcyBDb3ZhbGVudEd1aWRlZFRvdXIge1xuICBwcml2YXRlIF90b3Vyc01hcDogTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+ID0gbmV3IE1hcDxzdHJpbmcsIElHdWlkZWRUb3VyPigpO1xuICBwcml2YXRlIF90b3VyU3RlcFVSTHM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9odHRwQ2xpZW50OiBIdHRwQ2xpZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICBfcm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQ6IE5hdmlnYXRpb25FdmVudCkgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgJiYgZXZlbnQubmF2aWdhdGlvblRyaWdnZXIgPT09ICdwb3BzdGF0ZScpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE5hdmlnYXRpb25FdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zaGVwaGVyZFRvdXIuaXNBY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLnNoZXBoZXJkVG91ci5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICB0b3VyRXZlbnQkKHN0cjogVG91ckV2ZW50cyk6IE9ic2VydmFibGU8SUd1aWRlZFRvdXJFdmVudD4ge1xuICAgIHJldHVybiBmcm9tRXZlbnQodGhpcy5zaGVwaGVyZFRvdXIsIHN0cik7XG4gIH1cblxuICBhc3luYyByZWdpc3RlclRvdXIodG91ck5hbWU6IHN0cmluZywgdG91cjogSUd1aWRlZFRvdXIgfCBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBndWlkZWRUb3VyOiBJR3VpZGVkVG91ciA9IHR5cGVvZiB0b3VyID09PSAnc3RyaW5nJyA/IGF3YWl0IHRoaXMuX2xvYWRUb3VyKHRvdXIpIDogdG91cjtcbiAgICB0aGlzLl90b3Vyc01hcC5zZXQodG91ck5hbWUsIGd1aWRlZFRvdXIpO1xuICB9XG5cbiAgc3RhcnRUb3VyKHRvdXJOYW1lOiBzdHJpbmcpOiBTaGVwaGVyZC5Ub3VyIHtcbiAgICBjb25zdCBndWlkZWRUb3VyOiBJR3VpZGVkVG91ciA9IHRoaXMuX2dldFRvdXIodG91ck5hbWUpO1xuICAgIHRoaXMuZmluaXNoKCk7XG4gICAgaWYgKGd1aWRlZFRvdXIgJiYgZ3VpZGVkVG91ci5zdGVwcyAmJiBndWlkZWRUb3VyLnN0ZXBzLmxlbmd0aCkge1xuICAgICAgLy8gcmVtb3ZlIHN0ZXBzIGZyb20gdG91ciBzaW5jZSB3ZSBuZWVkIHRvIHByZXByb2Nlc3MgdGhlbSBmaXJzdFxuICAgICAgdGhpcy5uZXdUb3VyKE9iamVjdC5hc3NpZ24oe30sIGd1aWRlZFRvdXIsIHsgc3RlcHM6IHVuZGVmaW5lZCB9KSk7XG4gICAgICBjb25zdCB0b3VySW5zdGFuY2U6IFNoZXBoZXJkLlRvdXIgPSB0aGlzLnNoZXBoZXJkVG91ci5hZGRTdGVwcyhcbiAgICAgICAgdGhpcy5fY29uZmlndXJlUm91dGVzRm9yU3RlcHModGhpcy5fcHJlcGFyZVRvdXIoZ3VpZGVkVG91ci5zdGVwcywgZ3VpZGVkVG91ci5maW5pc2hCdXR0b25UZXh0KSksXG4gICAgICApO1xuICAgICAgLy8gaW5pdCByb3V0ZSB0cmFuc2l0aW9uIGlmIHN0ZXAgVVJMIGlzIGRpZmZlcmVudCB0aGVuIHRoZSBjdXJyZW50IGxvY2F0aW9uLlxuICAgICAgdGhpcy50b3VyRXZlbnQkKFRvdXJFdmVudHMuc2hvdykuc3Vic2NyaWJlKCh0b3VyRXZlbnQ6IElHdWlkZWRUb3VyRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFVSTDogc3RyaW5nID0gdGhpcy5fcm91dGVyLnVybC5zcGxpdCgvWz8jXS8pWzBdO1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgc3RlcDogeyBpZCwgb3B0aW9ucyB9LFxuICAgICAgICB9ID0gdG91ckV2ZW50O1xuICAgICAgICBpZiAodGhpcy5fdG91clN0ZXBVUkxzLmhhcyhpZCkpIHtcbiAgICAgICAgICBjb25zdCBzdGVwUm91dGU6IHN0cmluZyA9IHRoaXMuX3RvdXJTdGVwVVJMcy5nZXQoaWQpO1xuICAgICAgICAgIGlmIChzdGVwUm91dGUgIT09IGN1cnJlbnRVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbc3RlcFJvdXRlXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucm91dGluZykge1xuICAgICAgICAgICAgdGhpcy5fdG91clN0ZXBVUkxzLnNldChpZCwgb3B0aW9ucy5yb3V0aW5nLnJvdXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdG91clN0ZXBVUkxzLnNldChpZCwgY3VycmVudFVSTCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIHJldHVybiB0b3VySW5zdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oYFRvdXIgJHt0b3VyTmFtZX0gZG9lcyBub3QgZXhpc3QuIFBsZWFzZSB0cnkgYW5vdGhlciB0b3VyLmApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmRzIHRoZSByaWdodCByZWdpc3RlcmVkIHRvdXIgYnkgdXNpbmcgcXVlcnlQYXJhbXNcbiAgLy8gZmluaXNoZXMgYW55IG90aGVyIHRvdXIgYW5kIHN0YXJ0cyB0aGUgbmV3IG9uZS5cbiAgaW5pdGlhbGl6ZU9uUXVlcnlQYXJhbXMocXVlcnlQYXJhbTogc3RyaW5nID0gJ3RvdXInKTogT2JzZXJ2YWJsZTxQYXJhbU1hcD4ge1xuICAgIHJldHVybiB0aGlzLl9yb3V0ZS5xdWVyeVBhcmFtTWFwLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgIHRhcCgocGFyYW1zOiBQYXJhbU1hcCkgPT4ge1xuICAgICAgICBjb25zdCB0b3VyUGFyYW06IHN0cmluZyA9IHBhcmFtcy5nZXQocXVlcnlQYXJhbSk7XG4gICAgICAgIGlmICh0b3VyUGFyYW0pIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0VG91cih0b3VyUGFyYW0pO1xuICAgICAgICAgIC8vIGdldCBjdXJyZW50IHNlYXJjaCBwYXJhbWV0ZXJzXG4gICAgICAgICAgY29uc3Qgc2VhcmNoUGFyYW1zOiBVUkxTZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgIC8vIGRlbGV0ZSB0b3VyIHF1ZXJ5UGFyYW1cbiAgICAgICAgICBzZWFyY2hQYXJhbXMuZGVsZXRlKHF1ZXJ5UGFyYW0pO1xuICAgICAgICAgIC8vIGJ1aWxkIG5ldyBVUkwgc3RyaW5nIHdpdGhvdXQgaXRcbiAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgaWYgKHNlYXJjaFBhcmFtcy50b1N0cmluZygpKSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlcGxhY2Ugc3RhdGUgaW4gaGlzdG9yeSB3aXRob3V0IHRyaWdnZXJpbmcgYSBuYXZpZ2F0aW9uXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgcGF0aDogdXJsIH0sICcnLCB1cmwpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbG9hZFRvdXIodG91clVybDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBPYnNlcnZhYmxlPG9iamVjdD4gPSB0aGlzLl9odHRwQ2xpZW50LmdldCh0b3VyVXJsKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHJlcXVlc3RcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgbWFwKChyZXN1bHRTZXQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0U2V0KSk7XG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgICAgLnRvUHJvbWlzZSgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRUb3VyKGtleTogc3RyaW5nKTogSUd1aWRlZFRvdXIge1xuICAgIHJldHVybiB0aGlzLl90b3Vyc01hcC5nZXQoa2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbmZpZ3VyZVJvdXRlc0ZvclN0ZXBzKHJvdXRlZFN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXSk6IElHdWlkZWRUb3VyU3RlcFtdIHtcbiAgICByb3V0ZWRTdGVwcy5mb3JFYWNoKChzdGVwOiBJR3VpZGVkVG91clN0ZXApID0+IHtcbiAgICAgIGlmIChzdGVwLnJvdXRpbmcpIHtcbiAgICAgICAgY29uc3Qgcm91dGU6IHN0cmluZyA9IHN0ZXAucm91dGluZy5yb3V0ZTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBiZWZvcmVTaG93UHJvbWlzZSwgdGhlbiB3ZSBzYXZlIGl0IGFuZCBjYWxsIGl0IGFmdGVyIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgIGlmIChzdGVwLmJlZm9yZVNob3dQcm9taXNlKSB7XG4gICAgICAgICAgY29uc3QgYmVmb3JlU2hvd1Byb21pc2U6ICgpID0+IFByb21pc2U8dm9pZD4gPSBzdGVwLmJlZm9yZVNob3dQcm9taXNlO1xuICAgICAgICAgIHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0sIHN0ZXAucm91dGluZy5leHRyYXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYmVmb3JlU2hvd1Byb21pc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbcm91dGVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlZFN0ZXBzO1xuICB9XG59XG4iXX0=