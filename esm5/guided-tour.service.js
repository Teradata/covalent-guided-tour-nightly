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
            var tourInstance = this.shepherdTour.addSteps(this._configureRoutesForSteps(this._prepareTour(guidedTour.steps)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bjb3ZhbGVudC9ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImd1aWRlZC10b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFHZCxlQUFlLEdBRWhCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBMkIsTUFBTSxlQUFlLENBQUM7Ozs7QUFFNUUsaUNBRUM7OztJQURDLDRCQUF5Qjs7Ozs7QUFHM0IscUNBS0M7OztJQUpDLGtDQUdFOzs7OztBQU9KO0lBQytDLDZDQUFrQjtJQUcvRCxtQ0FBb0IsT0FBZSxFQUFVLE1BQXNCLEVBQVUsV0FBdUI7UUFBcEcsWUFDRSxpQkFBTyxTQVVSO1FBWG1CLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxZQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUFVLGlCQUFXLEdBQVgsV0FBVyxDQUFZO1FBRjVGLGVBQVMsR0FBNkIsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFJM0UsT0FBTyxDQUFDLE1BQU07YUFDWCxJQUFJLENBQ0gsTUFBTTs7OztRQUFDLFVBQUMsS0FBc0IsSUFBSyxPQUFBLEtBQUssWUFBWSxlQUFlLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLFVBQVUsRUFBMUUsQ0FBMEUsRUFBQyxDQUMvRzthQUNBLFNBQVM7Ozs7UUFBQyxVQUFDLEtBQXNCO1lBQ2hDLElBQUksS0FBSSxDQUFDLFlB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QUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFLLENBQUMsQ0FBQyxFQUE5QixDQUE4QixDQUFBLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7O2dCQXRHRixVQUFVOzs7O2dCQTVCVCxNQUFNO2dCQUNOLGNBQWM7Z0JBSFAsVUFBVTs7SUFxSW5CLGdDQUFDO0NBQUEsQUF2R0QsQ0FDK0Msa0JBQWtCLEdBc0doRTtTQXRHWSx5QkFBeUI7Ozs7OztJQUNwQyw4Q0FBNkU7Ozs7O0lBRWpFLDRDQUF1Qjs7Ozs7SUFBRSwyQ0FBOEI7Ozs7O0lBQUUsZ0RBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7XG4gIFJvdXRlcixcbiAgQWN0aXZhdGVkUm91dGUsXG4gIFBhcmFtTWFwLFxuICBOYXZpZ2F0aW9uRXh0cmFzLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50IGFzIE5hdmlnYXRpb25FdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCBTaGVwaGVyZCBmcm9tICdzaGVwaGVyZC5qcyc7XG5pbXBvcnQgeyB0YXAsIG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ292YWxlbnRHdWlkZWRUb3VyLCBJVG91clN0ZXAsIElUb3VyT3B0aW9ucyB9IGZyb20gJy4vZ3VpZGVkLnRvdXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyIGV4dGVuZHMgSVRvdXJPcHRpb25zIHtcbiAgc3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHdWlkZWRUb3VyU3RlcCBleHRlbmRzIElUb3VyU3RlcCB7XG4gIHJvdXRpbmc/OiB7XG4gICAgcm91dGU6IHN0cmluZztcbiAgICBleHRyYXM/OiBOYXZpZ2F0aW9uRXh0cmFzO1xuICB9O1xufVxuXG4vKipcbiAqICBSb3V0ZXIgZW5hYmxlZCBTaGVwaGVyZCB0b3VyXG4gKi9cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvdmFsZW50R3VpZGVkVG91clNlcnZpY2UgZXh0ZW5kcyBDb3ZhbGVudEd1aWRlZFRvdXIge1xuICBwcml2YXRlIF90b3Vyc01hcDogTWFwPHN0cmluZywgSUd1aWRlZFRvdXI+ID0gbmV3IE1hcDxzdHJpbmcsIElHdWlkZWRUb3VyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgX2h0dHBDbGllbnQ6IEh0dHBDbGllbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIF9yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChldmVudDogTmF2aWdhdGlvbkV2ZW50KSA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCAmJiBldmVudC5uYXZpZ2F0aW9uVHJpZ2dlciA9PT0gJ3BvcHN0YXRlJyksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogTmF2aWdhdGlvbkV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnNoZXBoZXJkVG91ci5pc0FjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuc2hlcGhlcmRUb3VyLmNhbmNlbCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyVG91cih0b3VyTmFtZTogc3RyaW5nLCB0b3VyOiBJR3VpZGVkVG91ciB8IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGd1aWRlZFRvdXI6IElHdWlkZWRUb3VyID0gdHlwZW9mIHRvdXIgPT09ICdzdHJpbmcnID8gYXdhaXQgdGhpcy5fbG9hZFRvdXIodG91cikgOiB0b3VyO1xuICAgIHRoaXMuX3RvdXJzTWFwLnNldCh0b3VyTmFtZSwgZ3VpZGVkVG91cik7XG4gIH1cblxuICBzdGFydFRvdXIodG91ck5hbWU6IHN0cmluZyk6IFNoZXBoZXJkLlRvdXIge1xuICAgIGNvbnN0IGd1aWRlZFRvdXI6IElHdWlkZWRUb3VyID0gdGhpcy5fZ2V0VG91cih0b3VyTmFtZSk7XG4gICAgdGhpcy5maW5pc2goKTtcbiAgICBpZiAoZ3VpZGVkVG91ciAmJiBndWlkZWRUb3VyLnN0ZXBzICYmIGd1aWRlZFRvdXIuc3RlcHMubGVuZ3RoKSB7XG4gICAgICAvLyByZW1vdmUgc3RlcHMgZnJvbSB0b3VyIHNpbmNlIHdlIG5lZWQgdG8gcHJlcHJvY2VzcyB0aGVtIGZpcnN0XG4gICAgICB0aGlzLm5ld1RvdXIoT2JqZWN0LmFzc2lnbih7fSwgZ3VpZGVkVG91ciwgeyBzdGVwczogdW5kZWZpbmVkIH0pKTtcbiAgICAgIGNvbnN0IHRvdXJJbnN0YW5jZTogU2hlcGhlcmQuVG91ciA9IHRoaXMuc2hlcGhlcmRUb3VyLmFkZFN0ZXBzKFxuICAgICAgICB0aGlzLl9jb25maWd1cmVSb3V0ZXNGb3JTdGVwcyh0aGlzLl9wcmVwYXJlVG91cihndWlkZWRUb3VyLnN0ZXBzKSksXG4gICAgICApO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgcmV0dXJuIHRvdXJJbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgVG91ciAke3RvdXJOYW1lfSBkb2VzIG5vdCBleGlzdC4gUGxlYXNlIHRyeSBhbm90aGVyIHRvdXIuYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmluZHMgdGhlIHJpZ2h0IHJlZ2lzdGVyZWQgdG91ciBieSB1c2luZyBxdWVyeVBhcmFtc1xuICAvLyBmaW5pc2hlcyBhbnkgb3RoZXIgdG91ciBhbmQgc3RhcnRzIHRoZSBuZXcgb25lLlxuICBpbml0aWFsaXplT25RdWVyeVBhcmFtcyhxdWVyeVBhcmFtOiBzdHJpbmcgPSAndG91cicpOiBPYnNlcnZhYmxlPFBhcmFtTWFwPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdXRlLnF1ZXJ5UGFyYW1NYXAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgdGFwKChwYXJhbXM6IFBhcmFtTWFwKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdXJQYXJhbTogc3RyaW5nID0gcGFyYW1zLmdldChxdWVyeVBhcmFtKTtcbiAgICAgICAgaWYgKHRvdXJQYXJhbSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRUb3VyKHRvdXJQYXJhbSk7XG4gICAgICAgICAgLy8gZ2V0IGN1cnJlbnQgc2VhcmNoIHBhcmFtZXRlcnNcbiAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXM6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgLy8gZGVsZXRlIHRvdXIgcXVlcnlQYXJhbVxuICAgICAgICAgIHNlYXJjaFBhcmFtcy5kZWxldGUocXVlcnlQYXJhbSk7XG4gICAgICAgICAgLy8gYnVpbGQgbmV3IFVSTCBzdHJpbmcgd2l0aG91dCBpdFxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICBpZiAoc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVwbGFjZSBzdGF0ZSBpbiBoaXN0b3J5IHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5hdmlnYXRpb25cbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYXRoOiB1cmwgfSwgJycsIHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkVG91cih0b3VyVXJsOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IE9ic2VydmFibGU8b2JqZWN0PiA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHRvdXJVcmwpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKHJlc3VsdFNldDogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRTZXQpKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFRvdXIoa2V5OiBzdHJpbmcpOiBJR3VpZGVkVG91ciB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdXJzTWFwLmdldChrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uZmlndXJlUm91dGVzRm9yU3RlcHMocm91dGVkU3RlcHM6IElHdWlkZWRUb3VyU3RlcFtdKTogSUd1aWRlZFRvdXJTdGVwW10ge1xuICAgIHJvdXRlZFN0ZXBzLmZvckVhY2goKHN0ZXA6IElHdWlkZWRUb3VyU3RlcCkgPT4ge1xuICAgICAgaWYgKHN0ZXAucm91dGluZykge1xuICAgICAgICBjb25zdCByb3V0ZTogc3RyaW5nID0gc3RlcC5yb3V0aW5nLnJvdXRlO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGJlZm9yZVNob3dQcm9taXNlLCB0aGVuIHdlIHNhdmUgaXQgYW5kIGNhbGwgaXQgYWZ0ZXIgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgaWYgKHN0ZXAuYmVmb3JlU2hvd1Byb21pc2UpIHtcbiAgICAgICAgICBjb25zdCBiZWZvcmVTaG93UHJvbWlzZTogKCkgPT4gUHJvbWlzZTx2b2lkPiA9IHN0ZXAuYmVmb3JlU2hvd1Byb21pc2U7XG4gICAgICAgICAgc3RlcC5iZWZvcmVTaG93UHJvbWlzZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwgc3RlcC5yb3V0aW5nLmV4dHJhcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBiZWZvcmVTaG93UHJvbWlzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGVwLmJlZm9yZVNob3dQcm9taXNlID0gKCkgPT4gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVkU3RlcHM7XG4gIH1cbn1cbiJdfQ==