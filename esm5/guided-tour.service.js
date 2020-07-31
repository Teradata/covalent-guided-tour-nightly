/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter, __extends, __generator } from "tslib";
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
var CovalentGuidedTourService = /** @class */ (function (_super) {
    __extends(CovalentGuidedTourService, _super);
    function CovalentGuidedTourService(_router, _route, _httpClient) {
        var _this = _super.call(this) || this;
        _this._router = _router;
        _this._route = _route;
        _this._httpClient = _httpClient;
        _this._toursMap = new Map();
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
        /** @type {?} */
        var guidedTour = this._getTour(tourName);
        this.finish();
        if (guidedTour && guidedTour.steps && guidedTour.steps.length) {
            // remove steps from tour since we need to preprocess them first
            this.newTour(Object.assign({}, guidedTour, { steps: undefined }));
            /** @type {?} */
            var tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps, guidedTour.finishButtonText, guidedTour.dismissButtonText)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bjb3ZhbGVudC9ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImd1aWRlZC10b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFHZCxlQUFlLEdBRWhCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBMkIsTUFBTSxlQUFlLENBQUM7Ozs7QUFFNUUsaUNBSUM7OztJQUhDLDRCQUF5Qjs7SUFDekIsdUNBQTBCOztJQUMxQix3Q0FBMkI7Ozs7O0FBRzdCLHFDQUtDOzs7SUFKQyxrQ0FHRTs7Ozs7QUFPSjtJQUMrQyw2Q0FBa0I7SUFHL0QsbUNBQW9CLE9BQWUsRUFBVSxNQUFzQixFQUFVLFdBQXVCO1FBQXBHLFlBQ0UsaUJBQU8sU0FVUjtRQVhtQixhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUY1RixlQUFTLEdBQTZCLElBQUksR0FBRyxFQUF1QixDQUFDO1FBSTNFLE9BQU8sQ0FBQyxNQUFNO2FBQ1gsSUFBSSxDQUNILE1BQU07Ozs7UUFBQyxVQUFDLEtBQXNCLElBQUssT0FBQSxLQUFLLFlBQVksZUFBZSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxVQUFVLEVBQTFFLENBQTBFLEVBQUMsQ0FDL0c7YUFDQSxTQUFTOzs7O1FBQUMsVUFBQyxL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QztvQkFDTCxDQUFDLENBQUEsQ0FBQztpQkFDSDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsaUJBQWlCOzs7b0JBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBSyxDQUFDLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQSxDQUFDO2lCQUMvRDthQUNGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztnQkF4R0YsVUFBVTs7OztnQkE5QlQsTUFBTTtnQkFDTixjQUFjO2dCQUhQLFVBQVU7O0lBeUluQixnQ0FBQztDQUFBLEFBekdELENBQytDLGtCQUFrQixHQXdHaEU7U0F4R1kseUJBQXlCOzs7Ozs7SUFDcEMsOENBQTZFOzs7OztJQUVqRSw0Q0FBdUI7Ozs7O0lBQUUsMkNBQThCOzs7OztJQUFFLGdEQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBSb3V0ZXIsXG4gIEFjdGl2YXRlZFJvdXRlLFxuICBQYXJhbU1hcCxcbiAgTmF2aWdhdGlvbkV4dHJhcyxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCBhcyBOYXZpZ2F0aW9uRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgU2hlcGhlcmQgZnJvbSAnc2hlcGhlcmQuanMnO1xuaW1wb3J0IHsgdGFwLCBtYXAsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENvdmFsZW50R3VpZGVkVG91ciwgSVRvdXJTdGVwLCBJVG91ck9wdGlvbnMgfSBmcm9tICcuL2d1aWRlZC50b3VyJztcblxuZXhwb3J0IGludGVyZmFjZSBJR3VpZGVkVG91ciBleHRlbmRzIElUb3VyT3B0aW9ucyB7XG4gIHN0ZXBzOiBJR3VpZGVkVG91clN0ZXBbXTtcbiAgZmluaXNoQnV0dG9uVGV4dD86IHN0cmluZztcbiAgZGlzbWlzc0J1dHRvblRleHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUd1aWRlZFRvdXJTdGVwIGV4dGVuZHMgSVRvdXJTdGVwIHtcbiAgcm91dGluZz86IHtcbiAgICByb3V0ZTogc3RyaW5nO1xuICAgIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXM7XG4gIH07XG59XG5cbi8qKlxuICogIFJvdXRlciBlbmFibGVkIFNoZXBoZXJkIHRvdXJcbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ292YWxlbnRHdWlkZWRUb3VyU2VydmljZSBleHRlbmRzIENvdmFsZW50R3VpZGVkVG91ciB7XG4gIHByaXZhdGUgX3RvdXJzTWFwOiBNYXA8c3RyaW5nLCBJR3VpZGVkVG91cj4gPSBuZXcgTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgX3JvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0ICYmIGV2ZW50Lm5hdmlnYXRpb25UcmlnZ2VyID09PSAncG9wc3RhdGUnKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2hlcGhlcmRUb3VyLmlzQWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zaGVwaGVyZFRvdXIuY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0ZXJUb3VyKHRvdXJOYW1lOiBzdHJpbmcsIHRvdXI6IElHdWlkZWRUb3VyIHwgc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0eXBlb2YgdG91ciA9PT0gJ3N0cmluZycgPyBhd2FpdCB0aGlzLl9sb2FkVG91cih0b3VyKSA6IHRvdXI7XG4gICAgdGhpcy5fdG91cnNNYXAuc2V0KHRvdXJOYW1lLCBndWlkZWRUb3VyKTtcbiAgfVxuXG4gIHN0YXJ0VG91cih0b3VyTmFtZTogc3RyaW5nKTogU2hlcGhlcmQuVG91ciB7XG4gICAgY29uc3QgZ3VpZGVkVG91cjogSUd1aWRlZFRvdXIgPSB0aGlzLl9nZXRUb3VyKHRvdXJOYW1lKTtcbiAgICB0aGlzLmZpbmlzaCgpO1xuICAgIGlmIChndWlkZWRUb3VyICYmIGd1aWRlZFRvdXIuc3RlcHMgJiYgZ3VpZGVkVG91ci5zdGVwcy5sZW5ndGgpIHtcbiAgICAgIC8vIHJlbW92ZSBzdGVwcyBmcm9tIHRvdXIgc2luY2Ugd2UgbmVlZCB0byBwcmVwcm9jZXNzIHRoZW0gZmlyc3RcbiAgICAgIHRoaXMubmV3VG91cihPYmplY3QuYXNzaWduKHt9LCBndWlkZWRUb3VyLCB7IHN0ZXBzOiB1bmRlZmluZWQgfSkpO1xuICAgICAgY29uc3QgdG91ckluc3RhbmNlOiBTaGVwaGVyZC5Ub3VyID0gdGhpcy5zaGVwaGVyZFRvdXIuYWRkU3RlcHMoXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZVJvdXRlc0ZvclN0ZXBzKFxuICAgICAgICAgIHRoaXMuX3ByZXBhcmVUb3VyKGd1aWRlZFRvdXIuc3RlcHMsIGd1aWRlZFRvdXIuZmluaXNoQnV0dG9uVGV4dCwgZ3VpZGVkVG91ci5kaXNtaXNzQnV0dG9uVGV4dCksXG4gICAgICAgICksXG4gICAgICApO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgcmV0dXJuIHRvdXJJbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgVG91ciAke3RvdXJOYW1lfSBkb2VzIG5vdCBleGlzdC4gUGxlYXNlIHRyeSBhbm90aGVyIHRvdXIuYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmluZHMgdGhlIHJpZ2h0IHJlZ2lzdGVyZWQgdG91ciBieSB1c2luZyBxdWVyeVBhcmFtc1xuICAvLyBmaW5pc2hlcyBhbnkgb3RoZXIgdG91ciBhbmQgc3RhcnRzIHRoZSBuZXcgb25lLlxuICBpbml0aWFsaXplT25RdWVyeVBhcmFtcyhxdWVyeVBhcmFtOiBzdHJpbmcgPSAndG91cicpOiBPYnNlcnZhYmxlPFBhcmFtTWFwPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdXRlLnF1ZXJ5UGFyYW1NYXAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgdGFwKChwYXJhbXM6IFBhcmFtTWFwKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdXJQYXJhbTogc3RyaW5nID0gcGFyYW1zLmdldChxdWVyeVBhcmFtKTtcbiAgICAgICAgaWYgKHRvdXJQYXJhbSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRUb3VyKHRvdXJQYXJhbSk7XG4gICAgICAgICAgLy8gZ2V0IGN1cnJlbnQgc2VhcmNoIHBhcmFtZXRlcnNcbiAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXM6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgLy8gZGVsZXRlIHRvdXIgcXVlcnlQYXJhbVxuICAgICAgICAgIHNlYXJjaFBhcmFtcy5kZWxldGUocXVlcnlQYXJhbSk7XG4gICAgICAgICAgLy8gYnVpbGQgbmV3IFVSTCBzdHJpbmcgd2l0aG91dCBpdFxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICBpZiAoc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVwbGFjZSBzdGF0ZSBpbiBoaXN0b3J5IHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5hdmlnYXRpb25cbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYXRoOiB1cmwgfSwgJycsIHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkVG91cih0b3VyVXJsOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IE9ic2VydmFibGU8b2JqZWN0PiA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHRvdXJVcmwpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKHJlc3VsdFNldDogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRTZXQpKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFRvdXIoa2V5OiBzdHJpbmcpOiBJR3VpZGVkVG91ciB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdXJzTWFwLmdldChrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uZmlndXJlUm91dGVzRm9yU3RlcHMocm91dGVkU3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdKTogSUd1aWRlZFRvdXJTdGVwW10ge1xuICAgIHJvdXRlZFN0ZXBzLmZvckVhY2goKHN0ZXA6IElHdWlkZWRUb3VyU3RlcCkgPT4ge1xuICAgICAgaWYgKHN0ZXAucm91dGluZykge1xuICAgICAgICBjb25zdCByb3V0ZTogc3RyaW5nID0gc3RlcC5yb3V0aW5nLnJvdXRlO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGJlZm9yZVNob3dQcm9taXNlLCB0aGVuIHdlIHNhdmUgaXQgYW5kIGNhbGwgaXQgYWZ0ZXIgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgaWYgKHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UpIHtcbiAgICAgICAgICBjb25zdCBiZWZvcmVTaG93UHJvbWlzZTogKCkgPT4gUHJvbWlzZTx2b2lkPiA9IHN0ZXAuYmVmb3JlU2hvd1Byb21pc2U7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwgc3RlcC5yb3V0aW5nLmV4dHJhcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBiZWZvcmVTaG93UHJvbWlzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVkU3RlcHM7XG4gIH1cbn1cbiJdfQ==